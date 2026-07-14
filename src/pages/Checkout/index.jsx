import { Link, Navigate } from 'react-router-dom';
import { CheckCircle2, Download, Home } from 'lucide-react';
import { useOrder } from '../../context/OrderContext';
import { formatIDR, formatDate } from '../../utils/format';

export default function Checkout() {
  const { lastOrder } = useOrder();

  if (!lastOrder) {
    return <Navigate to="/games" replace />;
  }

  const o = lastOrder;

  return (
    <div className="mx-auto max-w-lg px-4 py-14 sm:px-6">
      <div className="flex flex-col items-center text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-[var(--color-success)]/15">
          <CheckCircle2 size={32} className="text-[var(--color-success)]" />
        </div>
        <h1 className="mt-4 font-[var(--font-display)] text-2xl font-bold text-[var(--color-text)]">
          Top Up Berhasil
        </h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Simulasi transaksi selesai diproses.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <div className="flex items-center justify-between border-b border-dashed border-[var(--color-border)] pb-4">
          <div>
            <p className="text-xs text-[var(--color-muted)]">No. Invoice</p>
            <p className="font-mono text-sm font-semibold text-[var(--color-accent)]">{o.invoice}</p>
          </div>
          <span className="rounded-full bg-[var(--color-success)]/15 px-3 py-1 text-xs font-semibold text-[var(--color-success)]">
            Success
          </span>
        </div>

        <dl className="mt-4 space-y-3 text-sm">
          <Row label="Tanggal" value={formatDate(new Date(o.createdAt))} />
          <Row label="Game" value={o.game} />
          <Row label="Akun" value={`${o.userId}${o.serverId ? ' (' + o.serverId + ')' : ''} · ${o.nickname}`} />
          <Row label="Paket" value={o.package} />
          <Row label="Pembayaran" value={o.paymentMethod} />
          {o.promoCode && <Row label="Voucher" value={`${o.promoCode}`} />}
        </dl>

        <div className="mt-4 space-y-2 border-t border-[var(--color-border)] pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-[var(--color-muted)]">Subtotal</span>
            <span className="font-mono text-[var(--color-text)]">{formatIDR(o.originalPrice)}</span>
          </div>
          {o.discount > 0 && (
            <div className="flex justify-between">
              <span className="text-[var(--color-muted)]">Diskon</span>
              <span className="font-mono text-[var(--color-success)]">-{formatIDR(o.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-base">
            <span className="font-semibold text-[var(--color-text)]">Total Bayar</span>
            <span className="font-mono font-bold text-[var(--color-accent)]">{formatIDR(o.finalPrice)}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={() => window.print()}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text)] transition hover:border-[var(--color-accent)]"
        >
          <Download size={16} /> Simpan Invoice
        </button>
        <Link
          to="/"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-4 py-2.5 text-sm font-semibold text-white"
        >
          <Home size={16} /> Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="shrink-0 text-[var(--color-muted)]">{label}</dt>
      <dd className="truncate text-right font-medium text-[var(--color-text)]">{value}</dd>
    </div>
  );
}
