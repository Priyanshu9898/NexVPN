import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isDashboard = pathname.startsWith('/dashboard')
  const isAdmin     = pathname.startsWith('/admin')
  const isAuth      = pathname.startsWith('/login') || pathname.startsWith('/signup')

  const token = request.cookies.get('nexvpn-token')?.value
  const role  = request.cookies.get('nexvpn-role')?.value

  // Not logged in → redirect to login
  if ((isDashboard || isAdmin) && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Logged in but not admin → redirect to dashboard
  if (isAdmin && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Already logged in → redirect away from auth pages
  if (isAuth && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/signup'],
}
