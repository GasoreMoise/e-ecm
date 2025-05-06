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
    console.log('Auth verification request received');
    
    // Check JWT token from request headers
    const authHeader = req.headers.get('Authorization');
    console.log('Authorization header present:', !!authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('No valid authorization header found');
      return NextResponse.json(
        { authenticated: false, message: 'No authorization token provided' }, 
        { status: 401 }
      );
    }
    
    // Log detailed debugging info but not the full token
    const token = authHeader.substring(7); // Remove "Bearer " prefix
    console.log('Token length:', token.length);
    console.log('Token format check:', token.includes('.') ? 'Valid JWT format' : 'Invalid JWT format');
    
    // Get session from token
    console.log('Attempting to verify token...');
    const session = await getSession(req);
    console.log('Session verification result:', session ? 'Valid' : 'Invalid');
    
    if (!session) {
      return NextResponse.json(
        { authenticated: false, message: 'Invalid or expired token' }, 
        { status: 401 }
      );
    }
    
    console.log('User authenticated successfully:', session.id);
    
    // Return only minimal necessary user info
    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.id,
        email: session.email,
        type: session.type,
      }
    });
  } catch (error: any) {
    console.error('Verify authentication error:', error);
    console.error('Error stack:', error.stack);
    
    return NextResponse.json(
      { 
        authenticated: false, 
        message: 'Authentication error', 
        details: error.message || 'Unknown error'
      }, 
      { status: 500 }
    );
  }
} 