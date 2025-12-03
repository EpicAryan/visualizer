'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import { ButtonProps, CardProps, ExplainBoxProps } from './types';


const THEME_PRIMARY = 'bg-indigo-600';
const THEME_PRIMARY_HOVER = 'hover:bg-indigo-500';

// ========== BUTTON COMPONENT ==========
export const Button: React.FC<ButtonProps> = ({
  onClick,
  disabled = false,
  variant = 'primary',
  children,
  className = '',
}) => {
  const base =
    'px-4 py-2 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-sm font-mono';

  const styles: Record<typeof variant, string> = {
    primary: `${THEME_PRIMARY} text-white ${THEME_PRIMARY_HOVER} shadow-md shadow-indigo-500/20`,
    secondary: 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200',
    outline: 'border-2 border-indigo-500 text-indigo-700 hover:bg-indigo-50',
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[variant]} ${className}`}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  );
};

// ========== CARD COMPONENT ==========
export const Card: React.FC<CardProps> = ({ title, icon: Icon, children, className = '' }) => (
  <motion.div
    className={`overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
  >
    {title && (
      <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 p-4 sm:p-5">
        {Icon && (
          <motion.div
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Icon className="h-5 w-5 text-indigo-500" />
          </motion.div>
        )}
        <h3 className="font-mono text-base sm:text-lg font-bold text-slate-800">{title}</h3>
      </div>
    )}
    <div className="p-4 sm:p-6">{children}</div>
  </motion.div>
);

// ========== EXPLAINBOX COMPONENT ==========
export const ExplainBox: React.FC<ExplainBoxProps> = ({ title, children }) => (
  <motion.div
    className="mt-4 rounded-r-xl border-l-4 border-indigo-500 bg-slate-900 p-4 sm:p-5 font-mono text-xs sm:text-sm leading-relaxed text-slate-300"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4 }}
  >
    <div className="mb-2 flex items-center gap-2 text-xs font-bold tracking-wider text-indigo-400 uppercase">
      <Info size={14} /> {title || 'Under the Hood'}
    </div>
    {children}
  </motion.div>
);

// ========== UTILITY: SLEEP ==========
export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
