import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, Home, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';
import GlassCard from '../components/ui/GlassCard';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -z-10 rounded-full bg-primary-200/40 dark:bg-primary-950/20 blur-3xl w-96 h-96" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 -z-10 rounded-full bg-blue-200/40 dark:bg-blue-950/20 blur-3xl w-96 h-96" />

      <div className="w-full max-w-lg text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GlassCard className="p-8 md:p-12 border border-slate-200/50 dark:border-slate-800/50 shadow-2xl relative">
            {/* Logo Icon */}
            <div className="mx-auto w-20 h-20 bg-primary-100 dark:bg-primary-950/50 text-primary-600 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
              <CalendarDays size={40} className="animate-pulse" />
            </div>

            {/* Error Code */}
            <span className="text-sm font-bold uppercase tracking-widest text-primary-600 dark:text-primary-400 mb-2 block">
              Error 404
            </span>
            
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
              Lost in the Calendar?
            </h1>

            {/* Description */}
            <p className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto mb-10 leading-relaxed text-sm">
              The event or page you are looking for has expired, changed location, or does not exist. Let's get you back on track!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button variant="primary" className="w-full sm:w-auto flex items-center justify-center gap-2">
                  <Home size={18} /> Back to Home
                </Button>
              </Link>
              <Link to="/events">
                <Button variant="outline" className="w-full sm:w-auto flex items-center justify-center gap-2">
                  <ArrowLeft size={18} /> Browse Events
                </Button>
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
