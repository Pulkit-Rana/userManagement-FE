// File: /app/api/user/route.ts
import { NextResponse } from 'next/server';
import { GetCurrentUserResponseSchema } from '@/app/lib/schemas/auth-schemas';
import { handleError } from '@/app/lib/utils/error-handler';

export async function GET(request: Request) {
  try {
    const auth = request.headers.get('authorization');
    if (!auth) throw new Error('No Authorization header');

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me`, {
      headers: { Authorization: auth },
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch user');

    const data = await res.json();
    const parsed = GetCurrentUserResponseSchema.parse(data);
    return NextResponse.json(parsed, { status: 200 });
  } catch (error: any) {
    return handleError(error);
  }
}
