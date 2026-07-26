import React from 'react';

export const WeatherSkeleton: React.FC = () => {
  return (
    <div className="h-full w-full max-w-7xl mx-auto grid grid-cols-12 gap-3 lg:gap-5 animate-pulse">
      {/* Left Column Skeleton */}
      <div className="col-span-12 lg:col-span-4 flex flex-col gap-3 lg:gap-4 h-full min-h-0">
        <div className="flex-1 min-h-[220px] rounded-3xl lg:rounded-[32px] bg-slate-200 dark:bg-slate-800" />
        <div className="h-36 rounded-3xl lg:rounded-[32px] bg-slate-200 dark:bg-slate-800 shrink-0" />
      </div>

      {/* Right Column Skeleton */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-3 lg:gap-4 h-full min-h-0">
        <div className="flex-1 min-h-[220px] rounded-3xl lg:rounded-[32px] bg-slate-200 dark:bg-slate-800" />
        <div className="h-36 rounded-3xl lg:rounded-[32px] bg-slate-200 dark:bg-slate-800 shrink-0" />
      </div>
    </div>
  );
};

