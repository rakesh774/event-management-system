import React from 'react';
import { CalendarDays, Globe, MessageCircle, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 dark:bg-dark-900 dark:border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="bg-primary-600 p-1.5 rounded-lg text-white group-hover:rotate-12 transition-transform">
                <CalendarDays size={20} />
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">EventMaster</span>
            </Link>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
              The ultimate platform for discovering and managing professional events around the globe.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-slate-400 hover:text-primary-600 transition-colors">
                <MessageCircle size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-primary-600 transition-colors">
                <Globe size={20} />
              </a>
              <a href="#" className="text-slate-400 hover:text-primary-600 transition-colors">
                <Share2 size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link to="/events" className="text-slate-500 hover:text-primary-600 dark:text-slate-400 text-sm transition-colors">Browse Events</Link></li>
              <li><Link to="/pricing" className="text-slate-500 hover:text-primary-600 dark:text-slate-400 text-sm transition-colors">Pricing</Link></li>
              <li><Link to="/features" className="text-slate-500 hover:text-primary-600 dark:text-slate-400 text-sm transition-colors">Features</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-slate-500 hover:text-primary-600 dark:text-slate-400 text-sm transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="text-slate-500 hover:text-primary-600 dark:text-slate-400 text-sm transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="text-slate-500 hover:text-primary-600 dark:text-slate-400 text-sm transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link to="/privacy" className="text-slate-500 hover:text-primary-600 dark:text-slate-400 text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-slate-500 hover:text-primary-600 dark:text-slate-400 text-sm transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

        </div>
        
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            © {new Date().getFullYear()} EventMaster Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
