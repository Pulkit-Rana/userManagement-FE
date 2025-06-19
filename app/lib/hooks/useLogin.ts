'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { handleApiError } from '@/app/lib/utils/errorHandler';

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          username: email, // ✅ Must match Spring Boot DTO
          password,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.message || 'Login failed');
      }

      toast.success('Login successful');

      const from = searchParams.get('from') || '/dashboard'; // ✅ Smart redirect
      router.replace(from);
    } catch (err) {
      const msg = handleApiError(err, 'Login failed');
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}
