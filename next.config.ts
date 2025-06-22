/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    middleware: true,
  },
  // Optional: central middleware matcher to protect all routes except login and auth APIs
  middleware: [
    {
      source: '/((?!api/auth/login|api/auth/refresh|api/auth/logout|_next/static|_next/image|favicon.ico).*)',
    },
  ],
};
module.exports = nextConfig;