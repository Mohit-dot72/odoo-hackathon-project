import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Truck, Users, MapPin, Wrench, 
  Fuel, BarChart2, AlertOctagon, FileText, User, 
  Settings, ShieldCheck, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, setOpen }) => {
  const { user } = useAuth();

  // Sidebar link config with role restriction lists
  const links = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Admin', 'Fleet Manager', 'Driver', 'Safety Officer', 'Financial Analyst'] },
    { to: '/vehicles', label: 'Vehicles', icon: Truck, roles: ['Admin', 'Fleet Manager', 'Safety Officer'] },
    { to: '/drivers', label: 'Drivers', icon: Users, roles: ['Admin', 'Fleet Manager', 'Safety Officer'] },
    { to: '/trips', label: 'Trips', icon: MapPin, roles: ['Admin', 'Fleet Manager', 'Driver'] },
    { to: '/maintenance', label: 'Maintenance', icon: Wrench, roles: ['Admin', 'Fleet Manager'] },
    { to: '/fuel-expenses', label: 'Expenses & Fuel', icon: Fuel, roles: ['Admin', 'Fleet Manager', 'Driver', 'Financial Analyst'] },
    { to: '/reports', label: 'Reports', icon: BarChart2, roles: ['Admin', 'Fleet Manager', 'Safety Officer', 'Financial Analyst'] },
    { to: '/alerts', label: 'Alerts Board', icon: AlertOctagon, roles: ['Admin', 'Fleet Manager', 'Safety Officer'] },
    { to: '/documents', label: 'Documents', icon: FileText, roles: ['Admin', 'Fleet Manager'] },
    { to: '/profile', label: 'Profile', icon: User, roles: ['Admin', 'Fleet Manager', 'Driver', 'Safety Officer', 'Financial Analyst'] },
    { to: '/settings', label: 'Settings', icon: Settings, roles: ['Admin', 'Fleet Manager', 'Driver', 'Safety Officer', 'Financial Analyst'] },
  ];

  const filteredLinks = links.filter((link) => link.roles.includes(user?.role));

  const linkStyle = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? 'bg-brand-teal text-brand-dark shadow-md shadow-brand-teal/15 font-semibold'
        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
    }`;

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {isOpen && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800/80 z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Branding Header */}
        <div className="h-16 border-b border-slate-800/80 flex items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-teal rounded-lg flex items-center justify-center text-brand-dark font-black text-lg">
              T
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-brand-teal to-brand-green bg-clip-text text-transparent">
              TransitOps
            </span>
          </Link>
          <button
            onClick={() => setOpen(false)}
            className="text-slate-400 hover:text-slate-200 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Links Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {filteredLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={linkStyle}
              >
                <Icon size={18} />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer Role Badge */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/20 flex items-center gap-3">
          <div className="p-2 bg-brand-teal/10 text-brand-teal rounded-xl">
            <ShieldCheck size={20} />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs text-slate-500 font-bold uppercase">Active Mode</span>
            <span className="text-sm font-semibold text-slate-300">{user?.role}</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
