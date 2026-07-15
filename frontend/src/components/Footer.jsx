import { ScanLine } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mx-auto mt-24 max-w-6xl px-4 pb-10">
      <div className="glass-card flex flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-ink-muted md:flex-row">
        <div className="flex items-center gap-2 font-display font-semibold text-ink-primary">
          <ScanLine className="text-accent-cyan" size={18} />
          ResumeIQ
        </div>
        <p>© {new Date().getFullYear()} ResumeIQ. Built for job seekers who want the interview.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-ink-primary">Privacy</a>
          <a href="#" className="hover:text-ink-primary">Terms</a>
          <a href="#" className="hover:text-ink-primary">Contact</a>
        </div>
      </div>
    </footer>
  );
}
