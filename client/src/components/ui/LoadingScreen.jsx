import React from 'react';
import { CalendarDays } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl transition-all duration-300">
      <div className="relative flex flex-col items-center p-8 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-white/20 dark:border-white/10 shadow-2xl max-w-sm text-center">
        {/* Glow behind */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-32 h-32 bg-primary-500/20 rounded-full blur-2xl animate-pulse" />
        
        {/* Logo/Icon container */}
        <div className="relative mb-6">
          <div className="bg-primary-600 text-white p-4 rounded-2xl shadow-lg relative z-10 animate-bounce">
            <CalendarDays size={36} />
          </div>
          {/* Animated Spinner Ring around the icon */}
          <div className="absolute inset-0 -m-3 border-4 border-primary-500/10 border-t-primary-600 rounded-full animate-spin" />
        </div>
        
        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mb-2">
          EventMaster
        </h3>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 animate-pulse">
          Loading amazing experiences...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
