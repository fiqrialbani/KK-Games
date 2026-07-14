import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod/v4';
import { useUserAuth } from '../../context/UserAuthContext';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Lock, User, AlertCircle, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const userLoginSchema = z.object({
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

const adminLoginSchema = z.object({
  email: z.string().min(1, 'Username wajib diisi'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
});

export default function AuthModal({ isOpen, onClose }) {
  const { login, registerUser } = useUserAuth();
  const { login: adminLogin } = useAdminAuth();
  const navigate = useNavigate();
  const [isLoginView, setIsLoginView] = useState(true);
  const [loginRole, setLoginRole] = useState('user'); // 'user' or 'admin'
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(
      !isLoginView
        ? registerSchema
        : loginRole === 'admin'
        ? adminLoginSchema
        : userLoginSchema
    ),
  });

  if (!isOpen) return null;

  const handleSwitchView = () => {
    setIsLoginView(v => !v);
    reset();
  };

  const handleSwitchRole = (role) => {
    setLoginRole(role);
    reset();
  };

  const onSubmit = async (data) => {
    await new Promise(r => setTimeout(r, 600));
    if (isLoginView) {
      if (loginRole === 'admin') {
        const res = adminLogin(data.email, data.password);
        if (res.success) {
          toast.success('Login berhasil! Selamat datang, Admin.');
          onClose();
          reset();
          navigate('/admin/dashboard', { replace: true });
        } else {
          toast.error(res.message);
        }
      } else {
        const res = login(data.email, data.password);
        if (res.success) {
          toast.success('Berhasil login!');
          onClose();
          reset();
        } else {
          toast.error(res.message);
        }
      }
    } else {
      const res = registerUser(data.name, data.email, data.password);
      if (res.success) {
        toast.success('Pendaftaran berhasil! Otomatis login.');
        onClose();
        reset();
      } else {
        toast.error(res.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[#0D1B2E] p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[var(--color-muted)] hover:text-[var(--color-text)]"
        >
          <X size={20} />
        </button>

        <h2 className="font-[var(--font-display)] text-2xl font-bold text-[var(--color-text)]">
          {isLoginView ? 'Masuk ke KK Games' : 'Daftar Akun Baru'}
        </h2>
        <p className="mt-1 text-xs text-[var(--color-muted)]">
          {isLoginView ? 'Silakan masuk untuk menikmati simulasi checkout' : 'Buat akun gratis untuk mulai belanja'}
        </p>

        {/* Role Selector (User vs Admin) */}
        {isLoginView && (
          <div className="mt-4 flex rounded-xl bg-[var(--color-bg)] p-1 border border-[var(--color-border)]">
            <button
              type="button"
              onClick={() => handleSwitchRole('user')}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
                loginRole === 'user'
                  ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white shadow-md'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              User
            </button>
            <button
              type="button"
              onClick={() => handleSwitchRole('admin')}
              className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
                loginRole === 'admin'
                  ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white shadow-md'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              Admin
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4" noValidate>
          {!isLoginView && (
            <div>
              <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Nama Lengkap</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  {...register('name')}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] py-2.5 pl-9 pr-4 text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
                />
              </div>
              {errors.name && (
                <p className="mt-1 flex items-center gap-1 text-[11px] text-[var(--color-danger)]">
                  <AlertCircle size={11} /> {errors.name.message}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">
              {isLoginView && loginRole === 'admin' ? 'Username' : 'Email'}
            </label>
            <div className="relative">
              {isLoginView && loginRole === 'admin' ? (
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
              ) : (
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
              )}
              <input
                type={isLoginView && loginRole === 'admin' ? 'text' : 'email'}
                placeholder={isLoginView && loginRole === 'admin' ? 'Username' : 'Alamat Email'}
                {...register('email')}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] py-2.5 pl-9 pr-4 text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
              />
            </div>
            {errors.email && (
              <p className="mt-1 flex items-center gap-1 text-[11px] text-[var(--color-danger)]">
                <AlertCircle size={11} /> {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-[var(--color-muted)]">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Password"
                {...register('password')}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] py-2.5 pl-9 pr-10 text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
              />
              <button
                type="button"
                onClick={() => setShowPw(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-text)]"
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 flex items-center gap-1 text-[11px] text-[var(--color-danger)]">
                <AlertCircle size={11} /> {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? 'Memproses...' : isLoginView ? 'Masuk' : 'Daftar Sekarang'}
          </button>
        </form>

        {isLoginView && loginRole === 'user' && (
          <div className="mt-5 text-center text-xs text-[var(--color-muted)]">
            Belum punya akun?{' '}
            <button
              onClick={handleSwitchView}
              className="font-semibold text-[var(--color-accent)] hover:underline"
            >
              Daftar
            </button>
          </div>
        )}

        {!isLoginView && (
          <div className="mt-5 text-center text-xs text-[var(--color-muted)]">
            Sudah punya akun?{' '}
            <button
              onClick={handleSwitchView}
              className="font-semibold text-[var(--color-accent)] hover:underline"
            >
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
