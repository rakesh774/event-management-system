import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = "px-6 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-primary-500/50",
    secondary: "bg-white text-slate-800 border border-slate-200 hover:border-primary-500 hover:text-primary-600 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:border-primary-500",
    outline: "border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-slate-800",
    ghost: "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;
