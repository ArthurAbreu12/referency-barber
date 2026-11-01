import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Proteção de rotas /admin — requer role ADMIN
  if (pathname.startsWith('/admin')) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    })

    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    if ((token as any).role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  const response = NextResponse.next()

  response.headers.set('X-DNS-Prefetch-Control', 'on')
  response.headers.set('X-UA-Compatible', 'IE=edge')

  return response
}

export const config = {
  matcher: ['/admin/:path*'],
}
