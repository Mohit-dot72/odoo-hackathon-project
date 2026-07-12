import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Truck, Search, Plus, Trash2, Edit3, X, Eye, FileText, Compass } from 'lucide-react';
import { TableSkeleton } from '../../components/Loader/SkeletonLoader';
import ConfirmationModal from '../../components/Modal/ConfirmationModal';
import toast from 'react-hot-toast';

const Vehicles = () => {
  const { user } = useAuth();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  
  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  // Form states
  const [regNumber, setRegNumber] = useState('');
  const [name, setName] = useState('');
  const [model, setModel] = useState('');
  const [type, setType] = useState('Truck');
  const [capacity, setCapacity] = useState('');
  const [fuelType, setFuelType] = useState('Diesel');
  const [odometer, setOdometer] = useState('');
  const [insuranceExpiry, setInsuranceExpiry] = useState('');

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/vehicles', {
        params: { search, status: statusFilter, type: typeFilter, page, limit: 6 },
      });
      if (res.data.success) {
        setVehicles(res.data.data);
        setTotalPages(res.data.pagination.pages);
      }
    } catch (err) {
      toast.error('Failed to retrieve vehicle roster.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [search, statusFilter, typeFilter, page]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = { regNumber, name, model, type, capacity: Number(capacity), fuelType, odometer: Number(odometer), insuranceExpiry };
      const res = await axios.post('/api/vehicles', payload);
      if (res.data.success) {
        toast.success('Vehicle registered successfully!');
        setCreateModalOpen(false);
        resetForm();
        fetchVehicles();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed.');
    }
  };

  const handleDelete = async () => {
    if (!vehicleToDelete) return;
    try {
      const res = await axios.delete(`/api/vehicles/${vehicleToDelete}`);
      if (res.data.success) {
        toast.success('Vehicle removed successfully.');
        setVehicleToDelete(null);
        fetchVehicles();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to remove vehicle.');
    }
  };

  const resetForm = () => {
    setRegNumber('');
    setName('');
    setModel('');
    setType('Truck');
    setCapacity('');
    setFuelType('Diesel');
    setOdometer('');
    setInsuranceExpiry('');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Vehicle Registry</h2>
          <p className="text-slate-400 text-xs mt-1">Audit fleet diagnostic specs, odo meters, and registration books.</p>
        </div>
        {(user?.role === 'Admin' || user?.role === 'Fleet Manager') && (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="glass-button-primary flex items-center gap-2 py-2 text-xs"
          >
            <Plus size={14} />
            <span>Add Vehicle</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80">
        <div className="relative">
          <input
            type="text"
            placeholder="Search reg, model, name..."
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
          <option value="Active">Active</option>
          <option value="In Maintenance">In Maintenance</option>
          <option value="Out of Service">Out of Service</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
          className="bg-[#1E293B]/45 border border-slate-700/60 rounded-xl px-4 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-teal"
        >
          <option value="">All Types</option>
          <option value="Truck">Truck</option>
          <option value="Van">Van</option>
          <option value="Bus">Bus</option>
          <option value="Car">Car</option>
        </select>
      </div>

      {/* Vehicle Grid List */}
      {loading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : vehicles.length === 0 ? (
        <div className="py-20 text-center text-slate-500 text-sm">No vehicles registered match current filters.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <div key={v._id} className="glass-panel border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700 transition-all duration-200">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-white text-base tracking-wide">{v.regNumber}</h3>
                    <p className="text-slate-400 text-xs font-semibold mt-0.5">{v.name}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    v.status === 'Active' ? 'bg-brand-green/10 text-brand-green' : v.status === 'In Maintenance' ? 'bg-amber-500/10 text-amber-400' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {v.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-800/60">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Odometer</span>
                    <span className="text-slate-300 font-medium">{v.odometer.toLocaleString()} km</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Capacity</span>
                    <span className="text-slate-300 font-medium">{v.capacity} Tons ({v.type})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Fuel Type</span>
                    <span className="text-slate-300 font-semibold">{v.fuelType}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Assigned Driver</span>
                    <span className="text-brand-teal font-semibold truncate block">
                      {v.assignedDriver ? v.assignedDriver.name : 'Unassigned'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 mt-6 pt-3 border-t border-slate-800/60">
                <button
                  onClick={() => setSelectedVehicle(v)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="View Specs"
                >
                  <Eye size={14} />
                </button>
                {user?.role === 'Admin' && (
                  <button
                    onClick={() => { setVehicleToDelete(v._id); setDeleteModalOpen(true); }}
                    className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/25 transition-colors"
                    title="Remove Vehicle"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-xs text-slate-500 self-center">Page {page} of {totalPages}</span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}

      {/* Create Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setCreateModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm"></div>
          <form onSubmit={handleCreate} className="glass-panel w-full max-w-lg relative z-10 p-6 space-y-4 border border-slate-700 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white">Register New Vehicle</h3>
              <button type="button" onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X size={18} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Reg Number</label>
                <input type="text" value={regNumber} onChange={(e) => setRegNumber(e.target.value)} placeholder="MH-12-PQ-9999" className="glass-input text-xs w-full font-bold uppercase" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Volvo FH16" className="glass-input text-xs w-full" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Model</label>
                <input type="text" value={model} onChange={(e) => setModel(e.target.value)} placeholder="Model R - 2024" className="glass-input text-xs w-full" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="glass-input text-xs w-full">
                  <option value="Truck">Truck</option>
                  <option value="Van">Van</option>
                  <option value="Bus">Bus</option>
                  <option value="Car">Car</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Capacity (Tons / Seats)</label>
                <input type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="20" className="glass-input text-xs w-full" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Fuel Type</label>
                <select value={fuelType} onChange={(e) => setFuelType(e.target.value)} className="glass-input text-xs w-full">
                  <option value="Diesel">Diesel</option>
                  <option value="Petrol">Petrol</option>
                  <option value="CNG">CNG</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Odometer (km)</label>
                <input type="number" value={odometer} onChange={(e) => setOdometer(e.target.value)} placeholder="12000" className="glass-input text-xs w-full" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Insurance Expiry</label>
                <input type="date" value={insuranceExpiry} onChange={(e) => setInsuranceExpiry(e.target.value)} className="glass-input text-xs w-full text-slate-300" required />
              </div>
            </div>
            
            <button type="submit" className="glass-button-primary w-full text-xs py-2.5 font-bold">Register Vehicle</button>
          </form>
        </div>
      )}

      {/* Detail Slideover Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setSelectedVehicle(null)} className="fixed inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="glass-panel w-full max-w-md relative z-10 p-6 space-y-4 border border-slate-700">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-white">Specs Summary</h3>
              <button type="button" onClick={() => setSelectedVehicle(null)} className="text-slate-400 hover:text-slate-200">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="flex justify-between"><span className="text-slate-500">Reg:</span><span className="font-bold text-white uppercase">{selectedVehicle.regNumber}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Name:</span><span className="text-slate-300">{selectedVehicle.name}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Model:</span><span className="text-slate-300">{selectedVehicle.model}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Odometer:</span><span className="text-slate-300 font-semibold">{selectedVehicle.odometer.toLocaleString()} km</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Insurance Expiry:</span><span className="text-slate-300">{new Date(selectedVehicle.insuranceExpiry).toLocaleDateString()}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Compliance Files:</span><span className="text-brand-green font-semibold">Active & Audited</span></div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Deregister Vehicle"
        message="Are you sure you want to deregister this vehicle from the operations mapping console? This operation is permanent."
      />
    </div>
  );
};

export default Vehicles;
