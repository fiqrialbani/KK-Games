import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ReceiptText, Bell, UserRound, ShieldAlert, LogOut, Menu, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUserAuth } from '../../context/UserAuthContext';
import ConfirmationModal from '../ui/ConfirmationModal';

export default function ProfileLayout() {
  const { user, logout } = useUserAuth();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const menuItems = [
    { to: '/profile', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/profile/transactions', label: 'Riwayat Transaksi', icon: ReceiptText },
    { to: '/profile/notifications', label: 'Notifikasi', icon: Bell },
    { to: '/profile/settings', label: 'Pengaturan Akun', icon: UserRound },
    { to: '/profile/security', label: 'Keamanan', icon: ShieldAlert },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-6">
      <div className="space-y-6">
        {/* User Card Header */}
        <div className="flex items-center gap-3 border-b border-[var(--color-border)] pb-5">
          <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] text-lg font-bold text-white shadow-md shadow-[var(--color-primary)]/20 overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <span>{userInitial}</span>
            )}
          </div>
          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold text-[var(--color-text)]">{user?.name}</h4>
            <p className="truncate text-xs text-[var(--color-muted)]">{user?.email}</p>
          </div>
        </div>

        {/* Sidebar Nav */}
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setIsDrawerOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-xl px-4 py-3 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[var(--color-primary)]/15 to-[var(--color-secondary)]/15 border-l-2 border-[var(--color-accent)] text-[var(--color-text)] shadow-sm'
                    : 'text-[var(--color-muted)] hover:bg-[var(--color-card)]/50 hover:text-[var(--color-text)]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <item.icon size={16} className={isActive ? 'text-[var(--color-accent)]' : ''} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight size={14} className={`opacity-0 transition ${isActive ? 'opacity-100 text-[var(--color-accent)]' : ''}`} />
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout button bottom */}
      <button
        onClick={() => {
          setIsDrawerOpen(false);
          setShowLogoutConfirm(true);
        }}
        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-xs font-semibold text-[var(--color-danger)] transition hover:bg-[var(--color-danger)]/10"
      >
        <LogOut size={16} />
        <span>Keluar / Logout</span>
      </button>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Mobile Header Nav Trigger */}
      <div className="mb-4 flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-3 md:hidden">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-primary)] text-xs font-bold text-white">
            {userInitial}
          </div>
          <span className="text-xs font-semibold text-[var(--color-text)]">Menu Profil</span>
        </div>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="rounded-lg border border-[var(--color-border)] p-1.5 text-[var(--color-text)] hover:bg-[var(--color-bg)]"
        >
          <Menu size={16} />
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-[240px_1fr] lg:grid-cols-[260px_1fr]">
        {/* Desktop Sidebar */}
        <aside className="sticky top-24 hidden h-[calc(100vh-140px)] rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]/50 backdrop-blur-md md:block">
          {sidebarContent}
        </aside>

        {/* Mobile Drawer (Drawer Sidebar overlay) */}
        <AnimatePresence>
          {isDrawerOpen && (
            <div className="fixed inset-0 z-50 flex justify-end md:hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsDrawerOpen(false)}
                className="fixed inset-0 bg-black"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'tween', duration: 0.25 }}
                className="relative z-10 h-full w-64 border-l border-[var(--color-border)] bg-[#0D1B2E] shadow-2xl"
              >
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="absolute right-4 top-4 text-[var(--color-muted)] hover:text-[var(--color-text)]"
                >
                  <X size={18} />
                </button>
                <div className="h-full pt-10">
                  {sidebarContent}
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="min-w-0">
          <Outlet />
        </main>
      </div>

      <ConfirmationModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Konfirmasi Logout"
        message="Apakah Anda yakin ingin keluar dari akun Anda?"
        confirmText="Logout"
        cancelText="Batal"
      />
    </div>
  );
}
