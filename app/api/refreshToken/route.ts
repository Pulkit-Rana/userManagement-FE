import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refreshToken`, {
      method: 'POST',
      credentials: 'include',
      cache: 'no-store',
    });

    const setCookie = backendRes.headers.get('set-cookie');
    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json({ message: data?.message || 'Refresh failed' }, { status: backendRes.status });
    }

    const response = NextResponse.json(data, { status: backendRes.status });

    if (setCookie) {
      response.headers.set('set-cookie', setCookie);
    }

    return response;
  } catch (error) {
    console.error('[REFRESH ERROR]', error);
    return NextResponse.json({ message: 'Token refresh failed' }, { status: 401 });
  }
}
