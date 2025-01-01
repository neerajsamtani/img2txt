import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
    const authToken = request.cookies.get('auth_token')?.value

    // If they're trying to access the login page, let them through
    if (request.nextUrl.pathname === '/login') {
        return NextResponse.next()
    }

    // If they have a token, let them through
    if (authToken) {
        return NextResponse.next()
    }

    // Otherwise, redirect to login
    return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
} 