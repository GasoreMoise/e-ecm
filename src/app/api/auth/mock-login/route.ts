import { NextRequest, NextResponse } from 'next/server'
import { encrypt } from '@/lib/auth'
import { db } from '@/lib/db'

// Use config export for dynamic option
export const config = {
  runtime: 'nodejs',
  regions: ['fra1'],
  dynamic: 'force-dynamic'
};

// Mock user ID - consistent for development
const MOCK_USER_ID = 'mock-user-id-123';

export async function POST(req: NextRequest) {
  try {
    // Security check: Only allow in development
    if (process.env.NODE_ENV !== 'development') {
      console.error('Mock login attempt in non-development environment');
      return NextResponse.json(
        { error: 'This endpoint is only available in development' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { email, password } = body;
    
    console.log('Mock login attempt:', email);
    
    // Very simple validation - in a real app you'd verify with a database
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if development user exists, create if not
    try {
      const existingUser = await db.user.findUnique({
        where: { id: MOCK_USER_ID }
      });

      if (!existingUser) {
        console.log('Creating development mock user in database');
        await db.user.create({
          data: {
            id: MOCK_USER_ID,
            email: email,
            password: 'hashed_mock_password', // In a real app, this would be hashed
            type: 'BUYER',
            emailVerified: true,
            firstName: 'Mock',
            lastName: 'User',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });
        console.log('Mock user created successfully');
      } else {
        console.log('Using existing mock user');
      }
    } catch (dbError) {
      console.error('Error with mock user in database:', dbError);
      // Continue even if DB operation fails - we'll still generate a token
    }
    
    try {
      // Generate a token with mock user data
      const token = await encrypt({
        id: MOCK_USER_ID,
        email: email,
        type: 'BUYER',
        name: 'Mock User'
      });
      
      console.log('Mock login successful - token generated');
      
      return NextResponse.json({
        success: true,
        token,
        userType: 'BUYER',
        message: 'Mock authentication successful'
      });
    } catch (tokenError: any) {
      console.error('Error generating mock token:', tokenError);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to generate authentication token',
          details: tokenError.message
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Mock login error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Server error', 
        details: error.message || 'Unknown error'
      },
      { status: 500 }
    );
  }
} 