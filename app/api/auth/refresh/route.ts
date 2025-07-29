// app/api/auth/refresh/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { RefreshResponseSchema } from '@/app/lib/schemas/auth-schemas';
import { handleError } from '@/app/lib/utils/error-handler';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization') || '';

    const refreshToken = request.cookies.get('refreshToken')?.value;
    if (!refreshToken) {
      throw new Error('No valid refresh token found');
    }

    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refreshToken`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authHeader && { Authorization: authHeader }),
        },
        body: JSON.stringify({ token: refreshToken }),
      }
    );

    const data = await backendRes.json();
    if (!backendRes.ok) {
      throw new Error(data.error || 'Refresh token rejected by backend');
    }

    const parsed = RefreshResponseSchema.parse(data);

    const response = NextResponse.json(
      { accessToken: parsed.accessToken },
      { status: 200 }
    );

    const setCookie = backendRes.headers.get('set-cookie');
    if (setCookie) {
      response.headers.append('Set-Cookie', setCookie);
    }

    return response;
  } catch (err: any) {
    return handleError(err);
  }
}
