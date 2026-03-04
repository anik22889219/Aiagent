import { useState, useEffect, createContext, useContext } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({ id: 'guest', name: 'Guest User', role: 'admin' });

  const login = async (email, password) => {
    // No-op for now
    console.log('Login bypassed');
  };

  const logout = () => {
    // No-op for now
    console.log('Logout bypassed');
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
