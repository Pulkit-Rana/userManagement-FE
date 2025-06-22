'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import SideNav from '@/app/ui/dashboard/sidenav';
import UserProfile from '@/app/ui/dashboard/user-profile'; // ✅ Import the profile component

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { accessToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!accessToken) {
      router.replace('/auth/login');
    }
  }, [accessToken]);

  if (!accessToken) return null;

  return (
    <div className="flex h-screen flex-col">
      {/* ✅ Top Profile Header */}
      <div className="w-full flex items-center justify-end px-6 py-4 border-b border-border bg-background">
        <UserProfile />
      </div>

      {/* ✅ Main content with sidebar */}
      <div className="flex flex-grow overflow-hidden">
        <div className="w-64 flex-none border-r border-border">
          <SideNav />
        </div>
        <div className="flex-grow overflow-y-auto p-6 md:p-12">
          {children}
        </div>
      </div>
    </div>
  );
}
