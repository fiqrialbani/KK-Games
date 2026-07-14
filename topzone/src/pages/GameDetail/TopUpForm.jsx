import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2, Sparkles, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PackageCard from '../../components/cards/PackageCard';
import PaymentCard from '../../components/cards/PaymentCard';
import { formatIDR, generateInvoiceNumber } from '../../utils/format';
import { useOrder } from '../../context/OrderContext';
import { useData } from '../../context/DataContext';
import { useUserAuth } from '../../context/UserAuthContext';



const DUMMY_NICKNAMES = ['ShadowStriker', 'NovaHunter', 'PixelRonin', 'BlazeQueen', 'IronFalcon'];

function buildSchema(game) {
  const isRegionGame = ['genshin-impact', 'zenless-zone-zero', 'wuthering-waves', 'dragon-raja-re-rise', 'honkai-star-rail', 'the-legend-of-neverland'].includes(game.slug);

  return z.object({
    userId: z
      .string()
      .min(5, 'User ID minimal 5 digit')
      .max(12, 'User ID maksimal 12 digit')
      .regex(/^\d+$/, 'User ID hanya boleh angka'),
    serverId: isRegionGame
      ? z.string({ required_error: 'Pilih salah satu Region' }).min(1, 'Region harus dipilih')
      : game.serverRequired
        ? z.string().min(3, 'Server ID minimal 3 digit').regex(/^\d+$/, 'Server ID hanya boleh angka')
        : z.string().optional(),
    packageId: z.number({ required_error: 'Pilih salah satu paket' }),
    paymentId: z.number({ required_error: 'Pilih metode pembayaran' }),
    voucher: z.string().optional(),
  });
}

