import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, TrendingUp, Award, Upload as UploadIcon, ArrowRight } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler,
} from 'chart.js';
import toast from 'react-hot-toast';
import GlassCard from '../components/GlassCard';
import StatCard from '../components/StatCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import ATSGauge from '../components/ATSGauge';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'there';

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/reports/summary');
        setSummary(data.summary);
      } catch (err) {
        toast.error(err.response?.data?.error || 'Could not load your dashboard.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const recent = summary?.recent || [];
  const chartData = {
    labels: [...recent].reverse().map((r) => new Date(r.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'ATS Score',
        data: [...recent].reverse().map((r) => r.ats_score),
        borderColor: '#22D3EE',
        backgroundColor: 'rgba(34,211,238,0.15)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#8B5CF6',
      },
    ],
  };

  return (
    <div className="pb-16">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <GlassCard className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h1 className="font-display text-2xl font-bold">Welcome back, {firstName} 👋</h1>
            <p className="mt-1 text-ink-muted">Here's how your resume is performing across your recent analyses.</p>
          </div>
          <Link to="/upload" className="btn-primary whitespace-nowrap">
            <UploadIcon size={18} /> New Analysis
          </Link>
        </GlassCard>
      </motion.div>

      {loading ? (
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <LoadingSkeleton className="h-28" />
          <LoadingSkeleton className="h-28" />
          <LoadingSkeleton className="h-28" />
        </div>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <StatCard icon={FileText} label="Total Analyses" value={summary?.totalAnalyses || 0} accent="blue" delay={0} />
          <StatCard icon={Award} label="Highest ATS Score" value={summary?.highestScore || 0} suffix="%" accent="emerald" delay={0.1} />
          <StatCard icon={TrendingUp} label="Average Score" value={summary?.averageScore || 0} suffix="%" accent="purple" delay={0.2} />
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2" delay={0.1}>
          <h2 className="font-display text-lg font-semibold">Score Trend</h2>
          <p className="text-sm text-ink-muted">Your last {recent.length || 0} analyses.</p>
          <div className="mt-4 h-64">
            {recent.length > 0 ? (
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: { grid: { display: false }, ticks: { color: '#94A3B8' } },
                    y: { min: 0, max: 100, grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94A3B8' } },
                  },
                  plugins: { legend: { display: false } },
                }}
              />
            ) : (
              <EmptyState />
            )}
          </div>
        </GlassCard>

        <GlassCard delay={0.2} className="flex flex-col items-center justify-center">
          <h2 className="mb-4 font-display text-lg font-semibold">Latest Score</h2>
          <ATSGauge score={recent[0]?.ats_score || 0} />
        </GlassCard>
      </div>

      <GlassCard className="mt-6" delay={0.15}>
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Recent Reports</h2>
          <Link to="/reports" className="flex items-center gap-1 text-sm text-accent-cyan hover:underline">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {recent.length === 0 && <p className="text-sm text-ink-muted">No analyses yet — upload a resume to get started.</p>}
          {recent.map((r, i) => (
            <Link
              key={i}
              to={`/reports/${r.id || ''}`}
              className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition-colors hover:bg-white/[0.05]"
            >
              <div>
                <p className="text-sm font-medium">{r.resume_name}</p>
                <p className="text-xs text-ink-faint">{new Date(r.created_at).toLocaleDateString()}</p>
              </div>
              <span className="font-mono font-semibold text-accent-cyan">{r.ats_score}%</span>
            </Link>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <p className="text-sm text-ink-muted">No analyses yet. Your score trend will appear here.</p>
    </div>
  );
}
