// app/api/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { message: data.message || 'OTP verification failed' },
        { status: backendRes.status }
      );
    }

    // Pass refresh token from backend if sent via Set-Cookie
    const setCookie = backendRes.headers.get('set-cookie');
    const response = NextResponse.json(
      {
        accessToken: data.accessToken,
        tokenType: data.tokenType,
        expiresIn: data.expiresIn,
        user: data.user, // includes profile: { firstName, lastName, ... }
      },
      { status: backendRes.status }
    );

    if (setCookie) {
      response.headers.set('set-cookie', setCookie);
    }

    return response;
  } catch (err: any) {
    console.error('[verify-otp] error:', err);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
