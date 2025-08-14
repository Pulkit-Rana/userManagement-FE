// auth-schemas.ts
import { z } from "zod";

/** Profile: BE DTO ke sab fields optional/nullable ho sakte hain */
export const ProfileSchema = z.object({
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  profilePictureUrl: z.string().url().nullable().optional(),
  phoneNumber: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  zipCode: z.string().nullable().optional(),
  lastLoginDate: z.string().nullable().optional(), // ISO string agar bhej rahe ho
});
export type Profile = z.output<typeof ProfileSchema>;

/** Roles: backend Set<String> bhej raha hai → future-safe */
const RolesArraySchema = z.array(z.string().min(1));

/** User: BE me username hai; FE components me bhi use ho raha */
export const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string().email(),
  roles: RolesArraySchema,
  profile: ProfileSchema.nullable().optional(),
});
export type User = z.output<typeof UserSchema>;

export const LoginResponseSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().nullable().optional(),
  expiresIn: z.number(),
  tokenType: z.string().min(1),
  user: UserSchema,
});
export type LoginResponse = z.output<typeof LoginResponseSchema>;

export const RefreshResponseSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().nullable().optional(),
});
export type RefreshResponse = z.output<typeof RefreshResponseSchema>;

export const LogoutResponseSchema = z.object({
  message: z.string(),
});
export type LogoutResponse = z.output<typeof LogoutResponseSchema>;

export const GetCurrentUserResponseSchema = UserSchema;
export type GetCurrentUserResponse = z.output<typeof UserSchema>;

/** Login request: BE = min 8 */
export const LoginRequestSchema = z.object({
  username: z.string().email(),
  password: z.string().min(8),
});
export type LoginRequest = z.output<typeof LoginRequestSchema>;

/** Optional: normalize helper taaki UI components me profile hamesha same shape rahe */
export type NormalizedProfile = {
  firstName: string;
  lastName: string;
  profilePictureUrl: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  lastLoginDate: string;
};

export type NormalizedUser = Omit<User, "profile"> & { profile: NormalizedProfile };

export function normalizeUser(u: User): NormalizedUser {
  const p = u.profile ?? {};
  return {
    ...u,
    profile: {
      firstName: p.firstName ?? "",
      lastName: p.lastName ?? "",
      profilePictureUrl: p.profilePictureUrl ?? "",
      phoneNumber: p.phoneNumber ?? "",
      address: p.address ?? "",
      city: p.city ?? "",
      country: p.country ?? "",
      zipCode: p.zipCode ?? "",
      lastLoginDate: p.lastLoginDate ?? "",
    },
  };
}
