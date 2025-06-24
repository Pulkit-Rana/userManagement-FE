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
    // 1) backend कॉल
    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
      { method: 'POST', headers:{'Content-Type':'application/json'}, body: await request.text(), credentials:'include' }
    );

    // 2) JSON पढ़ो
    const data = await backendRes.json();
    const parsed = LoginResponseSchema.parse(data);

    // 3) Next.js response बनाएँ
    const response = NextResponse.json(parsed);

    // 4) अगर backend ने Set-Cookie भेजी है, उसे आगे भेज दो
    const setCookie = backendRes.headers.get('set-cookie');
    if (setCookie) {
      response.headers.set('set-cookie', setCookie);
    }

    return response;
  } catch (error: any) {
    return handleError(error);
  }
}