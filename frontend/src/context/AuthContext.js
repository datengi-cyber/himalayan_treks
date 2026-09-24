
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import api from '@/lib/api';

// create context
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Check auth on first load
  useEffect(() => {
    const token = Cookies.get('token');

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get('/auth/me')
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        Cookies.remove('token');
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // 🔑 LOGIN
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });

    Cookies.set('token', res.data.token, { expires: 7 });
    setUser(res.data.user);

    return res.data;
  };

  // 📝 REGISTER
  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', {
      name,
      email,
      password,
    });

    Cookies.set('token', res.data.token, { expires: 7 });
    setUser(res.data.user);

    return res.data;
  };

  // 🚪 LOGOUT
  const logout = () => {
    Cookies.remove('token');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ✅ SAFE HOOK (prevents null crash)
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}