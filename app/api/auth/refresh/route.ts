import { NextResponse, NextRequest } from 'next/server';
import { RefreshResponseSchema } from '@/app/lib/schemas/auth-schemas';
import { handleError } from '@/app/lib/utils/error-handler';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get('refreshToken')?.value;
    const authHeader = request.headers.get('authorization');

    console.log('🔍 Refresh Token Check:', {
      hasToken: !!refreshToken,
      tokenLength: refreshToken?.length
    });

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

    const data = await res.json();
    const parsed = RefreshResponseSchema.parse(data);
    
    console.log('🔍 Refresh Backend Response:', {
      hasNewRefreshToken: !!parsed.refreshToken,
      hasAccessToken: !!parsed.accessToken
    });

    const response = NextResponse.json(parsed);

    // 🔧 FIX: More robust cookie setting for refresh
    if (parsed.refreshToken && parsed.refreshToken.trim() !== '') {
      console.log('✅ Setting NEW refreshToken cookie');
      
      response.cookies.set('refreshToken', parsed.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      });
    } else {
      console.log('⚠️ No new refreshToken in refresh response');
    }

    return response;
  } catch (err: any) {
    console.log('🚨 Refresh API Error:', err.message);
    return handleError(err);
  }
}