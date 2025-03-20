import { NextResponse } from 'next/server'
import { encrypt } from '@/lib/auth'
import { sendVerificationEmail } from '@/lib/email'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    // Find user
    const user = await db.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: 'Email already verified' },
        { status: 400 }
      )
    }

    // Generate new verification token
    const verificationToken = await encrypt({ email })

    // Update user with new token
    await db.user.update({
      where: { email },
      data: { verificationToken }
    })

    // Send new verification email
    await sendVerificationEmail(email, verificationToken)

    return NextResponse.json({
      message: 'Verification email sent successfully'
    })
  } catch (error) {
    console.error('Resend verification error:', error)
    return NextResponse.json(
      { error: 'Failed to resend verification email' },
      { status: 500 }
    )
  }
} 