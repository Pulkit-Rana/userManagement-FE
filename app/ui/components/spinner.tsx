'use client';

import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: number;          // default size in pixels
  className?: string;
}

export function Spinner({ size = 24, className = '' }: SpinnerProps) {
  return (
    <Loader2
      size={size}
      className={`animate-spin ${className}`}
      aria-label="Loading..."
    />
  );
}
