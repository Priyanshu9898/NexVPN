import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isDashboard = pathname.startsWith('/dashboard')
  const isAuth      = pathname.startsWith('/login') || pathname.startsWith('/signup')

  // Zustand persists auth state in localStorage under 'nexvpn-auth'.
  // Middleware runs on the Edge where localStorage isn't available, so
  // we check the cookie that the client writes on login (set in api.ts interceptor).
  // For a lightweight check we look for the Zustand persisted key via a cookie.
  // The real guard is the backend rejecting requests with expired/missing tokens.
  const token = request.cookies.get('nexvpn-token')?.value

  if (isDashboard && !token) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuth && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
}
