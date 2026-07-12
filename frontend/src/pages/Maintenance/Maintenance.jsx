import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Wrench, Plus, Trash2, Edit3, X, Calendar, DollarSign, Activity } from 'lucide-react';
import { TableSkeleton } from '../../components/Loader/SkeletonLoader';
import toast from 'react-hot-toast';

const Maintenance = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Form states
  const [vehicleId, setVehicleId] = useState('');
  const [serviceType, setServiceType] = useState('Routine');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [cost, setCost] = useState('');
  const [status, setStatus] = useState('Scheduled');

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/maintenance', {
        params: { status: statusFilter, page, limit: 6 },
      });
      if (res.data.success) {
        setRecords(res.data.data);
        setTotalPages(res.data.pagination.pages);
      }
    } catch (err) {
      toast.error('Failed to sync maintenance logs.');
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const res = await axios.get('/api/vehicles');
      if (res.data.success) {
        setVehicles(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchVehicles();
  }, [statusFilter, page]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        vehicle: vehicleId,
        serviceType,
        description,
        startDate,
        endDate,
        cost: Number(cost),
        status,
      };
      const res = await axios.post('/api/maintenance', payload);
      if (res.data.success) {
        toast.success('Maintenance scheduled!');
        setCreateModalOpen(false);
        resetForm();
        fetchRecords();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Scheduling failed.');
    }
  };

  const handleUpdateStatus = async (recordId, newStatus) => {
    try {
      const res = await axios.put(`/api/maintenance/${recordId}`, { status: newStatus });
      if (res.data.success) {
        toast.success(`Service status: ${newStatus}`);
        fetchRecords();
      }
    } catch (err) {
      toast.error('Status modification failure.');
    }
  };

  const resetForm = () => {
    setVehicleId('');
    setServiceType('Routine');
    setDescription('');
    setStartDate('');
    setEndDate('');
    setCost('');
    setStatus('Scheduled');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Maintenance Scheduler</h2>
          <p className="text-slate-400 text-xs mt-1">Schedule parts replacement, routine tuning, and garage repair logs.</p>
        </div>
        {(user?.role === 'Admin' || user?.role === 'Fleet Manager') && (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="glass-button-primary flex items-center gap-2 py-2 text-xs"
          >
            <Plus size={14} />
            <span>Schedule Service</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="flex gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80 max-w-sm">
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="bg-[#1E293B]/45 border border-slate-700/60 rounded-xl px-4 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-teal w-full"
        >
          <option value="">All Statuses</option>
          <option value="Scheduled">Scheduled</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Records Cards Grid */}
      {loading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : records.length === 0 ? (
        <div className="py-20 text-center text-slate-500 text-sm">No maintenance records logged.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {records.map((r) => (
            <div key={r._id} className="glass-panel border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700 transition-all duration-200">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-white text-base tracking-wide">{r.vehicle?.regNumber}</h3>
                    <p className="text-brand-teal text-[10px] font-bold uppercase tracking-wider mt-0.5">{r.serviceType} Service</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    r.status === 'Completed' ? 'bg-brand-green/10 text-brand-green' : r.status === 'In Progress' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'
                  }`}>
                    {r.status}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-medium">
                  {r.description}
                </p>

                <div className="grid grid-cols-2 gap-4 text-xs pt-3 border-t border-slate-800/60">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Calendar size={14} className="text-slate-500" />
                    <span>{new Date(r.startDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-300 font-bold">
                    <DollarSign size={14} className="text-slate-500" />
                    <span>{r.cost?.toLocaleString()} USD</span>
                  </div>
                </div>
              </div>

              {/* Status Update Actions */}
              <div className="flex justify-end gap-2 mt-6 pt-3 border-t border-slate-800/60">
                {r.status === 'Scheduled' && (user?.role === 'Admin' || user?.role === 'Fleet Manager') && (
                  <button
                    onClick={() => handleUpdateStatus(r._id, 'In Progress')}
                    className="px-3 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg text-[10px] font-bold uppercase hover:bg-amber-500 hover:text-brand-dark transition-all"
                  >
                    Set Active
                  </button>
                )}
                
                {r.status === 'In Progress' && (user?.role === 'Admin' || user?.role === 'Fleet Manager') && (
                  <button
                    onClick={() => handleUpdateStatus(r._id, 'Completed')}
                    className="px-3 py-1.5 bg-brand-green/10 text-brand-green border border-brand-green/20 rounded-lg text-[10px] font-bold uppercase hover:bg-brand-green hover:text-brand-dark transition-all"
                  >
                    Mark Done
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

      {/* Create Maintenance Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setCreateModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm"></div>
          <form onSubmit={handleCreate} className="glass-panel w-full max-w-lg relative z-10 p-6 space-y-4 border border-slate-700">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white">Schedule Service</h3>
              <button type="button" onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X size={18} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Select Vehicle</label>
                <select value={vehicleId} onChange={(e) => setVehicleId(e.target.value)} className="glass-input text-xs w-full" required>
                  <option value="">-- Select --</option>
                  {vehicles.map(v => <option key={v._id} value={v._id}>{v.regNumber} ({v.name})</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Service Category</label>
                <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} className="glass-input text-xs w-full">
                  <option value="Routine">Routine Inspection</option>
                  <option value="Repair">Part Repair</option>
                  <option value="Breakdown">Breakdown Tow</option>
                  <option value="Inspection">Emissions/Safety</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Start Date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="glass-input text-xs w-full text-slate-350" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Est. End Date</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="glass-input text-xs w-full text-slate-350" required />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Cost (USD)</label>
                <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} placeholder="500" className="glass-input text-xs w-full" required />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Service Description</label>
                <textarea rows="3" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe work items..." className="glass-input text-xs w-full" required></textarea>
              </div>
            </div>
            
            <button type="submit" className="glass-button-primary w-full text-xs py-2.5 font-bold">Schedule Service</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Maintenance;
