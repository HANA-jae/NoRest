import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard'];
const authRoutes = ['/register'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for auth token in cookies
  // Note: Zustand stores in localStorage, so we need client-side protection
  // This middleware provides an additional layer of protection
  const authStorage = request.cookies.get('auth-storage');

  let isAuthenticated = false;
  if (authStorage?.value) {
    try {
      const parsed = JSON.parse(authStorage.value);
      isAuthenticated = parsed.state?.isAuthenticated === true;
    } catch {
      isAuthenticated = false;
    }
  }

  // Redirect authenticated users away from auth pages
  if (authRoutes.some(route => pathname.startsWith(route))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // Note: For client-side auth with Zustand + localStorage,
  // the main protection happens in the client components
  // This middleware is a supplementary check

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/register'],
};
