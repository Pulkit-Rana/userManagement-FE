import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        Cookie: req.headers.get('cookie') || '',
        Authorization: req.headers.get('authorization') || '',
      },
    });

    const setCookie = backendRes.headers.get('set-cookie');
    const response = NextResponse.json({}, { status: backendRes.status });

    if (setCookie) {
      response.headers.set('set-cookie', setCookie);
    }

    return response;
  } catch (err) {
    console.error('[LOGOUT ERROR]', err);
    return NextResponse.json({ message: 'Logout failed' }, { status: 500 });
  }
}
