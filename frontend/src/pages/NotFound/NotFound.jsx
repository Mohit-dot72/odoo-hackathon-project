import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-brand-dark flex flex-col justify-center items-center p-6 text-center">
      <div className="glass-panel max-w-md p-8 border border-slate-700/50 shadow-2xl flex flex-col items-center">
        <div className="p-4 bg-red-500/10 text-red-400 rounded-full mb-6">
          <AlertCircle size={48} />
        </div>
        
        <h1 className="text-6xl font-black text-white mb-2">404</h1>
        <h2 className="text-xl font-bold text-slate-200 mb-4">Route Not Dispatched</h2>
        
        <p className="text-slate-400 text-xs leading-relaxed mb-8">
          The dispatch coordinates you requested do not exist in our operations mapping system. Check the URL parameters or return to operations.
        </p>

        <Link
          to="/"
          className="glass-button-primary flex items-center justify-center gap-2 py-2 px-6 w-full text-xs font-semibold"
        >
          <ArrowLeft size={14} />
          <span>Return to Dashboard</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
