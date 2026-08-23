import React from 'react';
import { Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white mt-20 text-slate-500 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-800 text-lg">Chronicle</span>
          </div>

          <p className="text-xs text-slate-500 flex items-center">
            Built with React.js, Tailwind CSS, Express & MongoDB
          </p>

          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Chronicle Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
