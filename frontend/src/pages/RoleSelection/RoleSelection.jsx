import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserCheck, Shield, ClipboardList, Fuel, Key, AlertTriangle } from 'lucide-react';

const RoleSelection = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const roles = [
    {
      title: 'Fleet Manager',
      email: 'manager@transitops.com',
      icon: ClipboardList,
      color: 'text-brand-teal border-brand-teal/20 bg-brand-teal/5 hover:border-brand-teal/50',
      description: 'Dispatches trips, schedules vehicle services, monitors documents, and tracks fleet-wide statuses.',
      features: ['Trip Dispatch Engine', 'Vehicle & Driver CRUD', 'Service Scheduling', 'Verification Uploads'],
    },
    {
      title: 'Driver / Operator',
      email: 'driver@transitops.com',
      icon: Key,
      color: 'text-brand-green border-brand-green/20 bg-brand-green/5 hover:border-brand-green/50',
      description: 'Checks active assignments, reports start/completions, and records fuel fill-ups.',
      features: ['Active Shipment Milestones', 'Odometer Sync Logging', 'Fuel Refill Invoicing', 'Profile & Settings'],
    },
    {
      title: 'Safety Officer',
      email: 'safety@transitops.com',
      icon: Shield,
      color: 'text-blue-400 border-blue-500/20 bg-blue-500/5 hover:border-blue-500/50',
      description: 'Audits safety scores, reviews driver warnings, checks compliance, and generates safety documents.',
      features: ['Driver Safety Metrics', 'License & Insurance Auditing', 'Socket Expiry Alerts', 'Safety PDF Reporting'],
    },
    {
      title: 'Financial Analyst',
      email: 'finance@transitops.com',
      icon: Fuel,
      color: 'text-amber-400 border-amber-500/20 bg-amber-500/5 hover:border-amber-500/50',
      description: 'Monitors fuel quantities, tallies toll expenditures, audits repairs, and exports expense reports.',
      features: ['Expense Category Splits', 'Fuel Refill Analytics', 'Monthly Cost Curves', 'CSV Export Manager'],
    },
    {
      title: 'System Administrator',
      email: 'admin@transitops.com',
      icon: UserCheck,
      color: 'text-purple-400 border-purple-500/20 bg-purple-500/5 hover:border-purple-500/50',
      description: 'Full authorization capability. Approves driver registrations, updates roles, and deletes records.',
      features: ['Full Operations CRUD', 'User Session Control', 'Driver Onboard Approval', 'Global Telemetry Board'],
    },
  ];

  const handleRoleSelect = async (email) => {
    const success = await login(email, 'password123');
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col justify-center py-16 px-6 relative overflow-hidden">
      {/* Glow shapes */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-brand-teal/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-5xl mx-auto w-full relative z-10 text-center space-y-12">
        <div className="space-y-4">
          <span className="px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700/60 text-slate-400 text-xs font-semibold uppercase tracking-wider">
            Reviewer Demo Sandbox
          </span>
          <h1 className="text-3xl md:text-5xl font-black text-white">
            Choose Your{' '}
            <span className="bg-gradient-to-r from-brand-teal to-brand-green bg-clip-text text-transparent">
              Platform Role
            </span>
          </h1>
          <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
            Select a customized demo session. The application will log in with pre-seeded mock records and customize dashboard features.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <div
                key={index}
                onClick={() => handleRoleSelect(role.email)}
                className={`glass-panel border p-6 flex flex-col justify-between cursor-pointer transform hover:-translate-y-1 transition-all duration-300 group ${role.color}`}
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg text-slate-100 group-hover:text-brand-teal transition-colors">
                      {role.title}
                    </h3>
                    <div className="p-2 bg-slate-900/60 rounded-xl border border-slate-800">
                      <Icon size={20} />
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">
                    {role.description}
                  </p>
                </div>

                <div>
                  <div className="h-[1px] bg-slate-800/80 mb-4" />
                  <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Module Access:</span>
                  <ul className="grid grid-cols-2 gap-2 mt-2">
                    {role.features.map((feat, idx) => (
                      <li key={idx} className="text-[10px] text-slate-300 flex items-center gap-1">
                        <span className="w-1 h-1 bg-brand-teal rounded-full"></span>
                        <span className="truncate">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Back to landing */}
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            &larr; Back to Landing Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
