import { Link } from 'react-router-dom';
import { ScanLine } from 'lucide-react';
import GlassCard from '../components/GlassCard';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <GlassCard hover={false} className="text-center">
        <ScanLine className="mx-auto text-accent-cyan" size={32} />
        <h1 className="mt-4 font-display text-3xl font-bold">404</h1>
        <p className="mt-2 text-ink-muted">This page didn't make it past the scan.</p>
        <Link to="/" className="btn-primary mt-6 inline-flex">Back to Home</Link>
      </GlassCard>
    </div>
  );
}
