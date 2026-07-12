import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Mail, Lock, ArrowRight, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Redirect path after logging in
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error('Please fill in all fields');
    }

    setLoading(true);
    const success = await login(email, password);
    setLoading(false);

    if (success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-brand-teal/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-brand-green/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Branding header */}
        <div className="text-center mb-8 space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 bg-brand-teal rounded-2xl flex items-center justify-center text-brand-dark font-black text-2xl shadow-lg shadow-brand-teal/20">
              T
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-white">
              Transit<span className="text-brand-teal">Ops</span>
            </span>
          </Link>
          <p className="text-slate-400 text-sm">Smart Transport Operations Console</p>
        </div>

        {/* Login Form Panel */}
        <div className="glass-panel border-slate-700/60 p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-slate-100 mb-6">Authenticate Session</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
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

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Password</label>
                <button
                  type="button"
                  onClick={() => {
                    toast.success('Reset link dispatched to email console (mock)');
                  }}
                  className="text-xs text-brand-teal hover:underline font-semibold"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full glass-input pl-10 text-sm"
                  required
                />
                <Lock className="absolute left-3.5 top-3 text-slate-500" size={16} />
              </div>
            </div>

            {/* Remember Me Toggle */}
            <div className="flex items-center justify-between py-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-900/60 text-brand-teal focus:ring-0 focus:ring-offset-0 focus:outline-none"
                />
                <span className="text-xs text-slate-400 font-medium">Remember token</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full glass-button-primary flex items-center justify-center gap-2 font-bold text-sm py-3"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Quick Mock Access Info */}
          <div className="mt-6 p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed flex gap-2.5 items-start">
            <Info size={16} className="text-brand-teal shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-300">Quick Test Credentials:</span>
              <br />
              Admin: <code className="text-brand-teal">admin@transitops.com</code> (pass: <code className="text-brand-teal">password123</code>)
              <br />
              Fleet Mgr: <code className="text-brand-teal">manager@transitops.com</code> (pass: <code className="text-brand-teal">password123</code>)
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-teal hover:underline font-semibold">
              Register here
            </Link>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            &larr; Back to Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
