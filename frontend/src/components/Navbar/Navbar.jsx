import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-brand-dark/85 backdrop-blur-md border-b border-slate-800/80 py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-brand-teal rounded-xl flex items-center justify-center text-brand-dark font-black text-xl shadow-lg shadow-brand-teal/20">
            T
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">
            Transit<span className="text-brand-teal">Ops</span>
          </span>
        </Link>

        {/* Desktop Nav Items */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-slate-300 hover:text-brand-teal transition-colors">Features</a>
          <a href="#statistics" className="text-sm font-medium text-slate-300 hover:text-brand-teal transition-colors">Stats</a>
          <a href="#benefits" className="text-sm font-medium text-slate-300 hover:text-brand-teal transition-colors">Benefits</a>
          <a href="#pricing" className="text-sm font-medium text-slate-300 hover:text-brand-teal transition-colors">Pricing</a>
          <a href="#faq" className="text-sm font-medium text-slate-300 hover:text-brand-teal transition-colors">FAQ</a>
        </div>

        {/* Session actions */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <Link
              to="/dashboard"
              className="glass-button-primary flex items-center gap-2 px-5 py-2 text-sm"
            >
              <span>Dashboard</span>
              <ArrowRight size={14} />
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link
                to="/register"
                className="bg-slate-800/80 border border-slate-700/50 text-slate-200 px-5 py-2 rounded-xl text-sm font-semibold hover:bg-slate-700 hover:text-white hover:border-slate-600 transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-slate-400 hover:text-slate-200 md:hidden focus:outline-none"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="absolute top-full inset-x-0 bg-brand-dark/95 border-b border-slate-800/90 py-6 px-6 flex flex-col gap-5 md:hidden shadow-2xl backdrop-blur-lg">
          <a
            href="#features"
            onClick={() => setIsOpen(false)}
            className="text-base font-medium text-slate-300 hover:text-brand-teal"
          >
            Features
          </a>
          <a
            href="#statistics"
            onClick={() => setIsOpen(false)}
            className="text-base font-medium text-slate-300 hover:text-brand-teal"
          >
            Stats
          </a>
          <a
            href="#pricing"
            onClick={() => setIsOpen(false)}
            className="text-base font-medium text-slate-300 hover:text-brand-teal"
          >
            Pricing
          </a>
          <a
            href="#faq"
            onClick={() => setIsOpen(false)}
            className="text-base font-medium text-slate-300 hover:text-brand-teal"
          >
            FAQ
          </a>

          <div className="h-[1px] bg-slate-800/60 my-2" />

          {user ? (
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              className="glass-button-primary text-center"
            >
              Go to Dashboard
            </Link>
          ) : (
            <div className="flex flex-col gap-3">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="text-center font-semibold text-slate-300 py-2.5 hover:text-white"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="glass-button-primary text-center"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
