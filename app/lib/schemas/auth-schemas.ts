// File: /app/lib/schemas/auth-schemas.ts
import { z } from "zod";

// --- Profile (shared by /users/me and login.user.profile) ---
export const ProfileSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  phoneNumber: z.string().nullable(),
  address: z.string().nullable(),
  city: z.string().nullable(),
  country: z.string().nullable(),
  zipCode: z.string().nullable(),
  profilePictureUrl: z.string().url(),
  lastLoginDate: z.string().optional().nullable(),
});
export type Profile = z.infer<typeof ProfileSchema>;

// --- User (returned in login + GET /users/me) ---
export const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string().email(), // maps to 'email' field on frontend form
  roles: z.array(z.enum(["ADMIN", "USER"])),
  profile: ProfileSchema,
});
export type User = z.infer<typeof UserSchema>;

// --- POST /api/auth/login response ---
export const LoginResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string().nullable().optional(),
  expiresIn: z.number(),
  tokenType: z.string(),
  user: UserSchema,
});
export type LoginResponse = z.infer<typeof LoginResponseSchema>;

// --- POST /api/auth/refreshToken response ---
export const RefreshResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string().nullable().optional(),
});
export type RefreshResponse = z.infer<typeof RefreshResponseSchema>;

// --- POST /api/auth/logout response ---
export const LogoutResponseSchema = z.object({
  message: z.string(),
});
export type LogoutResponse = z.infer<typeof LogoutResponseSchema>;

// --- GET /api/users/me response (same as UserSchema) ---
export const GetCurrentUserResponseSchema = UserSchema;
export type GetCurrentUserResponse = User;

// --- POST /api/auth/login request body ---
export const LoginRequestSchema = z.object({
  email: z.string().email(), // frontend field
  password: z.string().min(6),
});
export type LoginRequest = z.infer<typeof LoginRequestSchema>;