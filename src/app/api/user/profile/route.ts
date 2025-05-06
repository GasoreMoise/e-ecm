import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

// Use config export for dynamic option
export const config = {
  runtime: 'nodejs',
  regions: ['fra1'],
  dynamic: 'force-dynamic'
};

// Get user data based on email address
async function findUserByEmail(email: string) {
  try {
    const user = await db.user.findUnique({
      where: { email }
    });
    
    return user;
  } catch (error) {
    console.error('Error finding user by email:', error);
    return null;
  }
}

// Mock user data for development
function getMockUserData(userId: string, userEmail: string = 'amandagasore@yahoo.com') {
  return {
    id: userId,
    firstName: 'Amanda',
    lastName: 'Gasore',
    email: userEmail,
    type: 'BUYER',
    emailVerified: true,
    createdAt: new Date().toISOString(),
    // Add zeroed dashboard metrics for first-time users
    metrics: {
      totalOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
      totalSpent: 0,
      accountBalance: 0,
      notifications: 0
    }
  };
}

export async function GET(req: NextRequest) {
  try {
    console.log('Profile API request received');
    
    // Check if we're in development mode
    const isDevelopment = process.env.NODE_ENV === 'development';
    console.log('Environment:', process.env.NODE_ENV);
    
    // Get session - with more logging
    console.log('Attempting to get user session...');
    const session = await getSession(req);
    console.log('Session result:', session ? 'Session found' : 'No session found');
    console.log('Session data:', session ? JSON.stringify(session, null, 2) : 'No session data');
    
    if (!session || !session.id) {
      console.log('No valid session found, returning 401');
      return NextResponse.json(
        { error: 'Not authenticated' }, 
        { status: 401 }
      );
    }
    
    // Ensure session.id is a string
    const userId = String(session.id);
    console.log('Authenticated user ID:', userId);
    console.log('Authenticated user email:', session.email);
    
    // Use Amanda's email if available
    const userEmail = typeof session.email === 'string' ? session.email : 'amandagasore@yahoo.com';
    
    // Check required environment variables
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL environment variable is not set');
      
      // In development, use mock data instead of failing
      if (isDevelopment) {
        console.log('Using mock data for development (no DATABASE_URL)');
        return NextResponse.json(getMockUserData(userId, userEmail));
      }
      
      return NextResponse.json(
        { error: 'Server configuration error', details: 'Missing DATABASE_URL' }, 
        { status: 500 }
      );
    }

    // Skip actual database operations during build phase
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'build') {
      console.log('Build phase detected, returning mock data');
      return NextResponse.json(getMockUserData(userId, userEmail));
    }

    try {
      // Find user by ID first
      console.log('Attempting to query database for user by ID...');
      let user = await db.user.findUnique({
        where: { id: userId }
      }).catch(error => {
        console.error('Database query error:', error);
        throw error;
      });

      // If user not found by ID, try by email
      if (!user && userEmail) {
        console.log('User not found by ID, trying by email:', userEmail);
        user = await findUserByEmail(userEmail);
      }

      if (!user) {
        console.log('User not found in database by ID or email');
        
        // In development, use mock data for easier testing
        if (isDevelopment) {
          console.log('Using mock data since user not found');
          return NextResponse.json(getMockUserData(userId, userEmail));
        }
        
        return NextResponse.json(
          { error: 'User not found' }, 
          { status: 404 }
        );
      }

      console.log('User found, returning profile data');
      // Return user profile data (excluding password)
      const { password, ...userProfile } = user;
      // Add zeroed metrics for first-time users
      return NextResponse.json({
        ...userProfile,
        metrics: {
          totalOrders: 0,
          pendingOrders: 0,
          completedOrders: 0,
          totalSpent: 0,
          accountBalance: 0,
          notifications: 0
        }
      });
    } catch (dbError: unknown) {
      console.error('Database operation error:', dbError);
      
      // In development, use mock data instead of failing
      if (isDevelopment) {
        console.log('Using mock data due to database error');
        return NextResponse.json(getMockUserData(userId, userEmail));
      }
      
      const errorMessage = dbError instanceof Error ? dbError.message : 'Unknown database error';
      
      return NextResponse.json(
        { error: 'Failed to retrieve user profile', details: errorMessage }, 
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error('Profile API error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    // In development, use mock data instead of failing
    if (process.env.NODE_ENV === 'development') {
      console.log('Using mock data due to error');
      // Try to extract email from session even if there was an error
      const email = req.headers.get('Authorization')?.includes('amandagasore') 
        ? 'amandagasore@yahoo.com' 
        : undefined;
      
      return NextResponse.json(getMockUserData('mock-user-id', email));
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { error: 'Server error', details: errorMessage }, 
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('Profile update request received');
    const session = await getSession(request);
    
    if (!session?.id) {
      console.log('No valid session for update, returning 401');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Ensure session.id is a string
    const userId = String(session.id);
    console.log('Authenticated user ID for update:', userId);
    const body = await request.json();
    console.log('Update request body:', body);
    
    // Check if we're in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: simulating successful update');
      return NextResponse.json({
        ...body,
        id: userId,
        email: session.email || body.email,
        updatedAt: new Date().toISOString()
      });
    }

    try {
      console.log('Attempting to update user in database...');
      const user = await db.user.update({
        where: { id: userId },
        data: {
          firstName: body.firstName,
          lastName: body.lastName,
          phone: body.phone,
          country: body.country,
          address: body.address,
          city: body.city,
          state: body.state,
          postalCode: body.zipCode,
          businessName: body.businessName,
          businessType: body.businessType,
          registrationNumber: body.registrationNumber,
          website: body.website
        }
      });

      console.log('User update successful');
      const { password, ...userProfile } = user;
      return NextResponse.json(userProfile);
    } catch (dbError: unknown) {
      console.error('Database error during update:', dbError);
      const errorMessage = dbError instanceof Error ? dbError.message : 'Unknown database error';
      
      return NextResponse.json(
        { error: 'Failed to update profile', details: errorMessage },
        { status: 500 }
      );
    }
  } catch (error: unknown) {
    console.error('Profile update error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { error: 'Failed to update profile', details: errorMessage },
      { status: 500 }
    );
  }
} 