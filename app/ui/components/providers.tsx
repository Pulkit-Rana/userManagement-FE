'use client';

import { ThemeProvider } from '@/app/ui/components/theme-provider';
import { Toaster } from '@/app/ui/components/sonner';
import { ThemeToggle } from '@/app/ui/components/theme-toggle';
import { AuthProvider } from '@/app/context/AuthContext';
import { ClientOnly } from './client-only';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ClientOnly>
        <Toaster richColors position="top-right" />
      </ClientOnly>

      <div className="fixed top-4 right-4 z-50">
        <ClientOnly>
          <ThemeToggle />
        </ClientOnly>
      </div>

      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}
