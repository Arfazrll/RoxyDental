'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, RegisterRequest } from '@/types/auth';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string, role: 'DOKTER' | 'PERAWAT') => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = authService.getStoredUser();
        const token = authService.getToken();

        if (storedUser && token) {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (error) {
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (username: string, password: string, role: 'DOKTER' | 'PERAWAT') => {
    try {
      const response = await authService.login({ username, password, role });
      setUser(response.data.user);
      
      if (role === 'DOKTER') {
        router.push('/dashboard/dokter/main');
      } else {
        router.push('/dashboard/perawat/main');
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login gagal');
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response = await authService.register(data);
      setUser(response.data.user);
      router.push('/dashboard/perawat/main');
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registrasi gagal');
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
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