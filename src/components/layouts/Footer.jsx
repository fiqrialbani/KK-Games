import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, MessageCircle, Play } from 'lucide-react';
import ContactModal from '../ui/ContactModal';
import TermsModal from '../ui/TermsModal';

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

export default function Footer() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);

  return (
    <>
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-card)]/40">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Link to="/" className="flex items-center gap-2 font-[var(--font-display)]">
                <img src="/kkgames.png" alt="KK Games Logo" className="h-8 w-8 object-contain rounded-lg" />
                <span className="text-lg font-bold text-[var(--color-text)]">
                  KK<span className="text-gradient">Games</span>
                </span>
              </Link>
              <p className="mt-3 max-w-xs text-sm text-[var(--color-muted)]">
                Kami tahu setiap game punya cerita yang berbeda. Makanya kami hadir buat nemenin semua kebutuhan top up-mu, supaya kamu bisa terus menikmati setiap momen bermain tanpa ribet.
              </p>
              <div className="mt-4 flex gap-3">
                {[
                  { Icon: Instagram, href: 'https://www.instagram.com/auravora_?igsh=MW14dXU5c29mcmFhbA==', target: '_blank', rel: 'noopener noreferrer' },
                  { Icon: MessageCircle, href: 'https://wa.me/6281234567890', target: '_blank', rel: 'noopener noreferrer' },
                  { Icon: Play, href: '#' },
                ].map(({ Icon, href, target, rel }, i) => (
                  <a
                    key={i}
                    href={href}
                    target={target}
                    rel={rel}
                    className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--color-border)] text-[var(--color-muted)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-[var(--font-display)] text-sm font-semibold uppercase tracking-wider text-[var(--color-text)]">
                Produk
              </h4>
              <ul className="mt-4 space-y-2 text-sm text-[var(--color-muted)]">
                <li><Link to="/games" className="hover:text-[var(--color-text)]">Semua Game</Link></li>
                <li><Link to="/#promo" className="hover:text-[var(--color-text)]">Promo</Link></li>
                <li><Link to="/#how-to" className="hover:text-[var(--color-text)]">Cara Top Up</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-[var(--font-display)] text-sm font-semibold uppercase tracking-wider text-[var(--color-text)]">
                Bantuan
              </h4>
              <ul className="mt-4 space-y-2 text-sm text-[var(--color-muted)]">
                <li><Link to="/#faq" className="hover:text-[var(--color-text)]">FAQ</Link></li>
                <li>
                  <button
                    onClick={() => setIsContactOpen(true)}
                    className="hover:text-[var(--color-text)] cursor-pointer text-left transition"
                  >
                    Hubungi Kami
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsTermsOpen(true)}
                    className="hover:text-[var(--color-text)] cursor-pointer text-left transition"
                  >
                    Syarat &amp; Ketentuan
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-[var(--font-display)] text-sm font-semibold uppercase tracking-wider text-[var(--color-text)]">
                Pembayaran
              </h4>
              <p className="mt-4 text-sm text-[var(--color-muted)]">
                DANA · OVO · GoPay · ShopeePay · QRIS · Bank BCA · Bank Mandiri
              </p>
            </div>
          </div>

          <div className="mt-10 border-t border-[var(--color-border)] pt-6 text-center text-xs text-[var(--color-muted)]">
            © {new Date().getFullYear()} KKGames.
          </div>
        </div>
      </footer>
      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <TermsModal isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />
    </>
  );
}
