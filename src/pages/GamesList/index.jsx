import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import Section from '../../components/ui/Section';
import GameCard from '../../components/cards/GameCard';
import { categories } from '../../data/games';
import { useData } from '../../context/DataContext';

export default function GamesList() {
  const { games } = useData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered = useMemo(() => {
    return games.filter((g) => {
      const matchesQuery = g.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = activeCategory === 'all' || g.categoryId === activeCategory;
      const isActive = g.status?.toLowerCase() === 'active';
      return matchesQuery && matchesCategory && isActive;
    });
  }, [games, query, activeCategory]);


  function handleQueryChange(value) {
    setQuery(value);
    if (value) setSearchParams({ search: value });
    else setSearchParams({});
  }

  return (
    <Section eyebrow="Katalog Lengkap" title="Semua Game" subtitle={`${filtered.length} game tersedia`}>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-sm items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2.5">
          <Search size={16} className="text-[var(--color-muted)]" />
          <input
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder="Cari game..."
            className="w-full bg-transparent text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${
              activeCategory === 'all'
                ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                : 'border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-text)]'
            }`}
          >
            Semua
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${
                activeCategory === c.id
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                  : 'border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((game, i) => (
            <GameCard key={game.id} game={game} index={i} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[var(--color-border)] py-16 text-center">
          <p className="text-sm text-[var(--color-muted)]">Tidak ada game yang cocok dengan pencarianmu.</p>
        </div>
      )}
    </Section>
  );
}
