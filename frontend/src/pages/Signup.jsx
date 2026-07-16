import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
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

  const emailValid = useMemo(() => {
    if (!email.trim()) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }, [email]);

  const nameValid = fullName.trim().length > 0;
  const passwordValid = password.length >= 8;
  const confirmValid = confirmPassword.length > 0 && confirmPassword === password;

  const passwordStrength = useMemo(() => {
    // Frontend-only strength heuristic (no backend impact)
    // returns 0..100
    const lenScore = Math.min(40, password.length * 4);
    const variety = [
      /[a-z]/.test(password),
      /[A-Z]/.test(password),
      /\d/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ].filter(Boolean).length;
    const varietyScore = variety * 15; // max 60
    return Math.max(0, Math.min(100, lenScore + varietyScore));
  }, [password]);

  const canSubmit = nameValid && emailValid && passwordValid && confirmPassword === password && confirmPassword.length > 0 && !submitting;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent submit until valid (frontend-only)
    if (!canSubmit) {
      if (!nameValid) toast.error('Name is required.');
      else if (!emailValid) toast.error('Please enter a valid email address.');
      else if (!passwordValid) toast.error('Password must be at least 8 characters.');
      else if (confirmPassword !== password) toast.error('Passwords do not match.');
      return;
    }

    setSubmitting(true);
    const { data, error } = await signUpWithEmail({ fullName, email, password });
    setSubmitting(false);

    if (error) {
      toast.error(error.message || 'Could not create your account.');
      return;
    }

    const needsConfirmation = !data?.session;
    if (needsConfirmation) {
      toast.success('Account created! Please check your inbox to confirm your email before logging in.');
      navigate('/login', { replace: true });
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
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <GlassCard hover={false} className="!p-8">
          <div className="mb-6 flex flex-col items-center">
            <ScanLine className="text-accent-cyan" size={30} />
            <h1 className="mt-3 font-display text-2xl font-bold">Create your account</h1>
            <p className="text-sm text-ink-muted">Start scoring your resume in seconds.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-ink-faint" size={18} />
                <input
                  type="text"
                  required
                  placeholder="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="input-glass pl-10"
                  aria-label="Full name"
                />
              </div>
              <AnimatePresence>
                {fullName.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.2 }}
                    className={nameValid ? 'field-success' : 'field-error'}
                    aria-live="polite"
                  >
                    {nameValid ? '✅ Looks good' : '❌ Name is required'}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Email */}
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-ink-faint" size={18} />
                <input
                  type="email"
                  required
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-glass pl-10"
                  aria-label="Email address"
                />
              </div>
              <AnimatePresence>
                {email.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.2 }}
                    className={emailValid ? 'field-success' : 'field-error'}
                    aria-live="polite"
                  >
                    {emailValid ? '✅ Email looks valid' : '❌ Please enter a valid email'}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-ink-faint" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-glass pl-10 pr-10"
                  aria-label="Password"
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

              {/* Helper text BEFORE typing */}
              <AnimatePresence>
                {password.length === 0 ? (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.2 }}
                    className="helper-text"
                    aria-live="polite"
                  >
                    Password must be at least 8 characters long.
                  </motion.p>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.2 }}
                    className={passwordValid ? 'field-success' : 'field-error'}
                    aria-live="polite"
                  >
                    {passwordValid ? '✅ Password looks good' : '❌ Password must be at least 8 characters'}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Strength meter + animated progress bar */}
              <div className="strength-track" aria-label="Password strength meter">
                <motion.div
                  className="strength-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${password.length === 0 ? 0 : passwordStrength}%` }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-ink-muted">
                <span>Strength</span>
                <span className={password.length === 0 ? '' : passwordValid ? 'text-emerald-300' : 'text-red-300'}>
                  {password.length === 0 ? '—' : passwordStrength < 40 ? 'Weak' : passwordStrength < 70 ? 'Good' : 'Strong'}
                </span>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-ink-faint" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-glass pl-10"
                  aria-label="Confirm password"
                />
              </div>
              <AnimatePresence>
                {confirmPassword.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.2 }}
                    className={confirmValid ? 'field-success' : 'field-error'}
                    aria-live="polite"
                  >
                    {confirmValid ? '✅ Passwords match' : '❌ Must match password'}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="btn-primary w-full disabled:opacity-60"
              aria-disabled={!canSubmit}
            >
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

