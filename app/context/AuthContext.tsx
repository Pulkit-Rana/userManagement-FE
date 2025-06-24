'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { BroadcastChannel } from 'broadcast-channel';
import axios from 'axios';
import { useRouter } from 'next/navigation';
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
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<LoginResponse['user'] | null>(null);
  // ✅ ADD THESE NEW STATE VARIABLES:
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const INACTIVITY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  
  const router = useRouter();

  const bc = typeof window !== 'undefined' ? new BroadcastChannel('auth') : null;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('accessToken');
      if (token) setAccessToken(token);
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      sessionStorage.setItem('accessToken', accessToken);
      axios
        .get('/api/auth/user', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
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

  // ✅ ADD THIS NEW useEffect HERE (AFTER ALL EXISTING useEffects):
  useEffect(() => {
    if (!accessToken) return;

    const updateActivity = () => setLastActivity(Date.now());
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    // Check inactivity every minute
    const inactivityInterval = setInterval(() => {
      if (Date.now() - lastActivity > INACTIVITY_TIMEOUT) {
        logout();
      }
    }, 60 * 1000);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
      clearInterval(inactivityInterval);
    };
  }, [accessToken, lastActivity]);

  const login = (token: string, userData: LoginResponse['user']) => {
    setAccessToken(token);
    setUser(userData);
    bc?.postMessage(`login:${token}`);
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } finally {
      setAccessToken(null);
      setUser(null);
      bc?.postMessage('logout');
      router.push('/auth/login');
    }
  };

  // ✅ REPLACE THIS REFRESH FUNCTION:
  const refresh = async (): Promise<string | null> => {
    try {
      const res = await axios.post('/api/auth/refresh');
      const data = res.data as { accessToken: string; refreshToken?: string };
      setAccessToken(data.accessToken);
      setLastActivity(Date.now()); // Update activity on refresh
      return data.accessToken;
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