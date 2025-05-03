import { jwtVerify, SignJWT } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
import { ResponseCookies } from 'next/dist/server/web/spec-extension/cookies'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

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

export async function login(token: string) {
  const cookieStore = (await cookies()) as ResponseCookies
  cookieStore.delete('token') // Clear any existing token
  cookieStore.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 // 24 hours
  })
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('token')
}

export async function getSession(req: NextRequest | Request) {
  let token: string | undefined;
  
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
  
  if (!token) return null;
  return await decrypt(token);
} 