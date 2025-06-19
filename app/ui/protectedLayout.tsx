'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/auth/login?from=' + encodeURIComponent(window.location.pathname));
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return <div className="p-4">🔒 Checking session...</div>;
  }

  return <>{children}</>;
}
