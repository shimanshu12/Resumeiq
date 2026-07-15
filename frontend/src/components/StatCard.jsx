import { motion, useMotionValue, animate } from 'framer-motion';
import { useEffect, useState } from 'react';
import GlassCard from './GlassCard';

// Animated counter card for dashboard stats (Total Analyses, Highest Score, etc.)
export default function StatCard({ icon: Icon, label, value, suffix = '', accent = 'blue', delay = 0 }) {
  const [display, setDisplay] = useState(0);
  const motionVal = useMotionValue(0);

  useEffect(() => {
    const controls = animate(motionVal, value, {
      duration: 1.2,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return controls.stop;
  }, [value]);

  const accentMap = {
    blue: 'text-accent-blue',
    purple: 'text-accent-purple',
    cyan: 'text-accent-cyan',
    emerald: 'text-accent-emerald',
  };

  return (
    <GlassCard delay={delay} className="flex items-center gap-4">
      <div className={`rounded-xl bg-white/[0.05] p-3 ${accentMap[accent]}`}>
        {Icon && <Icon size={22} />}
      </div>
      <div>
        <p className="text-sm text-ink-muted">{label}</p>
        <p className="font-mono text-2xl font-semibold text-ink-primary">
          {display}
          {suffix}
        </p>
      </div>
    </GlassCard>
  );
}
