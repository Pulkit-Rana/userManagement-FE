
import '@/app/global.css';
import { ThemeProvider } from '@/app/ui/components/theme-provider';
import { AuthProvider } from './context/AuthContext';
import { ThemeToggle } from './ui/components/theme-toggle';
import { Toaster } from "@/app/ui/components/sonner"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
           
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* Global Theme Toggle Button */}
            <div className="fixed top-4 right-4 z-50">
              <ThemeToggle />
            </div>
            <main>{children}</main>
          <Toaster richColors position="top-right" />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}