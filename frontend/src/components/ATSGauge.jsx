import { motion } from 'framer-motion';

/**
 * Signature visual: a circular gauge whose stroke fills to the ATS score
 * along a blue → purple → cyan gradient arc, with the score rendered in
 * mono font at the center. Used on the dashboard, upload result, and
 * report detail pages so the score always reads the same way everywhere.
 */
export default function ATSGauge({ score = 0, size = 160, label = 'ATS Score' }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(Math.max(score, 0), 100) / 100) * circumference;

  const tone =
    score >= 85 ? '#34D399' : score >= 60 ? '#3B82F6' : '#F87171';

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#22D3EE" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="10"
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gaugeGradient)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <motion.span
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="font-mono text-3xl font-semibold"
          style={{ color: tone }}
        >
          {Math.round(score)}%
        </motion.span>
        <span className="mt-1 text-xs text-ink-muted">{label}</span>
      </div>
    </div>
  );
}
