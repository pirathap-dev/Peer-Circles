// Global auth state. Persists token + user in AsyncStorage so the session
// survives app restarts.
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '../services/api';
import { saveAuth, loadAuth, clearAuth } from '../services/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState('user');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = await loadAuth();
      if (stored) {
        setToken(stored.token);
        setUser(stored.user);
        setRole(stored.role || 'user');
      }
      setLoading(false);
    })();
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await api.login(email, password);
    setToken(data.token);
    setUser(data.user);
    setRole('user');
    await saveAuth(data.token, data.user, 'user');
    return data;
  }, []);

  const adminLogin = useCallback(async (username, password) => {
    const data = await api.adminLogin(username, password);
    setToken(data.token);
    setUser(data.admin);
    setRole('admin');
    await saveAuth(data.token, data.admin, 'admin');
    return data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const data = await api.register(name, email, password);
    setToken(data.token);
    setUser(data.user);
    setRole('user');
    await saveAuth(data.token, data.user, 'user');
    return data;
  }, []);

  const logout = useCallback(async () => {
    setToken(null);
    setUser(null);
    setRole('user');
    await clearAuth();
  }, []);

  const updateUser = useCallback(
    async (updatedUser) => {
      setUser(updatedUser);
      if (token) await saveAuth(token, updatedUser, role);
    },
    [token, role]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        loading,
        login,
        adminLogin,
        register,
        logout,
        updateUser,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}