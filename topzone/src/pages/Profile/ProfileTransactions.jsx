import { useState, useMemo } from 'react';
import { useUserAuth } from '../../context/UserAuthContext';
import { useData } from '../../context/DataContext';
import { Search, Eye, Filter } from 'lucide-react';
import InvoiceModal from '../../components/ui/InvoiceModal';
import { formatIDR, formatDate } from '../../utils/format';

export default function ProfileTransactions() {
  const { user } = useUserAuth();
  const { transactions, games } = useData();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [gameFilter, setGameFilter] = useState('');
  const [dateFilter, setDateFilter] = useState(''); // 'today', 'week', 'month', or ''
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTx, setSelectedTx] = useState(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  const itemsPerPage = 8;

  // Filter transactions for this specific user
  const userTransactions = useMemo(() => {
    // Show all stored transactions (demo: all belong to this account)
    const list = transactions || [];

    return list.filter(t => {
      // Search invoice or game name
      const matchSearch = t.invoice.toLowerCase().includes(search.toLowerCase()) ||
                          t.game.toLowerCase().includes(search.toLowerCase());

      // Status
      const matchStatus = statusFilter ? t.status === statusFilter : true;

      // Game
      const matchGame = gameFilter ? t.game === gameFilter : true;

      // Date Range
      let matchDate = true;
      if (dateFilter) {
        const tDate = new Date(t.createdAt);
        const now = new Date();
        if (dateFilter === 'today') {
          matchDate = tDate.toDateString() === now.toDateString();
        } else if (dateFilter === 'week') {
          const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchDate = tDate >= oneWeekAgo;
        } else if (dateFilter === 'month') {
          const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
          matchDate = tDate >= oneMonthAgo;
        }
      }

      return matchSearch && matchStatus && matchGame && matchDate;
    });
  }, [transactions, search, statusFilter, gameFilter, dateFilter]);

  // Unique game list for filtering dropdown
  const gamesList = useMemo(() => {
    const names = new Set();
    (transactions || []).forEach(t => names.add(t.game));
    return Array.from(names);
  }, [transactions]);

  // Pagination
  const totalPages = Math.ceil(userTransactions.length / itemsPerPage);
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return userTransactions.slice(start, start + itemsPerPage);
  }, [userTransactions, currentPage]);

  const handleOpenInvoice = (tx) => {
    setSelectedTx(tx);
    setIsInvoiceOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="font-[var(--font-display)] text-xl font-bold text-[var(--color-text)]">
          Riwayat Transaksi
        </h1>
        <p className="text-xs text-[var(--color-muted)]">
          Lihat seluruh riwayat pembelian item game kamu.
        </p>
      </div>

      {/* Filters Area */}
      <div className="grid gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]/30 p-4 backdrop-blur-md sm:grid-cols-2 lg:grid-cols-5">
        {/* Search */}
        <div className="relative lg:col-span-2">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
          <input
            type="text"
            placeholder="Cari Invoice / Game..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] py-2 pl-9 pr-4 text-xs text-[var(--color-text)] placeholder-[var(--color-muted)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
          />
        </div>

        {/* Game Filter */}
        <div>
          <select
            value={gameFilter}
            onChange={(e) => { setGameFilter(e.target.value); setCurrentPage(1); }}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] py-2 px-3 text-xs text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
          >
            <option value="">Semua Game</option>
            {gamesList.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] py-2 px-3 text-xs text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
          >
            <option value="">Semua Status</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="PENDING">PENDING</option>
            <option value="FAILED">FAILED</option>
          </select>
        </div>

        {/* Date Filter */}
        <div>
          <select
            value={dateFilter}
            onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] py-2 px-3 text-xs text-[var(--color-text)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
          >
            <option value="">Semua Waktu</option>
            <option value="today">Hari Ini</option>
            <option value="week">7 Hari Terakhir</option>
            <option value="month">30 Hari Terakhir</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]/20 p-5 backdrop-blur-md">
        {paginatedTransactions.length === 0 ? (
          <div className="py-16 text-center text-xs text-[var(--color-muted)]">
            Tidak ada transaksi ditemukan.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)] font-medium">
                    <th className="pb-3 pr-4">Invoice</th>
                    <th className="pb-3 pr-4">Game</th>
                    <th className="pb-3 pr-4">User & Server ID</th>
                    <th className="pb-3 pr-4">Paket</th>
                    <th className="pb-3 pr-4">Pembayaran</th>
                    <th className="pb-3 pr-4">Total</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 pr-4">Tanggal</th>
                    <th className="pb-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]/40 font-medium text-[var(--color-text)]">
                  {paginatedTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[var(--color-card)]/10 transition-colors">
                      <td className="py-3.5 pr-4 font-mono font-semibold text-[var(--color-accent)]">{tx.invoice}</td>
                      <td className="py-3.5 pr-4">{tx.game}</td>
                      <td className="py-3.5 pr-4 font-mono text-[var(--color-muted)]">
                        {tx.userId} {tx.serverId ? `(${tx.serverId})` : ''}
                      </td>
                      <td className="py-3.5 pr-4">{tx.package}</td>
                      <td className="py-3.5 pr-4 text-[var(--color-muted)]">{tx.paymentMethod}</td>
                      <td className="py-3.5 pr-4 font-mono font-bold">{formatIDR(tx.finalPrice)}</td>
                      <td className="py-3.5 pr-4 font-semibold">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-2xs ${
                          tx.status === 'SUCCESS' || tx.status === 'success'
                            ? 'bg-[var(--color-success)]/15 text-[var(--color-success)]'
                            : tx.status === 'PENDING' || tx.status === 'pending'
                            ? 'bg-[var(--color-warning)]/15 text-[var(--color-warning)]'
                            : 'bg-[var(--color-danger)]/15 text-[var(--color-danger)]'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4 text-[var(--color-muted)]">
                        {formatDate(new Date(tx.createdAt)).split(' pukul ')[0]}
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => handleOpenInvoice(tx)}
                          className="rounded-lg border border-[var(--color-border)] p-1.5 text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 hover:border-[var(--color-accent)]/40 transition-all"
                        >
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center pt-4 border-t border-[var(--color-border)]/40 text-xs">
                <span className="text-[var(--color-muted)]">
                  Menampilkan {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, userTransactions.length)} dari {userTransactions.length} transaksi
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 hover:bg-[var(--color-card)] disabled:opacity-30 disabled:hover:bg-transparent transition text-2xs"
                  >
                    Sebelumnya
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 hover:bg-[var(--color-card)] disabled:opacity-30 disabled:hover:bg-transparent transition text-2xs"
                  >
                    Berikutnya
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <InvoiceModal
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        transaction={selectedTx}
      />
    </div>
  );
}
