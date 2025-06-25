'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { BroadcastChannel } from 'broadcast-channel';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { flushSync } from 'react-dom';
import type { LoginResponse } from '@/app/lib/schemas/auth-schemas';
import { setAccessToken as setApiClientToken } from '@/app/lib/apiClient';

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
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const router = useRouter();
  const bc = typeof window !== 'undefined' ? new BroadcastChannel('auth') : null;

  const INACTIVITY_TIMEOUT = 1000 * 60 * 60 * 48; // 48 hours

  // Load token from sessionStorage on boot
  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');
    if (token) {
      setAccessToken(token);
      setApiClientToken(token);
    }
  }, []);

  // Update user when token changes
  useEffect(() => {
    if (accessToken) {
      sessionStorage.setItem('accessToken', accessToken);
      setApiClientToken(accessToken);
      axios
        .get('/api/auth/user', {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        })
        .then((res) => setUser(res.data))
        .catch(() => setUser(null));
    } else {
      sessionStorage.removeItem('accessToken');
      setUser(null);
    }
  }, [accessToken]);

  // BroadcastChannel login/logout sync
  useEffect(() => {
    if (!bc) return;
    bc.onmessage = (msg) => {
      if (msg === 'logout') {
        sessionStorage.removeItem('accessToken');
        setAccessToken(null);
        setApiClientToken(null);
      }
      if (typeof msg === 'string' && msg.startsWith('login:')) {
        const [, token] = msg.split(':');
        sessionStorage.setItem('accessToken', token);
        setAccessToken(token);
        setApiClientToken(token);
      }
    };
    return () => {
      bc.close();
    };
  }, [bc]);

  // 48h inactivity logout
  useEffect(() => {
    if (!accessToken) return;

    const updateActivity = () => setLastActivity(Date.now());
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach((event) =>
      document.addEventListener(event, updateActivity, true)
    );

    const interval = setInterval(() => {
      if (Date.now() - lastActivity > INACTIVITY_TIMEOUT) {
        logout();
      }
    }, 60 * 60*48);

    return () => {
      events.forEach((event) =>
        document.removeEventListener(event, updateActivity, true)
      );
      clearInterval(interval);
    };
  }, [accessToken, lastActivity]);

  // Auto-refresh every 14 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refresh();
    }, 1000 * 60 * 14);
    return () => clearInterval(interval);
  }, []);

  const login = (token: string, userData: LoginResponse['user']) => {
    sessionStorage.setItem('accessToken', token);
    setAccessToken(token);
    setApiClientToken(token);
    setUser(userData);
    bc?.postMessage(`login:${token}`);
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } catch {
      // ignore
    } finally {
      sessionStorage.removeItem('accessToken');
      setAccessToken(null);
      setUser(null);
      setApiClientToken(null);
      bc?.postMessage('logout');

      flushSync(() => {}); // ⏱ ensure React state updates before redirect

      setTimeout(() => {
        router.push('/auth/login');
      }, 0);
    }
  };

  const refresh = async (): Promise<string | null> => {
    try {
      const res = await axios.post('/api/auth/refresh', {}, { withCredentials: true });
      const { accessToken: newToken } = res.data;
      sessionStorage.setItem('accessToken', newToken);
      setAccessToken(newToken);
      setApiClientToken(newToken);
      setLastActivity(Date.now());
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
