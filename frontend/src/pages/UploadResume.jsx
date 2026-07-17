import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, FileText, X, ClipboardPaste, FileUp, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import GlassCard from '../components/GlassCard';
import ATSGauge from '../components/ATSGauge';
import KeywordBadge from '../components/KeywordBadge';
import api from '../services/api';

const ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
};

export default function UploadResume() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jdMode, setJdMode] = useState('paste'); // 'paste' | 'file'
  const [jdText, setJdText] = useState('');
  const [jdFile, setJdFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState(null);

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected?.length) {
      toast.error('Only PDF and DOCX files under 5MB are supported.');
      return;
    }
    setResumeFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_TYPES,
    maxSize: 5 * 1024 * 1024,
    multiple: false,
  });

  const handleAnalyze = async () => {
    if (!resumeFile) return toast.error('Please upload a resume first.');
    if (jdMode === 'paste' && !jdText.trim()) return toast.error('Please paste a job description.');
    if (jdMode === 'file' && !jdFile) return toast.error('Please upload a job description file.');

    const formData = new FormData();
    formData.append('resume', resumeFile);
    if (jdMode === 'paste') {
      formData.append('jobDescriptionText', jdText);
    } else {
      formData.append('jobDescriptionFile', jdFile);
    }

    setAnalyzing(true);
    setProgress(0);
    setReport(null);

    try {
      const { data } = await api.post('/resumes/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
          setProgress(Math.round((evt.loaded / evt.total) * 100));
        },
      });
      setReport(data.report);
      toast.success('Analysis complete!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong analyzing your resume.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="pb-16">
      <h1 className="font-display text-2xl font-bold">Upload Resume</h1>
      <p className="mt-1 text-ink-muted">Upload your resume and a job description to get your ATS score instantly.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Resume dropzone */}
        <GlassCard>
          <h2 className="font-display text-lg font-semibold">1. Your Resume</h2>
          <div
            {...getRootProps()}
            className={`mt-4 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition-colors ${
              isDragActive ? 'border-accent-cyan bg-accent-cyan/5' : 'border-white/15 hover:border-white/25'
            }`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="text-accent-cyan" size={32} />
            <p className="mt-3 text-sm">Drag & drop your resume here, or click to browse</p>
            <p className="mt-1 text-xs text-ink-faint">PDF or DOCX, up to 5MB</p>
          </div>

          {resumeFile && (
            <div className="mt-4 flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2">
              <div className="flex items-center gap-2 text-sm">
                <FileText size={16} className="text-accent-cyan" /> {resumeFile.name}
              </div>
              <button onClick={() => setResumeFile(null)} aria-label="Remove file">
                <X size={16} className="text-ink-faint hover:text-ink-primary" />
              </button>
            </div>
          )}
        </GlassCard>

        {/* Job description */}
        <GlassCard delay={0.1}>
          <h2 className="font-display text-lg font-semibold">2. Job Description</h2>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setJdMode('paste')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm ${jdMode === 'paste' ? 'bg-white/[0.08]' : 'bg-white/[0.02] text-ink-muted'}`}
            >
              <ClipboardPaste size={16} /> Paste Text
            </button>
            <button
              onClick={() => setJdMode('file')}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm ${jdMode === 'file' ? 'bg-white/[0.08]' : 'bg-white/[0.02] text-ink-muted'}`}
            >
              <FileUp size={16} /> Upload .txt
            </button>
          </div>

          {jdMode === 'paste' ? (
            <textarea
              rows={7}
              placeholder="Paste the job description here…"
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              className="input-glass mt-4 resize-none"
            />
          ) : (
            <div className="mt-4">
              <input
                type="file"
                accept=".txt"
                onChange={(e) => setJdFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-ink-muted file:mr-4 file:rounded-lg file:border-0 file:bg-white/[0.08] file:px-4 file:py-2 file:text-ink-primary"
              />
            </div>
          )}
        </GlassCard>
      </div>

      <div className="mt-6 flex flex-col items-center gap-4">
        <button onClick={handleAnalyze} disabled={analyzing} className="btn-primary w-full max-w-xs disabled:opacity-60">
          {analyzing ? `Analyzing… ${progress}%` : 'Analyze Resume'}
        </button>
        {analyzing && (
          <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-white/10">
            <motion.div className="h-full bg-grad-primary" animate={{ width: `${progress}%` }} />
          </div>
        )}
      </div>

      <AnimatePresence>
        {report && <ResultPanel report={report} />}
      </AnimatePresence>
    </div>
  );
}

async function downloadReportPdf(reportId) {
  try {
    const response = await api.get(`/reports/${reportId}/pdf`, { responseType: 'blob' });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ResumeIQ-Report-${reportId}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (err) {
    toast.error('Could not download the PDF. Please try again.');
  }
}

function ResultPanel({ report }) {
  const showConfetti = report.ats_score > 90;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="relative mt-10"
    >
      {showConfetti && <ConfettiBurst />}
      <GlassCard className="grid gap-8 md:grid-cols-3">
        <div className="flex flex-col items-center justify-center">
          <ATSGauge score={report.ats_score} size={180} />
          <p className="mt-3 text-sm text-ink-muted">{report.resume_name}</p>
        </div>

        <div className="md:col-span-2">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Metric label="Keyword" value={report.keyword_match_pct} />
            <Metric label="Skill" value={report.skill_match_pct} />
            <Metric label="Experience" value={report.experience_match_pct} />
            <Metric label="Education" value={report.education_match_pct} />
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-ink-muted">Matching Keywords</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {(report.matching_keywords || []).map((k) => <KeywordBadge key={k} keyword={k} matched />)}
              {(report.matching_keywords || []).length === 0 && <p className="text-xs text-ink-faint">None found.</p>}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-sm font-semibold text-ink-muted">Missing Skills</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {(report.missing_keywords || []).map((k) => <KeywordBadge key={k} keyword={k} matched={false} />)}
              {(report.missing_keywords || []).length === 0 && <p className="text-xs text-ink-faint">Nothing missing — great match!</p>}
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <Link to={`/reports/${report.id}`} className="btn-ghost">View Full Report</Link>
            <button onClick={() => downloadReportPdf(report.id)} className="btn-primary">
              <Download size={16} /> Download PDF
            </button>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center">
      <p className="font-mono text-xl font-semibold text-accent-cyan">{value}%</p>
      <p className="text-xs text-ink-muted">{label}</p>
    </div>
  );
}

function ConfettiBurst() {
  const pieces = Array.from({ length: 24 });
  const colors = ['#3B82F6', '#8B5CF6', '#22D3EE', '#34D399'];
  return (
    <div className="pointer-events-none absolute inset-0 -top-6 overflow-hidden">
      {pieces.map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 1, y: 0, x: 0, rotate: 0 }}
          animate={{
            opacity: 0,
            y: 180 + Math.random() * 100,
            x: (Math.random() - 0.5) * 300,
            rotate: Math.random() * 360,
          }}
          transition={{ duration: 1.4 + Math.random(), ease: 'easeOut' }}
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            width: 8,
            height: 8,
            borderRadius: 2,
            background: colors[i % colors.length],
          }}
        />
      ))}
    </div>
  );
}