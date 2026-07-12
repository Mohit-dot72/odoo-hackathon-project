import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSocket } from '../../context/SocketContext';
import { AlertOctagon, Check, Eye, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Alerts = () => {
  const { liveAlerts } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/notifications');
      if (res.data.success) {
        setNotifications(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to sync alerts list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  // Sync real-time updates
  useEffect(() => {
    if (liveAlerts.length > 0) {
      const latest = liveAlerts[0];
      setNotifications((prev) => {
        if (prev.find((n) => n._id === latest._id)) return prev;
        return [latest, ...prev];
      });
    }
  }, [liveAlerts]);

  const handleMarkRead = async (id) => {
    try {
      const res = await axios.put(`/api/notifications/${id}`);
      if (res.data.success) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === id ? { ...n, read: true } : n))
        );
        toast.success('Alert dismissed.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDismissAll = async () => {
    try {
      const res = await axios.put('/api/notifications/read-all');
      if (res.data.success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        toast.success('All alerts dismissed.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = notifications.filter((n) => {
    if (typeFilter) return n.type === typeFilter;
    return true;
  });

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Alerts Board</h2>
          <p className="text-slate-400 text-xs mt-1 font-medium">Audit real-time dispatch warnings, document expiration alerts, and counseling indicators.</p>
        </div>
        
        {notifications.some((n) => !n.read) && (
          <button
            onClick={handleDismissAll}
            className="glass-button-secondary py-1.5 px-4 text-xs font-semibold flex items-center gap-1.5"
          >
            <Check size={14} />
            <span>Dismiss All</span>
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-3 text-xs">
        <button
          onClick={() => setTypeFilter('')}
          className={`px-4 py-1.5 rounded-lg transition-colors ${
            typeFilter === '' ? 'bg-brand-teal text-brand-dark font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All Notifications
        </button>
        <button
          onClick={() => setTypeFilter('Alert')}
          className={`px-4 py-1.5 rounded-lg transition-colors ${
            typeFilter === 'Alert' ? 'bg-red-500/20 text-red-400 font-bold border border-red-500/20' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Warnings / Alerts
        </button>
        <button
          onClick={() => setTypeFilter('Reminder')}
          className={`px-4 py-1.5 rounded-lg transition-colors ${
            typeFilter === 'Reminder' ? 'bg-blue-500/20 text-blue-400 font-bold border border-blue-500/20' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Reminders
        </button>
      </div>

      {/* Alerts list */}
      {loading ? (
        <div className="space-y-4">
          <div className="h-16 bg-slate-800 animate-pulse rounded-xl"></div>
          <div className="h-16 bg-slate-800 animate-pulse rounded-xl"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-slate-500 text-sm">No active alerts mapped.</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((n) => (
            <div
              key={n._id}
              className={`glass-panel border p-4 flex gap-4 justify-between items-center transition-all ${
                !n.read ? 'border-brand-teal/20 bg-brand-teal/5' : 'border-slate-800/80 bg-slate-900/10'
              }`}
            >
              <div className="flex gap-3">
                <div className={`p-2.5 rounded-xl h-fit shrink-0 ${
                  n.type === 'Alert' ? 'bg-red-500/10 text-red-400' : 'bg-brand-teal/10 text-brand-teal'
                }`}>
                  <AlertOctagon size={16} />
                </div>
                
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-sm">{n.title}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-slate-500 block">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {!n.read && (
                <button
                  onClick={() => handleMarkRead(n._id)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg transition-all"
                  title="Dismiss Alert"
                >
                  <Check size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Alerts;
