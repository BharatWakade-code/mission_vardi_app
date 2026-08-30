import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, mobile: string, password: string, role?: Role) => Promise<void>;
  logout: () => void;
  switchDemoRole: (role: Role) => Promise<void>;
  updateUser: (updated: Partial<User>) => void;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    const checkAuth = async () => {
      if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('parikshasetu_token');
        if (storedToken) {
          try {
            setToken(storedToken);
            const res = await api.getMe();
            setUser(res.user);
          } catch (err) {
            console.warn('Session expired, logging out', err);
            logout();
          }
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.login({ email, password });
      setUser(res.user);
      setToken(res.token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('parikshasetu_token', res.token);
      }
      setIsAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, mobile: string, password: string, role: Role = 'student') => {
    setIsLoading(true);
    try {
      const res = await api.register({ name, email, mobile, password, role });
      setUser(res.user);
      setToken(res.token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('parikshasetu_token', res.token);
      }
      setIsAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('parikshasetu_token');
    }
  };

  const switchDemoRole = async (role: Role) => {
    // Demo convenience login — credentials come from environment variables, not hardcoded.
    // Remove this function entirely before production deployment.
    const adminEmail = process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL || '';
    const adminPass = process.env.NEXT_PUBLIC_DEMO_ADMIN_PASSWORD || '';
    const studentEmail = process.env.NEXT_PUBLIC_DEMO_STUDENT_EMAIL || '';
    const studentPass = process.env.NEXT_PUBLIC_DEMO_STUDENT_PASSWORD || '';

    if (role === 'admin') {
      await login(adminEmail, adminPass);
    } else {
      await login(studentEmail, studentPass);
    }
  };

  const updateUser = (updated: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updated });
    }
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        logout,
        switchDemoRole,
        updateUser,
        openAuthModal,
        closeAuthModal,
        isAuthModalOpen,
        authModalMode,
      }}
    >
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
