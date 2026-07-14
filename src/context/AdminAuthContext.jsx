import { createContext, useContext, useState, useCallback } from 'react';

const AdminAuthContext = createContext(null);

const DEMO_CREDENTIALS = { username: 'admin', password: 'password123' };
const TOKEN_KEY = 'kk_admin_token';

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [adminUser, setAdminUser] = useState(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    return t ? { username: 'admin', role: 'Master Admin' } : null;
  });

  const login = useCallback((username, password) => {
    if (username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
      const fakeToken = `kk.admin.${Date.now()}.${Math.random().toString(36).slice(2)}`;
      localStorage.setItem(TOKEN_KEY, fakeToken);
      setToken(fakeToken);
      setAdminUser({ username, role: 'Master Admin' });
      return { success: true };
    }
    return { success: false, message: 'Username atau password salah.' };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setAdminUser(null);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ token, adminUser, isAuthenticated: !!token, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
