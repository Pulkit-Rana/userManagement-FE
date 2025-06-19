import { z } from 'zod';

//
// 🔐 Zod Schemas
//

export const RoleSchema = z.object({
  name: z.string(), // e.g., "ROLE_ADMIN"
});

export const ProfileSchema = z.object({
  profilePictureUrl: z.string().url().nullable(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  country: z.string().nullable(),
  zipCode: z.string().nullable(),
  lastLoginDate: z.string(), // or .transform((v) => new Date(v))
});

export const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string().email(),
  roles: z.array(RoleSchema),
  profile: ProfileSchema,
});

export const LoginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string().nullable().optional(),
  expiresIn: z.number(), // ⏳ Token expiry in seconds
  tokenType: z.string(), // e.g., "Bearer"
  user: UserSchema,
});

export const RefreshResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string().optional(),
  expiresIn: z.number(),
  tokenType: z.string(),
  user: UserSchema.optional(),
});

//
// ✅ TypeScript Types inferred from schemas
//

export type Role = z.infer<typeof RoleSchema>;
export type Profile = z.infer<typeof ProfileSchema>;
export type User = z.infer<typeof UserSchema>;

export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type RefreshResponse = z.infer<typeof RefreshResponseSchema>;

//
// 🧾 DTOs (client request body shapes)
//

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RefreshRequest {
  token: string;
}
