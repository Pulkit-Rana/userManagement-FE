// File: /app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { LoginResponseSchema } from '@/app/lib/schemas/auth-schemas';
import { handleError } from '@/app/lib/utils/error-handler';

const LoginRequestSchema = z.object({
  username: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password } = LoginRequestSchema.parse(body);

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });

    if (!res.ok) throw new Error('Invalid credentials');
    const data = await res.json();
    const parsed = LoginResponseSchema.parse(data);

    const response = NextResponse.json(parsed, { status: 200 });
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
  } catch (error: any) {
    return handleError(error);
  }
}