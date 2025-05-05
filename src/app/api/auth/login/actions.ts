'use server'

import { encrypt } from '@/lib/auth'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

type AuthSuccess = {
  success: true;
  token: string;
  userType: string;
}

type AuthFailure = {
  success: false;
  error: string;
  details?: string;
  needsVerification?: boolean;
  email?: string;
}

type AuthResult = AuthSuccess | AuthFailure;

export async function authenticateUser(email: string, password: string): Promise<AuthResult> {
  try {
    // Check required environment variables
    if (!process.env.DATABASE_URL || !process.env.JWT_SECRET) {
      console.error('Missing required environment variables for authentication')
      return { 
        success: false, 
        error: 'Server configuration error', 
        details: 'Missing environment variables' 
      }
    }

    // Skip actual database operations during build phase
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'build') {
      console.log('Build phase detected, skipping DB operations for: authenticateUser')
      return { 
        success: false, 
        error: 'Authentication not available during build phase' 
      }
    }

    console.log('Login attempt for email:', email)

    try {
      // Find user
      console.log('Searching for user in database...')
      const startDbLookup = Date.now()
      const user = await db.user.findUnique({
        where: { email }
      })
      console.log('Database lookup completed in', Date.now() - startDbLookup, 'ms')

      if (!user) {
        console.log('User not found')
        return { 
          success: false, 
          error: 'Invalid email or password' 
        }
      }

      // Verify password
      console.log('Verifying password...')
      const startPwdVerify = Date.now()
      const passwordValid = await bcrypt.compare(password, user.password)
      console.log('Password verification completed in', Date.now() - startPwdVerify, 'ms')
      
      if (!passwordValid) {
        console.log('Invalid password')
        return { 
          success: false, 
          error: 'Invalid email or password' 
        }
      }

      // Check if email is verified (commented out for testing)
      console.log('Checking email verification status:', user.emailVerified)
      /* Temporarily bypass email verification for testing
      if (!user.emailVerified) {
        console.log('Email not verified')
        return { 
          success: false, 
          error: 'Please verify your email before logging in',
          needsVerification: true,
          email: user.email
        }
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

      return { 
        success: true, 
        token, 
        userType: user.type 
      }
    } catch (dbError) {
      console.error('Database operation error:', dbError)
      return { 
        success: false, 
        error: 'Authentication failed', 
        details: 'Database operation error' 
      }
    }
  } catch (error) {
    console.error('Authentication error:', error)
    return { 
      success: false, 
      error: 'Authentication failed', 
      details: 'Unexpected error' 
    }
  }
} 