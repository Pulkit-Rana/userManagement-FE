'use client';

import { useAuth } from '@/app/context/AuthContext';
import Image from 'next/image';
import {
  Avatar, AvatarFallback, AvatarImage,
} from '@/app/ui/components/avatar';
import {
  Card, CardHeader, CardTitle, CardContent,
} from '@/app/ui/components/card';

function getInitials(name?: string) {
  if (!name) return '';
  return name.trim().split(/\s+/).map(s => s[0]?.toUpperCase()).slice(0, 2).join('');
}

export default function ProfilePageContent() {
  const { user } = useAuth();
  if (!user) return null; // not logged in

  // profile null/undefined ho sakta hai → defaults
  const profile = user.profile ?? {
    firstName: '',
    lastName: '',
    profilePictureUrl: '',
    phoneNumber: '',
    country: '',
    city: '',
    address: '',
    zipCode: '',
  };

  const fullNameRaw = `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim();
  const fullName = fullNameRaw || user.username || 'User';
  const initials =
    getInitials(fullNameRaw) || (user.username?.[0]?.toUpperCase() ?? '');
  const avatarSrc = profile.profilePictureUrl || '/avatar-placeholder.png';

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Your Profile</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center space-y-6">
        <Avatar className="w-24 h-24">
          <AvatarImage asChild>
            <Image
              src={avatarSrc}
              alt={fullName}
              width={96}
              height={96}
              className="rounded-full object-cover"
              // priority // chaaho to LCP improve karne ke liye on karo
            />
          </AvatarImage>
          <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
        </Avatar>

        <h3 className="text-xl font-semibold">{fullName}</h3>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-muted-foreground uppercase text-xs">Email</p>
            <p className="text-sm break-all">{user.username}</p>
          </div>
          <div>
            <p className="text-muted-foreground uppercase text-xs">Phone</p>
            <p className="text-sm">{profile.phoneNumber || '—'}</p>
          </div>
          <div>
            <p className="text-muted-foreground uppercase text-xs">Country</p>
            <p className="text-sm">{profile.country || '—'}</p>
          </div>
          <div>
            <p className="text-muted-foreground uppercase text-xs">City</p>
            <p className="text-sm">{profile.city || '—'}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-muted-foreground uppercase text-xs">Address</p>
            <p className="text-sm">{profile.address || '—'}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-muted-foreground uppercase text-xs">Zip Code</p>
            <p className="text-sm">{profile.zipCode || '—'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
