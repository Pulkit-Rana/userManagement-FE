import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export function handleError(error: any) {
  // Zod validation errors -> 400 Bad Request
  if (error instanceof ZodError) {
    return NextResponse.json(
      { error: error.errors.map((e) => ({ path: e.path, message: e.message })) },
      { status: 400 }
    );
  }

  // Authentication errors -> 401 Unauthorized
  const message = error.message || 'Unauthorized';
  if (
    message === 'Invalid credentials' ||
    message === 'No Authorization header' ||
    message === 'No refresh token' ||
    message === 'Refresh failed'
  ) {
    return NextResponse.json({ error: message }, { status: 401 });
  }

  // Fallback -> 500 Internal Server Error
  console.error('[Error]', error);
  return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}