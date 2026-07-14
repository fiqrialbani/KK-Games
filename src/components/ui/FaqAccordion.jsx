import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FaqAccordion({ faqs }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-3">
      {faqs.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? -1 : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={isOpen}
            >
              <span className="text-sm font-semibold text-[var(--color-text)]">{item.q}</span>
              <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={18} className="text-[var(--color-muted)]" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-4 text-sm leading-relaxed text-[var(--color-muted)]">{item.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
