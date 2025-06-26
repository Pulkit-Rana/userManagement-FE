'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import Header from '@/app/ui/header/userProfile';
import SideNav from '@/app/ui/dashboard/sidenav';
import { Spinner } from '@/app/ui/components/spinner';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { accessToken, refresh } = useAuth();
  const [ready, setReady] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    (async () => {
      if (!accessToken) {
        await refresh();
      }
      setReady(true);
    })();
  }, [accessToken, refresh]);

  if (!ready) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size={32} className="text-primary" />
      </div>
    );
  }

  const showHeader = pathname !== '/user/me';

  return (
    <div className="flex h-screen">
      <aside className="w-64 border-r border-border">
        <SideNav />
      </aside>
      <div className="flex flex-col flex-grow overflow-hidden">
        {showHeader && (
          <div className="flex-shrink-0">
            <Header />
          </div>
        )}
        <section className="flex-grow overflow-y-auto p-6 md:p-12">
          {children}
        </section>
      </div>
    </div>
  );
}
