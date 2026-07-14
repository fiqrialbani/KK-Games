import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Ya, Lanjutkan', cancelText = 'Batal' }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-sm rounded-2xl border border-[var(--color-border)] bg-[#0D1B2E] p-6 shadow-2xl"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-[var(--color-muted)] hover:text-[var(--color-text)] transition"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-3 text-[var(--color-warning)]">
            <AlertTriangle size={24} />
            <h3 className="font-[var(--font-display)] text-lg font-bold text-[var(--color-text)]">
              {title}
            </h3>
          </div>

          <p className="mt-3 text-sm text-[var(--color-muted)] leading-relaxed">
            {message}
          </p>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="rounded-xl border border-[var(--color-border)] bg-transparent px-4 py-2 text-xs font-semibold text-[var(--color-text)] transition hover:bg-[var(--color-card)]"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-4 py-2 text-xs font-semibold text-white shadow-lg hover:opacity-90 transition"
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
