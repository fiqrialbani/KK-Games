import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Section from '../../components/ui/Section';
import GameCard from '../../components/cards/GameCard';
import { useData } from '../../context/DataContext';

export default function PopularGames() {
  const { games } = useData();
  const scrollRef = useRef(null);
  const popular = games.filter((g) => g.popular || g.status?.toLowerCase() === 'active');


  function scroll(dir) {
    scrollRef.current?.scrollBy({ left: dir * 260, behavior: 'smooth' });
  }

  return (
    <Section
      eyebrow="Trending"
      title="Game Populer"
      subtitle="Yang paling banyak di-top up minggu ini."
      action={
        <div className="hidden gap-2 sm:flex">
          <button
            onClick={() => scroll(-1)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            aria-label="Scroll kiri"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll(1)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
            aria-label="Scroll kanan"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      }
    >
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {popular.map((game, i) => (
          <div key={game.id} className="w-40 shrink-0 sm:w-48">
            <GameCard game={game} index={i} />
          </div>
        ))}
      </div>
    </Section>
  );
}
