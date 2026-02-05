import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('arcadia_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { user: u } = await authApi.me();
      setUser(u);
    } catch {
      localStorage.removeItem('arcadia_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    const { token, user: u } = await authApi.login({ email, password });
    localStorage.setItem('arcadia_token', token);
    setUser(u);
    return u;
  };

  const loginAsGuest = async () => {
    const { token, user: u } = await authApi.guest();
    localStorage.setItem('arcadia_token', token);
    setUser(u);
    return u;
  };

  const register = async (email, password, name) => {
    const { token, user: u } = await authApi.register({ email, password, name });
    localStorage.setItem('arcadia_token', token);
    setUser(u);
    return u;
  };

  const logout = () => {
    localStorage.removeItem('arcadia_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginAsGuest, register, logout, refreshUser: loadUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
