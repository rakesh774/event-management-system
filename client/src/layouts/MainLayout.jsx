import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

const MainLayout = () => {
  const location = useLocation();
  
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-dark-900 transition-colors duration-300">
      <Navbar />
      
      {/* 
        The pt-20 is to account for the fixed Navbar (h-20).
        flex-grow ensures the main content pushes the footer to the bottom.
      */}
      <main className="flex-grow pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;
