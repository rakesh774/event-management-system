import React from 'react';
import GlassCard from './GlassCard';

const SkeletonCard = () => {
  return (
    <GlassCard className="p-0 overflow-hidden flex flex-col h-full animate-pulse">
      {/* Image Skeleton */}
      <div className="h-48 bg-slate-200 dark:bg-slate-700 w-full" />
      
      <div className="p-6 flex-grow flex flex-col space-y-4">
        {/* Category Skeleton */}
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
        
        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
        </div>
        
        {/* Details Skeletons */}
        <div className="space-y-2 mt-auto pt-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-slate-200 dark:bg-slate-700 rounded-full" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-slate-200 dark:bg-slate-700 rounded-full" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-slate-200 dark:bg-slate-700 rounded-full" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
          </div>
        </div>
        
        {/* Button Skeleton */}
        <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-lg w-full mt-4" />
      </div>
    </GlassCard>
  );
};

export default SkeletonCard;
