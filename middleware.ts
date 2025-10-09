import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect /dashboard to /profile
  if (pathname.startsWith('/dashboard')) {
    const url = new URL('/profile', request.url)
    return NextResponse.redirect(url)
  }

  // Simple redirects for now - auth will be handled client-side
  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*'],
}
