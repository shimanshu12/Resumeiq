import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ScanLine } from 'lucide-react';
import toast from 'react-hot-toast';
import AnimatedBackground from '../components/AnimatedBackground';
import GlassCard from '../components/GlassCard';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const { signInWithEmail, signInWithGoogle, sendPasswordReset } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await signInWithEmail({ email, password });
    setSubmitting(false);

    if (error) {
      toast.error(error.message || 'Could not log in. Check your credentials.');
      return;
    }
    toast.success('Welcome back!');
    navigate(redirectTo, { replace: true });
  };

  const handleGoogle = async () => {
    const { error } = await signInWithGoogle();
    if (error) toast.error(error.message || 'Google sign-in failed.');
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Enter your email above first, then click "Forgot password?"');
      return;
    }
    const { error } = await sendPasswordReset(email);
    if (error) {
      toast.error(error.message || 'Could not send reset email.');
    } else {
      toast.success('Password reset email sent.');
    }
  };

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center py-12">
      <AnimatedBackground />
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <GlassCard hover={false} className="!p-8">
          <div className="mb-6 flex flex-col items-center">
            <ScanLine className="text-accent-cyan" size={30} />
            <h1 className="mt-3 font-display text-2xl font-bold">Welcome back</h1>
            <p className="text-sm text-ink-muted">Log in to keep tracking your ATS score.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-ink-muted">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="rounded border-white/20 bg-white/5 accent-accent-purple"
                />
                Remember me
              </label>
              <button type="button" onClick={handleForgotPassword} className="text-accent-cyan hover:underline">
                Forgot password?
              </button>
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
              {submitting ? 'Logging in…' : 'Log In'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-ink-faint">
            <div className="h-px flex-1 bg-white/10" /> OR <div className="h-px flex-1 bg-white/10" />
          </div>

          <button onClick={handleGoogle} className="btn-ghost w-full">
            <GoogleIcon /> Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-ink-muted">
            Don't have an account?{' '}
            <Link to="/signup" className="text-accent-cyan hover:underline">Sign up</Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}
