import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const session = await auth()
  const { pathname } = request.nextUrl

  // Redirect /dashboard to /profile
  if (pathname.startsWith('/dashboard')) {
    const url = new URL('/profile', request.url)
    return NextResponse.redirect(url)
  }

  // Protect /profile for authenticated users
  if (pathname.startsWith('/profile')) {
    if (!session?.user) {
      const url = new URL('/auth', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }
  }

  // Protect /admin for ADMIN only
  if (pathname.startsWith('/admin')) {
    if (!session?.user) {
      const url = new URL('/auth', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }
    if (session.user.role !== 'ADMIN') {
      const url = new URL('/profile', request.url)
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/admin/:path*'],
}
