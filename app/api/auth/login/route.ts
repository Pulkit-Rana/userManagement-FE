import { NextResponse } from 'next/server';
import { LoginResponseSchema } from '@/app/lib/schemas/auth-schemas';
import { handleError } from '@/app/lib/utils/error-handler';

export async function POST(request: Request) {
  try {
    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: await request.text(),
        credentials: 'include',
      }
    );

    const data = await backendRes.json();
    const parsed = LoginResponseSchema.parse(data);

    const response = NextResponse.json(parsed);
    const backendCookie = backendRes.headers.get('set-cookie');

    if (backendCookie) {
      const parsedCookie = backendCookie
        .split(';')[0]
        .split('=');
      const [cookieName, cookieValue] = parsedCookie;

      if (cookieName === 'refreshToken') {
        response.cookies.set('refreshToken', cookieValue, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          path: '/',
          maxAge: 60 * 60 * 48, // 48 hours
        });
      }
    }

    return response;
  } catch (error: any) {
    return handleError(error);
  }
}
