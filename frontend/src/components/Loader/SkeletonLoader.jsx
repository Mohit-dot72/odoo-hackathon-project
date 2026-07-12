import React from 'react';

// 1. Single Dashboard Card Skeleton
export const CardSkeleton = () => {
  return (
    <div className="glass-panel p-6 animate-pulse space-y-4">
      <div className="flex justify-between items-center">
        <div className="h-3 w-24 bg-slate-800 rounded"></div>
        <div className="h-9 w-9 bg-slate-800 rounded-xl"></div>
      </div>
      <div className="space-y-2">
        <div className="h-7 w-32 bg-slate-800 rounded"></div>
        <div className="h-3 w-48 bg-slate-800 rounded"></div>
      </div>
    </div>
  );
};

// 2. Table loading rows placeholder
export const TableSkeleton = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="animate-pulse space-y-4 w-full">
      {/* Table Header */}
      <div className="flex gap-4 p-4 bg-slate-800/40 rounded-xl">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 bg-slate-800 rounded flex-1"></div>
        ))}
      </div>
      
      {/* Table Body */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 p-4 border-b border-slate-800/50">
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="h-3 bg-slate-800/60 rounded flex-1"></div>
          ))}
        </div>
      ))}
    </div>
  );
};

// 3. Grid loader for cards list
export const GridSkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};
