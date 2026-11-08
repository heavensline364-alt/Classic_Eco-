import React, { createContext, useContext, useState, useEffect } from 'react';
import { API, showToast } from '../services/api.js';
import { User } from '../types/index.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('classic_eco_token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      const storedToken = localStorage.getItem('classic_eco_token');
      if (storedToken) {
        try {
          const res = await API.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
          } else {
            logout();
          }
        } catch (err) {
          console.error('Failed to restore session:', err);
          logout();
        }
      }
      setIsLoading(false);
    };

    fetchMe();
  }, []);

  const login = (jwtToken: string, userData: User) => {
    localStorage.setItem('classic_eco_token', jwtToken);
    setToken(jwtToken);
    setUser(userData);
    showToast(`Welcome back, ${userData.name}!`);
  };

  const logout = () => {
    localStorage.removeItem('classic_eco_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, updateUser, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
