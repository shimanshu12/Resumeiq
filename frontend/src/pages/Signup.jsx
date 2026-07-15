import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ScanLine } from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedBackground from '../components/AnimatedBackground';
import GlassCard from '../components/GlassCard';
import { useAuth } from '../hooks/useAuth';

export default function Signup() {
  const { signUpWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters.');
      return;
    }

    setSubmitting(true);
    const { error } = await signUpWithEmail({ fullName, email, password });
    setSubmitting(false);

    if (error) {
      toast.error(error.message || 'Could not create your account.');
      return;
    }

    toast.success('Account created! Redirecting to your dashboard…');
    // A DB trigger (see database/schema.sql) mirrors this user into public.users.
    navigate('/dashboard', { replace: true });
  };

  const handleGoogle = async () => {
    const { error } = await signInWithGoogle();
    if (error) toast.error(error.message || 'Google sign-in failed.');
  };

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center py-12">
      <AnimatedBackground />
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <GlassCard hover={false} className="!p-8">
          <div className="mb-6 flex flex-col items-center">
            <ScanLine className="text-accent-cyan" size={30} />
            <h1 className="mt-3 font-display text-2xl font-bold">Create your account</h1>
            <p className="text-sm text-ink-muted">Start scoring your resume in seconds.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3.5 text-ink-faint" size={18} />
              <input
                type="text"
                required
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input-glass pl-10"
              />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-ink-faint" size={18} />
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-glass pl-10"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-ink-faint" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-glass pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-3.5 text-ink-faint hover:text-ink-primary"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-ink-faint" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-glass pl-10"
              />
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
              {submitting ? 'Creating account…' : 'Sign Up'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-ink-faint">
            <div className="h-px flex-1 bg-white/10" /> OR <div className="h-px flex-1 bg-white/10" />
          </div>

          <button onClick={handleGoogle} className="btn-ghost w-full">
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-ink-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-accent-cyan hover:underline">Log in</Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
