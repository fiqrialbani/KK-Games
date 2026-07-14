import { useState, useMemo } from 'react';
import { Search, CheckCircle, XCircle, Filter, ChevronLeft, ChevronRight, Eye, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { transactions as initialTx } from '../../data/games';

const formatRupiah = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

const STATUS_STYLE = {
  SUCCESS: { badge: 'bg-[var(--color-success)]/15 text-[var(--color-success)]', dot: 'bg-[var(--color-success)]' },
  PENDING: { badge: 'bg-[var(--color-warning)]/15 text-[var(--color-warning)]', dot: 'bg-[var(--color-warning)]' },
  FAILED:  { badge: 'bg-[var(--color-danger)]/15 text-[var(--color-danger)]', dot: 'bg-[var(--color-danger)]' },
};

const PAGE_SIZE = 10;

export default function AdminTransactions() {
  const [txList, setTxList] = useState(() => [...initialTx].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState(null);

  const filtered = useMemo(() => {
    let list = txList;
    if (statusFilter !== 'ALL') list = list.filter((t) => t.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.invoice.toLowerCase().includes(q) ||
          t.userId.includes(q) ||
          t.nickname.toLowerCase().includes(q)
      );
    }
    return list;
  }, [txList, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleStatusChange = (id, newStatus) => {
    setTxList((prev) => prev.map((t) => t.id === id ? { ...t, status: newStatus } : t));
    toast.success(`Transaksi diubah menjadi ${newStatus}!`);
    if (detail?.id === id) setDetail((d) => ({ ...d, status: newStatus }));
  };

  const handleSearch = (e) => { setSearch(e.target.value); setPage(1); };
  const handleFilter = (f) => { setStatusFilter(f); setPage(1); };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="font-[var(--font-display)] text-2xl font-bold text-[var(--color-text)]">Manajemen Transaksi</h1>
        <p className="text-sm text-[var(--color-muted)]">{txList.length} transaksi total</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
          <input
            type="text" placeholder="Cari invoice, User ID, atau nickname..."
            value={search} onChange={handleSearch}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] py-2.5 pl-10 pr-4 text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]/40"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-[var(--color-muted)]" />
          {['ALL', 'PENDING', 'SUCCESS', 'FAILED'].map((f) => (
            <button
              key={f}
              onClick={() => handleFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                statusFilter === f
                  ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white'
                  : 'border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-sm">
            <thead className="border-b border-[var(--color-border)] bg-[var(--color-bg)]/50">
              <tr>
                {['Invoice', 'Game & Paket', 'User', 'Pembayaran', 'Harga Akhir', 'Status', 'Aksi'].map((h) => (
                  <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {paginated.length === 0 ? (
                <tr><td colSpan={7} className="py-10 text-center text-sm text-[var(--color-muted)]">Tidak ada transaksi ditemukan.</td></tr>
              ) : paginated.map((tx) => {
                const st = STATUS_STYLE[tx.status];
                return (
                  <tr key={tx.id} className="hover:bg-[var(--color-bg)]/30 transition-colors">
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs text-[var(--color-accent)]">{tx.invoice}</span>
                      <p className="mt-0.5 text-[11px] text-[var(--color-muted)]">{new Date(tx.createdAt).toLocaleDateString('id-ID')}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-[var(--color-text)] leading-snug">{tx.game}</p>
                      <p className="text-xs text-[var(--color-muted)]">{tx.package}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-[var(--color-text)]">{tx.nickname}</p>
                      <p className="text-xs text-[var(--color-muted)]">ID: {tx.userId}</p>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-[var(--color-muted)]">{tx.paymentMethod}</td>
                    <td className="px-4 py-3.5 font-semibold text-[var(--color-text)]">{formatRupiah(tx.finalPrice)}</td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${st.badge}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setDetail(tx)} title="Detail" className="rounded-lg border border-[var(--color-border)] p-1.5 text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]">
                          <Eye size={13} />
                        </button>
                        {tx.status === 'PENDING' && (
                          <>
                            <button onClick={() => handleStatusChange(tx.id, 'SUCCESS')} title="Setujui" className="rounded-lg border border-[var(--color-success)]/30 p-1.5 text-[var(--color-success)] hover:bg-[var(--color-success)]/10">
                              <CheckCircle size={13} />
                            </button>
                            <button onClick={() => handleStatusChange(tx.id, 'FAILED')} title="Tolak" className="rounded-lg border border-[var(--color-danger)]/30 p-1.5 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10">
                              <XCircle size={13} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-[var(--color-border)] px-5 py-3.5">
          <p className="text-xs text-[var(--color-muted)]">
            Menampilkan {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)} dari {filtered.length} transaksi
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] disabled:opacity-40 hover:not-disabled:border-[var(--color-accent)] hover:not-disabled:text-[var(--color-accent)]">
              <ChevronLeft size={14} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button key={n} onClick={() => setPage(n)} className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition-all ${n === page ? 'bg-[var(--color-primary)] text-white' : 'border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]'}`}>
                {n}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] disabled:opacity-40 hover:not-disabled:border-[var(--color-accent)] hover:not-disabled:text-[var(--color-accent)]">
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {detail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-[var(--color-border)] bg-[#0D1B2E] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-4">
              <div>
                <h2 className="font-semibold text-[var(--color-text)]">Detail Transaksi</h2>
                <p className="font-mono text-xs text-[var(--color-accent)]">{detail.invoice}</p>
              </div>
              <button onClick={() => setDetail(null)} className="text-[var(--color-muted)] hover:text-[var(--color-text)]"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              {/* Status */}
              <div className="flex items-center justify-between rounded-xl bg-[var(--color-bg)]/60 px-4 py-3">
                <span className="text-sm font-medium text-[var(--color-muted)]">Status</span>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[detail.status].badge}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${STATUS_STYLE[detail.status].dot}`} />
                  {detail.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ['Game', detail.game],
                  ['Paket', detail.package],
                  ['User ID', detail.userId],
                  ['Nickname', detail.nickname],
                  ['Server', detail.server || '—'],
                  ['Pembayaran', detail.paymentMethod],
                  ['Kode Promo', detail.promoCode || '—'],
                  ['Diskon', detail.discount ? `${detail.discount}%` : '—'],
                  ['Harga Asli', formatRupiah(detail.originalPrice)],
                  ['Harga Akhir', formatRupiah(detail.finalPrice)],
                  ['Tanggal', new Date(detail.createdAt).toLocaleString('id-ID')],
                ].map(([label, val]) => (
                  <div key={label} className="rounded-xl bg-[var(--color-bg)]/40 px-3 py-2.5">
                    <p className="text-[11px] font-medium uppercase tracking-wider text-[var(--color-muted)]">{label}</p>
                    <p className="mt-0.5 font-medium text-[var(--color-text)]">{val}</p>
                  </div>
                ))}
              </div>
              {detail.status === 'PENDING' && (
                <div className="flex gap-3 pt-1">
                  <button onClick={() => { handleStatusChange(detail.id, 'SUCCESS'); setDetail(null); }} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-success)] py-2.5 text-sm font-semibold text-white hover:opacity-90">
                    <CheckCircle size={15} /> Setujui
                  </button>
                  <button onClick={() => { handleStatusChange(detail.id, 'FAILED'); setDetail(null); }} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-danger)] py-2.5 text-sm font-semibold text-white hover:opacity-90">
                    <XCircle size={15} /> Tolak
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
