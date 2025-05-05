import { NextResponse } from 'next/server'
import { requestPasswordReset } from './actions'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    const result = await requestPasswordReset(email)

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to process password reset request' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: result.message || 'If an account exists, you will receive a password reset email.'
    })
  } catch (error) {
    console.error('Password reset request error:', error)
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    )
  }
} 