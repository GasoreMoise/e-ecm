import { NextResponse } from 'next/server'
import { authenticateUser } from './actions'

// Skip runtime edge because it causes cookie issues
export const config = {
  runtime: 'nodejs',
  regions: ['fra1'],
  dynamic: 'force-dynamic'
};

// Simple JWT handling without cookie dependencies
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

    // Instead of setting a cookie, just return the token in the response
    // The client will handle storing the token
    console.log('Login successful for user type:', authResult.userType)
    return NextResponse.json({ 
      message: 'Login successful',
      userType: authResult.userType,
      token: authResult.token
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 