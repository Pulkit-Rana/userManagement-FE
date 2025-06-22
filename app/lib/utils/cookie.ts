// utils/cookie.ts
import { NextResponse, NextRequest } from 'next/server';

export function setCookie(
  res: NextResponse,
  name: string,
  value: string,
  path: string,
  maxAge: number
): void {
  res.cookies.set({
    name,
    value,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path,
    maxAge,
  });
}

export function deleteCookie(
  res: NextResponse,
  name: string,
  path: string
): void {
  res.cookies.delete({ name, path });
}

export function safeParseCookie(
  req: NextRequest,
  name: string
): string {
  const cookie = req.cookies.get(name)?.value;
  if (!cookie) throw new Error(`Missing cookie: ${name}`);
  return cookie;
}
