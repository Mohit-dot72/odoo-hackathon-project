import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { 
  Truck, Users, MapPin, Wrench, 
  DollarSign, Activity, AlertTriangle, Play 
} from 'lucide-react';
import StatusCard from '../../components/Cards/StatusCard';
import { 
  UtilizationChart, TripsChart, FuelChart, ExpenseChart 
} from '../../components/Charts/AnalyticsCharts';
import { GridSkeleton } from '../../components/Loader/SkeletonLoader';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/admin/analytics');
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
      toast.error('Failed to sync telemetry metrics.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await axios.get('/api/notifications');
      if (response.data.success) {
        setAlerts(response.data.data.slice(0, 5)); // show latest 5
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchAlerts();
  }, []);

  if (loading) {
    return <GridSkeleton count={8} />;
  }

  const summary = data?.summary || {};
  const charts = data?.charts || {};
  const recentActivities = data?.recentActivities || [];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-black text-white">Operations Center</h2>
          <p className="text-slate-400 text-xs mt-1">
            Logged in as <span className="text-brand-teal font-semibold">{user?.name}</span> ({user?.role})
          </p>
        </div>
        
        {/* Quick Actions Panel based on role */}
        <div className="flex flex-wrap gap-3">
          {(user?.role === 'Admin' || user?.role === 'Fleet Manager') && (
            <>
              <button
                onClick={() => navigate('/trips')}
                className="glass-button-primary flex items-center gap-2 py-2 text-xs"
              >
                <Play size={12} />
                <span>Dispatch Trip</span>
              </button>
              <button
                onClick={() => navigate('/vehicles')}
                className="glass-button-secondary py-2 text-xs"
              >
                + Add Truck
              </button>
            </>
          )}
          {user?.role === 'Financial Analyst' && (
            <button
              onClick={() => navigate('/fuel-expenses')}
              className="glass-button-primary flex items-center gap-2 py-2 text-xs"
            >
              <DollarSign size={12} />
              <span>Log Refuel</span>
            </button>
          )}
        </div>
      </div>

      {/* 8 Telemetry Status Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusCard
          title="Active Vehicles"
          value={`${summary.activeVehicles} / ${summary.totalVehicles}`}
          icon={Truck}
          subtext="Trucks currently operational"
          trend={`${summary.fleetUtilization}%`}
          trendType="up"
        />
        <StatusCard
          title="Available Drivers"
          value={`${summary.availableDrivers} / ${summary.totalDrivers}`}
          icon={Users}
          subtext="Ready for dispatch queue"
          trend="85%"
          trendType="neutral"
        />
        <StatusCard
          title="Active Shipments"
          value={summary.activeTrips}
          icon={MapPin}
          subtext="Cargo on the road"
          trend={`+${summary.completedTrips} done`}
          trendType="up"
        />
        <StatusCard
          title="In Maintenance"
          value={summary.maintenanceVehicles}
          icon={Wrench}
          subtext="Undergoing mechanical tune"
          trend="10% Fleet"
          trendType="down"
        />
        <StatusCard
          title="Odo Utilization"
          value={`${summary.fleetUtilization}%`}
          icon={Activity}
          subtext="Monthly mileage allocation"
          trend="+4.2%"
          trendType="up"
        />
        <StatusCard
          title="Toll & Expense Logs"
          value={`$${summary.totalExpenses?.toLocaleString()}`}
          icon={DollarSign}
          subtext="Refuels, parts, toll fees"
          trend="Under budget"
          trendType="up"
        />
        <StatusCard
          title="Fuel Consumption"
          value={`${summary.fuelConsumption?.toLocaleString()} L`}
          icon={Activity}
          subtext="Total liters filled"
          trend={`$${summary.fuelCost?.toLocaleString()}`}
          trendType="neutral"
        />
        <StatusCard
          title="Trip Success Index"
          value={`${summary.tripCompletionRate}%`}
          icon={MapPin}
          subtext="Trip delivery schedule rate"
          trend="Target 98%"
          trendType="up"
        />
      </div>

      {/* Visual Charts Board */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Fleet Utilization Area Chart */}
        <div className="glass-panel p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide">Fleet Utilization History</h3>
          <UtilizationChart data={charts.monthlyUtilization} />
        </div>

        {/* Trips Overview Bar Chart */}
        <div className="glass-panel p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide">Deliveries vs Cancellations</h3>
          <TripsChart data={charts.tripsOverview} />
        </div>

        {/* Fuel Consumption Line Chart */}
        <div className="glass-panel p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide">Monthly Fuel Intake</h3>
          <FuelChart data={charts.fuelConsumption} />
        </div>

        {/* Expenses Pie Chart */}
        <div className="glass-panel p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide">Financial Outlay Split</h3>
          <ExpenseChart data={charts.expenseBreakdown} />
        </div>
      </div>

      {/* Recent Dispatches & Alerts Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Recent Activities */}
        <div className="glass-panel p-6 space-y-4 lg:col-span-2">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide">Recent Dispatches</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-400">
              <thead className="text-[10px] text-slate-500 font-bold uppercase border-b border-slate-800 pb-2">
                <tr>
                  <th className="py-2">Trip / Vehicle</th>
                  <th>Driver</th>
                  <th>Route</th>
                  <th className="text-right">Activity Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {recentActivities.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-500">No recent trip logs</td>
                  </tr>
                ) : (
                  recentActivities.map((act) => (
                    <tr key={act.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="py-3 font-semibold text-slate-200">{act.title}</td>
                      <td>{act.driver}</td>
                      <td>{act.route}</td>
                      <td className="text-right font-medium text-brand-teal">Live</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Active Warnings/Alerts */}
        <div className="glass-panel p-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wide">Critical Operations Alerts</h3>
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">No active warnings</div>
            ) : (
              alerts.map((al) => (
                <div key={al._id} className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex gap-3 text-xs">
                  <div className="p-2 bg-red-500/10 text-red-400 rounded-lg h-fit shrink-0">
                    <AlertTriangle size={14} />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-300">{al.title}</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{al.message}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
