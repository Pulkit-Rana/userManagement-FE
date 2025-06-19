'use client';

import NavLinks from '@/app/ui/dashboard/nav-links';
import { useEffect, useState } from 'react';
import { Button } from '@/app/ui/components/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

export default function SideNav() {
  const [mounted, setMounted] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <nav className="h-full bg-card border-r border-border flex flex-col p-4">
      <h2 className="text-lg font-semibold mb-6 px-2">SyncNest</h2>

      <div className="flex flex-1 flex-col justify-between">
        <div className="flex flex-col space-y-2">
          <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
            <NavLinks />
          </div>
        </div>

        {/* 🔐 Logout button at bottom */}
        <div className="mt-6 border-t border-muted pt-4">
          <Button
            variant="ghost"
            onClick={logout}
            className="w-full justify-start gap-2 text-destructive hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
            <span className="hidden md:inline">Log out</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}
