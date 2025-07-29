// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const backendRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const text = await backendRes.text();
    const data = JSON.parse(text);

    if (!backendRes.ok) {
      return NextResponse.json(
        { message: data?.message || 'Registration failed' },
        { status: backendRes.status }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('[register] error:', err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
