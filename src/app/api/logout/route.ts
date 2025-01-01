import { NextResponse } from 'next/server'

export async function POST() {
    const response = NextResponse.json({ success: true })

    // Set the cookie with an expired date and matching path/domain settings
    response.cookies.set('auth_token', '', {
        expires: new Date(0),
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
    })

    return response
}