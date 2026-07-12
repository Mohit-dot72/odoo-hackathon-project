import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { FileText, Search, Plus, Trash2, Download, Eye, X, UploadCloud } from 'lucide-react';
import { TableSkeleton } from '../../components/Loader/SkeletonLoader';
import toast from 'react-hot-toast';

const Documents = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  
  // Modal states
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState('Insurance');
  const [expiryDate, setExpiryDate] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/documents', {
        params: { search, type: typeFilter },
      });
      if (res.data.success) {
        setDocuments(res.data.data);
      }
    } catch (err) {
      toast.error('Failed to sync compliance files.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [search, typeFilter]);

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      return toast.error('Please pick a file to upload');
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('type', type);
    if (expiryDate) {
      formData.append('expiryDate', expiryDate);
    }
    formData.append('file', selectedFile);

    try {
      const res = await axios.post('/api/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        toast.success('Document uploaded successfully!');
        setUploadModalOpen(false);
        resetForm();
        fetchDocuments();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete(`/api/documents/${id}`);
      if (res.data.success) {
        toast.success('Document removed.');
        fetchDocuments();
      }
    } catch (err) {
      toast.error('Failed to remove file.');
    }
  };

  const resetForm = () => {
    setName('');
    setType('Insurance');
    setExpiryDate('');
    setSelectedFile(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Compliance Locker</h2>
          <p className="text-slate-400 text-xs mt-1 font-medium">Verify insurance binders, registration books, emissions clearances, and licenses.</p>
        </div>
        
        <button
          onClick={() => setUploadModalOpen(true)}
          className="glass-button-primary flex items-center gap-2 py-2 text-xs"
        >
          <UploadCloud size={14} />
          <span>Upload File</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800/80">
        <div className="relative">
          <input
            type="text"
            placeholder="Search document name, type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1E293B]/45 border border-slate-700/60 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-teal transition-all placeholder:text-slate-500"
          />
          <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="bg-[#1E293B]/45 border border-slate-700/60 rounded-xl px-4 py-2 text-xs text-slate-300 focus:outline-none focus:border-brand-teal"
        >
          <option value="">All Categories</option>
          <option value="Insurance">Insurance Binders</option>
          <option value="RC Book">Registration (RC) Book</option>
          <option value="Driver License">Driver Licenses</option>
          <option value="Fitness Certificate">Fitness Clearances</option>
          <option value="Pollution Certificate">Pollution Clearances</option>
        </select>
      </div>

      {/* Document Grid */}
      {loading ? (
        <TableSkeleton rows={4} cols={4} />
      ) : documents.length === 0 ? (
        <div className="py-20 text-center text-slate-500 text-sm">No compliance files registered.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div key={doc._id} className="glass-panel border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700/60 transition-all duration-200">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-brand-teal/10 text-brand-teal rounded-lg">
                      <FileText size={18} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-white text-sm truncate w-40">{doc.name}</h3>
                      <span className="text-[10px] text-slate-500 font-bold uppercase block mt-0.5">{doc.type}</span>
                    </div>
                  </div>
                </div>

                <div className="text-xs space-y-1 bg-slate-950/20 p-3 rounded-xl border border-slate-850">
                  <div className="flex justify-between"><span className="text-slate-500">Uploaded By:</span><span className="text-slate-300 font-semibold">{doc.uploadedBy?.name || 'Dispatcher'}</span></div>
                  {doc.expiryDate && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Expiry Date:</span>
                      <span className={`font-semibold ${
                        new Date(doc.expiryDate) < new Date() ? 'text-red-400 font-bold' : 'text-slate-350'
                      }`}>{new Date(doc.expiryDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 mt-6 pt-3 border-t border-slate-800/60">
                <button
                  onClick={() => window.open(doc.fileUrl, '_blank')}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Download File"
                >
                  <Download size={14} />
                </button>
                {(user?.role === 'Admin' || String(user?.id) === String(doc.uploadedBy?._id)) && (
                  <button
                    onClick={() => handleDelete(doc._id)}
                    className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/25 transition-colors"
                    title="Remove Document"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setUploadModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm"></div>
          <form onSubmit={handleUpload} className="glass-panel w-full max-w-md relative z-10 p-6 space-y-4 border border-slate-700">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white">Upload File</h3>
              <button type="button" onClick={() => setUploadModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Document Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Volvo Insurance 2026" className="glass-input text-xs w-full" required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">File Category</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="glass-input text-xs w-full">
                  <option value="Insurance">Insurance Binders</option>
                  <option value="RC Book">Registration (RC) Book</option>
                  <option value="Driver License">Driver Licenses</option>
                  <option value="Fitness Certificate">Fitness Clearances</option>
                  <option value="Pollution Certificate">Pollution Clearances</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Expiry Date</label>
                <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className="glass-input text-xs w-full text-slate-350" />
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Select Document File</label>
                <input type="file" onChange={handleFileChange} className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-300 file:cursor-pointer hover:file:bg-slate-700" required />
              </div>
            </div>
            
            <button type="submit" disabled={uploading} className="glass-button-primary w-full text-xs py-2.5 font-bold flex items-center justify-center gap-2 mt-4">
              <UploadCloud size={14} />
              <span>{uploading ? 'Uploading...' : 'Upload Document'}</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Documents;
