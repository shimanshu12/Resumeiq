import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Download, ArrowLeft, Lightbulb } from 'lucide-react';
import toast from 'react-hot-toast';
import GlassCard from '../components/GlassCard';
import ATSGauge from '../components/ATSGauge';
import KeywordBadge from '../components/KeywordBadge';
import LoadingSkeleton from '../components/LoadingSkeleton';
import api from '../services/api';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ReportDetail() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/reports/${id}`);
        setReport(data.report);
      } catch (err) {
        toast.error(err.response?.data?.error || 'Could not load this report.');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6 pb-16">
        <LoadingSkeleton className="h-10 w-64" />
        <LoadingSkeleton className="h-72 w-full" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="py-24 text-center text-ink-muted">
        Report not found. <Link to="/reports" className="text-accent-cyan hover:underline">Back to reports</Link>
      </div>
    );
  }

  const doughnutData = {
    labels: ['Keyword', 'Skill', 'Experience', 'Education'],
    datasets: [
      {
        data: [report.keyword_match_pct, report.skill_match_pct, report.experience_match_pct, report.education_match_pct],
        backgroundColor: ['#3B82F6', '#8B5CF6', '#22D3EE', '#34D399'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="pb-16">
      <Link to="/reports" className="mb-4 flex items-center gap-1 text-sm text-ink-muted hover:text-ink-primary">
        <ArrowLeft size={16} /> Back to reports
      </Link>

      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold">{report.resume_name}</h1>
          <p className="mt-1 text-ink-muted">Analyzed on {new Date(report.created_at).toLocaleString()}</p>
        </div>
        <button
          type="button"
          onClick={async () => {
            try {
              const { data: sessionData } = await (await import('../supabase/supabaseClient')).supabase.auth.getSession();
              const token = sessionData?.session?.access_token;
              if (!token) {
                toast.error('Please log in again. Missing authentication token.');
                return;
              }

              window.open(
                `${import.meta.env.VITE_API_BASE_URL}/reports/${report.id}/pdf?token=${encodeURIComponent(token)}`,
                '_blank',
                'noopener,noreferrer'
              );
            } catch {
              toast.error('Could not prepare PDF download. Please try again.');
            }
          }}
          className="btn-primary"
        >
          <Download size={16} /> Download PDF Report
        </button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <GlassCard className="flex flex-col items-center justify-center">
          <ATSGauge score={report.ats_score} size={180} />
        </GlassCard>

        <GlassCard delay={0.1} className="lg:col-span-2">
          <h2 className="font-display text-lg font-semibold">Match Breakdown</h2>
          <div className="mt-4 h-56">
            <Doughnut
              data={doughnutData}
              options={{
                maintainAspectRatio: false,
                plugins: { legend: { position: 'right', labels: { color: '#94A3B8' } } },
              }}
            />
          </div>
        </GlassCard>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <GlassCard delay={0.1}>
          <h2 className="font-display text-lg font-semibold">Matching Keywords</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {(report.matching_keywords || []).map((k) => <KeywordBadge key={k} keyword={k} matched />)}
            {(report.matching_keywords || []).length === 0 && <p className="text-xs text-ink-faint">None found.</p>}
          </div>
        </GlassCard>

        <GlassCard delay={0.15}>
          <h2 className="font-display text-lg font-semibold">Missing Skills</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {(report.missing_keywords || []).map((k) => <KeywordBadge key={k} keyword={k} matched={false} />)}
            {(report.missing_keywords || []).length === 0 && <p className="text-xs text-ink-faint">Nothing missing — great match!</p>}
          </div>
        </GlassCard>
      </div>

      <GlassCard className="mt-6" delay={0.2}>
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
          <Lightbulb size={18} className="text-accent-purple" /> Suggestions
        </h2>
        <ul className="mt-3 space-y-2">
          {(report.suggestions || []).map((s, i) => (
            <li key={i} className="flex gap-2 text-sm text-ink-muted">
              <span className="text-accent-cyan">{i + 1}.</span> {s}
            </li>
          ))}
        </ul>
      </GlassCard>
    </div>
  );
}
