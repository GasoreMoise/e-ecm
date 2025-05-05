import { NextResponse } from 'next/server'
import { login } from '@/lib/auth'
import { authenticateUser } from './actions'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    console.log('Login request started:', new Date().toISOString())
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    const authResult = await authenticateUser(email, password)

    if (!authResult.success) {
      // Map error responses
      if (authResult.error === 'Please verify your email before logging in') {
        return NextResponse.json(
          { 
            error: authResult.error,
            needsVerification: true,
            email: email
          },
          { status: 403 }
        )
      }
      
      return NextResponse.json(
        { error: authResult.error || 'Authentication failed' },
        { status: 400 }
      )
    }

    // Ensure token exists
    if (!authResult.token) {
      return NextResponse.json(
        { error: 'Authentication token generation failed' },
        { status: 500 }
      )
    }

    // Set cookie
    console.log('Setting auth cookie...')
    const startCookieSet = Date.now()
    await login(authResult.token)
    console.log('Cookie set in', Date.now() - startCookieSet, 'ms')

    console.log('Login successful for user type:', authResult.userType)
    return NextResponse.json({ 
      message: 'Login successful',
      userType: authResult.userType 
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 