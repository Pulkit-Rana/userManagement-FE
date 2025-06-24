// middleware.ts
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
  '/_next'
];

// Secret को Edge Runtime से निकालने के लिए runtime change
const SECRET = process.env.NEXT_PUBLIC_JWT_SECRET!;
if (!SECRET) {
  throw new Error('⚠️ JWT_SECRET environment variable is not defined');
}

async function attemptRefresh(req: NextRequest, retries = 0): Promise<NextResponse | null> {
  try {
    const refreshRes = await fetch(new URL('/api/auth/refresh', req.url), {
      method: 'POST',
      credentials: 'include',  // browser खुद cookie भेज देगा
    });
    if (!refreshRes.ok) throw new Error('Refresh failed');

    const data = (await refreshRes.json()) as RefreshResponse;
    const res = NextResponse.next();
    res.headers.set('authorization', `Bearer ${data.accessToken}`);
    if (data.refreshToken) {
      res.cookies.set('refreshToken', data.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60,
      });
    }
    return res;
  } catch {
    if (retries < 3) {
      await new Promise(r => setTimeout(r, Math.pow(2, retries) * 100));
      return attemptRefresh(req, retries + 1);
    }
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (PUBLIC_PATHS.some(path => pathname === path || pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = request.headers.get('authorization')?.split(' ')[1];
  if (token) {
    try {
      // अब SECRET मिलेगा, इसलिए jwtVerify काम करेगा
      await jwtVerify(token, new TextEncoder().encode(SECRET));
      return NextResponse.next();
    } catch {
      const refreshed = await attemptRefresh(request);
      if (refreshed) return refreshed;
    }
  }
  return NextResponse.redirect(new URL('/auth/login', request.url));
}

// यहाँ runtime को 'nodejs' बताया है ताकि process.env.JWT_SECRET उपलब्ध हो
export const config = {
  matcher: ['/((?!api|_next|favicon.ico).*)'],
};
