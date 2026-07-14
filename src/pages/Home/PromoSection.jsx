import Section from '../../components/ui/Section';
import PromoCard from '../../components/cards/PromoCard';
import { useData } from '../../context/DataContext';

export default function PromoSection() {
  const { promotions } = useData();
  return (
    <Section id="promo" eyebrow="Hemat lebih banyak" title="Promo Aktif" subtitle="Pakai kode voucher saat checkout.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {promotions.map((promo, i) => (
          <PromoCard key={promo.id} promo={promo} index={i} />
        ))}
      </div>
    </Section>
  );
}
