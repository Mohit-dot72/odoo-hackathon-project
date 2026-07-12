import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', type = 'danger' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/70 backdrop-blur-sm"></div>

      {/* Modal Container */}
      <div className="glass-panel w-full max-w-md relative z-10 p-6 border border-slate-700/80 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl ${
            type === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-brand-teal/10 text-brand-teal'
          }`}>
            <AlertTriangle size={24} />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-100">{title}</h3>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="glass-button-secondary py-2 text-xs"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`py-2 px-5 rounded-xl font-semibold text-xs transition-all ${
              type === 'danger'
                ? 'bg-red-500 text-white hover:bg-red-600 hover:shadow-lg hover:shadow-red-500/10'
                : 'glass-button-primary'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
