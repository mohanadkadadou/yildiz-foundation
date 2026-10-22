import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Protects /admin. The login redirect is built from NEXTAUTH_URL (the public address),
// because behind the reverse proxy the request URL points at the internal localhost:3000.
export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  if (token?.role === 'ADMIN') return NextResponse.next()

  const login = new URL('/auth/login', process.env.NEXTAUTH_URL || req.url)
  login.searchParams.set('callbackUrl', req.nextUrl.pathname)
  return NextResponse.redirect(login)
}

export const config = { matcher: ['/admin/:path*'] }
