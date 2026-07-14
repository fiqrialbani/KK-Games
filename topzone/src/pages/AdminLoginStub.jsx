import { Link } from 'react-router-dom';
import { Lock, Construction } from 'lucide-react';

export default function AdminLoginStub() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-[var(--color-secondary)]/15">
        <Lock size={26} className="text-[var(--color-secondary)]" />
      </div>
      <h1 className="mt-4 font-[var(--font-display)] text-xl font-bold text-[var(--color-text)]">
        Admin Dashboard
      </h1>
      <p className="mt-2 flex items-center gap-1.5 text-sm text-[var(--color-muted)]">
        <Construction size={14} /> Sedang dalam pengembangan (fase berikutnya).
      </p>
      <Link to="/" className="mt-6 rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white">
        Kembali ke Beranda
      </Link>
    </div>
  );
}
