'use server'

import { encrypt } from '@/lib/auth'
import { sendPasswordResetEmail } from '@/lib/email'
import { db } from '@/lib/db'

export async function requestPasswordReset(email: string) {
  try {
    // Check required environment variables
    if (!process.env.JWT_SECRET || !process.env.SMTP_HOST || !process.env.SMTP_USER) {
      console.error('Missing required environment variables for password reset functionality')
      return { success: false, error: 'Server configuration error' }
    }

    // Check if user exists
    const user = await db.user.findUnique({
      where: { email }
    })

    if (!user) {
      // Return success even if user doesn't exist for security
      return { 
        success: true, 
        message: 'If an account exists, you will receive a password reset email.' 
      }
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

    return { 
      success: true, 
      message: 'If an account exists, you will receive a password reset email.' 
    }
  } catch (error) {
    console.error('Password reset request error:', error)
    return { 
      success: false, 
      error: 'Failed to process password reset request' 
    }
  }
} 