import { createContext, useContext, useState, useEffect } from 'react';
import { games as seedGames, packages as seedPackages, paymentMethods as seedPayments, promotions as seedPromos, transactions as seedTransactions } from '../data/games';

const DataContext = createContext(null);

const SEED_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Top Up Berhasil',
    message: 'Transaksi top up Mobile Legends 571 Diamonds Anda telah berhasil diproses!',
    type: 'transaction_success',
    isRead: false,
    createdAt: '2026-07-14T09:16:00Z'
  },
  {
    id: 2,
    title: 'Promo Baru Tersedia',
    message: 'Gunakan kode promo WEEKEND10 untuk diskon 10% di akhir pekan ini!',
    type: 'promo_new',
    isRead: true,
    createdAt: '2026-07-13T10:00:00Z'
  },
  {
    id: 3,
    title: 'Game Baru: Blood Strike',
    message: 'Blood Strike kini tersedia di KK Games! Top up gold sekarang.',
    type: 'game_new',
    isRead: false,
    createdAt: '2026-07-12T08:00:00Z'
  }
];

export function DataProvider({ children }) {
  // Initialize from localStorage or fallback to static seed data
  const [games, setGames] = useState(() => {
    const saved = localStorage.getItem('kk_games');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Reset localStorage data if it still contains Unsplash URLs, or if new games have been added, or if publisher needs update
      const hasOldUrls = parsed.some(g => g.id === 1 && g.image.includes('unsplash.com'));
      const hasNewGames = parsed.length !== seedGames.length;
      const hasOldPublisher = parsed.some(g => g.id === 12 && g.publisher !== 'HK KURO GAMES LIMITED') ||
                              parsed.some(g => g.id === 6 && g.publisher !== 'COGNOSPHERE PTE.LTD.') ||
                              parsed.some(g => g.id === 7 && g.publisher !== 'Garena');
      if (hasOldUrls || hasNewGames || hasOldPublisher) {
        localStorage.removeItem('kk_games');
        localStorage.removeItem('kk_packages');
        return seedGames;
      }
      return parsed;
    }
    return seedGames;
  });

  const [packages, setPackages] = useState(() => {
    const saved = localStorage.getItem('kk_packages');
    if (saved) return JSON.parse(saved);
    // Flatten with gameId
    const flat = [];
    Object.entries(seedPackages).forEach(([gid, pkgs]) =>
      pkgs.forEach((p) => flat.push({ ...p, gameId: Number(gid) }))
    );
    return flat;
  });

  const [paymentMethods, setPaymentMethods] = useState(() => {
    const saved = localStorage.getItem('kk_payments');
    return saved ? JSON.parse(saved) : seedPayments;
  });

  const [promotions, setPromotions] = useState(() => {
    const saved = localStorage.getItem('kk_promotions');
    return saved ? JSON.parse(saved) : seedPromos;
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('kk_transactions');
    return saved ? JSON.parse(saved) : seedTransactions;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('kk_notifications');
    return saved ? JSON.parse(saved) : SEED_NOTIFICATIONS;
  });

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('kk_games', JSON.stringify(games));
  }, [games]);

  useEffect(() => {
    localStorage.setItem('kk_packages', JSON.stringify(packages));
  }, [packages]);

  useEffect(() => {
    localStorage.setItem('kk_payments', JSON.stringify(paymentMethods));
  }, [paymentMethods]);

  useEffect(() => {
    localStorage.setItem('kk_promotions', JSON.stringify(promotions));
  }, [promotions]);

  useEffect(() => {
    localStorage.setItem('kk_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('kk_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Helper APIs for notifications
  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const addNotification = (title, message, type) => {
    const newNotif = {
      id: Date.now(),
      title,
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const addTransaction = (txn) => {
    setTransactions(prev => [txn, ...prev]);
  };

  return (
    <DataContext.Provider
      value={{
        games,
        setGames,
        packages,
        setPackages,
        paymentMethods,
        setPaymentMethods,
        promotions,
        setPromotions,
        transactions,
        setTransactions,
        addTransaction,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        addNotification,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
