import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { logout } from '@/lib/auth'

export async function POST() {
  try {
    // Use the logout helper from auth.ts
    await logout()
    
    const response = NextResponse.json({ message: 'Logged out successfully' })
    response.cookies.delete('token')
    
    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 })
  }
} 