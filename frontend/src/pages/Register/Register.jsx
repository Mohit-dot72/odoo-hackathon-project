import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Lock, Phone, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Driver');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !phone) {
      return toast.error('Please fill in all fields');
    }

    setLoading(true);
    const success = await register(name, email, password, role, phone);
    setLoading(false);

    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-brand-teal/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 bg-brand-teal rounded-2xl flex items-center justify-center text-brand-dark font-black text-2xl">
              T
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white">
              Transit<span className="text-brand-teal">Ops</span>
            </span>
          </Link>
          <p className="text-slate-400 text-sm">Smart Transport Operations Console</p>
        </div>

        {/* Form Panel */}
        <div className="glass-panel border-slate-700/60 p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-slate-100 mb-6">Create Platform Account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="John Miller"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full glass-input pl-10 text-sm"
                  required
                />
                <User className="absolute left-3.5 top-3 text-slate-500" size={16} />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full glass-input pl-10 text-sm"
                  required
                />
                <Mail className="absolute left-3.5 top-3 text-slate-500" size={16} />
              </div>
            </div>

            {/* Phone Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone Number</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="+1 (555) 123-4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full glass-input pl-10 text-sm"
                  required
                />
                <Phone className="absolute left-3.5 top-3 text-slate-500" size={16} />
              </div>
            </div>

            {/* Role Select Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Security Access Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full glass-input text-sm"
              >
                <option value="Driver">Driver / Operator</option>
                <option value="Fleet Manager">Fleet Manager</option>
                <option value="Safety Officer">Safety Officer</option>
                <option value="Financial Analyst">Financial Analyst</option>
                <option value="Admin">System Administrator</option>
              </select>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Account Password</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="•••••••• (Min 6 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full glass-input pl-10 text-sm"
                  minLength={6}
                  required
                />
                <Lock className="absolute left-3.5 top-3 text-slate-500" size={16} />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full glass-button-primary flex items-center justify-center gap-2 font-bold text-sm py-3 mt-2"
            >
              <span>{loading ? 'Registering...' : 'Register Account'}</span>
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-teal hover:underline font-semibold">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
