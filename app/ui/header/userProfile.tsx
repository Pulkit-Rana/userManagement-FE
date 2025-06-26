'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/app/context/AuthContext';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/app/ui/components/avatar';

export default function Header() {
  const { user } = useAuth();
  if (!user) return null;

  const initials = `${user.profile.firstName?.[0] ?? ''}${user.profile.lastName?.[0] ?? ''}`;
  const fullName = `${user.profile.firstName} ${user.profile.lastName}`;

  return (
    <header className="h-16 w-full flex items-center justify-between px-6 bg-background border-b border-border">
      {/* Left: Logo/Title */}
      <Link href="/" className="text-lg font-semibold">
        MyApp
      </Link>

      {/* Right: Avatar + Name → /user/me */}
      <Link
        href="/user/me"
        className="flex items-center gap-3 rounded-md px-2 py-1 hover:bg-muted transition"
      >
        <Avatar>
          <AvatarImage asChild>
            <Image
              src={user.profile.profilePictureUrl || '/avatar-placeholder.png'}
              alt={fullName}
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          </AvatarImage>
          <AvatarFallback className="text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">{fullName}</span>
      </Link>
    </header>
  );
}
