import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Search, Menu, X, LogIn, LogOut, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserAuth } from '../../context/UserAuthContext';
import AuthModal from '../ui/AuthModal';
import toast from 'react-hot-toast';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, isAuthenticated, logout } = useUserAuth();
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/games?search=${encodeURIComponent(query.trim())}`);
      setOpen(false);
    }
  }

  const handleLogout = () => {
    logout();
    toast.success('Berhasil logout!');
  };

  const links = [
    { to: '/games', label: 'Semua Game' },
    { to: '/#promo', label: 'Promo' },
    { to: '/#faq', label: 'FAQ' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2 font-[var(--font-display)]">
            <img src="/kkgames.png" alt="KK Games Logo" className="h-9 w-9 object-contain rounded-lg" />
            <span className="text-xl font-bold tracking-wide text-[var(--color-text)]">
              KK<span className="text-gradient">Games</span>
            </span>
          </Link>

          <form onSubmit={handleSearch} className="ml-4 hidden flex-1 max-w-md md:flex">
            <div className="flex w-full items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]/70 px-3 py-2 transition focus-within:border-[var(--color-accent)]">
              <Search size={16} className="text-[var(--color-muted)]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari game favoritmu..."
                className="w-full bg-transparent text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none"
              />
            </div>
          </form>

          <nav className="ml-auto hidden items-center gap-6 md:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-sm font-medium text-[var(--color-muted)] transition hover:text-[var(--color-text)]"
              >
                {l.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="flex items-center gap-3 pl-4 border-l border-[var(--color-border)]">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-text)] transition hover:border-[var(--color-accent)]"
                >
                  <User size={13} className="text-[var(--color-accent)]" />
                  <span>Profil Saya</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3.5 py-1.5 text-xs font-semibold text-[var(--color-danger)] transition hover:bg-[var(--color-danger)]/10"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-5 py-2 text-sm font-semibold text-white shadow-lg transition-all hover:opacity-90 hover:shadow-[var(--color-primary)]/20"
              >
                Masuk / Daftar
              </button>
            )}
          </nav>

          <button
            onClick={() => setOpen(!open)}
            className="ml-auto text-[var(--color-text)] md:hidden focus:outline-none"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-[var(--color-border)] bg-[var(--color-bg)] md:hidden"
            >
              <div className="flex flex-col gap-4 px-4 py-4">
                <form onSubmit={handleSearch} className="flex w-full items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]/70 px-3 py-2">
                  <Search size={16} className="text-[var(--color-muted)]" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Cari game favoritmu..."
                    className="w-full bg-transparent text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none"
                  />
                </form>

                {links.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-text)]"
                  >
                    {l.label}
                  </Link>
                ))}

                {isAuthenticated ? (
                  <div className="flex flex-col gap-2 pt-2 border-t border-[var(--color-border)]">
                    <Link
                      to="/profile"
                      onClick={() => setOpen(false)}
                      className="w-full text-center rounded-lg border border-[var(--color-border)] py-2 text-sm font-semibold text-[var(--color-accent)]"
                    >
                      Profil Saya
                    </Link>
                    <button
                      onClick={() => { handleLogout(); setOpen(false); }}
                      className="w-full rounded-lg border border-[var(--color-border)] py-2 text-sm font-semibold text-[var(--color-danger)]"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setShowAuthModal(true); setOpen(false); }}
                    className="w-full rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] py-2 text-center text-sm font-semibold text-white"
                  >
                    Masuk / Daftar
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
