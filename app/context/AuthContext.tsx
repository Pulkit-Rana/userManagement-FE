// File: /app/context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { BroadcastChannel } from 'broadcast-channel';
import apiClient from '@/app/lib/apiClient';
import type { LoginResponse } from '@/app/lib/schemas/auth-schemas';

interface AuthContextType {
  accessToken: string | null;
  user: LoginResponse['user'] | null;
  login: (token: string, userData: LoginResponse['user']) => void;
  logout: () => Promise<void>;
  refresh: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('accessToken');
  });
  const [user, setUser] = useState<LoginResponse['user'] | null>(null);

  const bc = typeof window !== 'undefined' ? new BroadcastChannel('auth') : null;

  useEffect(() => {
    if (accessToken) {
      sessionStorage.setItem('accessToken', accessToken);
      apiClient.get('/user')
        .then((res) => setUser(res.data))
        .catch(() => setUser(null));
    } else {
      sessionStorage.removeItem('accessToken');
      setUser(null);
    }
  }, [accessToken]);

  useEffect(() => {
    if (!bc) return;
    bc.onmessage = (msg) => {
      if (msg === 'logout') {
        setAccessToken(null);
      }
      if (typeof msg === 'string' && msg.startsWith('login:')) {
        const [, token] = msg.split(':');
        setAccessToken(token);
      }
    };
    return () => {
      bc.close();
    };
  }, [bc]);

  const login = (token: string, userData: LoginResponse['user']) => {
    setAccessToken(token);
    setUser(userData);
    bc?.postMessage(`login:${token}`);
  };

  const logout = async () => {
    await apiClient.post('/auth/logout');
    setAccessToken(null);
    setUser(null);
    bc?.postMessage('logout');
  };

  const refresh = async (): Promise<string | null> => {
    try {
      const res = await apiClient.post('/auth/refresh');
      const { accessToken: newToken } = res.data;
      setAccessToken(newToken);
      return newToken;
    } catch {
      await logout();
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ accessToken, user, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};