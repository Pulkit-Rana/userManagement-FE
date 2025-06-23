// File: /app/api/auth/refresh/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { RefreshResponseSchema } from '@/app/lib/schemas/auth-schemas';
import { handleError } from '@/app/lib/utils/error-handler';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value;
    const authHeader = request.headers.get('authorization');

    if (!refreshToken) throw new Error('No refresh token found in cookies');

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refreshToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader }),
      },
      body: JSON.stringify({ token: refreshToken }),
      credentials: 'include',
    });

    if (!res.ok) throw new Error('Refresh failed');

    const parsed = RefreshResponseSchema.parse(await res.json());
    const response = NextResponse.json(parsed);

    if (parsed.refreshToken) {
      response.cookies.set('refreshToken', parsed.refreshToken, {
        httpOnly: true,
        secure: false,
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
