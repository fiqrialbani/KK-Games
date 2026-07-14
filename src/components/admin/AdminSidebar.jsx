import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Gamepad2, Package, CreditCard,
  Tag, Receipt, LogOut, Menu, X, Zap, ChevronRight,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import toast from 'react-hot-toast';

const NAV_ITEMS = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/games', icon: Gamepad2, label: 'Games' },
  { to: '/admin/packages', icon: Package, label: 'Packages' },
  { to: '/admin/payments', icon: CreditCard, label: 'Payments' },
  { to: '/admin/promotions', icon: Tag, label: 'Promotions' },
  { to: '/admin/transactions', icon: Receipt, label: 'Transactions' },
];

export default function AdminSidebar() {
  const { adminUser, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Berhasil logout!');
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-[var(--color-border)] px-6 py-5">
        <img src="/kkgames.png" alt="KK Games Logo" className="h-9 w-9 object-contain rounded-xl" />
        <div>
          <span className="font-[var(--font-display)] text-base font-bold tracking-wide text-[var(--color-text)]">
            KK<span className="text-[var(--color-accent)]"> Games</span>
          </span>
          <p className="text-[10px] font-medium tracking-widest text-[var(--color-muted)] uppercase">Admin Panel</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-secondary)]/10 text-[var(--color-text)] border border-[var(--color-primary)]/30'
                  : 'text-[var(--color-muted)] hover:bg-[var(--color-card)] hover:text-[var(--color-text)]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-[var(--color-accent)]' : ''} />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={14} className="text-[var(--color-accent)]" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User & Logout */}
      <div className="border-t border-[var(--color-border)] p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-[var(--color-card)] px-3 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-primary)] text-xs font-bold text-white">
            {adminUser?.username?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-[var(--color-text)]">{adminUser?.username || 'Admin'}</p>
            <p className="truncate text-[11px] text-[var(--color-muted)]">{adminUser?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--color-danger)] transition-all hover:bg-[var(--color-danger)]/10"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text)] shadow-lg lg:hidden"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-[#0B1628] border-r border-[var(--color-border)] transition-transform duration-300 lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 text-[var(--color-muted)] hover:text-[var(--color-text)]"
        >
          <X size={20} />
        </button>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-shrink-0 lg:flex-col bg-[#0B1628] border-r border-[var(--color-border)] min-h-screen sticky top-0">
        <SidebarContent />
      </aside>
    </>
  );
}
