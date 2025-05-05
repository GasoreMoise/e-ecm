import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    return NextResponse.json({ 
      message: 'Logged out successfully',
      success: true
    })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Failed to logout' }, 
      { status: 500 }
    )
  }
} 