import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Trash2, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { useReports } from '../hooks/useReports';

const PAGE_SIZE = 8;

export default function Reports() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { reports, total, loading, deleteReport } = useReports({ search, page, pageSize: PAGE_SIZE });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="pb-16">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="font-display text-2xl font-bold">Previous Reports</h1>
          <p className="mt-1 text-ink-muted">Every resume you've analyzed, in one place.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-3 text-ink-faint" size={18} />
          <input
            placeholder="Search by resume name…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="input-glass pl-10"
          />
        </div>
      </div>

      <GlassCard className="mt-6 !p-0" hover={false}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-ink-muted">
                <th className="px-6 py-4 font-medium">Resume Name</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">ATS Score</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading &&
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={4} className="px-6 py-3">
                      <LoadingSkeleton className="h-8 w-full" />
                    </td>
                  </tr>
                ))}

              {!loading && reports.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-ink-muted">
                    No reports yet.{' '}
                    <Link to="/upload" className="text-accent-cyan hover:underline">Analyze your first resume</Link>.
                  </td>
                </tr>
              )}

              {!loading &&
                reports.map((r) => (
                  <tr key={r.id} className="border-b border-white/[0.04] transition-colors hover:bg-white/[0.02]">
                    <td className="px-6 py-4 font-medium">{r.resume_name}</td>
                    <td className="px-6 py-4 text-ink-muted">{new Date(r.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className="font-mono font-semibold text-accent-cyan">{r.ats_score}%</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link to={`/reports/${r.id}`} className="text-ink-muted hover:text-accent-cyan" aria-label="View report">
                          <Eye size={16} />
                        </Link>
                        <a
                          href={`${import.meta.env.VITE_API_BASE_URL}/reports/${r.id}/pdf`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-ink-muted hover:text-accent-emerald"
                          aria-label="Download PDF"
                        >
                          <Download size={16} />
                        </a>
                        <button onClick={() => deleteReport(r.id)} className="text-ink-muted hover:text-red-400" aria-label="Delete report">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between border-t border-white/[0.06] px-6 py-4 text-sm text-ink-muted">
          <span>Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-white/10 p-2 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-white/10 p-2 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
