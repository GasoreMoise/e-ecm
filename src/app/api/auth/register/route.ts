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

    // Create user with emailVerified set to true
    const user = await db.user.create({
      data: {
        email,
        password: hashedPassword,
        type: type.toUpperCase(),
        ...userData,
        emailVerified: true, // Auto-verify users
      }
    })

    return NextResponse.json({
      message: 'Registration successful. You can now login.'
    })
  } catch (error) {
    console.error('Registration error details:', error)
    return NextResponse.json(
      { error: 'Registration failed: ' + (error as Error).message },
      { status: 500 }
    )
  }
} 