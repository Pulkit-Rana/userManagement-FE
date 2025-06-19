// Login
export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string | null;
  expiresIn: number;              // ⬅️ ✅ REQUIRED
  tokenType: string;              // ⬅️ ✅ REQUIRED
  user: User;
}
// Core user model returned after login
export interface User {
  id: string;
  username: string;
  roles: Role[]; // e.g., [{ name: "ROLE_ADMIN" }]
  profile: Profile;
}

// Role assigned to user
export interface Role {
  name: string; // e.g., "ROLE_ADMIN", "ROLE_USER"
}

// Profile associated with user
export interface Profile {
  profilePictureUrl: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  city: string;
  country: string;
  zipCode: string;
  lastLoginDate: string;
}

// Refresh token exchange (FE ↔️ /api/refresh)
export interface RefreshRequest {
  token: string;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken?: string;       // if rotated
  expiresIn: number;           // ⬅️ ✅ REQUIRED
  tokenType: string;           // ⬅️ ✅ REQUIRED
  user?: User;                 // ⬅️ Optional, but backend may return it
}
