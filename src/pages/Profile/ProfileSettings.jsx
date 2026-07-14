import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useUserAuth } from '../../context/UserAuthContext';
import { useState } from 'react';
import { Save, Loader2, Palette, Globe, Camera, User, Phone } from 'lucide-react';

const settingsSchema = z.object({
  name: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  username: z.string().min(3, 'Username minimal 3 karakter').regex(/^[a-zA-Z0-9_]+$/, 'Username hanya boleh huruf, angka, dan underscore'),
  phone: z.string().min(10, 'Nomor telepon minimal 10 digit').regex(/^(?:\+62|62|0)8[1-9]\d{7,10}$/, 'Format nomor telepon Indonesia tidak valid'),
  theme: z.enum(['light', 'dark', 'system']),
  language: z.enum(['id', 'en']),
  avatar: z.string().optional()
});

export default function ProfileSettings() {
  const { user, updateProfile } = useUserAuth();
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || '');

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: user?.name || '',
      username: user?.username || '',
      phone: user?.phone || '',
      theme: user?.theme || 'dark',
      language: user?.language || 'id',
      avatar: user?.avatar || ''
    }
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Format gambar harus JPG, PNG, atau WEBP');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran gambar maksimal 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      setAvatarPreview(result);
      setValue('avatar', result);
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 600));

    // Check username uniqueness
    const registeredUsers = JSON.parse(localStorage.getItem('kk_registered_users') || '[]');
    const isTaken = registeredUsers.some(
      u => u.username?.toLowerCase() === data.username.toLowerCase() && u.email !== user.email
    );

    if (isTaken) {
      toast.error('Username sudah digunakan pengguna lain.');
      return;
    }

    const res = updateProfile(data);
    if (res.success) {
      toast.success('Pengaturan & preferensi berhasil disimpan!');
    } else {
      toast.error(res.message);
    }
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="font-[var(--font-display)] text-xl font-bold text-[var(--color-text)]">
          Pengaturan Akun
        </h1>
        <p className="text-xs text-[var(--color-muted)]">
          Kelola informasi profil beserta preferensi tema dan bahasa Anda.
        </p>
      </div>

      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]/30 p-6 backdrop-blur-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {/* Avatar Area */}
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-6 pb-6 border-b border-[var(--color-border)]/60">
            <div className="relative group flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] text-xl font-bold text-white overflow-hidden shadow-lg">
              {avatarPreview ? (
                <img src={avatarPreview} alt={user?.name} className="h-full w-full object-cover" />
              ) : (
                <span>{userInitial}</span>
              )}
              <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition cursor-pointer">
                <Camera size={16} className="text-white" />
                <input
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[var(--color-text)]">Ubah Foto Profil</h4>
              <p className="mt-1 text-3xs text-[var(--color-muted)]">
                JPG, PNG, atau WEBP. Maksimal 2MB.
              </p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {/* Name */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[var(--color-muted)]">Nama Lengkap</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  {...register('name')}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] py-2.5 pl-9 pr-4 text-xs text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                />
              </div>
              {errors.name && (
                <p className="mt-1.5 text-2xs text-[var(--color-danger)]">{errors.name.message}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[var(--color-muted)]">Username</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                <input
                  type="text"
                  placeholder="Username"
                  {...register('username')}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] py-2.5 pl-9 pr-4 text-xs text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                />
              </div>
              {errors.username && (
                <p className="mt-1.5 text-2xs text-[var(--color-danger)]">{errors.username.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[var(--color-muted)]">Nomor Telepon</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                <input
                  type="tel"
                  placeholder="Contoh: 081234567890"
                  {...register('phone')}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] py-2.5 pl-9 pr-4 text-xs text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                />
              </div>
              {errors.phone && (
                <p className="mt-1.5 text-2xs text-[var(--color-danger)]">{errors.phone.message}</p>
              )}
            </div>

            {/* Theme Preference */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[var(--color-muted)]">Tema Tampilan</label>
              <div className="relative">
                <Palette size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                <select
                  {...register('theme')}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] py-2.5 pl-9 pr-3 text-xs text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                >
                  <option value="dark">Dark Theme</option>
                  <option value="light">Light Theme</option>
                  <option value="system">System Preference</option>
                </select>
              </div>
            </div>

            {/* Language Preference */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[var(--color-muted)]">Bahasa / Language</label>
              <div className="relative">
                <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
                <select
                  {...register('language')}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] py-2.5 pl-9 pr-3 text-xs text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
                >
                  <option value="id">Bahasa Indonesia</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-6 py-2.5 text-xs font-semibold text-white shadow-lg hover:opacity-90 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Menyimpan...
                </>
              ) : (
                <>
                  <Save size={14} /> Simpan Pengaturan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
