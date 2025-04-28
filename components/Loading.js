import { motion } from 'framer-motion';

export default function Loading({ text = 'Loading...' }) {
  return (
    <div className="loading-container">
      <motion.div
        className="spinner"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      >
        <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
          <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        </svg>
      </motion.div>
      <p className="text-slate-500 dark:text-slate-400">{text}</p>
    </div>
  );
}