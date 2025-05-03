import { NextResponse } from 'next/server'
import { encrypt, login } from '@/lib/auth'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    console.log('Login request started:', new Date().toISOString())
    const body = await request.json()
    const { email, password } = body
    console.log('Login attempt for email:', email)

    // Find user
    console.log('Searching for user in database...')
    const startDbLookup = Date.now()
    const user = await db.user.findUnique({
      where: { email }
    })
    console.log('Database lookup completed in', Date.now() - startDbLookup, 'ms')

    if (!user) {
      console.log('User not found')
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 400 }
      )
    }

    // Verify password
    console.log('Verifying password...')
    const startPwdVerify = Date.now()
    const passwordValid = await bcrypt.compare(password, user.password)
    console.log('Password verification completed in', Date.now() - startPwdVerify, 'ms')
    
    if (!passwordValid) {
      console.log('Invalid password')
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 400 }
      )
    }

    // Check if email is verified
    console.log('Checking email verification status:', user.emailVerified)
    /* Temporarily bypass email verification for testing
    if (!user.emailVerified) {
      console.log('Email not verified')
      return NextResponse.json(
        { 
          error: 'Please verify your email before logging in',
          needsVerification: true,
          email: user.email
        },
        { status: 403 }
      )
    }
    */

    // Generate token
    console.log('Generating JWT token...')
    const startTokenGen = Date.now()
    const token = await encrypt({
      id: user.id,
      email: user.email,
      type: user.type
    })
    console.log('Token generation completed in', Date.now() - startTokenGen, 'ms')

    // Set cookie
    console.log('Setting auth cookie...')
    const startCookieSet = Date.now()
    await login(token)
    console.log('Cookie set in', Date.now() - startCookieSet, 'ms')

    console.log('Login successful for user type:', user.type)
    return NextResponse.json({ 
      message: 'Login successful',
      userType: user.type 
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
} 