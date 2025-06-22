// File: /middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import type { RefreshResponse } from '@/app/lib/schemas/auth-schemas';

const PUBLIC_PATHS = [
  '/',
  '/auth/login',                    // ✅ Correct login path
  '/api/auth/login',
  '/api/auth/refresh',
  '/api/auth/logout',
  '/_next',
];

const SECRET = process.env.JWT_SECRET;

async function attemptRefresh(req: NextRequest, retries = 0): Promise<NextResponse | null> {
  try {
    const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        cookie: req.headers.get('cookie') || '',
      },
      credentials: 'include',
    });

    if (!refreshRes.ok) throw new Error('Refresh failed');
    const data = (await refreshRes.json()) as RefreshResponse;

    const res = NextResponse.next();
    res.headers.set('authorization', `Bearer ${data.accessToken}`);
    return res;
  } catch {
    if (retries < 3) {
      const backoff = Math.pow(2, retries) * 100;
      await new Promise((r) => setTimeout(r, backoff));
      return attemptRefresh(req, retries + 1);
    }
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublic = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path)
  );
  if (isPublic) return NextResponse.next();

  const token = request.headers.get('authorization')?.split(' ')[1];
  if (token) {
    try {
      await jwtVerify(token, new TextEncoder().encode(SECRET));
      return NextResponse.next();
    } catch {
      const refreshed = await attemptRefresh(request);
      if (refreshed) return refreshed;
    }
  }

  const loginUrl = new URL('/auth/login', request.url); // ✅ fixed redirect path
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico).*)'],
};
