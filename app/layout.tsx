import '@/app/global.css';
import { ThemeProvider } from '@/app/ui/components/theme-provider';
import { AuthProvider } from './context/AuthContext';
import { ThemeToggle } from './ui/components/theme-toggle';
import { Toaster } from "@/app/ui/components/sonner";
import { ClientOnly } from './ui/components/client-only';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ClientOnly>
          <Toaster richColors position="top-right" />
        </ClientOnly>

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="fixed top-4 right-4 z-50">
            <ClientOnly>
              <ThemeToggle />
            </ClientOnly>
          </div>

          <AuthProvider>
            <main>{children}</main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
