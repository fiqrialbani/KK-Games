import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Server, Gift, Landmark, CheckCircle2 } from 'lucide-react';
import { formatIDR, formatDate } from '../../utils/format';

export default function InvoiceModal({ isOpen, onClose, transaction }) {
  if (!isOpen || !transaction) return null;

  const t = transaction;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          className="relative w-full max-w-lg rounded-2xl border border-[var(--color-border)] bg-[#0D1B2E] p-6 shadow-2xl overflow-y-auto max-h-[90vh]"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-[var(--color-muted)] hover:text-[var(--color-text)] transition"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col items-center text-center border-b border-dashed border-[var(--color-border)] pb-5">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-[var(--color-success)]/15">
              <CheckCircle2 size={24} className="text-[var(--color-success)]" />
            </div>
            <h3 className="mt-3 font-[var(--font-display)] text-xl font-bold text-[var(--color-text)]">
              Detail Transaksi
            </h3>
            <p className="mt-1 font-mono text-xs text-[var(--color-accent)] font-semibold">
              {t.invoice}
            </p>
            <span className={`mt-2 rounded-full px-2.5 py-0.5 text-2xs font-semibold ${
              t.status === 'SUCCESS' || t.status === 'success'
                ? 'bg-[var(--color-success)]/15 text-[var(--color-success)]'
                : t.status === 'PENDING' || t.status === 'pending'
                ? 'bg-[var(--color-warning)]/15 text-[var(--color-warning)]'
                : 'bg-[var(--color-danger)]/15 text-[var(--color-danger)]'
            }`}>
              {t.status}
            </span>
          </div>

          <dl className="mt-5 space-y-3.5 text-xs">
            <div className="flex justify-between items-center">
              <dt className="flex items-center gap-1.5 text-[var(--color-muted)]">
                <Calendar size={13} /> Tanggal
              </dt>
              <dd className="font-medium text-[var(--color-text)]">
                {formatDate(new Date(t.createdAt))}
              </dd>
            </div>

            <div className="flex justify-between items-center">
              <dt className="flex items-center gap-1.5 text-[var(--color-muted)]">
                🎮 Game
              </dt>
              <dd className="font-medium text-[var(--color-text)]">
                {t.game}
              </dd>
            </div>

            <div className="flex justify-between items-center">
              <dt className="flex items-center gap-1.5 text-[var(--color-muted)]">
                <User size={13} /> User ID
              </dt>
              <dd className="font-mono font-medium text-[var(--color-text)]">
                {t.userId}
              </dd>
            </div>

            {t.serverId && (
              <div className="flex justify-between items-center">
                <dt className="flex items-center gap-1.5 text-[var(--color-muted)]">
                  <Server size={13} /> Server ID / Region
                </dt>
                <dd className="font-mono font-medium text-[var(--color-text)]">
                  {t.serverId}
                </dd>
              </div>
            )}

            <div className="flex justify-between items-center">
              <dt className="flex items-center gap-1.5 text-[var(--color-muted)]">
                📦 Paket
              </dt>
              <dd className="font-medium text-[var(--color-text)]">
                {t.package}
              </dd>
            </div>

            <div className="flex justify-between items-center">
              <dt className="flex items-center gap-1.5 text-[var(--color-muted)]">
                <Landmark size={13} /> Pembayaran
              </dt>
              <dd className="font-medium text-[var(--color-text)]">
                {t.paymentMethod}
              </dd>
            </div>

            {t.promoCode && (
              <div className="flex justify-between items-center">
                <dt className="flex items-center gap-1.5 text-[var(--color-muted)]">
                  <Gift size={13} /> Promo
                </dt>
                <dd className="font-mono font-semibold text-[var(--color-success)]">
                  {t.promoCode}
                </dd>
              </div>
            )}
          </dl>

          <div className="mt-5 space-y-2 border-t border-[var(--color-border)] pt-4 text-xs">
            <div className="flex justify-between text-[var(--color-muted)]">
              <span>Subtotal</span>
              <span className="font-mono">{formatIDR(t.originalPrice || t.finalPrice + (t.discount || 0))}</span>
            </div>
            {(t.discount > 0) && (
              <div className="flex justify-between text-[var(--color-success)]">
                <span>Diskon</span>
                <span className="font-mono">-{formatIDR(t.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-semibold pt-1 border-t border-[var(--color-border)]/50">
              <span className="text-[var(--color-text)]">Total</span>
              <span className="font-mono text-[var(--color-accent)] font-bold">{formatIDR(t.finalPrice)}</span>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={onClose}
              className="w-full rounded-xl border border-[var(--color-border)] py-2.5 text-xs font-semibold text-[var(--color-text)] hover:bg-[var(--color-card)] transition"
            >
              Kembali
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
