import { Link } from 'react-router-dom';
import { Ghost } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <Ghost size={44} className="text-[var(--color-muted)]" />
      <h1 className="mt-4 font-[var(--font-display)] text-3xl font-bold text-[var(--color-text)]">404</h1>
      <p className="mt-2 text-sm text-[var(--color-muted)]">Halaman yang kamu cari tidak ditemukan.</p>
      <Link to="/" className="mt-6 rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white">
        Kembali ke Beranda
      </Link>
    </div>
  );
}
