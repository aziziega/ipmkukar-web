import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/auth'

// Routes that require authentication
const protectedRoutes = ['/admin/dashboard']

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/admin/login']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get auth token from cookie
  const token = request.cookies.get('auth-token')?.value

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // Check if route is auth route (login page)
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Verify token if it exists
  let isAuthenticated = false
  if (token) {
    const payload = await verifyToken(token)
    isAuthenticated = payload !== null
  }

  // Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to dashboard if accessing login page while authenticated
  if (isAuthRoute && isAuthenticated) {
    const dashboardUrl = new URL('/admin/dashboard', request.url)
    return NextResponse.redirect(dashboardUrl)
  }

  // Allow the request to proceed
  return NextResponse.next()
}

// Configure which routes should be handled by this middleware
export const config = {
  matcher: [
    '/admin/:path*',
    // Exclude API routes and static files
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
