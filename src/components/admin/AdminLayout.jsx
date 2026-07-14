import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
  const { isAuthenticated } = useAdminAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[#080F1E]">
      <AdminSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <main className="flex-1 p-4 pt-16 lg:p-6 lg:pt-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
