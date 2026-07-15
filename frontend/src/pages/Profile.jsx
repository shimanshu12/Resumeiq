import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, KeyRound, LogOut, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import GlassCard from '../components/GlassCard';
import StatCard from '../components/StatCard';
import { FileText, Award, TrendingUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../supabase/supabaseClient';
import api from '../services/api';

export default function Profile() {
  const { user, signOut, sendPasswordReset } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
  const [saving, setSaving] = useState(false);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/reports/summary');
        setSummary(data.summary);
      } catch {
        // Non-critical — profile still renders without stats
      }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ data: { full_name: fullName } });
    setSaving(false);
    if (error) {
      toast.error(error.message || 'Could not update profile.');
    } else {
      toast.success('Profile updated.');
    }
  };

  const handleResetPassword = async () => {
    const { error } = await sendPasswordReset(user.email);
    if (error) {
      toast.error(error.message || 'Could not send reset email.');
    } else {
      toast.success('Password reset email sent.');
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const initials = (fullName || user?.email || '?').slice(0, 2).toUpperCase();

  return (
    <div className="mx-auto max-w-3xl pb-16">
      <h1 className="font-display text-2xl font-bold">Profile</h1>

      <GlassCard className="mt-6 flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-grad-primary font-display text-xl font-bold">
          {initials}
        </div>
        <div>
          <p className="font-display text-lg font-semibold">{fullName || 'Unnamed User'}</p>
          <p className="text-sm text-ink-muted">{user?.email}</p>
        </div>
      </GlassCard>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <StatCard icon={FileText} label="Total Reports" value={summary?.totalAnalyses || 0} accent="blue" />
        <StatCard icon={TrendingUp} label="Average ATS Score" value={summary?.averageScore || 0} suffix="%" accent="purple" />
        <StatCard icon={Award} label="Highest Score" value={summary?.highestScore || 0} suffix="%" accent="emerald" />
      </div>

      <GlassCard className="mt-6" delay={0.1}>
        <h2 className="font-display text-lg font-semibold">Edit Profile</h2>
        <div className="mt-4 space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-ink-faint" size={18} />
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="input-glass pl-10" placeholder="Full name" />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-ink-faint" size={18} />
            <input value={user?.email || ''} disabled className="input-glass pl-10 opacity-60" />
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-60">
            <Save size={16} /> {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </GlassCard>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row">
        <button onClick={handleResetPassword} className="btn-ghost flex-1">
          <KeyRound size={16} /> Reset Password
        </button>
        <button onClick={handleLogout} className="btn-ghost flex-1 text-red-300 hover:text-red-200">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
}
