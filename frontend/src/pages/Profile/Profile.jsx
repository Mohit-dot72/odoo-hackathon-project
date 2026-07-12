import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, MapPin, Lock, Save, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState(user?.address || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveInfo = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate updating backend profile
    setTimeout(() => {
      updateProfile({ name, phone, email, address });
      setLoading(false);
      toast.success('Profile details updated successfully!');
    }, 800);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    toast.success('Password updated successfully (Local session hashes sync)!');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Profile Settings</h2>
        <p className="text-slate-400 text-xs mt-1">Adjust individual telemetry parameters and security credentials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Card: Summary & Avatar */}
        <div className="glass-panel border-slate-800 p-6 flex flex-col items-center text-center space-y-4 h-fit">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-brand-teal to-brand-green p-[2px] cursor-pointer">
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center text-brand-teal text-3xl font-black uppercase">
                {name.charAt(0)}
              </div>
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-brand-teal text-brand-dark rounded-full hover:scale-105 transition-transform" title="Update Avatar">
              <Camera size={14} />
            </button>
          </div>

          <div>
            <h3 className="font-extrabold text-white text-base">{name}</h3>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider block mt-0.5">{user?.role}</span>
          </div>

          <div className="w-full h-[1px] bg-slate-800/80" />

          <div className="w-full space-y-2 text-xs text-left">
            <div className="flex justify-between"><span className="text-slate-500">Security Clearance:</span><span className="text-brand-teal font-semibold">Active</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Session Verified:</span><span className="text-brand-green font-semibold">Yes</span></div>
          </div>
        </div>

        {/* Right Form: Info */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSaveInfo} className="glass-panel border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Account Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5 text-xs">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Full Name</label>
                <div className="relative">
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full glass-input text-xs pl-9" required />
                  <User className="absolute left-3 top-2.5 text-slate-500" size={14} />
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Email Address</label>
                <div className="relative">
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full glass-input text-xs pl-9" required />
                  <Mail className="absolute left-3 top-2.5 text-slate-500" size={14} />
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</label>
                <div className="relative">
                  <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full glass-input text-xs pl-9" required />
                  <Phone className="absolute left-3 top-2.5 text-slate-500" size={14} />
                </div>
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Location Address</label>
                <div className="relative">
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full glass-input text-xs pl-9" />
                  <MapPin className="absolute left-3 top-2.5 text-slate-500" size={14} />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="glass-button-primary py-2 px-6 font-bold text-xs flex items-center gap-1.5 self-end">
              <Save size={14} />
              <span>{loading ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </form>

          {/* Password update form */}
          <form onSubmit={handleUpdatePassword} className="glass-panel border-slate-800 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Update Security Credentials</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">New Password</label>
                <div className="relative">
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 chars" className="w-full glass-input text-xs pl-9" minLength={6} required />
                  <Lock className="absolute left-3 top-2.5 text-slate-500" size={14} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Confirm Password</label>
                <div className="relative">
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full glass-input text-xs pl-9" minLength={6} required />
                  <Lock className="absolute left-3 top-2.5 text-slate-500" size={14} />
                </div>
              </div>
            </div>

            <button type="submit" className="glass-button-primary py-2 px-6 font-bold text-xs flex items-center gap-1.5">
              <Save size={14} />
              <span>Update Password</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
