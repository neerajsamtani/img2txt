import crypto from 'crypto'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const CORRECT_PASSWORD = process.env.AUTH_PASSWORD

// Generate a secure session token
function generateToken(): string {
    return crypto.randomBytes(32).toString('hex')
}

// Use constant-time comparison to prevent timing attacks
function secureCompare(a: string | undefined, b: string | undefined): boolean {
    if (!a || !b) return false;
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))
}

export async function POST(request: Request) {
    const { password } = await request.json()

    if (secureCompare(password, CORRECT_PASSWORD)) {
        const sessionToken = generateToken()
        const cookieStore = await cookies()

        cookieStore.set('auth_token', sessionToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 7200 // 2 hours
        })

        return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false }, { status: 401 })
} 