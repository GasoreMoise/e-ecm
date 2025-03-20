import { NextResponse } from 'next/server'
import { encrypt } from '@/lib/auth'
import { sendPasswordResetEmail } from '@/lib/email'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    // Check if user exists
    const user = await db.user.findUnique({
      where: { email }
    })

    if (!user) {
      // Return success even if user doesn't exist for security
      return NextResponse.json({
        message: 'If an account exists, you will receive a password reset email.'
      })
    }

    // Generate reset token (1 hour expiry)
    const resetToken = await encrypt({
      email,
      purpose: 'password-reset',
      exp: Math.floor(Date.now() / 1000) + 60 * 60
    })

    // Store reset token
    await db.user.update({
      where: { email },
      data: { resetToken }
    })

    // Send reset email
    await sendPasswordResetEmail(email, resetToken)

    return NextResponse.json({
      message: 'If an account exists, you will receive a password reset email.'
    })
  } catch (error) {
    console.error('Password reset request error:', error)
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    )
  }
} 