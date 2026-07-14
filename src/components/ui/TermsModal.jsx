import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText } from 'lucide-react';

export default function TermsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl rounded-2xl border border-[var(--color-border)] bg-[#0D1B2E] p-6 shadow-2xl flex flex-col max-h-[85vh]"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-[var(--color-muted)] hover:text-[var(--color-text)] transition rounded-lg p-1 hover:bg-[var(--color-card)]/50"
            aria-label="Tutup"
          >
            <X size={18} />
          </button>

          <div className="mb-4 flex items-center gap-2.5">
            <div className="rounded-lg bg-[var(--color-primary)]/10 p-2 text-[var(--color-accent)]">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="font-[var(--font-display)] text-xl font-bold text-[var(--color-text)]">
                Syarat & <span className="text-gradient">Ketentuan</span>
              </h3>
              <p className="text-xs text-[var(--color-muted)] mt-0.5">Terakhir diperbarui: Juli 2026</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-sm text-[var(--color-muted)] leading-relaxed custom-scrollbar">
            <section>
              <h4 className="font-semibold text-[var(--color-text)] mb-1">1. Pendahuluan</h4>
              <p>
                Selamat datang di KK Games. Dengan mengakses, melakukan pendaftaran akun, atau menggunakan layanan top-up game kami, Anda dianggap telah membaca, memahami, dan menyetujui seluruh isi Syarat & Ketentuan ini.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-[var(--color-text)] mb-1">2. Ketentuan Akun & Pengguna</h4>
              <p>
                Pengguna bertanggung jawab penuh atas kerahasiaan informasi akun masing-masing, termasuk password. Setiap aktivitas yang terjadi di bawah akun terdaftar merupakan tanggung jawab pemilik akun yang bersangkutan.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-[var(--color-text)] mb-1">3. Transaksi & Pembayaran</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Semua pembelian/top-up bersifat final. KK Games tidak menerima pengembalian dana (refund) atas kesalahan penginputan data game ID oleh pengguna.</li>
                <li>Pengguna wajib melakukan transfer pembayaran sesuai dengan nominal unik dan instruksi yang tertera di sistem.</li>
                <li>Metode pembayaran resmi yang tersedia meliputi QRIS, Dompet Digital (DANA, OVO, GoPay, ShopeePay), dan Transfer Bank resmi.</li>
              </ul>
            </section>

            <section>
              <h4 className="font-semibold text-[var(--color-text)] mb-1">4. Kebijakan Privasi</h4>
              <p>
                KK Games berkomitmen menjaga kerahasiaan data pribadi pengguna. Informasi kontak dan detail transaksi hanya digunakan untuk kepentingan verifikasi status pembayaran dan pengiriman pesanan game Anda.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-[var(--color-text)] mb-1">5. Perubahan Layanan & Harga</h4>
              <p>
                Harga produk top-up game sewaktu-waktu dapat berubah mengikuti kebijakan provider game. KK Games berhak memperbarui harga tanpa pemberitahuan tertulis terlebih dahulu.
              </p>
            </section>

            <section>
              <h4 className="font-semibold text-[var(--color-text)] mb-1">6. Batasan Tanggung Jawab</h4>
              <p>
                KK Games tidak bertanggung jawab atas kerugian atau penangguhan akun game pengguna yang disebabkan oleh tindakan pihak ketiga atau developer game setelah transaksi berhasil diproses oleh sistem kami.
              </p>
            </section>
          </div>

          <div className="mt-6 border-t border-[var(--color-border)]/50 pt-4 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-5 py-2.5 text-xs font-semibold text-white shadow-lg hover:opacity-90 transition duration-300"
            >
              Saya Mengerti & Setuju
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
