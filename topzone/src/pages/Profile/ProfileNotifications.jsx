import { useData } from '../../context/DataContext';
import { formatDate } from '../../utils/format';
import { Bell, BellRing, Check, CheckCheck, Trash2, Calendar, Sparkles, Gamepad2, ShoppingCart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProfileNotifications() {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification
  } = useData();

  const handleMarkRead = (id) => {
    markNotificationRead(id);
    toast.success('Notifikasi ditandai dibaca');
  };

  const handleMarkAllRead = () => {
    markAllNotificationsRead();
    toast.success('Semua notifikasi ditandai dibaca');
  };

  const handleDelete = (id) => {
    deleteNotification(id);
    toast.success('Notifikasi berhasil dihapus');
  };

  const getIcon = (type) => {
    switch (type) {
      case 'transaction_success':
        return { icon: ShoppingCart, color: 'text-[var(--color-success)] bg-[var(--color-success)]/10' };
      case 'promo_new':
        return { icon: Sparkles, color: 'text-[var(--color-warning)] bg-[var(--color-warning)]/10' };
      case 'game_new':
        return { icon: Gamepad2, color: 'text-[var(--color-accent)] bg-[var(--color-accent)]/10' };
      default:
        return { icon: Bell, color: 'text-[var(--color-primary)] bg-[var(--color-primary)]/10' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-[var(--font-display)] text-xl font-bold text-[var(--color-text)]">
            Notifikasi
          </h1>
          <p className="text-xs text-[var(--color-muted)]">
            Dapatkan pembaruan terbaru mengenai transaksi, promo, dan game baru.
          </p>
        </div>
        
        {notifications.length > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 self-start rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]/50 px-4 py-2 text-xs font-semibold text-[var(--color-accent)] hover:bg-[var(--color-card)] transition"
          >
            <CheckCheck size={14} /> Tandai Semua Dibaca
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]/10 py-16 text-center text-xs text-[var(--color-muted)]">
            Belum ada notifikasi baru untuk Anda.
          </div>
        ) : (
          notifications.map((n) => {
            const config = getIcon(n.type);
            const Icon = config.icon;

            return (
              <div
                key={n.id}
                className={`relative flex items-start gap-4 rounded-2xl border p-4 transition duration-200 ${
                  n.isRead
                    ? 'border-[var(--color-border)] bg-[var(--color-card)]/20 opacity-70'
                    : 'border-[var(--color-accent)]/30 bg-[var(--color-card)]/50 shadow-md shadow-[var(--color-accent)]/2'
                }`}
              >
                {/* Icon Wrapper */}
                <div className={`rounded-xl p-3 shrink-0 ${config.color}`}>
                  <Icon size={18} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-16">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-xs font-bold ${n.isRead ? 'text-[var(--color-text)]' : 'text-[var(--color-accent)]'}`}>
                      {n.title}
                    </h3>
                    {!n.isRead && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-accent)] shrink-0 animate-pulse" />
                    )}
                  </div>
                  <p className="mt-1 text-xs text-[var(--color-muted)] leading-relaxed">
                    {n.message}
                  </p>
                  <span className="mt-2.5 flex items-center gap-1 font-mono text-3xs text-[var(--color-muted)]/80">
                    <Calendar size={10} /> {formatDate(new Date(n.createdAt))}
                  </span>
                </div>

                {/* Actions overlay right */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                  {!n.isRead && (
                    <button
                      onClick={() => handleMarkRead(n.id)}
                      className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-1.5 text-[var(--color-success)] hover:bg-[var(--color-success)]/10 hover:border-[var(--color-success)]/30 transition"
                      title="Tandai dibaca"
                    >
                      <Check size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-1.5 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/10 hover:border-[var(--color-danger)]/30 transition"
                    title="Hapus"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
