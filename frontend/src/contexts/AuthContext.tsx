'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, LoginData, RegisterData } from '@/services/auth.service';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
  phone: string;
  specialization?: string;
  isActive: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string, role: 'DOKTER' | 'PERAWAT') => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string, role: 'DOKTER' | 'PERAWAT') => {
    try {
      const response = await authService.login({ username, password, role });
      setUser(response.data.user);
      
      if (role === 'DOKTER') {
        router.push('/dashboard/dokter/main');
      } else {
        router.push('/dashboard/perawat');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      setUser(response.data.user);
      router.push('/dashboard/dokter/main');
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}