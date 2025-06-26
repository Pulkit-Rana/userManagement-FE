// app/api/auth/refresh/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { RefreshResponseSchema } from '@/app/lib/schemas/auth-schemas';
import { handleError } from '@/app/lib/utils/error-handler';

export async function POST(request: NextRequest) {
  try {
    // 1) पुरानी JWT header से निकालें
    const authHeader = request.headers.get('authorization') || '';

    // 2) refreshToken cookie से निकालें
    const refreshToken = request.cookies.get('refreshToken')?.value;
    if (!refreshToken) {
      throw new Error('No valid refresh token found');
    }

    // 3) बैकएंड को कॉल: header + JSON बॉडी दोनों भेजें
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

    // 4) रेस्पॉन्स validate करें
    const parsed = RefreshResponseSchema.parse(data);

    // 5) क्लाइंट को नया JWT भेजें
    const response = NextResponse.json(
      { accessToken: parsed.accessToken },
      { status: 200 }
    );

    // 6) नया refreshToken cookie (Set-Cookie) क्लाइंट को फॉरवर्ड करें
    const setCookie = backendRes.headers.get('set-cookie');
    if (setCookie) {
      response.headers.append('Set-Cookie', setCookie);
    }

    return response;
  } catch (err: any) {
    return handleError(err);
  }
}
