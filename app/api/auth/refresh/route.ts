import { NextResponse, NextRequest } from 'next/server';
import { RefreshResponseSchema } from '@/app/lib/schemas/auth-schemas';
import { handleError } from '@/app/lib/utils/error-handler';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value;
    const authHeader = request.headers.get('authorization');

    if (!refreshToken || refreshToken.trim() === '') {
      throw new Error('No valid refresh token found');
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refreshToken`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { Authorization: authHeader }),
      },
      body: JSON.stringify({ token: refreshToken }),
      credentials: 'include',
    });

    if (!res.ok) throw new Error('Refresh token rejected by backend');

    const data = await res.json();
    const parsed = RefreshResponseSchema.parse(data);
    const response = NextResponse.json(parsed);

    if (parsed.refreshToken && parsed.refreshToken.trim() !== '') {
      response.cookies.set('refreshToken', parsed.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 48, // 48 hours
      });
    }

    return response;
  } catch (err: any) {
    return handleError(err);
  }
}
