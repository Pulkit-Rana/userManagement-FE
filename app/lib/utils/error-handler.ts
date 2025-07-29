// lib/utils/error-handler.ts
import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export function handleError(error: unknown) {
  console.error('[handleError]', error);

  // ✅ Zod validation error → 400
  if (error instanceof ZodError) {
    const messages = error.errors.map(e => `${e.path.join('.')}: ${e.message}`);
    return NextResponse.json(
      {
        message: 'Validation failed',
        details: messages,
      },
      { status: 400 }
    );
  }

  const message = (typeof error === 'object' && error && 'message' in error)
    ? (error as any).message
    : 'Unexpected error occurred';

  // ✅ Auth-related → 401
  if (
    message === 'Invalid credentials' ||
    message === 'No Authorization header' ||
    message === 'No refresh token' ||
    message === 'Refresh failed'
  ) {
    return NextResponse.json({ message }, { status: 401 });
  }

  // ✅ Optional: other known app errors (403, 404, 422, etc)
  if (message === 'Forbidden') {
    return NextResponse.json({ message }, { status: 403 });
  }

  if (message === 'Not Found') {
    return NextResponse.json({ message }, { status: 404 });
  }

  // ✅ Fallback → 500
  return NextResponse.json(
    { message: 'Internal Server Error', details: message },
    { status: 500 }
  );
}
