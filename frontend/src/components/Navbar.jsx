import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanLine, Menu, X, LayoutDashboard, Upload, FileText, User, LogOut } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

const authedLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/upload', label: 'Upload Resume', icon: Upload },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/profile', label: 'Profile', icon: User },
];

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out. See you soon!');
    navigate('/');
  };

  return (
    <header className="sticky top-4 z-50 mx-auto max-w-6xl px-4">
      <nav className="glass-nav flex items-center justify-between rounded-2xl px-5 py-3">
        <Link to="/" className="flex items-center gap-2">
          <ScanLine className="text-accent-cyan" size={22} />
          <span className="font-display text-lg font-bold tracking-tight">
            Resume<span className="text-accent-cyan">IQ</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {user &&
            authedLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'bg-white/[0.08] text-ink-primary' : 'text-ink-muted hover:text-ink-primary'
                  }`
                }
              >
                <Icon size={16} /> {label}
              </NavLink>
            ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <button onClick={handleLogout} className="btn-ghost !px-4 !py-2 text-sm">
              <LogOut size={16} /> Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="btn-ghost !px-4 !py-2 text-sm">
                Login
              </Link>
              <Link to="/signup" className="btn-primary !px-4 !py-2 text-sm">
                Get Started
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-nav mt-2 overflow-hidden rounded-2xl md:hidden"
          >
            <div className="flex flex-col gap-1 p-4">
              {user ? (
                <>
                  {authedLinks.map(({ to, label, icon: Icon }) => (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-muted hover:text-ink-primary"
                    >
                      <Icon size={16} /> {label}
                    </NavLink>
                  ))}
                  <button
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-ink-muted hover:text-ink-primary"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="btn-ghost w-full text-sm">
                    Login
                  </Link>
                  <Link to="/signup" onClick={() => setOpen(false)} className="btn-primary w-full text-sm">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
