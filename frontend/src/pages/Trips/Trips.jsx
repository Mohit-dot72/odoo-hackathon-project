import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Search, Plus, Play, CheckCircle, Ban, X, Compass, Route } from 'lucide-react';
import { TableSkeleton } from '../../components/Loader/SkeletonLoader';
import toast from 'react-hot-toast';

const Trips = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedTripMap, setSelectedTripMap] = useState(null);

  // Form states
  const [vehicleId, setVehicleId] = useState('');
  const [driverId, setDriverId] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [distance, setDistance] = useState('');
  const [cargoWeight, setCargoWeight] = useState('');
  const [estDuration, setEstDuration] = useState('');

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/trips', {
        params: { search, status: statusFilter, page, limit: 5 },
      });
      if (res.data.success) {
        setTrips(res.data.data);
        setTotalPages(res.data.pagination.pages);
        
        // Match selected trip updates or choose default
        if (res.data.data.length > 0) {
          const matched = res.data.data.find(t => selectedTripMap && t._id === selectedTripMap._id);
          setSelectedTripMap(matched || res.data.data[0]);
        } else {
          setSelectedTripMap(null);
        }
      }
    } catch (err) {
      toast.error('Failed to sync dispatches.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAssets = async () => {
    try {
      const vRes = await axios.get('/api/vehicles');
      const dRes = await axios.get('/api/drivers');
      if (vRes.data.success) setVehicles(vRes.data.data.filter(v => v.status === 'Active'));
      if (dRes.data.success) setDrivers(dRes.data.data.filter(d => d.availability === 'Available'));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTrips();
    fetchAssets();
  }, [search, statusFilter, page]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        vehicle: vehicleId,
        driver: driverId,
        source,
        destination,
        distance: Number(distance),
        cargoWeight: Number(cargoWeight),
        estDuration: Number(estDuration),
      };
      const res = await axios.post('/api/trips', payload);
      if (res.data.success) {
        toast.success('Trip dispatched successfully!');
        setCreateModalOpen(false);
        resetForm();
        fetchTrips();
        fetchAssets();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Dispatch failed.');
    }
  };

  const handleUpdateStatus = async (tripId, status) => {
    try {
      const res = await axios.put(`/api/trips/${tripId}`, { status });
      if (res.data.success) {
        toast.success(`Trip status updated: ${status}`);
        fetchTrips();
        fetchAssets();
      }
    } catch (err) {
      toast.error('Status transition failure.');
    }
  };

  const resetForm = () => {
    setVehicleId('');
    setDriverId('');
    setSource('');
    setDestination('');
    setDistance('');
    setCargoWeight('');
    setEstDuration('');
  };

  // Mathematically calculate routing coordinates based on route name hashes
  const getRoutePath = (trip) => {
    if (!trip) return { path: '', start: { cx: 0, cy: 0 }, end: { cx: 0, cy: 0 }, truck: { cx: 0, cy: 0 } };
    
    const srcHash = trip.source.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const destHash = trip.destination.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    const startX = 15 + (srcHash % 25); // 15 to 40
    const startY = 60 + (srcHash % 25); // 60 to 85
    const endX = 60 + (destHash % 30);   // 60 to 90
    const endY = 15 + (destHash % 30);   // 15 to 45
    
    const ctrlX = (startX + endX) / 2 + (srcHash % 20) - 10;
    const ctrlY = (startY + endY) / 2 - 20 - (destHash % 15);
    
    const path = `M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`;
    
    // Calculate middle position (t=0.5) of the Bezier curve
    const t = 0.5;
    const truckX = Math.round(Math.pow(1-t, 2)*startX + 2*(1-t)*t*ctrlX + Math.pow(t, 2)*endX);
    const truckY = Math.round(Math.pow(1-t, 2)*startY + 2*(1-t)*t*ctrlY + Math.pow(t, 2)*endY);
    
    return {
      path,
      start: { cx: startX, cy: startY },
      end: { cx: endX, cy: endY },
      truck: { cx: truckX, cy: truckY }
    };
  };

  const routeInfo = getRoutePath(selectedTripMap);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Live Dispatches</h2>
          <p className="text-slate-400 text-xs mt-1">Track scheduled cargo, active vehicles routes, and driver delivery logs.</p>
        </div>
        {(user?.role === 'Admin' || user?.role === 'Fleet Manager') && (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="glass-button-primary flex items-center gap-2 py-2 text-xs"
          >
            <Plus size={14} />
            <span>Dispatch Cargo</span>
          </button>
        )}
      </div>

      {/* Main Grid: Trip List Left, Visual Map Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Trip lists and filters */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80">
            <div className="relative">
              <input
                type="text"
                placeholder="Search trip ID, source, destination..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="w-full bg-[#1E293B]/45 border border-slate-700/60 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-teal transition-all placeholder:text-slate-500"
              />
              <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="bg-[#1E293B]/45 border border-slate-700/60 rounded-xl px-4 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-teal"
            >
              <option value="">All Statuses</option>
              <option value="Scheduled">Scheduled</option>
              <option value="On Trip">On Trip</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* List */}
          {loading ? (
            <TableSkeleton rows={4} cols={4} />
          ) : trips.length === 0 ? (
            <div className="py-20 text-center text-slate-500 text-sm">No dispatches matching parameters.</div>
          ) : (
            <div className="space-y-4">
              {trips.map((t) => (
                <div
                  key={t._id}
                  onClick={() => setSelectedTripMap(t)}
                  className={`glass-panel border p-5 cursor-pointer transition-all duration-200 ${
                    selectedTripMap?._id === t._id ? 'border-brand-teal/80 bg-[#1E293B]/80 shadow-brand-teal/5' : 'border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-sm text-white tracking-wide">{t.tripId}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          t.status === 'On Trip' ? 'bg-brand-teal/10 text-brand-teal' : t.status === 'Completed' ? 'bg-brand-green/10 text-brand-green' : t.status === 'Scheduled' ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-3 text-xs text-slate-300">
                        <span className="font-semibold text-slate-100">{t.source}</span>
                        <span className="text-slate-500 font-bold">&rarr;</span>
                        <span className="font-semibold text-slate-100">{t.destination}</span>
                      </div>
                    </div>

                    {/* Status change actions */}
                    <div className="flex items-center gap-2.5 self-end sm:self-center">
                      {t.status === 'Scheduled' && (user?.role === 'Admin' || user?.role === 'Fleet Manager' || String(user?.id) === String(t.driver?._id)) && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleUpdateStatus(t._id, 'On Trip'); }}
                          className="px-3 py-1.5 bg-brand-teal/10 text-brand-teal border border-brand-teal/20 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1 hover:bg-brand-teal hover:text-brand-dark transition-all"
                        >
                          <Play size={10} />
                          <span>Start Trip</span>
                        </button>
                      )}
                      
                      {t.status === 'On Trip' && (user?.role === 'Admin' || user?.role === 'Fleet Manager' || String(user?.id) === String(t.driver?._id)) && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleUpdateStatus(t._id, 'Completed'); }}
                          className="px-3 py-1.5 bg-brand-green/10 text-brand-green border border-brand-green/20 rounded-lg text-[10px] font-bold uppercase flex items-center gap-1 hover:bg-brand-green hover:text-brand-dark transition-all"
                        >
                          <CheckCircle size={10} />
                          <span>Deliver</span>
                        </button>
                      )}

                      {t.status === 'Scheduled' && (user?.role === 'Admin' || user?.role === 'Fleet Manager') && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleUpdateStatus(t._id, 'Cancelled'); }}
                          className="p-1.5 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/25 transition-all"
                          title="Cancel Trip"
                        >
                          <Ban size={12} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-4 pt-3 border-t border-slate-800/40 text-[10px] text-slate-400">
                    <div>
                      <span className="block font-bold text-slate-500 uppercase">Assigned Truck</span>
                      <span className="text-slate-300 font-medium">{t.vehicle?.regNumber} ({t.vehicle?.name})</span>
                    </div>
                    <div>
                      <span className="block font-bold text-slate-500 uppercase">Operator</span>
                      <span className="text-slate-300 font-medium">{t.driver?.name}</span>
                    </div>
                    <div>
                      <span className="block font-bold text-slate-500 uppercase">Cargo Volume</span>
                      <span className="text-slate-300 font-medium">{t.cargoWeight} Tons ({t.distance} km)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Google Maps Interactive Placeholder */}
        <div className="glass-panel border-slate-800 p-6 flex flex-col justify-between h-[450px]">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-800">
            <h3 className="font-bold text-xs uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
              <Compass size={14} className="text-brand-teal animate-spin" style={{ animationDuration: '8s' }} />
              Live Route Telemetry
            </h3>
            {selectedTripMap && (
              <span className="text-[10px] font-bold text-brand-teal">{selectedTripMap.tripId}</span>
            )}
          </div>

          {selectedTripMap ? (
            <div className="flex-1 flex flex-col justify-between">
              {/* Custom Animated Maps Canvas */}
              <div className="flex-1 bg-slate-950/80 rounded-xl relative overflow-hidden border border-slate-800 flex items-center justify-center">
                <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                
                {/* SVG path mapping */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Route path line */}
                  <path
                    d={routeInfo.path}
                    fill="none"
                    stroke="#1E293B"
                    strokeWidth="1.5"
                  />
                  {selectedTripMap.status === 'On Trip' && (
                    <path
                      d={routeInfo.path}
                      fill="none"
                      stroke="#14B8A6"
                      strokeWidth="1.5"
                      strokeDasharray="4, 4"
                      className="animate-dash"
                      style={{ animation: 'dash 15s linear infinite' }}
                    />
                  )}
                  {/* Source Marker */}
                  <circle cx={routeInfo.start.cx} cy={routeInfo.start.cy} r="3" fill="#10B981" />
                  <circle cx={routeInfo.start.cx} cy={routeInfo.start.cy} r="6" fill="#10B981" className="animate-ping" opacity="0.4" />
                  
                  {/* Destination Marker */}
                  <circle cx={routeInfo.end.cx} cy={routeInfo.end.cy} r="3" fill="#EF4444" />
                  <circle cx={routeInfo.end.cx} cy={routeInfo.end.cy} r="6" fill="#EF4444" className="animate-ping" opacity="0.4" />

                  {/* Truck node */}
                  {selectedTripMap.status === 'On Trip' && (
                    <circle cx={routeInfo.truck.cx} cy={routeInfo.truck.cy} r="4.5" fill="#14B8A6" />
                  )}
                </svg>

                {/* Source/Destination Labels */}
                <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-800 px-2 py-1 rounded text-[9px] text-slate-350 max-w-[120px] truncate">
                  <span className="font-bold text-slate-500 block uppercase">Origin</span>
                  {selectedTripMap.source}
                </div>
                <div className="absolute top-4 right-4 bg-slate-900/90 border border-slate-800 px-2 py-1 rounded text-[9px] text-slate-350 text-right max-w-[120px] truncate">
                  <span className="font-bold text-slate-500 block uppercase">Destination</span>
                  {selectedTripMap.destination}
                </div>
              </div>

              {/* Specs below map */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 text-[10px] text-slate-400 space-y-1">
                <div className="flex justify-between"><span className="text-slate-500">Route Distance:</span><span className="text-slate-200 font-semibold">{selectedTripMap.distance} km</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Est. Duration:</span><span className="text-slate-200 font-semibold">{selectedTripMap.estDuration} Hours</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Payload Weight:</span><span className="text-slate-200 font-semibold">{selectedTripMap.cargoWeight} Tons</span></div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs">
              <Route size={32} className="mb-2 text-slate-600" />
              Select a dispatch to display visual routing.
            </div>
          )}
        </div>
      </div>

      {/* Create Dispatch Cargo Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setCreateModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm"></div>
          <form onSubmit={handleCreate} className="glass-panel w-full max-w-lg relative z-10 p-6 space-y-4 border border-slate-700">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white">Dispatch Cargo</h3>
              <button type="button" onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X size={18} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Select Active Truck</label>
                <select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} className="glass-input text-xs w-full" required>
                  <option value="">-- Select --</option>
                  {vehicles.map(v => <option key={v._id} value={v._id}>{v.regNumber} ({v.name})</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Select Operator</label>
                <select value={driverId} onChange={(e) => setDriverId(e.target.value)} className="glass-input text-xs w-full" required>
                  <option value="">-- Select --</option>
                  {drivers.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Source Coordinates/City</label>
                <input type="text" value={source} onChange={(e) => setSource(e.target.value)} placeholder="San Francisco, CA" className="glass-input text-xs w-full" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Source Destination/City</label>
                <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="Seattle, WA" className="glass-input text-xs w-full" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Route Distance (km)</label>
                <input type="number" value={distance} onChange={(e) => setDistance(e.target.value)} placeholder="800" className="glass-input text-xs w-full" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Cargo Weight (Tons)</label>
                <input type="number" value={cargoWeight} onChange={(e) => setCargoWeight(e.target.value)} placeholder="18" className="glass-input text-xs w-full" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Est. Duration (Hours)</label>
                <input type="number" value={estDuration} onChange={(e) => setEstDuration(e.target.value)} placeholder="10" className="glass-input text-xs w-full" required />
              </div>
            </div>
            
            <button type="submit" className="glass-button-primary w-full text-xs py-2.5 font-bold">Dispatch Cargo</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Trips;
