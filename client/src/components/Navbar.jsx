import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, Menu, X, User, Sun, Moon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import Button from './ui/Button';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Events', path: '/events' },
    { name: 'Contact', path: '/contact' },
    ...(user && user.isAdmin ? [{ name: 'Dashboard', path: '/admin' }] : []),
    ...(user && !user.isAdmin ? [{ name: 'Create Event', path: '/create-event' }] : [])
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
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {user ? (
                <>
                  <Link to="/mybookings">
                    <Button variant="ghost" className="text-sm">My Bookings</Button>
                  </Link>
                  <Button variant="outline" className="text-sm" onClick={logout}>Log out</Button>
                  <div className="flex items-center justify-center bg-primary-100 text-primary-700 w-10 h-10 rounded-full font-bold">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="text-sm">Log in</Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="primary" className="text-sm">Sign up</Button>
                  </Link>
                </>
              )}
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
            
            <div className="mt-4 flex flex-col gap-3 px-3 border-t border-slate-200 dark:border-slate-700 pt-4">
              {/* Theme Toggle Button (Mobile) */}
              <button
                onClick={toggleTheme}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors text-sm font-semibold"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun size={18} /> Light Mode
                  </>
                ) : (
                  <>
                    <Moon size={18} /> Dark Mode
                  </>
                )}
              </button>

              {user ? (
                <>
                  <Link to="/mybookings" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="secondary" className="w-full justify-center">My Bookings</Button>
                  </Link>
                  <Button variant="outline" className="w-full justify-center" onClick={() => { logout(); setIsMenuOpen(false); }}>
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="secondary" className="w-full justify-center">Log in</Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="primary" className="w-full justify-center">Sign up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
