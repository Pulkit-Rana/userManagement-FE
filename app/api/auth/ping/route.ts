import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/ping`, {
    method: 'GET',
    headers: {
      Authorization: authHeader ?? '',
    },
  });

  if (!res.ok) {
    return NextResponse.json({ valid: false }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
