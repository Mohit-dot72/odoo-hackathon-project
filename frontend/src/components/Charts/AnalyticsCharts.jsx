import React from 'react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, BarChart, Bar,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

// Global Custom Tooltip to fit dark navy theme
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-panel p-3 border border-slate-700 text-xs">
        <p className="font-semibold text-slate-300 mb-1">{label}</p>
        {payload.map((item, index) => (
          <p key={index} style={{ color: item.color }} className="font-medium mt-0.5">
            {item.name}: {item.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// 1. Fleet Utilization Chart (Area)
export const UtilizationChart = ({ data = [] }) => {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorUti" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
          <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
          <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="utilization" stroke="#14B8A6" strokeWidth={2} fillOpacity={1} fill="url(#colorUti)" name="Utilization Rate (%)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// 2. Trips Overview Chart (Bar)
export const TripsChart = ({ data = [] }) => {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
          <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
          <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '11px', color: '#94A3B8' }} />
          <Bar dataKey="completed" fill="#10B981" radius={[4, 4, 0, 0]} name="Completed" />
          <Bar dataKey="cancelled" fill="#EF4444" radius={[4, 4, 0, 0]} name="Cancelled" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// 3. Fuel Consumption Chart (Line)
export const FuelChart = ({ data = [] }) => {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
          <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} />
          <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '11px' }} />
          <Line type="monotone" dataKey="liters" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Consumption (Liters)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// 4. Expense Breakdown Chart (Pie)
export const ExpenseChart = ({ data = [] }) => {
  const COLORS = ['#14B8A6', '#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];
  const chartData = (data || []).filter(item => item.value > 0);

  return (
    <div className="w-full h-80 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '10px' }} layout="horizontal" verticalAlign="bottom" align="center" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
