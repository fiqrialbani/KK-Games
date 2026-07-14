import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Package, Receipt, TrendingUp, ArrowUpRight, Eye } from 'lucide-react';
import { games, packages, transactions } from '../../data/games';

const formatRupiah = (n) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

const STATUS_STYLE = {
  SUCCESS: 'bg-[var(--color-success)]/15 text-[var(--color-success)]',
  PENDING: 'bg-[var(--color-warning)]/15 text-[var(--color-warning)]',
  FAILED:  'bg-[var(--color-danger)]/15 text-[var(--color-danger)]',
};

// Build monthly revenue data for last 6 months
function buildMonthlyRevenue() {
  const now = new Date('2026-07-14');
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      label: d.toLocaleDateString('id-ID', { month: 'short' }),
      month: d.getMonth(),
      year: d.getFullYear(),
      revenue: 0,
    });
  }
  transactions
    .filter((t) => t.status === 'SUCCESS')
    .forEach((t) => {
      const d = new Date(t.createdAt);
      const entry = months.find((m) => m.month === d.getMonth() && m.year === d.getFullYear());
      if (entry) entry.revenue += t.finalPrice;
    });
  // Add simulated past months data
  const base = [420000, 810000, 650000, 970000, 560000];
  months.slice(0, 5).forEach((m, i) => { if (m.revenue === 0) m.revenue = base[i]; });
  return months;
}

// Top 5 games by success transactions
function buildTopGames() {
  const counts = {};
  transactions.filter((t) => t.status === 'SUCCESS').forEach((t) => {
    counts[t.game] = (counts[t.game] || 0) + 1;
  });
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, count]) => ({ name: name.split(':')[0].trim(), count }));
}

function AreaChart({ data }) {
  const max = Math.max(...data.map((d) => d.revenue), 1);
  const W = 500, H = 140, PAD = 10;
  const pts = data.map((d, i) => ({
    x: PAD + (i / (data.length - 1)) * (W - PAD * 2),
    y: H - PAD - (d.revenue / max) * (H - PAD * 2),
  }));
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const area = `${line} L${pts[pts.length - 1].x},${H - PAD} L${pts[0].x},${H - PAD} Z`;

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="none" style={{ height: 140 }}>
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#areaGrad)" />
        <path d={line} fill="none" stroke="#06B6D4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#06B6D4" stroke="#080F1E" strokeWidth="2" />
        ))}
      </svg>
      <div className="mt-2 flex justify-between px-2">
        {data.map((d) => (
          <span key={d.label} className="text-[10px] text-[var(--color-muted)]">{d.label}</span>
        ))}
      </div>
    </div>
  );
}

function BarChart({ data }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="flex items-end gap-3 h-[120px] px-2 pb-2">
      {data.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1">
          <span className="text-[10px] font-semibold text-[var(--color-accent)]">{d.count}</span>
          <div
            className="w-full rounded-t-md transition-all"
            style={{
              height: `${(d.count / max) * 80}px`,
              background: `linear-gradient(to top, var(--color-primary), var(--color-secondary))`,
              opacity: 0.8 + (i / data.length) * 0.2,
            }}
          />
          <span className="text-[9px] text-[var(--color-muted)] text-center leading-tight">{d.name}</span>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const allPackages = useMemo(() => Object.values(packages).flat(), []);
  const totalRevenue = useMemo(
    () => transactions.filter((t) => t.status === 'SUCCESS').reduce((s, t) => s + t.finalPrice, 0),
    []
  );
  const monthlyData = useMemo(buildMonthlyRevenue, []);
  const topGames = useMemo(buildTopGames, []);
  const recentTx = useMemo(() => [...transactions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5), []);

  const stats = [
    { label: 'Total Games', value: games.length, icon: Gamepad2, color: 'from-[var(--color-primary)] to-[var(--color-accent)]', sub: 'Judul terdaftar' },
    { label: 'Total Packages', value: allPackages.length, icon: Package, color: 'from-[var(--color-secondary)] to-[var(--color-primary)]', sub: 'Varian top-up' },
    { label: 'Total Transaksi', value: transactions.length, icon: Receipt, color: 'from-[var(--color-warning)] to-[#F97316]', sub: 'Semua status' },
    { label: 'Total Revenue', value: formatRupiah(totalRevenue), icon: TrendingUp, color: 'from-[var(--color-success)] to-[var(--color-accent)]', sub: 'Transaksi sukses' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-[var(--font-display)] text-2xl font-bold text-[var(--color-text)]">Dashboard Overview</h1>
        <p className="mt-0.5 text-sm text-[var(--color-muted)]">Ringkasan data platform KK Games hari ini</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color, sub }) => (
          <div key={label} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 transition-transform hover:-translate-y-0.5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">{label}</p>
                <p className="mt-2 font-[var(--font-display)] text-2xl font-bold text-[var(--color-text)]">{value}</p>
                <p className="mt-0.5 text-xs text-[var(--color-muted)]">{sub}</p>
              </div>
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
                <Icon size={20} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {/* Area Chart */}
        <div className="lg:col-span-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-[var(--color-text)]">Revenue Bulanan</h2>
              <p className="text-xs text-[var(--color-muted)]">6 bulan terakhir (transaksi sukses)</p>
            </div>
            <span className="flex items-center gap-1 text-xs text-[var(--color-success)]">
              <TrendingUp size={12} /> Trending up
            </span>
          </div>
          <AreaChart data={monthlyData} />
        </div>

        {/* Bar Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <div className="mb-4">
            <h2 className="font-semibold text-[var(--color-text)]">Top 5 Game</h2>
            <p className="text-xs text-[var(--color-muted)]">Berdasarkan transaksi sukses</p>
          </div>
          <BarChart data={topGames} />
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-[var(--color-text)]">Transaksi Terbaru</h2>
            <p className="text-xs text-[var(--color-muted)]">5 transaksi paling baru</p>
          </div>
          <Link
            to="/admin/transactions"
            className="flex items-center gap-1 text-xs font-medium text-[var(--color-accent)] hover:underline"
          >
            Lihat semua <ArrowUpRight size={12} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                {['Invoice', 'Game & Paket', 'User', 'Harga Akhir', 'Status', 'Aksi'].map((h) => (
                  <th key={h} className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {recentTx.map((tx) => (
                <tr key={tx.id} className="hover:bg-[var(--color-bg)]/40">
                  <td className="py-3 font-mono text-xs text-[var(--color-accent)]">{tx.invoice}</td>
                  <td className="py-3">
                    <p className="font-medium text-[var(--color-text)]">{tx.game}</p>
                    <p className="text-xs text-[var(--color-muted)]">{tx.package}</p>
                  </td>
                  <td className="py-3">
                    <p className="font-medium text-[var(--color-text)]">{tx.nickname}</p>
                    <p className="text-xs text-[var(--color-muted)]">ID: {tx.userId}</p>
                  </td>
                  <td className="py-3 font-semibold text-[var(--color-text)]">{formatRupiah(tx.finalPrice)}</td>
                  <td className="py-3">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_STYLE[tx.status]}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <Link to="/admin/transactions" className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-border)] px-2.5 py-1 text-xs text-[var(--color-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]">
                      <Eye size={12} /> Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
