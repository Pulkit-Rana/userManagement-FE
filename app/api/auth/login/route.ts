// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { LoginResponseSchema } from '@/app/lib/schemas/auth-schemas';
import { handleError } from '@/app/lib/utils/error-handler';

export async function POST(request: NextRequest) {
  try {
    // क्लाइंट का request body 그대로 बैकएंड को भेजें
    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: await request.text(),
        // NOTE: credentials here नहीं भेजने से cookie-forwarding safe रहेगा
      }
    );

    const data = await backendRes.json();
    if (!backendRes.ok) {
      // बैकएंड error मैसेज फॉरवर्ड करें
      return NextResponse.json({ error: data.error || 'Login failed' }, { status: backendRes.status });
    }

    // डेटा validate करें
    const parsed = LoginResponseSchema.parse(data);

    // क्लाइंट को JSON भेजें
    const response = NextResponse.json(parsed, { status: 200 });

    // बैकएंड से Set-Cookie हेडर ले लें
    const setCookie = backendRes.headers.get('set-cookie');
    if (setCookie) {
      // बिना कोई बदलाव किए क्लाइंट को भेजें (path=/ पहले से है या बैकएंड सेट करेगा)
      response.headers.append('Set-Cookie', setCookie);
    }

    return response;
  } catch (err: any) {
    return handleError(err);
  }
}
