import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { Users, Search, Plus, Trash2, Shield, Heart, Award, X, CheckSquare } from 'lucide-react';
import { TableSkeleton } from '../../components/Loader/SkeletonLoader';
import ConfirmationModal from '../../components/Modal/ConfirmationModal';
import toast from 'react-hot-toast';

const Drivers = () => {
  const { user } = useAuth();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState(null);

  // Form states
  const [name, setName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [experience, setExperience] = useState('');
  const [safetyScore, setSafetyScore] = useState('90');

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/drivers', {
        params: { search, availability: availabilityFilter, page, limit: 6 },
      });
      if (res.data.success) {
        setDrivers(res.data.data);
        setTotalPages(res.data.pagination.pages);
      }
    } catch (err) {
      toast.error('Failed to load drivers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, [search, availabilityFilter, page]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = { name, licenseNumber, phone, email, experience: Number(experience), safetyScore: Number(safetyScore) };
      const res = await axios.post('/api/drivers', payload);
      if (res.data.success) {
        toast.success('Driver onboarded successfully!');
        setCreateModalOpen(false);
        resetForm();
        fetchDrivers();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to onboard driver.');
    }
  };

  const handleApprove = async (driverId) => {
    try {
      const res = await axios.put(`/api/admin/drivers/${driverId}/approve`);
      if (res.data.success) {
        toast.success('Driver onboarding approved!');
        fetchDrivers();
      }
    } catch (err) {
      toast.error('Onboarding approval failed.');
    }
  };

  const handleDelete = async () => {
    if (!driverToDelete) return;
    try {
      const res = await axios.delete(`/api/drivers/${driverToDelete}`);
      if (res.data.success) {
        toast.success('Driver removed.');
        setDriverToDelete(null);
        fetchDrivers();
      }
    } catch (err) {
      toast.error('Failed to remove driver.');
    }
  };

  const resetForm = () => {
    setName('');
    setLicenseNumber('');
    setPhone('');
    setEmail('');
    setExperience('');
    setSafetyScore('90');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Driver Roster</h2>
          <p className="text-slate-400 text-xs mt-1">Audit license numbers, driver experience years, and safety counseling scores.</p>
        </div>
        {(user?.role === 'Admin' || user?.role === 'Fleet Manager') && (
          <button
            onClick={() => setCreateModalOpen(true)}
            className="glass-button-primary flex items-center gap-2 py-2 text-xs"
          >
            <Plus size={14} />
            <span>Onboard Driver</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80">
        <div className="relative">
          <input
            type="text"
            placeholder="Search driver name, license, contact..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-[#1E293B]/45 border border-slate-700/60 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-teal transition-all placeholder:text-slate-500"
          />
          <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
        </div>

        <select
          value={availabilityFilter}
          onChange={(e) => { setAvailabilityFilter(e.target.value); setPage(1); }}
          className="bg-[#1E293B]/45 border border-slate-700/60 rounded-xl px-4 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-teal"
        >
          <option value="">All Availabilities</option>
          <option value="Available">Available</option>
          <option value="On Trip">On Trip</option>
          <option value="On Leave">On Leave</option>
        </select>
      </div>

      {/* Drivers List */}
      {loading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : drivers.length === 0 ? (
        <div className="py-20 text-center text-slate-500 text-sm">No drivers logged matching parameters.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drivers.map((d) => (
            <div key={d._id} className="glass-panel border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700/60 transition-all duration-200">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-extrabold text-white text-base tracking-wide">{d.name}</h3>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mt-0.5">{d.licenseNumber}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    d.availability === 'Available' ? 'bg-brand-green/10 text-brand-green' : d.availability === 'On Trip' ? 'bg-brand-teal/10 text-brand-teal' : 'bg-red-500/10 text-red-400'
                  }`}>
                    {d.availability}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs pt-3 border-t border-slate-800/60">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Experience</span>
                    <span className="text-slate-300 font-medium">{d.experience} Years</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Assigned Truck</span>
                    <span className="text-brand-teal font-semibold">
                      {d.assignedVehicle ? d.assignedVehicle.regNumber : 'None'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Contact Phone</span>
                    <span className="text-slate-300 font-semibold">{d.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Safety Rating</span>
                    <span className={`font-black flex items-center gap-1 ${
                      d.safetyScore >= 85 ? 'text-brand-green' : d.safetyScore >= 70 ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      <Award size={14} />
                      {d.safetyScore}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex justify-between items-center mt-6 pt-3 border-t border-slate-800/60">
                {/* Onboard approval */}
                {d.availability === 'On Leave' && (user?.role === 'Admin' || user?.role === 'Fleet Manager') ? (
                  <button
                    onClick={() => handleApprove(d._id)}
                    className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase text-brand-teal hover:underline"
                  >
                    <CheckSquare size={14} />
                    <span>Approve Onboard</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex gap-2">
                  {user?.role === 'Admin' && (
                    <button
                      onClick={() => { setDriverToDelete(d._id); setDeleteModalOpen(true); }}
                      className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/25 transition-colors"
                      title="Remove Driver"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
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
          <form onSubmit={handleCreate} className="glass-panel w-full max-w-lg relative z-10 p-6 space-y-4 border border-slate-700">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white">Onboard Driver</h3>
              <button type="button" onClick={() => setCreateModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X size={18} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Driver Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Carlos Santana" className="glass-input text-xs w-full" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">License Number</label>
                <input type="text" value={licenseNumber} onChange={(e) => setLicenseNumber(e.target.value)} placeholder="DL-US-99999" className="glass-input text-xs w-full uppercase" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Phone</label>
                <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 123-9999" className="glass-input text-xs w-full" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="carlos@company.com" className="glass-input text-xs w-full" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Experience (Years)</label>
                <input type="number" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="5" className="glass-input text-xs w-full" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Initial Safety Score (%)</label>
                <input type="number" value={safetyScore} onChange={(e) => setSafetyScore(e.target.value)} min="0" max="100" className="glass-input text-xs w-full" required />
              </div>
            </div>
            
            <button type="submit" className="glass-button-primary w-full text-xs py-2.5 font-bold">Onboard Driver</button>
          </form>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Deregister Driver"
        message="Are you sure you want to remove this driver from the operational dispatch roster? This action cannot be undone."
      />
    </div>
  );
};

export default Drivers;
