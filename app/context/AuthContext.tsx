'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { User } from '@/app/lib/types/auth';
import { handleApiError } from '@/app/lib/utils/errorHandler';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user', {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store',
        });

        if (!res.ok) throw new Error('Session expired or unauthorized');
        const data: User = await res.json();
        setUser(data);
      } catch (err) {
        console.error('[AuthContext] session fetch failed:', err);
        toast.error(handleApiError(err, 'Could not restore session'));
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = async () => {
    try {
      const res = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) throw new Error('Logout failed');

      setUser(null); // 🧼 Ensure it's cleared before redirect
      toast.success('You have been logged out');
      router.push('/auth/login');
    } catch (err) {
      console.error('[Logout]', err);
      toast.error(handleApiError(err, 'Logout failed'));
    }
  };

  if (isLoading) return null;

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
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
