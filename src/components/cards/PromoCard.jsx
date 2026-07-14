import { motion } from 'framer-motion';
import { Ticket, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function PromoCard({ promo, index = 0 }) {
  function copyCode() {
    navigator.clipboard?.writeText(promo.code);
    toast.success(`Kode ${promo.code} disalin!`);
  }

  const isUpcoming = promo.status === 'upcoming';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.05 }}
      className="relative flex items-center gap-4 overflow-hidden rounded-xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-card)] to-[var(--color-bg)] p-4"
    >
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-primary)]">
        <Ticket size={20} className="text-white" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[var(--color-text)]">{promo.title}</p>
        <p className="text-xs text-[var(--color-muted)]">
          Diskon {promo.discount}% · berlaku s/d {new Date(promo.endDate).toLocaleDateString('id-ID')}
        </p>
      </div>
      <button
        disabled={isUpcoming}
        onClick={copyCode}
        className="flex shrink-0 items-center gap-1 rounded-lg border border-dashed border-[var(--color-accent)]/50 px-3 py-1.5 text-xs font-mono font-semibold text-[var(--color-accent)] transition hover:bg-[var(--color-accent)]/10 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {promo.code} <Copy size={12} />
      </button>
      {isUpcoming && (
        <span className="absolute right-2 top-2 rounded-full bg-[var(--color-warning)]/15 px-2 py-0.5 text-[10px] font-semibold text-[var(--color-warning)]">
          Segera
        </span>
      )}
    </motion.div>
  );
}
