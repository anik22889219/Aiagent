import { useState, useEffect, createContext, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // optionally fetch profile
    const token = localStorage.getItem('accessToken');
    if (token) {
      api.get('/api/auth/me').then((res) => setUser(res.data)).catch(() => {});
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    localStorage.setItem('accessToken', res.data.accessToken);
    setUser(await api.get('/api/auth/me').then((r) => r.data));
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
