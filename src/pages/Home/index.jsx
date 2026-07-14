import Hero from './Hero';
import PopularGames from './PopularGames';
import AllGames from './AllGames';
import PromoSection from './PromoSection';
import HowToTopUp from './HowToTopUp';
import FaqSection from './FaqSection';

export default function Home() {
  return (
    <div>
      <Hero />
      <PopularGames />
      <AllGames />
      <PromoSection />
      <HowToTopUp />
      <FaqSection />
    </div>
  );
}
