// app/api/user/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    // 1) Read accessToken from HttpOnly cookie
    const token = req.cookies.get('accessToken')?.value
    if (!token) {
      return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
    }

    // 2) Forward as Authorization header to correct backend endpoint
    const backendRes = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/me`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    )

    // 3) Handle backend 401 explicitly
    if (backendRes.status === 401) {
      return NextResponse.json(
        { message: 'Session expired' },
        { status: 401 }
      )
    }

    if (!backendRes.ok) {
      return NextResponse.json(
        { message: 'Failed to fetch user' },
        { status: backendRes.status }
      )
    }

    // 4) Forward only the user JSON
    const user = await backendRes.json()
    return NextResponse.json(user)
  } catch (error) {
    console.error('[USER ERROR]', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}