import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refreshToken`, {
      method: 'POST',
      credentials: 'include',
      cache: 'no-store',
    });

    const data = await backendRes.json();

    const response = NextResponse.json(data, { status: backendRes.status });

    const setCookie = backendRes.headers.get('set-cookie');
    if (setCookie) {
      response.headers.set('set-cookie', setCookie);
    }

    return response;
  } catch (error) {
    console.error('[REFRESH ERROR]', error);
    return NextResponse.json({ message: 'Token refresh failed' }, { status: 401 });
  }
}
