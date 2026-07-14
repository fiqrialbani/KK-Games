import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';
import { ShieldCheck, Eye, EyeOff, Lock, Loader2 } from 'lucide-react';
import { useState } from 'react';

const passwordSchema = z.object({
  oldPassword: z.string().min(1, 'Password lama harus diisi'),
  newPassword: z
    .string()
    .min(8, 'Password baru minimal 8 karakter')
    .regex(/[A-Z]/, 'Password baru harus mengandung minimal 1 huruf besar')
    .regex(/[a-z]/, 'Password baru harus mengandung minimal 1 huruf kecil')
    .regex(/\d/, 'Password baru harus mengandung minimal 1 angka'),
  confirmPassword: z.string().min(1, 'Konfirmasi password baru harus diisi')
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Konfirmasi password baru tidak cocok',
  path: ['confirmPassword']
});

export default function ProfileSecurity() {
  const { changePassword } = useUserAuth();
  const navigate = useNavigate();

  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: { oldPassword: '', newPassword: '', confirmPassword: '' }
  });

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 800));
    const res = changePassword(data.oldPassword, data.newPassword);
    
    if (res.success) {
      toast.success('Password berhasil diubah! Silakan login kembali.');
      navigate('/login', { replace: true });
    } else {
      toast.error(res.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="font-[var(--font-display)] text-xl font-bold text-[var(--color-text)]">
          Keamanan Akun
        </h1>
        <p className="text-xs text-[var(--color-muted)]">
          Ganti password lama Anda dengan password baru yang lebih aman.
        </p>
      </div>

      <div className="max-w-xl rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]/30 p-6 backdrop-blur-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {/* Old Password */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[var(--color-muted)]">Password Lama</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
              <input
                type={showOldPw ? 'text' : 'password'}
                placeholder="Masukkan password lama"
                {...register('oldPassword')}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] py-2.5 pl-9 pr-10 text-xs text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              />
              <button
                type="button"
                onClick={() => setShowOldPw(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-text)]"
              >
                {showOldPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {errors.oldPassword && (
              <p className="mt-1.5 text-2xs text-[var(--color-danger)]">{errors.oldPassword.message}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[var(--color-muted)]">Password Baru</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
              <input
                type={showNewPw ? 'text' : 'password'}
                placeholder="Password Baru (min 8 karakter, huruf besar/kecil, angka)"
                {...register('newPassword')}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] py-2.5 pl-9 pr-10 text-xs text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              />
              <button
                type="button"
                onClick={() => setShowNewPw(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-text)]"
              >
                {showNewPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1.5 text-2xs text-[var(--color-danger)]">{errors.newPassword.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[var(--color-muted)]">Konfirmasi Password Baru</label>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
              <input
                type={showConfirmPw ? 'text' : 'password'}
                placeholder="Ulangi password baru"
                {...register('confirmPassword')}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] py-2.5 pl-9 pr-10 text-xs text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPw(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)] hover:text-[var(--color-text)]"
              >
                {showConfirmPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1.5 text-2xs text-[var(--color-danger)]">{errors.confirmPassword.message}</p>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-6 py-2.5 text-xs font-semibold text-white shadow-lg hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Mengubah Password...
                </>
              ) : (
                <>
                  <ShieldCheck size={14} /> Ubah Password
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
