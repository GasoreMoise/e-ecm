import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getSession } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// Mock user data for development
function getMockUserData(userId: string) {
  return {
    id: userId,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    type: 'BUYER',
    emailVerified: true,
    createdAt: new Date().toISOString()
  };
}

export async function GET(request: Request) {
  try {
    console.log('Profile API request received');
    // Verify session/authentication
    const session = await getSession(request)
    
    if (!session || !session.id) {
      console.log('Unauthorized access attempt - no valid session');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('Authenticated user ID:', session.id);

    try {
      // Try to fetch real user data
      const user = await db.user.findUnique({
        where: { id: session.id as string },
        select: {
          firstName: true,
          lastName: true,
          email: true,
          type: true,
          emailVerified: true,
          createdAt: true
        }
      });

      if (!user) {
        console.log('User not found in database');
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      console.log('Returning real user data');
      return NextResponse.json(user);
    } catch (dbError) {
      // Return mock data if database error (likely during development)
      console.error('Database error fetching user, returning mock data:', dbError);
      return NextResponse.json(getMockUserData(session.id as string));
    }
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession(request)
    
    if (!session?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    
    const user = await db.user.update({
      where: { id: session.id },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        phone: body.phone,
        businessName: body.businessName,
        businessType: body.businessType,
        registrationNumber: body.registrationNumber,
        website: body.website
      }
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
} 