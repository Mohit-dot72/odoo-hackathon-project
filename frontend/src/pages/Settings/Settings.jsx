import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Globe, Lock, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('en');
  
  // Notification preferences
  const [warnings, setWarnings] = useState(true);
  const [maintenanceAlerts, setMaintenanceAlerts] = useState(true);
  const [emailDigest, setEmailDigest] = useState(false);

  // Security preferences
  const [twoFactor, setTwoFactor] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    toast.success('Configuration parameters updated successfully!');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">System Configurations</h2>
        <p className="text-slate-400 text-xs mt-1 font-medium">Configure notification filters, localized parameters, and security policies.</p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* Theme & Localization */}
        <div className="glass-panel border-slate-800 p-6 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Globe size={16} className="text-brand-teal" />
            Theme & Translation
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Operational Theme</label>
              <select
                value={darkMode ? 'dark' : 'light'}
                onChange={(e) => setDarkMode(e.target.value === 'dark')}
                className="w-full glass-input text-xs"
              >
                <option value="dark">Navy Deep Mode (Recommended)</option>
                <option value="light">Solarized Light Mode</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Platform Localization</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full glass-input text-xs"
              >
                <option value="en">English (US)</option>
                <option value="es">Español (ES)</option>
                <option value="fr">Français (FR)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification preferences */}
        <div className="glass-panel border-slate-800 p-6 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Bell size={16} className="text-brand-teal" />
            Alert Filters
          </h3>

          <div className="space-y-4 pt-2">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <h5 className="font-semibold text-slate-200">Real-time Warning Notifications</h5>
                <p className="text-[10px] text-slate-500 mt-0.5">Toggle browser popup alerts for document expirations and safety counseling.</p>
              </div>
              <input
                type="checkbox"
                checked={warnings}
                onChange={() => setWarnings(!warnings)}
                className="w-8 h-4 rounded border-slate-700 bg-slate-900 text-brand-teal focus:ring-0 focus:outline-none"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <h5 className="font-semibold text-slate-200">Maintenance & Garage Indicators</h5>
                <p className="text-[10px] text-slate-500 mt-0.5">Toggle alarms when scheduled parts replacement windows commence.</p>
              </div>
              <input
                type="checkbox"
                checked={maintenanceAlerts}
                onChange={() => setMaintenanceAlerts(!maintenanceAlerts)}
                className="w-8 h-4 rounded border-slate-700 bg-slate-900 text-brand-teal focus:ring-0"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <h5 className="font-semibold text-slate-200">Weekly Email Summary Report</h5>
                <p className="text-[10px] text-slate-500 mt-0.5">Dispatches weekly CSV financial expense totals directly to the register inbox.</p>
              </div>
              <input
                type="checkbox"
                checked={emailDigest}
                onChange={() => setEmailDigest(!emailDigest)}
                className="w-8 h-4 rounded border-slate-700 bg-slate-900 text-brand-teal focus:ring-0"
              />
            </label>
          </div>
        </div>

        {/* Security parameters */}
        <div className="glass-panel border-slate-800 p-6 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Shield size={16} className="text-brand-teal" />
            Security & Authentication
          </h3>

          <div className="pt-2">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <h5 className="font-semibold text-slate-200">Two-Factor Code Verification</h5>
                <p className="text-[10px] text-slate-500 mt-0.5">Require multi-factor token verification during registration and login sessions.</p>
              </div>
              <input
                type="checkbox"
                checked={twoFactor}
                onChange={() => setTwoFactor(!twoFactor)}
                className="w-8 h-4 rounded border-slate-700 bg-slate-900 text-brand-teal focus:ring-0"
              />
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="glass-button-primary py-2.5 px-8 font-bold text-xs flex items-center gap-1.5 self-end"
        >
          <Save size={14} />
          <span>Save Preferences</span>
        </button>
      </form>
    </div>
  );
};

export default Settings;
