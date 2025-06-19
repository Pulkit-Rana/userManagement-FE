// ✅ app/api/user/route.ts — Responsible for checking current session via JWT
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me`;
    const refreshUrl = `${req.nextUrl.origin}/api/refreshToken`; // ✅ local internal call fallback

    // Try initial session fetch
    const initialRes = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        cookie: req.headers.get('cookie') || '',
      },
      credentials: 'include',
      cache: 'no-store',
    });

    if (initialRes.status === 401 || initialRes.status === 403) {
      const refreshRes = await fetch(refreshUrl, {
        method: 'POST',
        credentials: 'include',
        cache: 'no-store',
      });

      if (!refreshRes.ok) {
        return NextResponse.json({ message: 'Session expired' }, { status: 401 });
      }

      const retryRes = await fetch(backendUrl, {
        method: 'GET',
        headers: {
          cookie: req.headers.get('cookie') || '',
        },
        credentials: 'include',
        cache: 'no-store',
      });

      if (!retryRes.ok) {
        return NextResponse.json({ message: 'Unauthorized after retry' }, { status: retryRes.status });
      }

      const retryData = await retryRes.json();
      return NextResponse.json(retryData);
    }

    const data = await initialRes.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('[USER SESSION CHECK]', error);
    return NextResponse.json({ message: 'Session fetch failed' }, { status: 500 });
  }
}
