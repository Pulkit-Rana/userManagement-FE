'use client';

import { useAuth } from '@/app/context/AuthContext';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/app/ui/components/avatar';

export default function UserProfile() {
  const { user } = useAuth();

  if (!user) return null;

  const initials = `${user.profile.firstName?.[0] ?? ''}${user.profile.lastName?.[0] ?? ''}`;

  return (
    <div className="flex items-center gap-3">
      <Avatar>
        <AvatarImage src={user.profile.profilePictureUrl} alt="Profile Picture" />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <div className="text-sm font-medium">
        {user.profile.firstName} {user.profile.lastName}
      </div>
    </div>
  );
}
