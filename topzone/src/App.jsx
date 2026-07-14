import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/layouts/Navbar';
import Footer from './components/layouts/Footer';
import Home from './pages/Home';
import GameDetail from './pages/GameDetail';
import GamesList from './pages/GamesList';
import Checkout from './pages/Checkout';
import NotFound from './pages/NotFound';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import UserProtectedRoute from './components/auth/UserProtectedRoute';
import ProfileLayout from './components/layouts/ProfileLayout';
import ProfileDashboard from './pages/Profile/ProfileDashboard';
import ProfileEdit from './pages/Profile/ProfileEdit';
import ProfileTransactions from './pages/Profile/ProfileTransactions';
import ProfileNotifications from './pages/Profile/ProfileNotifications';
import ProfileSettings from './pages/Profile/ProfileSettings';
import ProfileSecurity from './pages/Profile/ProfileSecurity';

function ScrollToHashElement() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        const timer = setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
        return () => clearTimeout(timer);
      }
    } else {
      window.scrollTo({ top: 0 });
    }
  }, [hash, pathname]);

  return null;
}

// Auth imports
import { AdminAuthProvider } from './context/AdminAuthContext';
import { UserAuthProvider } from './context/UserAuthContext';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminGames from './pages/admin/Games';
import AdminPackages from './pages/admin/Packages';
import AdminPayments from './pages/admin/Payments';
import AdminPromotions from './pages/admin/Promotions';
import AdminTransactions from './pages/admin/Transactions';

export default function App() {
  return (
    <AdminAuthProvider>
      <UserAuthProvider>
        <ScrollToHashElement />
        <Routes>
          {/* ── Auth Pages (no Navbar/Footer) ── */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* ── Admin Auth (no Navbar/Footer) ── */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ── Protected Admin Routes ── */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="games" element={<AdminGames />} />
            <Route path="packages" element={<AdminPackages />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="promotions" element={<AdminPromotions />} />
            <Route path="transactions" element={<AdminTransactions />} />
          </Route>

          {/* ── Public Client Routes (with Navbar + Footer) ── */}
          <Route
            path="/*"
            element={
              <div className="flex min-h-screen flex-col bg-[var(--color-bg)] font-[var(--font-body)] text-[var(--color-text)]">
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/games" element={<GamesList />} />
                    <Route path="/games/:slug" element={<GameDetail />} />
                    {/* Checkout is protected — user must be logged in */}
                    <Route
                      path="/checkout"
                      element={
                        <UserProtectedRoute>
                          <Checkout />
                        </UserProtectedRoute>
                      }
                    />

                    {/* Profile layout and nested sub-pages wrapped inside client routes */}
                    <Route
                      path="/profile"
                      element={
                        <UserProtectedRoute>
                          <ProfileLayout />
                        </UserProtectedRoute>
                      }
                    >
                      <Route index element={<ProfileDashboard />} />
                      <Route path="edit" element={<ProfileEdit />} />
                      <Route path="transactions" element={<ProfileTransactions />} />
                      <Route path="notifications" element={<ProfileNotifications />} />
                      <Route path="settings" element={<ProfileSettings />} />
                      <Route path="security" element={<ProfileSecurity />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            }
          />
        </Routes>
      </UserAuthProvider>
    </AdminAuthProvider>
  );
}
