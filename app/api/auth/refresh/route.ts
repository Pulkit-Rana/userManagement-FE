// File: /app/api/auth/refresh/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { RefreshResponseSchema } from '@/app/lib/schemas/auth-schemas';
import { handleError } from '@/app/lib/utils/error-handler';

export async function POST(request: NextRequest) {
  try {
    const cookie = request.cookies.get('refreshToken')?.value;
    if (!cookie) throw new Error('No refresh token');

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refreshToken`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: cookie }),
        credentials: 'include',
      }
    );
    if (!res.ok) throw new Error('Refresh failed');

    const parsed = RefreshResponseSchema.parse(await res.json());
    const response = NextResponse.json(parsed);
    if (parsed.refreshToken) {
      response.cookies.set('refreshToken', parsed.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      });
    }
    return response;
  } catch (err: any) {
    return handleError(err);
  }
}