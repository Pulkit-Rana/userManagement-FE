import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';
import type { RefreshResponse } from '@/app/lib/schemas/auth-schemas';

const PUBLIC_PATHS = [
  '/',
  '/login',
  '/auth/login',
  '/api/auth/login',
  '/api/auth/refresh',
  '/api/auth/logout',
  '/_next',
  '/favicon.ico',
  '/robots.txt',
];

const SECRET = process.env.NEXT_PUBLIC_JWT_SECRET!;
if (!SECRET) {
  throw new Error('⚠️ JWT_SECRET environment variable is not defined');
}

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

    if (data.refreshToken) {
      res.cookies.set('refreshToken', data.refreshToken, {
        httpOnly: true,
        secure: true, // ✅ use secure in production
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 48, // 48h
      });
    }

    return res;
  } catch {
    if (retries < 2) {
      await new Promise((r) => setTimeout(r, Math.pow(2, retries) * 100));
      return attemptRefresh(req, retries + 1);
    }
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some((path) => pathname === path || pathname.startsWith(path))) {
    return NextResponse.next();
  }

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

  return NextResponse.redirect(new URL('/auth/login', request.url));
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico|robots.txt).*)'],
};
