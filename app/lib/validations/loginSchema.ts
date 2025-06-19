// lib/validators/loginSchema.ts
import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});

export const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string().email(),
  roles: z.array(z.string()),
  profile: z.object({
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    phoneNumber: z.string().nullable(),
    address: z.string().nullable(),
    city: z.string().nullable(),
    country: z.string().nullable(),
    zipCode: z.string().nullable(),
    profilePictureUrl: z.string().url().nullable(),
    lastLoginDate: z.string(), // keep as string or use `.transform(date => new Date(date))`
  }),
});

export type User = z.infer<typeof UserSchema>;