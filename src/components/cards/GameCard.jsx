import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

export default function GameCard({ game, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3) }}
    >
      <Link
        to={`/games/${game.slug}`}
        className="group relative block overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] transition hover:-translate-y-1 hover:border-[var(--color-accent)]/60 hover:shadow-xl hover:shadow-[var(--color-primary)]/10"
      >
        <div className="relative aspect-square w-full overflow-hidden">
          <img
            src={game.image}
            alt={game.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-transparent to-transparent opacity-80" />
          {game.popular && (
            <span className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-[var(--color-bg)]/80 px-2 py-1 text-[10px] font-semibold text-[var(--color-accent)] backdrop-blur">
              <Flame size={10} /> Populer
            </span>
          )}
        </div>
        <div className="p-3">
          <h3 className="truncate font-[var(--font-display)] text-sm font-semibold text-[var(--color-text)]">
            {game.name}
          </h3>
          <p className="mt-0.5 truncate text-xs text-[var(--color-muted)]">{game.publisher}</p>
        </div>
      </Link>
    </motion.div>
  );
}
