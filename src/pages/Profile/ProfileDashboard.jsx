import { Link } from 'react-router-dom';
import { Calendar, User, Mail, Phone, Edit, ArrowRight, TrendingUp, CheckCircle, Clock, XCircle, Gamepad2 } from 'lucide-react';
import { useUserAuth } from '../../context/UserAuthContext';
import { useData } from '../../context/DataContext';
import { formatIDR, formatDate } from '../../utils/format';

export default function ProfileDashboard() {
  const { user } = useUserAuth();
  const { transactions } = useData();

  // Show all transactions (demo: all transactions belong to this account)
  const userTransactions = transactions || [];

  // Compute Statistics
  const totalTx = userTransactions.length;
  const successTx = userTransactions.filter(t => t.status === 'SUCCESS' || t.status === 'success');
  const totalSuccess = successTx.length;
  const totalSpend = successTx.reduce((sum, t) => sum + (t.finalPrice || 0), 0);

  // Game Terfavorit (Count max game)
  const gameCounts = {};
  successTx.forEach(t => {
    gameCounts[t.game] = (gameCounts[t.game] || 0) + 1;
  });
  let favoriteGame = '-';
  let maxCount = 0;
  Object.entries(gameCounts).forEach(([game, count]) => {
    if (count > maxCount) {
      maxCount = count;
      favoriteGame = game;
    }
  });

  const recentTx = userTransactions.slice(0, 5);

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  const stats = [
    { label: 'Total Transaksi', value: totalTx, icon: TrendingUp, color: 'text-[var(--color-accent)] bg-[var(--color-accent)]/10' },
    { label: 'Total Pembelian', value: totalSuccess, icon: CheckCircle, color: 'text-[var(--color-success)] bg-[var(--color-success)]/10' },
    { label: 'Total Pengeluaran', value: formatIDR(totalSpend), icon: TrendingUp, color: 'text-[var(--color-secondary)] bg-[var(--color-secondary)]/10' },
    { label: 'Game Terfavorit', value: favoriteGame, icon: Gamepad2, color: 'text-[var(--color-primary)] bg-[var(--color-primary)]/10' },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="font-[var(--font-display)] text-xl font-bold text-[var(--color-text)]">
          Dashboard Profile
        </h1>
        <p className="text-xs text-[var(--color-muted)]">
          Selamat datang kembali! Berikut ringkasan aktivitas akun kamu.
        </p>
      </div>

      {/* User Info Card & Statistics Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* User Card */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]/50 p-5 backdrop-blur-md flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] text-xl font-bold text-white shadow-lg overflow-hidden shrink-0">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  <span>{userInitial}</span>
                )}
              </div>
              <div>
                <h3 className="text-base font-bold text-[var(--color-text)]">{user?.name}</h3>
                <p className="font-mono text-xs text-[var(--color-accent)]">@{user?.username}</p>
              </div>
            </div>

            <dl className="space-y-2 border-t border-[var(--color-border)] pt-4 text-xs">
              <div className="flex justify-between py-1">
                <dt className="flex items-center gap-1.5 text-[var(--color-muted)]">
                  <Mail size={13} /> Email
                </dt>
                <dd className="font-medium text-[var(--color-text)] truncate max-w-[150px]">{user?.email}</dd>
              </div>
              <div className="flex justify-between py-1">
                <dt className="flex items-center gap-1.5 text-[var(--color-muted)]">
                  <Phone size={13} /> Telepon
                </dt>
                <dd className="font-medium text-[var(--color-text)]">{user?.phone || '-'}</dd>
              </div>
              <div className="flex justify-between py-1">
                <dt className="flex items-center gap-1.5 text-[var(--color-muted)]">
                  <Calendar size={13} /> Bergabung
                </dt>
                <dd className="font-medium text-[var(--color-text)]">{user?.joinedAt ? formatDate(new Date(user.joinedAt)).split(' pukul ')[0] : '-'}</dd>
              </div>
            </dl>
          </div>

          <Link
            to="/profile/edit"
            className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] py-2.5 text-xs font-semibold text-white shadow-md shadow-[var(--color-primary)]/10 hover:opacity-90 transition"
          >
            <Edit size={14} /> Edit Profil
          </Link>
        </div>

        {/* Statistics Cards Grid */}
        <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
          {stats.map((s, idx) => (
            <div key={idx} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]/50 p-5 backdrop-blur-md flex items-start gap-4">
              <div className={`rounded-xl p-3 shrink-0 ${s.color}`}>
                <s.icon size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-2xs font-semibold text-[var(--color-muted)] uppercase tracking-wide">{s.label}</p>
                <h4 className="mt-1 truncate text-lg font-bold text-[var(--color-text)] font-mono">{s.value}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]/30 p-5 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
          <h3 className="font-[var(--font-display)] text-sm font-bold text-[var(--color-text)]">
            Transaksi Terakhir
          </h3>
          <Link
            to="/profile/transactions"
            className="flex items-center gap-1 text-2xs font-bold text-[var(--color-accent)] hover:underline"
          >
            Lihat Semua <ArrowRight size={12} />
          </Link>
        </div>

        {recentTx.length === 0 ? (
          <div className="py-12 text-center text-xs text-[var(--color-muted)]">
            Belum ada riwayat transaksi.
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)] font-medium">
                  <th className="pb-3 pr-4">Invoice</th>
                  <th className="pb-3 pr-4">Game</th>
                  <th className="pb-3 pr-4">Nominal</th>
                  <th className="pb-3 pr-4">Harga</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]/40 font-medium text-[var(--color-text)]">
                {recentTx.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[var(--color-card)]/20 transition-colors">
                    <td className="py-3.5 pr-4 font-mono font-semibold text-[var(--color-accent)]">{tx.invoice}</td>
                    <td className="py-3.5 pr-4">{tx.game}</td>
                    <td className="py-3.5 pr-4 text-[var(--color-muted)]">{tx.package}</td>
                    <td className="py-3.5 pr-4 font-mono font-bold">{formatIDR(tx.finalPrice)}</td>
                    <td className="py-3.5 pr-4">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-2xs font-semibold ${
                        tx.status === 'SUCCESS' || tx.status === 'success'
                          ? 'bg-[var(--color-success)]/15 text-[var(--color-success)]'
                          : tx.status === 'PENDING' || tx.status === 'pending'
                          ? 'bg-[var(--color-warning)]/15 text-[var(--color-warning)]'
                          : 'bg-[var(--color-danger)]/15 text-[var(--color-danger)]'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-[var(--color-muted)]">
                      {formatDate(new Date(tx.createdAt)).split(' pukul ')[0]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
