import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileQuestion } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="bg-white p-10 sm:p-14 rounded-3xl border border-slate-200 max-w-lg w-full shadow-xl relative">
        <div className="w-20 h-20 bg-brand-50 border border-brand-200 text-brand-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xs">
          <FileQuestion className="w-10 h-10" />
        </div>
        <h1 className="text-7xl font-extrabold bg-gradient-to-r from-slate-900 via-brand-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">
          404
        </h1>
        <h2 className="text-2xl font-bold text-slate-900 mt-4">Page Not Found</h2>
        <p className="text-sm text-slate-600 mt-2 max-w-xs mx-auto leading-relaxed">
          The page or blog post you are searching for might have been moved, removed, or never existed.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-500/20 transition-all hover:scale-[1.02]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
