import { useState } from 'react';
import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { useUserAuth } from '../../context/UserAuthContext';
import { Zap, Mail, Lock, Eye, EyeOff, AlertCircle, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export default function LoginPage() {
  const { isAuthenticated, login } = useUserAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  if (isAuthenticated) return <Navigate to={from} replace />;

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 600));
    const res = login(data.email, data.password);
    if (res.success) {
      toast.success('Berhasil masuk!');
      navigate(from, { replace: true });
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#080F1E] via-[#0D1B2E] to-[#12082a] px-4 py-16">
      {/* Background blobs */}
      <div
        className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full opacity-25 blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--color-accent), transparent 70%)' }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--color-secondary), transparent 70%)' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <Link to="/" className="flex items-center gap-2 font-[var(--font-display)]">
            <img src="/kkgames.png" alt="KK Games Logo" className="h-11 w-11 object-contain rounded-xl shadow-lg shadow-[var(--color-primary)]/30" />
            <span className="text-2xl font-bold tracking-wide text-[var(--color-text)]">
              KK<span className="text-gradient"> Games</span>
            </span>
          </Link>
          <p className="text-xs text-[var(--color-muted)]">Platform Top Up Game Tercepat</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[#0D1B2E]/80 p-8 shadow-2xl backdrop-blur-md">
          <h1 className="font-[var(--font-display)] text-2xl font-bold text-[var(--color-text)]">
            Masuk ke Akun
          </h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Belum punya akun?{' '}
            <Link to="/register" className="font-semibold text-[var(--color-accent)] hover:underline">
              Daftar gratis
            </Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4" noValidate>
            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--color-muted)]">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                <input
                  type="email"
                  placeholder="Masukkan email kamu"
                  {...register('email')}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] py-3 pl-10 pr-4 text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] transition focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 flex items-center gap-1 text-[11px] text-[var(--color-danger)]">
                  <AlertCircle size={11} /> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--color-muted)]">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  {...register('password')}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] py-3 pl-10 pr-11 text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] transition focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-text)]"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 flex items-center gap-1 text-[11px] text-[var(--color-danger)]">
                  <AlertCircle size={11} /> {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--color-primary)]/30 transition hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Memproses...</span>
              ) : (
                <>
                  <LogIn size={16} /> Masuk Sekarang
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-[var(--color-border)] pt-5 text-center text-xs text-[var(--color-muted)]">
            Akses Panel Admin?{' '}
            <Link to="/admin/login" className="font-semibold text-[var(--color-accent)]/70 hover:text-[var(--color-accent)] hover:underline">
              Login Admin
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[var(--color-muted)]">
          <Link to="/" className="hover:text-[var(--color-text)]">← Kembali ke Beranda</Link>
        </p>
      </motion.div>
    </div>
  );
}
