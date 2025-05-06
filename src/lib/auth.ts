import { jwtVerify, SignJWT } from 'jose'
import { NextRequest } from 'next/server'

// Make sure JWT_SECRET is initialized safely - handle missing env variable case
const JWT_SECRET = process.env.JWT_SECRET 
  ? new TextEncoder().encode(process.env.JWT_SECRET)
  : new TextEncoder().encode('fallback-dev-secret-do-not-use-in-production');

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET)
}

export async function decrypt(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload
  } catch (error) {
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
  } catch (error) {
    console.error('Error extracting token:', error)
    return null
  }
}

// Get session from request
export async function getSession(req: NextRequest | Request) {
  const token = getTokenFromRequest(req);
  if (!token) return null;
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
  }
}; 