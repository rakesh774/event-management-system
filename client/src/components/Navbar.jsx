import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, Menu, X, User } from 'lucide-react';
import Button from './ui/Button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed w-full top-0 z-50 glass-panel border-b-0 rounded-none dark:glass-panel-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary-600 p-2 rounded-xl text-white group-hover:rotate-12 transition-transform">
              <CalendarDays size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">EventMaster</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-primary-600 ${
                    isActive(link.path) ? 'text-primary-600' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center space-x-4 border-l border-slate-200 dark:border-slate-700 pl-6">
              <Link to="/login">
                <Button variant="ghost" className="text-sm">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button variant="primary" className="text-sm">Sign up</Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white focus:outline-none"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden glass-panel dark:glass-panel-dark border-t border-slate-200 dark:border-slate-800"
        >
          <div className="px-2 pt-2 pb-6 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-3 rounded-md text-base font-medium ${
                  isActive(link.path) 
                    ? 'bg-primary-50 text-primary-600 dark:bg-slate-800 dark:text-primary-400' 
                    : 'text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-3 px-3">
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button variant="secondary" className="w-full justify-center">Log in</Button>
              </Link>
              <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                <Button variant="primary" className="w-full justify-center">Sign up</Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
