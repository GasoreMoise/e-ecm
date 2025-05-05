'use server';

import { cookies } from 'next/headers';
import { ResponseCookies } from 'next/dist/server/web/spec-extension/cookies';
import { decrypt } from './auth';

// Server-side function to set login cookie
export async function login(token: string) {
  try {
    const cookieStore = (await cookies()) as ResponseCookies;
    cookieStore.delete('token'); // Clear any existing token
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    });
    return true;
  } catch (error) {
    console.error('Error setting auth cookie:', error);
    return false;
  }
}

// Server-side function to clear login cookie
export async function logout() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('token');
    return true;
  } catch (error) {
    console.error('Error clearing auth cookie:', error);
    return false;
  }
}

// Server-side function to get session from cookie
export async function getSessionFromCookie() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) return null;
    return await decrypt(token);
  } catch (error) {
    console.error('Error getting session from cookie:', error);
    return null;
  }
} 