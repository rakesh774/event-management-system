import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';

const Signup = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 py-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-400/20 dark:bg-primary-900/40 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-400/20 dark:bg-blue-900/40 rounded-full blur-3xl -z-10" />
      
      <GlassCard className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create an account</h2>
          <p className="text-slate-600 dark:text-slate-400">Join EventMaster to create and manage events</p>
        </div>
        
        <form className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="John Doe" 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                required
              />
              <User size={18} className="absolute left-3 top-3.5 text-slate-400" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email address</label>
            <div className="relative">
              <input 
                type="email" 
                placeholder="you@example.com" 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                required
              />
              <Mail size={18} className="absolute left-3 top-3.5 text-slate-400" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Password</label>
            <div className="relative">
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                required
              />
              <Lock size={18} className="absolute left-3 top-3.5 text-slate-400" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Confirm Password</label>
            <div className="relative">
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                required
              />
              <Lock size={18} className="absolute left-3 top-3.5 text-slate-400" />
            </div>
          </div>
          
          <Button variant="primary" className="w-full py-3 text-lg mt-2">
            Create Account
          </Button>
        </form>
        
        <div className="mt-8 text-center text-sm text-slate-600 dark:text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 font-medium hover:text-primary-700">
            Sign in
          </Link>
        </div>
      </GlassCard>
    </div>
  );
};

export default Signup;
