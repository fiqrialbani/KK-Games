import { motion } from 'framer-motion';

export default function Banner({ game }) {
  return (
    <div className="relative h-56 w-full overflow-hidden sm:h-72">
      <img src={game.banner} alt="" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-[var(--color-bg)]/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto flex max-w-7xl items-end gap-4 px-4 pb-6 sm:px-6 lg:px-8">
          <motion.img
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            src={game.image}
            alt={game.name}
            className="h-20 w-20 shrink-0 rounded-xl border-2 border-[var(--color-bg)] object-cover shadow-lg sm:h-24 sm:w-24"
          />
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <h1 className="font-[var(--font-display)] text-xl font-bold text-[var(--color-text)] sm:text-2xl">
              {game.name}
            </h1>
            <p className="text-xs text-[var(--color-muted)] sm:text-sm">{game.publisher} · {game.currency}</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
