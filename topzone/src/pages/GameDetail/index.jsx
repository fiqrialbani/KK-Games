import { useParams, Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';
import Banner from './Banner';
import TopUpForm from './TopUpForm';
import { useData } from '../../context/DataContext';

export default function GameDetail() {
  const { slug } = useParams();
  const { games, packages } = useData();
  const game = games.find((g) => g.slug === slug);

  if (!game) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <AlertTriangle size={40} className="text-[var(--color-warning)]" />
        <h1 className="mt-4 font-[var(--font-display)] text-xl font-bold text-[var(--color-text)]">
          Game tidak ditemukan
        </h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Game yang kamu cari mungkin sudah tidak tersedia.
        </p>
        <Link to="/games" className="mt-6 rounded-lg bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white">
          Lihat Semua Game
        </Link>
      </div>
    );
  }

  // Filter packages for this game
  const gamePackages = packages.filter((p) => p.gameId === game.id);


  return (
    <div className="pb-16">
      <Banner game={game} />
      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
        <p className="max-w-2xl text-sm text-[var(--color-muted)]">{game.description}</p>
        <div className="mt-8">
          <TopUpForm game={game} packages={gamePackages} />
        </div>
      </div>
    </div>
  );
}
