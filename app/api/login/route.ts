import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include',
      cache: 'no-store',
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { message: data?.message || 'Login failed' },
        { status: backendRes.status }
      );
    }

    const { accessToken, user, expiresIn, tokenType } = data;
    const setCookieHeader = backendRes.headers.get('set-cookie');

    const response = NextResponse.json({ accessToken, user, expiresIn, tokenType });

    if (setCookieHeader) {
      response.headers.set('set-cookie', setCookieHeader);
    }

    return response;
  } catch (err) {
    console.error('[LOGIN ERROR]', err);
    return NextResponse.json({ message: 'Unexpected login error' }, { status: 500 });
  }
}
