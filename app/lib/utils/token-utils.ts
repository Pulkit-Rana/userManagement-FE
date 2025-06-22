import { SignJWT, jwtVerify, JWTPayload } from 'jose';

// Signs a JWT with given payload and expiration
export async function signJwt(
  payload: JWTPayload,
  expiresIn: string | number
): Promise<string> {
  const secretKey = new TextEncoder().encode(
    process.env.JWT_SECRET as string
  );
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secretKey);
}

// Verifies a JWT and returns its payload
export async function verifyJwt<T extends JWTPayload = JWTPayload>(
  token: string
): Promise<T> {
  const secretKey = new TextEncoder().encode(
    process.env.JWT_SECRET as string
  );
  const { payload } = await jwtVerify(token, secretKey);
  return payload as T;
}

// Parses a JWT client-side without verification
export function parseJwt<T = any>(
  token: string
): T | null {
  try {
    const base64 = token.split('.')[1];
    const json = atob(
      base64.replace(/-/g, '+').replace(/_/g, '/')
    );
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}