import { jwtVerify, SignJWT } from 'jose'
import { NextRequest } from 'next/server'

// Determine if code is running on client or server
const isClient = typeof window !== 'undefined'

// Make sure JWT_SECRET is initialized safely - handle missing env variable case
const getJwtSecret = () => {
  // Skip JWT_SECRET check on client-side - this will only be used on server components
  if (isClient) {
    // Return a placeholder for client - actual JWT operations will happen server-side
    return new TextEncoder().encode('client-side-placeholder')
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET environment variable is not defined')
    
    if (process.env.NODE_ENV === 'production') {
      console.error('Running in production without JWT_SECRET is not recommended')
    } else {
      console.warn('Using fallback secret for development only')
    }
    
    return new TextEncoder().encode('fallback-dev-secret-do-not-use-in-production')
  }
  
  return new TextEncoder().encode(process.env.JWT_SECRET)
}

// Only initialize JWT_SECRET on the server side
const JWT_SECRET = isClient ? null : getJwtSecret()

export async function encrypt(payload: any) {
  try {
    // This function should only be called server-side
    if (isClient) {
      console.error('encrypt() was called on client side. JWT operations should be server-side only.')
      throw new Error('Authentication operations must be performed on the server')
    }

    if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
      console.error('Attempting to encrypt data without a proper JWT_SECRET in production')
    }
    
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
      .sign(JWT_SECRET!)
  } catch (error: any) {
    console.error('JWT encryption error:', error.message || 'Unknown error')
    throw new Error('Failed to generate authentication token')
  }
}

export async function decrypt(token: string) {
  try {
    if (!token) {
      console.error('Attempted to decrypt null or empty token')
      return null
    }
    
    // This function should only be called server-side
    if (isClient) {
      console.error('decrypt() was called on client side. JWT operations should be server-side only.')
      return null
    }
    
    if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
      console.error('Attempting to decrypt data without a proper JWT_SECRET in production')
    }
    
    const { payload } = await jwtVerify(token, JWT_SECRET!)
    return payload
  } catch (error: any) {
    console.error('JWT decryption error:', error.message || 'Unknown error')
    return null
  }
}

// Extract token from request
export function getTokenFromRequest(req: NextRequest | Request): string | null {
  try {
    let token: string | undefined;
    
    // First check Authorization header for Bearer token
    const authHeader = req.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7); // Remove "Bearer " prefix
      return token;
    }
    
    // If no Authorization header, fall back to cookies
    if (req instanceof NextRequest) {
      token = req.cookies.get('token')?.value;
    } else {
      // Regular Request object
      const cookieHeader = req.headers.get('cookie');
      if (cookieHeader) {
        const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split('=');
          acc[key] = value;
          return acc;
        }, {} as Record<string, string>);
        
        token = cookies['token'];
      }
    }
    
    return token || null;
  } catch (error: any) {
    console.error('Error extracting token:', error.message || 'Unknown error')
    return null
  }
}

// Get session from request
export async function getSession(req: NextRequest | Request) {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  
  // This function should only be called server-side
  if (isClient) {
    console.error('getSession() was called on client side. JWT operations should be server-side only.')
    return null
  }
  
  return await decrypt(token);
}

// Client-side auth helper
export const clientAuth = {
  saveToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  },
  getToken: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  },
  clearToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  },
  isAuthenticated: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token') !== null;
    }
    return false;
  },
  // New method to check auth status via API
  verifyAuth: async () => {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem('auth_token');
    if (!token) return false;
    
    try {
      const res = await fetch('/api/auth/verify', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!res.ok) return false;
      
      const data = await res.json();
      return data.authenticated;
    } catch (error) {
      console.error('Auth verification error:', error);
      return false;
    }
  }
}; 