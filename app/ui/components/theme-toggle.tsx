'use client';

import { Button } from '@/app/ui/components/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () =>
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');

  // Dynamic background color classes
  const bgColor =
    resolvedTheme === 'light'
      ? 'bg-yellow-400 hover:bg-yellow-500'
      : 'bg-slate-800 hover:bg-slate-900';

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className={`h-14 w-14 rounded-full shadow-xl transition-all ${bgColor}`}
      >
        {resolvedTheme === 'light' ? (
          <Moon className="h-6 w-6" />
        ) : (
          <Sun className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
}
