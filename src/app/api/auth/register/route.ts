import { NextResponse } from 'next/server'
import { encrypt } from '@/lib/auth'
import { sendVerificationEmail } from '@/lib/email'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Registration request body:', body)

    const { email, password, type, terms, ...userData } = body

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate verification token
    const verificationToken = await encrypt({ email })

    // Create user with emailVerified set to false
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        type: type.toUpperCase(),
        ...userData,
        emailVerified: false,
        verificationToken
      }
    })

    // Send verification email
    try {
      await sendVerificationEmail(email, verificationToken)
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError)
      // Continue with registration but log the error
    }

    return NextResponse.json({
      message: 'Registration successful. Please check your email to verify your account.'
    })
  } catch (error) {
    console.error('Registration error details:', error)
    return NextResponse.json(
      { error: 'Registration failed: ' + (error as Error).message },
      { status: 500 }
    )
  }
} 