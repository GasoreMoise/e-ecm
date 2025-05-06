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
  console.log('Authentication attempt initiated for:', email);
  
  try {
    // Check required environment variables
    if (!process.env.DATABASE_URL || !process.env.JWT_SECRET) {
      console.error('Missing required environment variables for authentication')
      console.error('DATABASE_URL exists:', !!process.env.DATABASE_URL)
      console.error('JWT_SECRET exists:', !!process.env.JWT_SECRET)
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
      console.log('Database URL format check:', process.env.DATABASE_URL?.startsWith('postgresql://') ? 'Valid format' : 'Invalid format')
      
      // For development environments, allow mock authentication if needed
      if (process.env.NODE_ENV === 'development' && process.env.MOCK_AUTH === 'true' && email === 'test@example.com') {
        console.log('Using mock authentication for development');
        
        // Check if the password is the test password
        if (password === 'password123') {
          console.log('Mock authentication successful');
          const token = await encrypt({
            id: 'test-user-id',
            email: 'test@example.com',
            type: 'BUYER'
          });
          
          return { 
            success: true, 
            token, 
            userType: 'BUYER' 
          };
        } else {
          console.log('Mock authentication failed: incorrect password');
          return { 
            success: false, 
            error: 'Invalid email or password' 
          };
        }
      }
      
      // Real database authentication
      const startDbLookup = Date.now()
      
      try {
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
        
        try {
          const token = await encrypt({
            id: user.id,
            email: user.email,
            type: user.type
          })
          console.log('Token generation completed in', Date.now() - startTokenGen, 'ms')
          console.log('Authentication successful for user:', user.email);

          return { 
            success: true, 
            token, 
            userType: user.type 
          }
        } catch (tokenError: any) {
          console.error('Token generation failed:', tokenError)
          return { 
            success: false, 
            error: 'Authentication failed', 
            details: `Failed to generate authentication token: ${tokenError.message}` 
          }
        }
      } catch (queryError: any) {
        console.error('Database query error:', queryError)
        return { 
          success: false, 
          error: 'Authentication failed', 
          details: `Database query error: ${queryError.message}` 
        }
      }
      
    } catch (dbError: any) {
      console.error('Database operation error:', dbError)
      console.error('Database connection string format:', 
        process.env.DATABASE_URL ? 
        `${process.env.DATABASE_URL.substring(0, 12)}...` : 
        'Not provided')
      return { 
        success: false, 
        error: 'Authentication failed', 
        details: `Database operation error: ${dbError.message || 'Unknown error'}` 
      }
    }
  } catch (error: any) {
    console.error('Authentication error:', error)
    return { 
      success: false, 
      error: 'Authentication failed', 
      details: `Unexpected error: ${error.message || 'Unknown error'}` 
    }
  }
} 