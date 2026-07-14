import { useState } from 'react';
import { Link } from 'react-router-dom';
import Section from '../../components/ui/Section';
import GameCard from '../../components/cards/GameCard';
import { categories } from '../../data/games';
import { useData } from '../../context/DataContext';

export default function AllGames() {
  const { games } = useData();
  const [activeCategory, setActiveCategory] = useState('all');

  const filtered =
    activeCategory === 'all'
      ? games.filter((g) => g.status?.toLowerCase() === 'active')
      : games.filter((g) => g.categoryId === activeCategory && g.status?.toLowerCase() === 'active');


  return (
    <Section
      id="all-games"
      eyebrow="Katalog"
      title="Semua Game"
      subtitle="Pilih game, kami siapkan paketnya."
      action={
        <Link
          to="/games"
          className="text-sm font-semibold text-[var(--color-accent)] hover:underline"
        >
          Lihat semua →
        </Link>
      }
    >
      <div className="mb-6 flex flex-wrap gap-2">
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

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {filtered.slice(0, 10).map((game, i) => (
          <GameCard key={game.id} game={game} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="py-10 text-center text-sm text-[var(--color-muted)]">
          Belum ada game di kategori ini.
        </p>
      )}
    </Section>
  );
}
