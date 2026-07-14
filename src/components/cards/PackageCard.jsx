import { formatIDR } from '../../utils/format';
import { Gem, Coins, Ticket, Sparkles, Moon } from 'lucide-react';

function getCurrencyIcon(currency) {
  const norm = (currency || '').toLowerCase();

  // 1. Diamonds / Gems / Sapphires
  if (norm.includes('diamond') || norm.includes('gem') || norm.includes('sapphire')) {
    return <Gem size={16} className="text-cyan-400 animate-pulse animate-duration-1000" />;
  }

  // 2. Coupons / Tickets
  if (norm.includes('coupon') || norm.includes('ticket')) {
    return <Ticket size={16} className="text-amber-400 rotate-12" />;
  }

  // 3. Crystals / Shards / Lunite
  if (norm.includes('crystal') || norm.includes('shard') || norm.includes('lunite') || norm.includes('monochrome')) {
    if (norm.includes('lunite')) {
      return <Moon size={16} className="text-indigo-300 animate-pulse" />;
    }
    return <Sparkles size={16} className="text-violet-400 animate-pulse" />;
  }

  // 4. Gold / Coins / Tokens
  if (norm.includes('gold') || norm.includes('coin') || norm.includes('token')) {
    return <Coins size={16} className="text-yellow-500" />;
  }

  // 5. Short code currencies (UC, VP, CP)
  if (norm === 'uc' || norm === 'vp' || norm === 'cp') {
    const bgColors = {
      uc: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
      vp: 'bg-red-500/10 border-red-500/30 text-red-400',
      cp: 'bg-sky-500/10 border-sky-500/30 text-sky-400',
    };
    return (
      <span className={`flex h-6 min-w-[28px] items-center justify-center rounded px-1.5 text-[10px] font-black border tracking-wider ${bgColors[norm] || 'bg-gray-500/10 border-gray-500/30 text-gray-400'}`}>
        {currency.toUpperCase()}
      </span>
    );
  }

  // Fallback
  return <Coins size={16} className="text-[var(--color-accent)] animate-pulse" />;
}

export default function PackageCard({ pkg, selected, onSelect, game }) {
  const currencyIcon = getCurrencyIcon(game?.currency);

  return (
    <button
      type="button"
      onClick={() => onSelect(pkg)}
      className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition ${
        selected
          ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 shadow-md shadow-[var(--color-accent)]/10'
          : 'border-[var(--color-border)] bg-[var(--color-card)] hover:border-[var(--color-accent)]/40'
      }`}
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-[var(--color-text)]">{pkg.name}</p>
        <p className="mt-1 font-mono text-sm text-[var(--color-accent)]">{formatIDR(pkg.price)}</p>
      </div>
      <div className="shrink-0 flex items-center justify-center rounded-lg bg-[var(--color-accent)]/5 p-2 text-[var(--color-accent)]">
        {currencyIcon}
      </div>
    </button>
  );
}
