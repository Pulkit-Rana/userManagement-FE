import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import type { RefreshResponse } from '@/app/lib/schemas/auth-schemas';

const PUBLIC_PATHS = [
  '/', '/login', '/auth/login',
  '/api/auth/login',
  '/api/auth/logout',
  '/api/auth/refresh',
  '/api/auth/me',
  '/_next', '/favicon.ico', '/robots.txt',
];

const SECRET = process.env.NEXT_PUBLIC_JWT_SECRET!;
if (!SECRET) throw new Error('⚠️ NEXT_PUBLIC_JWT_SECRET is not defined');

async function attemptRefresh(req: NextRequest, retries = 0): Promise<NextResponse | null> {
  try {
    const refreshRes = await fetch(new URL('/api/auth/refresh', req.url), {
      method: 'POST',
      credentials: 'include',
    });
    if (!refreshRes.ok) throw new Error('Refresh failed');

    const data = (await refreshRes.json()) as RefreshResponse;
    const res = NextResponse.next();
    res.headers.set('authorization', `Bearer ${data.accessToken}`);
    return res;
  } catch {
    if (retries < 2) {
      await new Promise(r => setTimeout(r, Math.pow(2, retries) * 100));
      return attemptRefresh(req, retries + 1);
    }
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Prevent logged-in users from seeing login page
  if (pathname === '/auth/login' || pathname === '/login') {
    const cookie = request.cookies.get('refreshToken')?.value;
    if (cookie) {
      const refreshed = await attemptRefresh(request);
      if (refreshed) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    }
    return NextResponse.next();
  }

  // Allow public paths
  if (PUBLIC_PATHS.some(path => pathname === path || pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Protect other routes
  const authHeader = request.headers.get('authorization') ?? '';
  const token = authHeader.split(' ')[1] || null;

  if (token) {
    try {
      await jwtVerify(token, new TextEncoder().encode(SECRET));
      return NextResponse.next();
    } catch {
      const refreshed = await attemptRefresh(request);
      if (refreshed) return refreshed;
    }
  } else {
    const refreshed = await attemptRefresh(request);
    if (refreshed) return refreshed;
  }

  // Not authenticated → login
  return NextResponse.redirect(new URL('/auth/login', request.url));
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico|robots.txt).*)'],
};