export default function TopUpForm({ game, packages }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { setLastOrder } = useOrder();
  const { paymentMethods, promotions, addTransaction, addNotification } = useData();
  const { isAuthenticated } = useUserAuth();
  const [nickname, setNickname] = useState('');
  const [checkingNickname, setCheckingNickname] = useState(false);
  const [voucherStatus, setVoucherStatus] = useState(null); // { valid, discount }
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingOrderData, setPendingOrderData] = useState(null);


  // Filter payment methods that are active
  const activePayments = useMemo(() => paymentMethods.filter(p => p.status === 'ACTIVE' || p.status === 'active'), [paymentMethods]);


  const schema = useMemo(() => buildSchema(game), [game]);
  const maxPrice = Math.max(...packages.map((p) => p.price));

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { userId: '', serverId: '', voucher: '' },
  });

  const userId = watch('userId');
  const serverId = watch('serverId');
  const packageId = watch('packageId');
  const paymentId = watch('paymentId');
  const voucher = watch('voucher');

  // Simulasi lookup nickname dari User ID (+ Server ID jika diperlukan)
  useEffect(() => {
    const idReady = userId && userId.length >= 5 && /^\d+$/.test(userId);
    const isRegionGame = ['genshin-impact', 'zenless-zone-zero', 'wuthering-waves', 'dragon-raja-re-rise', 'honkai-star-rail', 'the-legend-of-neverland'].includes(game.slug);
    const serverReady = !game.serverRequired || (isRegionGame ? !!serverId : (serverId && serverId.length >= 3));

    if (idReady && serverReady) {
      setCheckingNickname(true);
      const timeout = setTimeout(() => {
        const idx = Number(userId.slice(-1)) % DUMMY_NICKNAMES.length;
        setNickname(DUMMY_NICKNAMES[idx]);
        setCheckingNickname(false);
      }, 500);
      return () => clearTimeout(timeout);
    } else {
      setNickname('');
    }
  }, [userId, serverId, game.serverRequired, game.slug]);

  function applyVoucher() {
    const code = (voucher || '').trim().toUpperCase();
    if (!code) return;
    const found = promotions.find((p) => p.code === code && p.status === 'active');
    if (found) {
      setVoucherStatus({ valid: true, discount: found.discount, title: found.title });
      toast.success(`Voucher "${found.title}" berhasil dipakai`);
    } else {
      setVoucherStatus({ valid: false });
      toast.error('Kode voucher tidak valid atau sudah berakhir');
    }
  }

  const selectedPackage = packages.find((p) => p.id === packageId);
  const selectedPayment = paymentMethods.find((p) => p.id === paymentId);
  const subtotal = selectedPackage?.price || 0;
  const discountAmount = voucherStatus?.valid ? Math.round((subtotal * voucherStatus.discount) / 100) : 0;
  const total = subtotal - discountAmount;

  function onSubmit(data) {
    if (!isAuthenticated) {
      toast.error('Kamu harus login terlebih dahulu untuk melakukan top up!');
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    if (!nickname) {
      toast.error('Nickname belum terverifikasi. Cek kembali User ID kamu.');
      return;
    }
    setPendingOrderData(data);
    setShowPaymentModal(true);
  }

  function confirmPayment() {
    if (!pendingOrderData) return;

    const order = {
      id: Date.now(),
      invoice: generateInvoiceNumber(),
      createdAt: new Date().toISOString(),
      game: game.name,
      gameId: game.id,
      gameImage: game.image,
      package: selectedPackage?.name || '',
      packageId: selectedPackage?.id || 0,
      paymentMethod: selectedPayment?.name || '',
      paymentMethodId: selectedPayment?.id || 0,
      userId: pendingOrderData.userId,
      serverId: pendingOrderData.serverId || null,
      nickname,
      promoCode: voucherStatus?.valid ? pendingOrderData.voucher.toUpperCase() : null,
      discount: discountAmount,
      originalPrice: subtotal,
      finalPrice: total,
      status: 'SUCCESS',
    };

    // Save to OrderContext for checkout receipt
    setLastOrder(order);

    // Add to DataContext (updates transactions state + syncs localStorage)
    addTransaction(order);

    // Add success notification via DataContext
    addNotification(
      'Top Up Berhasil',
      `Transaksi top up ${game.name} ${selectedPackage?.name} berhasil diproses!`,
      'transaction_success'
    );

    toast.success('Top up berhasil diproses!');
    setShowPaymentModal(false);
    navigate('/checkout');
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        {/* Account info */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <h2 className="font-[var(--font-display)] text-sm font-semibold text-[var(--color-text)]">
            1. Masukkan Data Akun
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[var(--color-muted)]">
                {game.idLabel}
              </label>
              <input
                {...register('userId')}
                inputMode="numeric"
                placeholder="Contoh: 123456789"
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)]/60 focus:border-[var(--color-accent)] focus:outline-none"
              />
              {errors.userId && <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.userId.message}</p>}
            </div>

            {game.serverRequired && (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-[var(--color-muted)]">
                  {['genshin-impact', 'zenless-zone-zero', 'wuthering-waves', 'dragon-raja-re-rise', 'honkai-star-rail', 'the-legend-of-neverland'].includes(game.slug) ? 'Region' : 'Server ID'}
                </label>
                {['genshin-impact', 'zenless-zone-zero', 'wuthering-waves', 'dragon-raja-re-rise', 'honkai-star-rail', 'the-legend-of-neverland'].includes(game.slug) ? (
                  <select
                    {...register('serverId')}
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-text)] focus:border-[var(--color-accent)] focus:outline-none"
                  >
                    <option value="">-- Pilih Region --</option>
                    <option value="Asia">Asia</option>
                    <option value="America">America</option>
                    <option value="Eropa">Eropa</option>
                    <option value="Hongkong/Taiwan/JP/KR">Hongkong/Taiwan/JP/KR</option>
                  </select>
                ) : (
                  <input
                    {...register('serverId')}
                    inputMode="numeric"
                    placeholder="Contoh: 2001"
                    className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)]/60 focus:border-[var(--color-accent)] focus:outline-none"
                  />
                )}
                {errors.serverId && <p className="mt-1 text-xs text-[var(--color-danger)]">{errors.serverId.message}</p>}
              </div>
            )}
          </div>

          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-medium text-[var(--color-muted)]">Nickname</label>
            <div className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5">
              <User size={16} className="text-[var(--color-muted)]" />
              {checkingNickname ? (
                <span className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
                  <Loader2 size={14} className="animate-spin" /> Memeriksa akun...
                </span>
              ) : (
                <span className={`text-sm ${nickname ? 'font-semibold text-[var(--color-accent)]' : 'text-[var(--color-muted)]'}`}>
                  {nickname || 'Isi ID di atas untuk memuat nickname'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Package selection */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <h2 className="font-[var(--font-display)] text-sm font-semibold text-[var(--color-text)]">
            2. Pilih Nominal
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                maxPrice={maxPrice}
                selected={packageId === pkg.id}
                onSelect={(p) => setValue('packageId', p.id, { shouldValidate: true })}
                game={game}
              />
            ))}
          </div>
          {errors.packageId && <p className="mt-2 text-xs text-[var(--color-danger)]">{errors.packageId.message}</p>}
        </div>

        {/* Payment selection */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <h2 className="font-[var(--font-display)] text-sm font-semibold text-[var(--color-text)]">
            3. Metode Pembayaran
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {activePayments.map((method) => (
              <PaymentCard
                key={method.id}
                method={method}
                selected={paymentId === method.id}
                onSelect={(m) => setValue('paymentId', m.id, { shouldValidate: true })}
              />
            ))}
          </div>
          {errors.paymentId && <p className="mt-2 text-xs text-[var(--color-danger)]">{errors.paymentId.message}</p>}
        </div>

        {/* Voucher */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <h2 className="font-[var(--font-display)] text-sm font-semibold text-[var(--color-text)]">
            4. Voucher Promo <span className="font-normal text-[var(--color-muted)]">(opsional)</span>
          </h2>
          <div className="mt-4 flex gap-2">
            <input
              {...register('voucher')}
              placeholder="Masukkan kode voucher"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2.5 text-sm uppercase text-[var(--color-text)] placeholder:normal-case placeholder:text-[var(--color-muted)]/60 focus:border-[var(--color-accent)] focus:outline-none"
            />
            <button
              type="button"
              onClick={applyVoucher}
              className="shrink-0 rounded-lg border border-[var(--color-accent)]/50 px-4 text-sm font-semibold text-[var(--color-accent)] transition hover:bg-[var(--color-accent)]/10"
            >
              Pakai
            </button>
          </div>
          {voucherStatus?.valid === false && (
            <p className="mt-2 text-xs text-[var(--color-danger)]">Kode voucher tidak ditemukan / tidak berlaku.</p>
          )}
          {voucherStatus?.valid && (
            <p className="mt-2 flex items-center gap-1 text-xs text-[var(--color-success)]">
              <Sparkles size={12} /> {voucherStatus.title} diterapkan (-{voucherStatus.discount}%)
            </p>
          )}
        </div>
      </div>

      {/* Order summary */}
      <aside className="h-fit rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 lg:sticky lg:top-24">
        <h2 className="font-[var(--font-display)] text-sm font-semibold text-[var(--color-text)]">
          Ringkasan Pesanan
        </h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-[var(--color-muted)]">Game</dt>
            <dd className="font-medium text-[var(--color-text)]">{game.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[var(--color-muted)]">Item</dt>
            <dd className="font-medium text-[var(--color-text)]">{selectedPackage ? selectedPackage.name : '-'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[var(--color-muted)]">Pembayaran</dt>
            <dd className="font-medium text-[var(--color-text)]">{selectedPayment ? selectedPayment.name : '-'}</dd>
          </div>
          <div className="border-t border-[var(--color-border)] pt-3">
            <div className="flex justify-between">
              <dt className="text-[var(--color-muted)]">Subtotal</dt>
              <dd className="font-mono text-[var(--color-text)]">{formatIDR(subtotal)}</dd>
            </div>
            {discountAmount > 0 && (
              <div className="mt-1 flex justify-between">
                <dt className="text-[var(--color-muted)]">Diskon</dt>
                <dd className="font-mono text-[var(--color-success)]">-{formatIDR(discountAmount)}</dd>
              </div>
            )}
          </div>
          <div className="flex justify-between border-t border-[var(--color-border)] pt-3 text-base">
            <dt className="font-semibold text-[var(--color-text)]">Total</dt>
            <dd className="font-mono font-bold text-[var(--color-accent)]">{formatIDR(total)}</dd>
          </div>
        </dl>

        <button
          type="submit"
          disabled={isSubmitting || !selectedPackage || !selectedPayment}
          className="mt-5 w-full rounded-lg bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--color-primary)]/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSubmitting ? 'Memproses...' : 'Top Up Sekarang'}
        </button>
        <p className="mt-3 text-center text-[10px] text-[var(--color-muted)]">
          Ini adalah simulasi. Tidak ada transaksi nyata yang terjadi.
        </p>
      </aside>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[#0d1527] p-6 shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setShowPaymentModal(false)}
                className="absolute right-4 top-4 text-[var(--color-muted)] hover:text-[var(--color-text)] transition cursor-pointer"
              >
                <X size={18} />
              </button>

              <h3 className="font-[var(--font-display)] text-lg font-bold text-[var(--color-text)] border-b border-[var(--color-border)]/50 pb-3">
                Konfirmasi Pembayaran
              </h3>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--color-muted)]">Game</span>
                  <span className="font-semibold text-[var(--color-text)]">{game.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-muted)]">Item</span>
                  <span className="font-semibold text-[var(--color-text)]">{selectedPackage?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-muted)]">User ID</span>
                  <span className="font-semibold text-[var(--color-accent)]">{pendingOrderData?.userId}</span>
                </div>
                {game.serverRequired && pendingOrderData?.serverId && (
                  <div className="flex justify-between">
                    <span className="text-[var(--color-muted)]">Server / Region</span>
                    <span className="font-semibold text-[var(--color-text)]">{pendingOrderData.serverId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[var(--color-muted)]">Nickname</span>
                  <span className="font-semibold text-[var(--color-success)]">{nickname}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--color-muted)]">Metode Bayar</span>
                  <span className="font-semibold text-[var(--color-text)]">{selectedPayment?.name}</span>
                </div>

                <div className="border-t border-dashed border-[var(--color-border)]/50 pt-3 mt-1 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-[var(--color-muted)]">Harga</span>
                    <span className="font-mono text-[var(--color-text)]">{formatIDR(subtotal)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-[var(--color-muted)]">Diskon</span>
                      <span className="font-mono text-[var(--color-success)]">-{formatIDR(discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base border-t border-[var(--color-border)]/50 pt-2 font-bold">
                    <span className="text-[var(--color-text)]">Total Bayar</span>
                    <span className="font-mono text-[var(--color-accent)]">{formatIDR(total)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-lg bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/20 p-3 text-xs text-[var(--color-warning)] leading-relaxed">
                ⚠️ <strong>Peringatan:</strong> Pastikan data akun Anda sudah benar. Transaksi yang sudah diproses tidak dapat dibatalkan atau dikembalikan.
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="rounded-xl border border-[var(--color-border)] bg-transparent px-4 py-2.5 text-xs font-semibold text-[var(--color-text)] transition hover:bg-[var(--color-card)] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={confirmPayment}
                  className="rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-[var(--color-primary)]/20 hover:brightness-110 active:scale-95 transition cursor-pointer"
                >
                  Bayar Sekarang
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </form>
  );
}
