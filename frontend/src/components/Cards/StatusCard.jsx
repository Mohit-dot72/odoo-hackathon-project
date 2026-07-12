import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatusCard = ({ title, value, icon: Icon, subtext, trend, trendType = 'neutral' }) => {
  return (
    <div className="glass-panel glass-panel-hover p-6 flex flex-col justify-between relative overflow-hidden group">
      {/* Background radial accent glow */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-brand-teal/5 rounded-full blur-2xl group-hover:bg-brand-teal/10 transition-all duration-300"></div>

      <div className="flex items-center justify-between mb-4">
        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/40 text-brand-teal group-hover:border-brand-teal/30 transition-colors duration-300">
            <Icon size={18} />
          </div>
        )}
      </div>

      <div>
        <h3 className="text-2xl font-bold tracking-tight text-slate-100 group-hover:text-brand-teal transition-colors duration-300">
          {value}
        </h3>
        
        <div className="flex items-center gap-1.5 mt-2">
          {trend !== undefined && (
            <span className={`flex items-center text-xs font-semibold gap-0.5 ${
              trendType === 'up' ? 'text-brand-green' : trendType === 'down' ? 'text-red-400' : 'text-slate-500'
            }`}>
              {trendType === 'up' && <TrendingUp size={12} />}
              {trendType === 'down' && <TrendingDown size={12} />}
              {trend}
            </span>
          )}
          <span className="text-slate-500 text-[11px] font-medium">{subtext}</span>
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
