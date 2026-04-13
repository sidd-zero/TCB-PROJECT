import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/lib/auth';

// Add paths that should be accessible without authentication
const publicPaths = ['/', '/login', '/api/auth/login'];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  // Skip logic for static assets and public files
  if (path.startsWith('/_next') || path.includes('.')) {
    return NextResponse.next();
  }

  const isPublicPath = publicPaths.some(p => path === p || path.startsWith('/api/auth/'));
  const sessionToken = req.cookies.get('session')?.value;

  // 1. If trying to access a protected path without a session, redirect to login
  if (!isPublicPath && !sessionToken) {
    return NextResponse.redirect(new URL('/login', req.nextUrl));
  }

  // 2. Auth checks
  if (sessionToken) {
    try {
      const payload = await decrypt(sessionToken);
      
      // If already authenticated and trying to access login or landing, redirect to dashboard
      if (path === '/login' || path === '/') {
        return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
      }

      // ONBOARDING REDIRECT LOGIC
      // If not onboarded and not on the onboarding page, redirect to it
      // ONLY if it's not a public path or an API route
      if (!payload.isOnboarded && path !== '/onboarding' && !isPublicPath && !path.startsWith('/api/')) {
        return NextResponse.redirect(new URL('/onboarding', req.nextUrl));
      }

      // If already onboarded and trying to access the onboarding page, redirect home
      if (payload.isOnboarded && path === '/onboarding') {
        return NextResponse.redirect(new URL('/', req.nextUrl));
      }
    } catch (err) {
      // Session invalid fallback
      if (!isPublicPath) {
        return NextResponse.redirect(new URL('/login', req.nextUrl));
      }
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
