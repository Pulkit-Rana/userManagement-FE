import { NextResponse, NextRequest } from 'next/server';
import { LogoutResponseSchema } from '@/app/lib/schemas/auth-schemas';
import { handleError } from '@/app/lib/utils/error-handler';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader ?? '',
      },
      body: '{}',
      credentials: 'include',
    });

    const response = NextResponse.redirect(new URL('/auth/login', request.url), 302);
    response.cookies.set('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });
    return response;
  } catch (error: any) {
    return handleError(error);
  }
}
