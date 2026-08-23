import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  const bgStyles = {
    success: 'bg-white border-emerald-300 text-emerald-900 shadow-xl',
    error: 'bg-white border-rose-300 text-rose-900 shadow-xl',
    info: 'bg-white border-sky-300 text-sky-900 shadow-xl',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-600 shrink-0" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in max-w-md">
      <div
        className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl border shadow-xl ${bgStyles[type]}`}
      >
        {icons[type]}
        <p className="text-sm font-medium pr-2 text-slate-800">{message}</p>
        <button
          onClick={onClose}
          className="p-1 hover:bg-slate-100 rounded-lg transition text-slate-400 hover:text-slate-700"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
