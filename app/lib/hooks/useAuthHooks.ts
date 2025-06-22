'use client';

import { useState } from 'react';
import apiClient from '@/app/lib/apiClient';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import type { LoginFormValues } from '@/app/ui/login-form';

export function useLogin() {
  const { login } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function execute(values: LoginFormValues) {
    setIsLoading(true);
    try {
      const { email, ...rest } = values;
      const payload = { username: email, ...rest };
      const res = await apiClient.post('/auth/login', payload, {
        headers: { 'Cache-Control': 'no-store' },
      });
      const { accessToken, user } = res.data;
      login(accessToken, user);
      toast.success('Logged in successfully');
      router.replace('/dashboard');
    } catch (err: any) {
      const raw = err.response?.data?.error;
      const msg =
        typeof raw === 'string'
          ? raw
          : Array.isArray(raw) && raw[0]?.message
          ? raw[0].message
          : 'Login failed';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }

  return { login: execute, isLoading };
}

export function useLogout() {
  const { logout } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function execute() {
    setIsLoggingOut(true);
    await logout();
    toast('Logged out successfully');
    router.replace('/login');
    setIsLoggingOut(false);
  }

  return { logout: execute, isLoggingOut };
}

export function useRefreshToken() {
  const { refresh } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  async function execute() {
    setIsRefreshing(true);
    await refresh();
    setIsRefreshing(false);
  }

  return { refreshToken: execute, isRefreshing };
}
