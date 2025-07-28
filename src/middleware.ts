import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/signup', '/about', '/services', '/faqs', '/contact'];
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith('/api/'));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Get NextAuth token
  const token = await getToken({ req: request, secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET });

  // Admin routes
  if (pathname.startsWith('/admin/')) {
    // Check for NextAuth token first
    if (token && token.role === 'admin') {
      return NextResponse.next();
    }

    // Fallback to JWT token for dummy users
    const jwtToken = request.cookies.get('authToken')?.value || 
                    request.headers.get('authorization')?.replace('Bearer ', '');

    if (!jwtToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const decoded = verifyToken(jwtToken);
      if (decoded.role !== 'admin') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Superadmin routes
  if (pathname.startsWith('/superadmin/')) {
    // Check for NextAuth token first
    if (token && token.role === 'superadmin') {
      return NextResponse.next();
    }

    // Fallback to JWT token for dummy users
    const jwtToken = request.cookies.get('authToken')?.value || 
                    request.headers.get('authorization')?.replace('Bearer ', '');

    if (!jwtToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const decoded = verifyToken(jwtToken);
      if (decoded.role !== 'superadmin') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // User routes (like profile, bookings, etc.)
  if (pathname.startsWith('/profile/') || pathname.startsWith('/bookings/')) {
    // Check for NextAuth token first
    if (token && token.role === 'user') {
      return NextResponse.next();
    }

    // Fallback to JWT token for dummy users
    const jwtToken = request.cookies.get('authToken')?.value || 
                    request.headers.get('authorization')?.replace('Bearer ', '');

    if (!jwtToken) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const decoded = verifyToken(jwtToken);
      if (decoded.role !== 'user') {
        return NextResponse.redirect(new URL('/login', request.url));
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 