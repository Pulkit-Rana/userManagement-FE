'use client';

import { useAuth } from '@/app/context/AuthContext';
import UserProfile from '@/app/ui/header/userProfile';

export default function ProfilePageContent() {
  const { user } = useAuth();

  if (!user) return null;

  const { profile } = user;
  const fullName = `${profile.firstName ?? ''} ${profile.lastName ?? ''}`.trim();

  return (
    <div className="p-6 space-y-6">
      {/* 🔝 Top-right profile summary */}
      <div className="flex justify-end">
        <UserProfile />
      </div>

      {/* 👤 Full profile section */}
      <h2 className="text-xl font-semibold">👤 Your Profile</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">First Name</p>
          <p>{profile.firstName || '—'}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Last Name</p>
          <p>{profile.lastName || '—'}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Email</p>
          <p>{user.username}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Phone</p>
          <p>{profile.phoneNumber || '—'}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Country</p>
          <p>{profile.country || '—'}</p>
        </div>
        <div>
          <p className="text-muted-foreground">City</p>
          <p>{profile.city || '—'}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Address</p>
          <p>{profile.address || '—'}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Zip Code</p>
          <p>{profile.zipCode || '—'}</p>
        </div>
      </div>
    </div>
  );
}
