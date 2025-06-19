import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        // ✅ Forward cookies
        Cookie: req.headers.get('cookie') || '',
        // ✅ Forward access token so backend can extract username
        Authorization: req.headers.get('authorization') || '',
      },
    });

    const response = NextResponse.json({}, { status: backendRes.status });

    // ✅ Forward Set-Cookie to expire refresh token
    const setCookie = backendRes.headers.get('set-cookie');
    if (setCookie) {
      response.headers.set('set-cookie', setCookie);
    }

    return response;
  } catch (err) {
    return NextResponse.json(
      { message: 'Logout failed' },
      { status: 500 }
    );
  }
}
