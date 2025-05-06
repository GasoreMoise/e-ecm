import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

// Use config export for dynamic option
export const config = {
  runtime: 'nodejs',
  regions: ['fra1'],
  dynamic: 'force-dynamic'
};

export async function GET(req: NextRequest) {
  try {
    // Security check: Only allow in development
    if (process.env.NODE_ENV !== 'development') {
      console.error('Mock profile attempt in non-development environment');
      return NextResponse.json(
        { error: 'This endpoint is only available in development' },
        { status: 403 }
      );
    }

    console.log('Mock profile API request received');
    
    // Get session from token
    const session = await getSession(req);
    console.log('Session for mock profile:', session ? 'Found' : 'Not found');
    
    if (!session || !session.id) {
      // For development, return mock data even without authentication
      console.log('No session found, but returning mock data for development');
      return NextResponse.json(getMockUserProfile('mock-user-id'));
    }
    
    // Ensure session.id is a string
    const userId = String(session.id);
    
    // Return mock user profile data
    return NextResponse.json(getMockUserProfile(userId));
  } catch (error: unknown) {
    console.error('Mock profile error:', error);
    // Even on error, return mock data in development
    return NextResponse.json(getMockUserProfile('mock-user-id'));
  }
}

// Generate mock user profile data
function getMockUserProfile(userId: string) {
  return {
    id: userId,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    type: 'BUYER',
    emailVerified: true,
    createdAt: '2023-04-15T10:30:00.000Z',
    updatedAt: new Date().toISOString(),
    country: 'United States',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    businessName: 'Acme Optical',
    businessType: 'Retail',
    registrationNumber: 'BUS12345',
    website: 'https://example.com',
    profileImage: 'https://i.pravatar.cc/300'
  };
}

export async function PUT(req: NextRequest) {
  try {
    // Security check: Only allow in development
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'This endpoint is only available in development' },
        { status: 403 }
      );
    }

    console.log('Mock profile update request received');
    
    // Get request body
    const body = await req.json();
    console.log('Mock profile update data:', body);
    
    // Return updated mock profile
    return NextResponse.json({
      ...getMockUserProfile('mock-user-id'),
      ...body,
      updatedAt: new Date().toISOString()
    });
  } catch (error: unknown) {
    console.error('Mock profile update error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { error: 'Failed to update profile', details: errorMessage },
      { status: 500 }
    );
  }
} 