import { motion } from 'framer-motion';

// Reusable glassmorphism card with a subtle hover-lift, used throughout
// the dashboard, reports, and profile pages for visual consistency.
export default function GlassCard({ children, className = '', hover = true, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { y: -4 } : undefined}
      className={`glass-card p-6 transition-shadow duration-300 hover:shadow-glow-cyan ${className}`}
    >
      {children}
    </motion.div>
  );
}
