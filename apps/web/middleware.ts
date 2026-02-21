import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(_: NextRequest) {
  const response = NextResponse.next();
  response.headers.set('Content-Security-Policy', "default-src 'self'; img-src 'self' data: https://*.tile.openstreetmap.org; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-eval'; connect-src 'self' http://localhost:* https://*.supabase.co");
  return response;
}

export const config = {
  matcher: '/:path*'
};
