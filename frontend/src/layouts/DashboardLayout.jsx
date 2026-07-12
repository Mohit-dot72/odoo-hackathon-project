import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import Sidebar from '../components/Sidebar/Sidebar';
import { Bell, Search, User, LogOut, Menu, X, ShieldAlert } from 'lucide-react';
import axios from 'axios';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { liveAlerts } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sync notifications with backend and Socket.IO
  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications');
      if (response.data.success) {
        setNotifications(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Prepend live alerts coming via Socket.IO
  useEffect(() => {
    if (liveAlerts.length > 0) {
      const latest = liveAlerts[0];
      // Avoid duplicating alerts that might be fetched on reload
      setNotifications((prev) => {
        if (prev.find((n) => n._id === latest._id)) return prev;
        return [latest, ...prev];
      });
    }
  }, [liveAlerts]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = async () => {
    try {
      await axios.put('/api/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error('Error marking read:', err);
    }
  };

  const handleGlobalSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Search redirects or handles searches
      navigate(`/vehicles?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex">
      {/* Sidebar - Desktop (Static) & Mobile (Drawer) */}
      <Sidebar isOpen={sidebarOpen} setOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Navbar */}
        <header className="h-16 border-b border-slate-800/80 bg-brand-dark/45 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-6">
          {/* Left: Mobile Toggle & Page Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-slate-400 hover:text-slate-200 lg:hidden"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold tracking-tight text-slate-100 hidden sm:block">
              {location.pathname.substring(1).charAt(0).toUpperCase() + location.pathname.substring(2)}
            </h1>
          </div>

          {/* Center: Global Search Bar */}
          <form onSubmit={handleGlobalSearch} className="max-w-md w-full mx-4 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search registration, status, routes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1E293B]/40 border border-slate-700/60 rounded-xl pl-10 pr-4 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-brand-teal focus:ring-1 focus:ring-brand-teal transition-all placeholder:text-slate-500"
              />
              <Search className="absolute left-3 top-2.5 text-slate-500" size={16} />
            </div>
          </form>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            {/* Notifications Dropdown Trigger */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  if (!showNotifications && unreadCount > 0) {
                    markAllRead();
                  }
                }}
                className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-slate-300 hover:text-brand-teal transition-all relative"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-teal text-brand-dark font-bold text-[10px] rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Overlay panel */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 glass-panel border border-slate-700 max-h-96 overflow-y-auto z-50 p-2">
                  <div className="flex justify-between items-center px-3 py-2 border-b border-slate-800">
                    <span className="font-semibold text-sm text-brand-teal">System Alerts</span>
                    <button
                      onClick={() => setNotifications([])}
                      className="text-xs text-slate-500 hover:text-slate-400"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="divide-y divide-slate-800/50">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-500">No new notifications</div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif._id}
                          className={`p-3 text-xs transition-colors hover:bg-slate-800/40 ${
                            !notif.read ? 'bg-brand-teal/5' : ''
                          }`}
                        >
                          <div className="flex justify-between font-medium text-slate-200">
                            <span className="truncate">{notif.title}</span>
                            <span className="text-[10px] text-slate-500">
                              {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-slate-400 mt-1 leading-normal">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile trigger */}
            <div className="flex items-center gap-3">
              <div
                onClick={() => navigate('/profile')}
                className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-teal to-brand-green p-[1px] cursor-pointer"
              >
                <div className="w-full h-full bg-slate-900 rounded-xl flex items-center justify-center text-brand-teal hover:bg-slate-800 transition-colors">
                  <User size={16} />
                </div>
              </div>
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-sm font-medium text-slate-200">{user?.name}</span>
                <span className="text-[11px] text-slate-500 font-semibold uppercase">{user?.role}</span>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-xl bg-slate-800/40 border border-slate-700/40 text-slate-400 hover:text-red-400 transition-colors ml-2"
                title="Log Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Nested Sub-view */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
