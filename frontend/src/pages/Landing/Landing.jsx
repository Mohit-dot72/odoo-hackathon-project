import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import { 
  ArrowRight, Activity, Map, ShieldAlert, BarChart3, 
  DollarSign, CheckCircle2, Star, Plus, Minus, Send 
} from 'lucide-react';

const Landing = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [contactSuccess, setContactSuccess] = useState(false);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const features = [
    {
      title: 'Real-Time Dispatching',
      description: 'Track fleet routes, trip schedules, and live telemetry on a unified GIS dashboard layout.',
      icon: Map,
    },
    {
      title: 'Safety Counselor Metrics',
      description: 'Audit individual driver scoring logs, license expiry schedules, and safety counselors.',
      icon: ShieldAlert,
    },
    {
      title: 'Smart Fleet Diagnostics',
      description: 'Preventive service calendars, compliance uploads, and automatic maintenance notifications.',
      icon: Activity,
    },
    {
      title: 'Expense & Fuel Ledger',
      description: 'Audit refuel logs, log tolls, analyze consumption coefficients, and export spreadsheets.',
      icon: DollarSign,
    },
  ];

  const pricing = [
    {
      name: 'Starter Plan',
      price: '$199',
      period: 'month',
      desc: 'Optimized for small delivery companies with up to 10 vehicles.',
      features: ['Up to 10 Active Vehicles', 'Standard Dispatch Tracking', 'Basic Expense Logging', 'CSV Data Exports', 'Email Support'],
      cta: 'Start Free Trial',
      popular: false,
    },
    {
      name: 'Operations Pro',
      price: '$499',
      period: 'month',
      desc: 'Comprehensive suite for medium-sized fleets and dispatch depots.',
      features: ['Up to 50 Vehicles', 'Real-Time Socket Alerts', 'Driver Safety Ratings', 'PDF/CSV Export Dashboard', 'Priority 24/7 Support', 'Documents OCR Cloud Storage'],
      cta: 'Upgrade to Pro',
      popular: true,
    },
    {
      name: 'Enterprise Telemetry',
      price: 'Custom',
      period: 'quote',
      desc: 'Customized API architecture for multi-national supply logistics.',
      features: ['Unlimited Vehicles', 'Dedicated Socket Server', 'Custom ERP Integrations', 'Custom PDF/CSV Templates', 'Dedicated Operations Manager', 'SLA Agreement Guarantee'],
      cta: 'Contact Dispatcher',
      popular: false,
    },
  ];

  const faqs = [
    {
      q: 'Does TransitOps require OBD hardware tracking installation?',
      a: 'No, TransitOps is designed to connect seamlessly with existing GPS telematics APIs, mobile driver logins, or direct manual driver inputs, keeping setup immediate.',
    },
    {
      q: 'How does the automated document expiration alert work?',
      a: 'When RC Books, insurances, or driver licenses are uploaded, our background scheduler monitors expiration dates and fires real-time Socket.IO browser warnings 30 days prior.',
    },
    {
      q: 'Can we import bulk vehicle logs using CSV?',
      a: 'Yes, our dashboard allows administrators to upload CSV lists of drivers, vehicles, and fuel receipts directly into the database engine.',
    },
    {
      q: 'Is there support for driver logins?',
      a: 'Absolutely! Drivers have a streamlined dashboard to check their scheduled trips, log active coordinates, upload fuel invoices, and adjust settings.',
    },
  ];

  return (
    <div className="bg-[#0B0F19] text-slate-100 min-h-screen relative">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center relative overflow-hidden">
        {/* Glow overlay */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-teal/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <span className="px-4 py-1.5 rounded-full bg-brand-teal/10 border border-brand-teal/30 text-brand-teal text-xs font-semibold uppercase tracking-wider">
            Smart Transport Operations Platform
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-white">
            Optimize Fleet Logistics in{' '}
            <span className="bg-gradient-to-r from-brand-teal to-brand-green bg-clip-text text-transparent">
              Real-Time
            </span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            TransitOps connects dispatchers, drivers, mechanics, and analysts on a single premium glassmorphic dashboard. Manage CRUD logs, compliance certificates, and expenses.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/roles" className="glass-button-primary flex items-center justify-center gap-2 py-3 px-8">
              <span>Launch Demo Deck</span>
              <ArrowRight size={16} />
            </Link>
            <a href="#features" className="glass-button-secondary py-3 px-8 text-center">
              Explore Features
            </a>
          </div>
        </div>

        {/* Custom Truck illustration Banner */}
        <div className="mt-16 relative w-full max-w-5xl mx-auto glass-panel p-2 border border-slate-700/40 rounded-3xl shadow-2xl">
          <div className="bg-slate-950/80 rounded-[22px] overflow-hidden p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 text-left border border-slate-800">
            <div className="flex-1 space-y-4">
              <h3 className="text-xl md:text-2xl font-bold text-white">Interactive Fleet Telemetry</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Experience dynamic Recharts fuel curves, scheduled maintenance reminders, and instantaneous Socket.IO dispatch warning updates. Secure, role-restricted, and fast.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <CheckCircle2 size={16} className="text-brand-teal" />
                  <span>React 19 & Tailwind</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <CheckCircle2 size={16} className="text-brand-teal" />
                  <span>Node / Mongoose Engine</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <CheckCircle2 size={16} className="text-brand-teal" />
                  <span>Socket.IO Channels</span>
                </div>
              </div>
            </div>
            
            {/* SVG truck graphic banner */}
            <div className="w-full md:w-80 flex items-center justify-center bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
              <svg viewBox="0 0 120 80" className="w-full max-w-[200px] text-brand-teal fill-current">
                <path d="M10,45 L10,50 L20,50 L20,45 Z" fill="#1e293b" />
                <path d="M20,25 L75,25 L75,55 L20,55 Z" fill="#1e293b" stroke="rgba(20,184,166,0.3)" />
                <path d="M75,30 L95,30 L105,42 L105,55 L75,55 Z" fill="#0f172a" stroke="#14B8A6" strokeWidth="1" />
                <circle cx="35" cy="58" r="8" fill="#10B981" />
                <circle cx="35" cy="58" r="4" fill="#0b0f19" />
                <circle cx="85" cy="58" r="8" fill="#10B981" />
                <circle cx="85" cy="58" r="4" fill="#0b0f19" />
                <path d="M90,35 L100,35 L102,42 L90,42 Z" fill="#1e293b" />
                <rect x="30" y="32" width="20" height="4" fill="#14b8a6" opacity="0.6" />
                <rect x="30" y="40" width="30" height="4" fill="#14b8a6" opacity="0.6" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 bg-slate-950/40 border-y border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight">Platform Features</h2>
            <p className="text-slate-400 text-sm">
              TransitOps offers role-customized tool suites mapping permissions logically across your transport division.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <div key={index} className="glass-panel glass-panel-hover p-6 space-y-4">
                  <div className="p-3 bg-brand-teal/10 text-brand-teal rounded-xl w-fit">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-bold text-lg text-white">{feat.title}</h3>
                  <p className="text-slate-400 text-xs leading-relaxed">{feat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section id="statistics" className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-2">
            <h4 className="text-4xl md:text-5xl font-black text-brand-teal">99.8%</h4>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Fleet Uptime</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-4xl md:text-5xl font-black text-brand-teal">1.2M+</h4>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Completed Trips</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-4xl md:text-5xl font-black text-brand-teal">22%</h4>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Fuel Cost Cut</p>
          </div>
          <div className="space-y-2">
            <h4 className="text-4xl md:text-5xl font-black text-brand-teal">&lt; 3 Sec</h4>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Alert Dispatch</p>
          </div>
        </div>
      </section>

      {/* Benefits section */}
      <section id="benefits" className="py-20 bg-slate-950/40 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Engineered for Modern Fleet Operations</h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              Managing complex transport networks calls for robust software integrations. Our platform aligns safety inspectors checking RC/Pollution certifications with financial experts auditing refuels.
            </p>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle2 className="text-brand-teal shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold text-sm text-slate-200">Role-Based Security Guards</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Analyst, safety inspector, manager, and driver sessions prevent data manipulation.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle2 className="text-brand-teal shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold text-sm text-slate-200">Interactive Document Expiry Warnings</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Scans document expiry dates and dispatches warnings via socket networks.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 bg-slate-900/40 border-slate-800">
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800/80">
                <span className="text-xs font-bold uppercase text-brand-teal">Live Dispatch Board</span>
                <span className="px-2 py-0.5 rounded-full bg-brand-green/10 text-brand-green text-[10px] font-bold uppercase">Active</span>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-200">TRIP-1003 (Tesla Semi)</p>
                    <p className="text-slate-500 mt-0.5">Seattle to Portland</p>
                  </div>
                  <span className="text-brand-teal font-semibold">On Trip</span>
                </div>
                <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-200">TRIP-1001 (Volvo FH16)</p>
                    <p className="text-slate-500 mt-0.5">SF to Los Angeles</p>
                  </div>
                  <span className="text-slate-500 font-semibold">Scheduled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight">Flexible Operations Pricing</h2>
            <p className="text-slate-400 text-sm">
              SaaS tiers designed to adapt seamlessly as you add trucks and driver depots to your network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricing.map((tier, idx) => (
              <div
                key={idx}
                className={`glass-panel p-8 flex flex-col justify-between relative ${
                  tier.popular ? 'border-brand-teal ring-1 ring-brand-teal/20' : 'border-slate-800'
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 right-6 bg-brand-teal text-brand-dark text-[10px] font-extrabold uppercase px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <div>
                  <h3 className="text-lg font-bold text-slate-200">{tier.name}</h3>
                  <div className="flex items-baseline gap-1 mt-4">
                    <span className="text-3xl md:text-4xl font-black text-white">{tier.price}</span>
                    <span className="text-slate-500 text-xs font-semibold">/{tier.period}</span>
                  </div>
                  <p className="text-slate-400 text-xs mt-3 leading-relaxed">{tier.desc}</p>
                  
                  <div className="h-[1px] bg-slate-800/80 my-6" />

                  <ul className="space-y-3">
                    {tier.features.map((feat, fidx) => (
                      <li key={fidx} className="flex items-center gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 size={14} className="text-brand-teal shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to="/roles"
                  className={`mt-8 py-2.5 rounded-xl font-semibold text-xs text-center transition-all ${
                    tier.popular
                      ? 'bg-brand-teal text-brand-dark hover:bg-brand-teal/95 hover:shadow-lg hover:shadow-brand-teal/15'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="py-20 bg-slate-950/40 border-t border-slate-900">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
            <p className="text-slate-400 text-sm">All you need to know about the platform controls.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="glass-panel border-slate-800 p-4">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex justify-between items-center text-left font-semibold text-sm text-slate-200 hover:text-brand-teal transition-colors"
                >
                  <span>{faq.q}</span>
                  {activeFaq === idx ? <Minus size={16} /> : <Plus size={16} />}
                </button>
                {activeFaq === idx && (
                  <p className="text-xs text-slate-400 mt-3 leading-relaxed border-t border-slate-800/50 pt-3">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 max-w-3xl mx-auto px-6 text-center">
        <div className="glass-panel p-8 border-slate-800/80 bg-slate-900/30">
          <h2 className="text-2xl font-bold text-slate-100 mb-2">Speak to a Dispatch Consultant</h2>
          <p className="text-xs text-slate-500 mb-6 max-w-md mx-auto">
            Need custom telemetry APIs or custom integrations? Drop your details and our team will connect.
          </p>

          {contactSuccess ? (
            <div className="py-6 text-brand-green text-sm font-semibold flex flex-col items-center gap-2">
              <CheckCircle2 size={32} />
              <span>Inquiry dispatched successfully! We'll call back soon.</span>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setContactSuccess(true);
              }}
              className="space-y-4 text-left"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  className="glass-input text-xs"
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  required
                  className="glass-input text-xs"
                />
              </div>
              <textarea
                rows="3"
                placeholder="How can we assist your fleet operations?"
                required
                className="glass-input text-xs w-full"
              ></textarea>
              <button
                type="submit"
                className="glass-button-primary flex items-center justify-center gap-2 py-2 px-6 text-xs w-full"
              >
                <span>Dispatch Inquiry</span>
                <Send size={12} />
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-900 bg-slate-950 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-teal rounded-md flex items-center justify-center text-brand-dark font-black text-xs">
              T
            </div>
            <span className="font-bold text-slate-300">TransitOps Platform</span>
          </div>
          <p className="text-slate-600">
            &copy; {new Date().getFullYear()} TransitOps Platform. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-400">Terms</a>
            <a href="#" className="hover:text-slate-400">Privacy</a>
            <a href="#" className="hover:text-slate-400">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
