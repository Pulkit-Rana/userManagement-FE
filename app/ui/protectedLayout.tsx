'use client';

import { useAuth } from '@/app/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/auth/login?from=' + encodeURIComponent(pathname));
    }
  }, [user, isLoading, router, pathname]);

  if (isLoading || !user) {
    return <div className="p-4 text-sm text-muted-foreground">🔒 Checking session...</div>;
  }

  return <>{children}</>;
}
