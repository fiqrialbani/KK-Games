import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const UserAuthContext = createContext(null);

export function UserAuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('kk_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = useCallback((email, password) => {
    // Check registered users in localStorage
    const registeredUsers = JSON.parse(localStorage.getItem('kk_registered_users') || '[]');
    const matched = registeredUsers.find(u => u.email === email && u.password === password);
    
    if (matched) {
      const userData = {
        email: matched.email,
        name: matched.name,
        username: matched.username || matched.name.toLowerCase().replace(/\s+/g, ''),
        avatar: matched.avatar || '',
        phone: matched.phone || '',
        theme: matched.theme || 'dark',
        language: matched.language || 'id',
        joinedAt: matched.joinedAt || new Date().toISOString().split('T')[0]
      };
      localStorage.setItem('kk_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    }
    return { success: false, message: 'Email atau password salah.' };
  }, []);

  const registerUser = useCallback((name, email, password) => {
    const registeredUsers = JSON.parse(localStorage.getItem('kk_registered_users') || '[]');
    const exists = registeredUsers.some(u => u.email === email);
    
    if (exists) {
      return { success: false, message: 'Email sudah terdaftar.' };
    }

    const joinedAt = new Date().toISOString().split('T')[0];
    const username = name.toLowerCase().replace(/\s+/g, '');
    const newUser = {
      name,
      email,
      password,
      username,
      avatar: '',
      phone: '',
      theme: 'dark',
      language: 'id',
      joinedAt
    };
    registeredUsers.push(newUser);
    localStorage.setItem('kk_registered_users', JSON.stringify(registeredUsers));
    
    // Automatically log in
    const userData = {
      email,
      name,
      username,
      avatar: '',
      phone: '',
      theme: 'dark',
      language: 'id',
      joinedAt
    };
    localStorage.setItem('kk_user', JSON.stringify(userData));
    setUser(userData);
    return { success: true };
  }, []);

  const updateProfile = useCallback((profileData) => {
    if (!user) return { success: false, message: 'User belum login' };

    const registeredUsers = JSON.parse(localStorage.getItem('kk_registered_users') || '[]');
    const updatedUsers = registeredUsers.map(u => {
      if (u.email === user.email) {
        return {
          ...u,
          name: profileData.name || u.name,
          username: profileData.username || u.username,
          phone: profileData.phone || u.phone,
          theme: profileData.theme || u.theme,
          language: profileData.language || u.language,
          avatar: profileData.avatar !== undefined ? profileData.avatar : u.avatar
        };
      }
      return u;
    });

    localStorage.setItem('kk_registered_users', JSON.stringify(updatedUsers));

    const updatedUser = {
      ...user,
      name: profileData.name || user.name,
      username: profileData.username || user.username,
      phone: profileData.phone || user.phone,
      theme: profileData.theme || user.theme,
      language: profileData.language || user.language,
      avatar: profileData.avatar !== undefined ? profileData.avatar : user.avatar
    };

    localStorage.setItem('kk_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    return { success: true };
  }, [user]);

  const changePassword = useCallback((oldPassword, newPassword) => {
    if (!user) return { success: false, message: 'User belum login' };

    const registeredUsers = JSON.parse(localStorage.getItem('kk_registered_users') || '[]');
    const userIndex = registeredUsers.findIndex(u => u.email === user.email);

    if (userIndex === -1) {
      return { success: false, message: 'Pengguna tidak ditemukan' };
    }

    if (registeredUsers[userIndex].password !== oldPassword) {
      return { success: false, message: 'Password lama tidak sesuai' };
    }

    registeredUsers[userIndex].password = newPassword;
    localStorage.setItem('kk_registered_users', JSON.stringify(registeredUsers));

    // Auto logout
    localStorage.removeItem('kk_user');
    setUser(null);
    return { success: true };
  }, [user]);

  const logout = useCallback(() => {
    localStorage.removeItem('kk_user');
    setUser(null);
  }, []);

  // Apply theme when theme updates
  useEffect(() => {
    if (user?.theme) {
      const root = document.documentElement;
      if (user.theme === 'light') {
        root.classList.add('light');
        root.classList.remove('dark');
      } else if (user.theme === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        // System preference
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        root.classList.add(systemTheme);
        if (systemTheme === 'dark') root.classList.remove('light');
        else root.classList.remove('dark');
      }
    }
  }, [user?.theme]);

  return (
    <UserAuthContext.Provider value={{ user, isAuthenticated: !!user, login, registerUser, updateProfile, changePassword, logout }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export function useUserAuth() {
  const ctx = useContext(UserAuthContext);
  if (!ctx) throw new Error('useUserAuth must be used within UserAuthProvider');
  return ctx;
}
