'use client';

import { useAuth } from '@/app/context/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/app/ui/components/avatar';
import { Skeleton } from '@/app/ui/components/skeleton';

export default function UserProfile() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="w-8 h-8 rounded-full" />
        <Skeleton className="w-24 h-4" />
      </div>
    );
  }

  if (!user) return null;

  const { profile } = user;
  const fullName = `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim();

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarImage
          src={profile.profilePictureUrl || '/default-avatar.png'}
          alt={fullName || user.username}
        />
        <AvatarFallback>
          {profile.firstName?.[0] ?? user.username[0]}
          {profile.lastName?.[0] ?? ''}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium text-muted-foreground">
        {fullName || user.username}
      </span>
    </div>
  );
}
