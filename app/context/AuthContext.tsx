'use client';

import {
  createContext,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import useSWR from 'swr';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { User, UserSchema } from '@/app/lib/types/auth';
import { handleApiError } from '@/app/lib/utils/errorHandler';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
  refreshSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const authChannel = typeof window !== 'undefined' ? new BroadcastChannel('auth') : null;

const fetcher = async (url: string) => {
  const res = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Session expired or unauthorized');
  const data = await res.json();
  return UserSchema.parse(data);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  const {
    data: user,
    error,
    isLoading,
    mutate,
  } = useSWR<User | null>('/api/user', fetcher, {
    shouldRetryOnError: false,
    revalidateOnFocus: true,
  });

  const refreshSession = () => {
    mutate();
  };

  const logout = async () => {
    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Logout failed');

      mutate(null, false);
      toast.success('You have been logged out');
      authChannel?.postMessage('logout');
      router.push('/auth/login');
    } catch (err) {
      console.error('[Logout]', err);
      toast.error(handleApiError(err, 'Logout failed'));
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && authChannel) {
      authChannel.onmessage = (event) => {
        if (event.data === 'logout' || event.data === 'login') {
          mutate();
        }
      };
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
