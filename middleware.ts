import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth';

// Add paths that should be accessible without authentication
const publicPaths = ['/login', '/api/auth/login'];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isPublicPath = publicPaths.some(p => path === p || path.startsWith('/api/auth/'));

  const session = req.cookies.get('session')?.value;

  // 1. If trying to access a protected path without a session, redirect to login
  if (!isPublicPath && !session) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  // 2. If trying to access login while already authenticated, redirect to dashboard
  if (path === '/login' && session) {
    try {
      await decrypt(session);
      return NextResponse.redirect(new URL('/', req.nextUrl));
    } catch (err) {
      // Session invalid, let user stay on login
    }
  }

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes except auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/(?!auth)|_next/static|_next/image|favicon.ico).*)',
  ],
};
