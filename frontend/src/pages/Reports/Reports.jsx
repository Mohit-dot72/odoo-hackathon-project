import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart3, Download, FileSpreadsheet, FileText, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const Reports = () => {
  const [reportType, setReportType] = useState('Vehicle');
  const [format, setFormat] = useState('CSV');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('/api/reports');
      if (res.data.success) {
        setHistory(res.data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleExport = () => {
    setLoading(true);
    try {
      // Direct native browser download route trigger
      const url = `/api/reports/export?type=${reportType}&format=${format}`;
      window.open(url, '_blank');
      
      toast.success(`${reportType} ${format} generated!`);
      // Delay history refresh to give backend time to register
      setTimeout(() => {
        fetchHistory();
        setLoading(false);
      }, 1500);
    } catch (err) {
      toast.error('Failed to export report.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white">Exporter Hub</h2>
        <p className="text-slate-400 text-xs mt-1 font-medium">Export vehicle roster sheets, driver safety scores, refuel invoices, and garage reports.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Selector panel */}
        <div className="glass-panel border-slate-800 p-6 space-y-6">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Configure Report</h3>
          
          <div className="space-y-4 text-xs">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Dataset Category</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full glass-input text-xs"
              >
                <option value="Vehicle">Vehicle Fleet Registry</option>
                <option value="Driver">Driver Safety Scores</option>
                <option value="Trip">Live Dispatch Sheets</option>
                <option value="Fuel">Fuel Efficiency Curve</option>
                <option value="Expense">Fleet General Expenses</option>
                <option value="Maintenance">Garage Services History</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase">Export Format</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormat('CSV')}
                  className={`py-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                    format === 'CSV'
                      ? 'border-brand-teal text-brand-teal bg-brand-teal/5 font-bold'
                      : 'border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileSpreadsheet size={20} />
                  <span>CSV Spreadsheet</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setFormat('PDF')}
                  className={`py-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${
                    format === 'PDF'
                      ? 'border-brand-teal text-brand-teal bg-brand-teal/5 font-bold'
                      : 'border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileText size={20} />
                  <span>PDF Document</span>
                </button>
              </div>
            </div>

            <button
              onClick={handleExport}
              disabled={loading}
              className="glass-button-primary w-full py-2.5 font-bold flex items-center justify-center gap-2 mt-4 text-xs"
            >
              <Download size={14} />
              <span>{loading ? 'Exporting...' : 'Export Document'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: History panel */}
        <div className="glass-panel border-slate-800 p-6 lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Export History Log</h3>
          
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left text-slate-400">
              <thead className="text-[10px] text-slate-500 font-bold uppercase border-b border-slate-800 pb-2">
                <tr>
                  <th className="py-2">Report Info</th>
                  <th>Generated By</th>
                  <th>Date & Time</th>
                  <th className="text-right">Format</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {history.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-500">No export logs found.</td>
                  </tr>
                ) : (
                  history.map((h) => (
                    <tr key={h._id} className="hover:bg-slate-800/25 transition-colors">
                      <td className="py-3 font-semibold text-slate-200">{h.reportType} Report</td>
                      <td>{h.generatedBy?.name || 'Dispatcher'}</td>
                      <td>{new Date(h.createdAt).toLocaleString()}</td>
                      <td className="text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          h.format === 'CSV' ? 'bg-brand-green/10 text-brand-green' : 'bg-brand-teal/10 text-brand-teal'
                        }`}>
                          {h.format}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
