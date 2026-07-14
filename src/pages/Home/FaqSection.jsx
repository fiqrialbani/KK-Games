import Section from '../../components/ui/Section';
import FaqAccordion from '../../components/ui/FaqAccordion';
import { faqs } from '../../data/games';

export default function FaqSection() {
  return (
    <Section id="faq" eyebrow="Masih bingung?" title="Pertanyaan Umum" className="max-w-3xl">
      <FaqAccordion faqs={faqs} />
    </Section>
  );
}
