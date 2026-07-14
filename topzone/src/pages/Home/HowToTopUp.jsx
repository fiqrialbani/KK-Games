import { motion } from 'framer-motion';
import { Gamepad2, Package, CreditCard, CheckCircle2 } from 'lucide-react';
import Section from '../../components/ui/Section';

const steps = [
  { icon: Gamepad2, title: 'Pilih Game', desc: 'Cari dan pilih game yang ingin di-top up.' },
  { icon: Package, title: 'Pilih Paket', desc: 'Masukkan ID akun dan pilih nominal item.' },
  { icon: CreditCard, title: 'Bayar', desc: 'Pilih metode pembayaran favoritmu.' },
  { icon: CheckCircle2, title: 'Selesai', desc: 'Item masuk otomatis ke akun game-mu.' },
];

export default function HowToTopUp() {
  return (
    <Section id="how-to" eyebrow="Simpel" title="Cara Top Up" subtitle="Empat langkah, tanpa ribet.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.08 }}
            className="relative rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5"
          >
            <span className="font-mono text-xs text-[var(--color-muted)]">0{i + 1}</span>
            <div className="mt-3 grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-secondary)]/20 text-[var(--color-accent)]">
              <step.icon size={20} />
            </div>
            <h3 className="mt-4 font-[var(--font-display)] text-sm font-semibold text-[var(--color-text)]">
              {step.title}
            </h3>
            <p className="mt-1 text-xs text-[var(--color-muted)]">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
