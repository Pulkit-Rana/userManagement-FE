// File: /app/(protected)/ProtectedLayout.tsx
'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { accessToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!accessToken) {
      router.replace('/auth/login'); // Redirect if not logged in
    }
  }, [accessToken]);

  if (!accessToken) return null; // Optional loading state

  return <>{children}</>;
}
