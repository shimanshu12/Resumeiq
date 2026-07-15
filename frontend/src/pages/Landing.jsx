import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Target, Sparkles, FileCheck, ChevronDown } from 'lucide-react';
import AnimatedBackground from '../components/AnimatedBackground';
import GlassCard from '../components/GlassCard';
import ATSGauge from '../components/ATSGauge';
import { useAuth } from '../hooks/useAuth';

const STATS = [
  { value: '95%', label: 'ATS Accuracy' },
  { value: '<10s', label: 'Instant Analysis' },
  { value: '40+', label: 'Keyword Signals' },
  { value: '24/7', label: 'AI Suggestions' },
];

const FEATURES = [
  { icon: Target, title: 'Keyword Matching', text: 'Compares your resume against any job description, term by term, the way real ATS software does.' },
  { icon: Zap, title: 'Instant ATS Score', text: 'Get a single, trustworthy score in seconds — keyword, skill, experience, and education match combined.' },
  { icon: Sparkles, title: 'AI Suggestions', text: 'Specific, actionable edits — not generic advice — ranked by what will move your score the most.' },
  { icon: FileCheck, title: 'Downloadable Reports', text: 'Export a polished PDF report you can reference while you revise, or share with a mentor.' },
];

const TESTIMONIALS = [
  { name: 'Priya S.', role: 'Frontend Engineer', quote: 'Found three missing keywords I never would have guessed. Landed two interviews the same week.' },
  { name: 'Daniel K.', role: 'Data Analyst', quote: 'The gap between my resume and the JD was obvious once I saw it laid out like this.' },
  { name: 'Amara O.', role: 'Product Manager', quote: 'Clean, fast, and the suggestions actually made sense for my industry.' },
];

const FAQS = [
  { q: 'How is my ATS score calculated?', a: 'We blend keyword match, hard-skill match, experience match, and education match from your resume against the job description you provide.' },
  { q: 'What file types can I upload?', a: 'PDF and DOCX resumes are supported. Job descriptions can be pasted directly or uploaded as a .txt file.' },
  { q: 'Is my resume data private?', a: 'Yes. Your files are stored in your own private Supabase storage bucket and only accessible to your account.' },
  { q: 'Can I compare multiple resumes?', a: 'Yes — upload multiple versions and compare their scores side by side from your Reports page.' },
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="relative">
      <AnimatedBackground />

      {/* Hero */}
      <section className="grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <span className="badge-match mb-5">AI Resume Keyword Analyzer</span>
          <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">
            Know exactly why your resume gets{' '}
            <span className="bg-grad-primary bg-clip-text text-transparent">filtered out</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg text-ink-muted">
            ResumeIQ scores your resume against any job description, flags the exact keywords
            you're missing, and tells you precisely what to add.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to={user ? '/upload' : '/signup'} className="btn-primary">
              Analyze Resume <ArrowRight size={18} />
            </Link>
            <Link to={user ? '/dashboard' : '/signup'} className="btn-ghost">
              Get Started
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {STATS.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.1 }}>
                <p className="font-mono text-2xl font-bold text-accent-cyan">{s.value}</p>
                <p className="text-xs text-ink-muted">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Floating resume + gauge visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative flex items-center justify-center"
        >
          <div className="animate-float">
            <GlassCard className="w-72" hover={false}>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">resume_final_v3.pdf</p>
                <span className="badge-match text-[10px]">Analyzed</span>
              </div>
              <div className="mt-6 flex justify-center">
                <ATSGauge score={87} size={140} />
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="badge-match">React</span>
                <span className="badge-match">Node.js</span>
                <span className="badge-missing">Docker</span>
                <span className="badge-missing">AWS</span>
              </div>
            </GlassCard>
          </div>
          <div className="absolute -right-6 -top-6 -z-10 animate-float [animation-delay:1.5s]">
            <GlassCard className="w-40 !p-4" hover={false}>
              <p className="text-xs text-ink-muted">Keyword Match</p>
              <p className="font-mono text-xl font-semibold text-accent-emerald">92%</p>
            </GlassCard>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-16">
        <h2 className="text-center font-display text-3xl font-bold">Everything an ATS checks, before you hit submit</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <GlassCard key={f.title} delay={i * 0.1}>
              <f.icon className="text-accent-cyan" size={26} />
              <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{f.text}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <h2 className="text-center font-display text-3xl font-bold">Trusted by job seekers who got the callback</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <GlassCard key={t.name} delay={i * 0.1}>
              <p className="text-sm italic text-ink-muted">"{t.quote}"</p>
              <p className="mt-4 font-semibold">{t.name}</p>
              <p className="text-xs text-ink-faint">{t.role}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <h2 className="text-center font-display text-3xl font-bold">Frequently asked questions</h2>
        <div className="mx-auto mt-10 max-w-2xl space-y-3">
          {FAQS.map((f) => (
            <FaqItem key={f.q} {...f} />
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 text-center">
        <GlassCard className="mx-auto max-w-2xl py-12">
          <h2 className="font-display text-2xl font-bold md:text-3xl">Ready to see your ATS score?</h2>
          <p className="mt-3 text-ink-muted">It takes less than a minute — no credit card required.</p>
          <Link to={user ? '/upload' : '/signup'} className="btn-primary mt-6 inline-flex">
            Analyze Resume <ArrowRight size={18} />
          </Link>
        </GlassCard>
      </section>
    </div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <GlassCard hover={false} className="!p-4">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between text-left">
        <span className="font-medium">{q}</span>
        <ChevronDown className={`transition-transform ${open ? 'rotate-180' : ''}`} size={18} />
      </button>
      {open && <p className="mt-3 text-sm text-ink-muted">{a}</p>}
    </GlassCard>
  );
}
