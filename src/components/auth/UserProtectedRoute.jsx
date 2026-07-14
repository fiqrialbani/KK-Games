import { Navigate, useLocation } from 'react-router-dom';
import { useUserAuth } from '../../context/UserAuthContext';

/**
 * Wraps a route so that only authenticated users can access it.
 * Unauthenticated users are redirected to /login, and the original
 * location is saved so they can be redirected back after login.
 */
export default function UserProtectedRoute({ children }) {
  const { isAuthenticated } = useUserAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}
