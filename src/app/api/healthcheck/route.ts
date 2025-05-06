import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export const config = {
  runtime: 'nodejs',
  regions: ['fra1'],
  dynamic: 'force-dynamic'
};

export async function GET() {
  try {
    // Check database connection
    let dbStatus = 'error'
    try {
      // Simple query to check database connection
      await db.$queryRaw`SELECT 1 as result`
      dbStatus = 'connected'
    } catch (dbError) {
      console.error('Database healthcheck failed:', dbError)
      dbStatus = 'disconnected'
    }

    // Check environment variables
    const envStatus = {
      database: !!process.env.DATABASE_URL,
      jwt: !!process.env.JWT_SECRET,
      smtp: !!process.env.SMTP_HOST && !!process.env.SMTP_USER,
      appUrl: !!process.env.NEXT_PUBLIC_APP_URL
    }

    // Return health status
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      database: dbStatus,
      config: envStatus
    })
  } catch (error) {
    console.error('Healthcheck error:', error)
    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 