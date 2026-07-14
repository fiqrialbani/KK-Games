import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Mail, Phone } from 'lucide-react';

const Instagram = ({ size = 20, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function ContactModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const contacts = [
    {
      name: 'Instagram',
      value: '@auravora_',
      description: 'Ikuti kami untuk info promo terbaru',
      icon: Instagram,
      link: 'https://www.instagram.com/auravora_?igsh=MW14dXU5c29mcmFhbA==',
      color: 'hover:border-pink-500 hover:text-pink-500 hover:bg-pink-500/5',
      iconColor: 'text-pink-500',
    },
    {
      name: 'WhatsApp Customer Service',
      value: '+62 812-3456-7890',
      description: 'Layanan pelanggan 24/7 respon cepat',
      icon: MessageCircle,
      link: 'https://wa.me/6281234567890',
      color: 'hover:border-green-500 hover:text-green-500 hover:bg-green-500/5',
      iconColor: 'text-green-500',
    },
    {
      name: 'Email Support',
      value: 'support@kkgames.com',
      description: 'Hubungi kami untuk kerja sama atau kendala transaksi',
      icon: Mail,
      link: 'mailto:support@kkgames.com',
      color: 'hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent)]/5',
      iconColor: 'text-[var(--color-accent)]',
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[#0D1B2E] p-6 shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-[var(--color-muted)] hover:text-[var(--color-text)] transition rounded-lg p-1 hover:bg-[var(--color-card)]/50"
            aria-label="Tutup"
          >
            <X size={18} />
          </button>

          <div className="mb-6">
            <h3 className="font-[var(--font-display)] text-xl font-bold text-[var(--color-text)]">
              Hubungi <span className="text-gradient">Kami</span>
            </h3>
            <p className="mt-1.5 text-xs text-[var(--color-muted)]">
              Punya pertanyaan atau kendala? Pilih salah satu saluran komunikasi kami di bawah ini. Tim kami siap membantu!
            </p>
          </div>

          <div className="space-y-3">
            {contacts.map((contact, idx) => {
              const Icon = contact.icon;
              return (
                <a
                  key={idx}
                  href={contact.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-start gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]/30 p-4 transition-all duration-300 ${contact.color}`}
                >
                  <div className={`mt-0.5 rounded-lg bg-[var(--color-bg)] p-2.5 ${contact.iconColor}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-[var(--color-text)]">{contact.name}</h4>
                    <p className="text-xs font-mono mt-0.5 opacity-90">{contact.value}</p>
                    <p className="text-[11px] text-[var(--color-muted)] mt-1">{contact.description}</p>
                  </div>
                </a>
              );
            })}
          </div>

          <div className="mt-6 border-t border-[var(--color-border)]/50 pt-4 text-center text-[10px] text-[var(--color-muted)]">
            Senin - Minggu: 24 Jam Nonstop
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
