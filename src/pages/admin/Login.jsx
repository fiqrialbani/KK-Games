import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { useNavigate } from 'react-router-dom';
import { Zap, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const schema = z.object({
  username: z.string().min(1, 'Username wajib diisi'),
  password: z.string().min(1, 'Password wajib diisi'),
});

export default function AdminLogin() {
  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    if (isAuthenticated) navigate('/admin/dashboard', { replace: true });
  }, [isAuthenticated, navigate]);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 600));
    const result = login(data.username, data.password);
    if (result.success) {
      toast.success('Login berhasil! Selamat datang, Admin.');
      navigate('/admin/dashboard', { replace: true });
    } else {
      toast.error(result.message || 'Login gagal.');
    }
  };

  return (
    <div className="min-h-screen bg-[#080F1E] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Glow blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[var(--color-primary)] opacity-10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[var(--color-secondary)] opacity-10 blur-3xl" />

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] shadow-lg shadow-[var(--color-primary)]/30">
            <Zap size={28} className="text-white" />
          </div>
          <h1 className="font-[var(--font-display)] text-3xl font-bold tracking-wide text-[var(--color-text)]">
            TOP<span className="text-[var(--color-accent)]">ZONE</span>
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">Admin Dashboard — Masuk untuk melanjutkan</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[#0D1B2E]/80 p-8 shadow-2xl backdrop-blur-sm">
          <h2 className="mb-6 text-lg font-semibold text-[var(--color-text)]">Login Admin</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            {/* Username */}
            <div>
              <label htmlFor="admin-username" className="mb-1.5 block text-sm font-medium text-[var(--color-muted)]">
                Username
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                <input
                  id="admin-username"
                  type="text"
                  autoComplete="username"
                  placeholder="Masukkan username"
                  {...register('username')}
                  className={`w-full rounded-xl border bg-[var(--color-bg)] py-3 pl-10 pr-4 text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 ${
                    errors.username ? 'border-[var(--color-danger)]' : 'border-[var(--color-border)] focus:border-[var(--color-accent)]'
                  }`}
                />
              </div>
              {errors.username && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-[var(--color-danger)]">
                  <AlertCircle size={12} /> {errors.username.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="admin-password" className="mb-1.5 block text-sm font-medium text-[var(--color-muted)]">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                <input
                  id="admin-password"
                  type={showPw ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Masukkan password"
                  {...register('password')}
                  className={`w-full rounded-xl border bg-[var(--color-bg)] py-3 pl-10 pr-11 text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/50 ${
                    errors.password ? 'border-[var(--color-danger)]' : 'border-[var(--color-border)] focus:border-[var(--color-accent)]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-text)]"
                  aria-label="Toggle password visibility"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-[var(--color-danger)]">
                  <AlertCircle size={12} /> {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              id="admin-login-btn"
              className="w-full rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--color-primary)]/25 transition-all hover:opacity-90 hover:shadow-[var(--color-primary)]/40 disabled:opacity-60"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Memverifikasi...
                </span>
              ) : (
                'Masuk ke Dashboard'
              )}
            </button>
          </form>
        </div>

        {/* Demo credentials hint */}
        <div className="mt-4 rounded-xl border border-[var(--color-accent)]/20 bg-[var(--color-accent)]/5 p-4">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-accent)]">
            💡 Demo Credentials
          </p>
          <p className="text-xs text-[var(--color-muted)]">
            <span className="font-mono text-[var(--color-text)]">Username:</span>{' '}
            <code className="rounded bg-[var(--color-card)] px-1.5 py-0.5 font-mono text-[var(--color-accent)]">admin</code>
          </p>
          <p className="mt-1 text-xs text-[var(--color-muted)]">
            <span className="font-mono text-[var(--color-text)]">Password:</span>{' '}
            <code className="rounded bg-[var(--color-card)] px-1.5 py-0.5 font-mono text-[var(--color-accent)]">password123</code>
          </p>
        </div>
      </div>
    </div>
  );
}
