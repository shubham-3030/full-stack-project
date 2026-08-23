import React from 'react';

const LoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className="bg-white border border-slate-200 rounded-2xl p-6 animate-pulse flex flex-col space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="w-20 h-6 bg-slate-200 rounded-full"></div>
            <div className="w-16 h-4 bg-slate-200 rounded"></div>
          </div>
          <div className="w-3/4 h-7 bg-slate-200 rounded-lg mt-2"></div>
          <div className="space-y-2">
            <div className="w-full h-4 bg-slate-100 rounded"></div>
            <div className="w-full h-4 bg-slate-100 rounded"></div>
            <div className="w-2/3 h-4 bg-slate-100 rounded"></div>
          </div>
          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-slate-200"></div>
              <div className="space-y-1">
                <div className="w-24 h-4 bg-slate-200 rounded"></div>
                <div className="w-16 h-3 bg-slate-100 rounded"></div>
              </div>
            </div>
            <div className="w-16 h-8 bg-slate-100 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
