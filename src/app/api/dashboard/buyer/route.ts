import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

// This function provides mock data when real data cannot be fetched (for development)
function getMockDashboardData(userId: string) {
  return {
    orders: {
      total: 42,
      pending: 12,
      completed: 28,
      canceled: 2
    },
    balance: {
      outstanding: 2500.00,
      credit: 750.00
    },
    notifications: [
      { 
        id: '1', 
        type: 'order', 
        message: 'Your order #1234 has been shipped', 
        createdAt: new Date().toISOString()
      },
      { 
        id: '2', 
        type: 'offer', 
        message: 'New discount offer available for bulk orders', 
        createdAt: new Date(Date.now() - 86400000).toISOString() 
      },
      { 
        id: '3', 
        type: 'order', 
        message: 'Order #1235 has been delivered', 
        createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
      }
    ]
  };
}

export async function GET(request: Request) {
  try {
    console.log('Dashboard API request received');
    // Verify session/authentication
    const session = await getSession(request)
    
    if (!session || !session.id) {
      console.log('Unauthorized access attempt - no valid session');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    console.log('Authenticated user:', session.id);

    // Verify user type
    const user = await db.user.findUnique({
      where: { id: session.id as string },
      select: { type: true }
    }).catch(err => {
      console.error('Error fetching user type:', err);
      return null;
    });

    if (!user || user.type !== 'BUYER') {
      console.log('User not authorized as buyer:', user?.type);
      return NextResponse.json(
        { error: 'Unauthorized. Only buyers can access this information.' },
        { status: 403 }
      )
    }

    try {
      // Try fetching real data
      console.log('Attempting to fetch real dashboard data');
      
      // Fetch order counts
      const [totalOrders, pendingOrders, completedOrders, canceledOrders] = await Promise.all([
        db.order.count({ where: { buyerId: session.id as string } }),
        db.order.count({ where: { buyerId: session.id as string, status: 'PENDING' } }),
        db.order.count({ where: { buyerId: session.id as string, status: 'COMPLETED' } }),
        db.order.count({ where: { buyerId: session.id as string, status: 'CANCELED' } })
      ]);

      // Fetch balance information
      const [paymentRecords, creditRecords] = await Promise.all([
        db.payment.findMany({
          where: { 
            userId: session.id as string,
            status: 'PENDING'
          },
          select: { amount: true }
        }),
        db.credit.findMany({
          where: { 
            userId: session.id as string,
            status: 'ACTIVE'
          },
          select: { amount: true }
        })
      ]);

      const outstandingBalance = paymentRecords.reduce((sum, payment) => sum + payment.amount, 0);
      const creditBalance = creditRecords.reduce((sum, credit) => sum + credit.amount, 0);

      // Fetch recent notifications
      const notifications = await db.notification.findMany({
        where: { userId: session.id as string },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: {
          id: true,
          type: true,
          message: true,
          createdAt: true
        }
      });

      // Return real dashboard data
      console.log('Returning real dashboard data');
      return NextResponse.json({
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          completed: completedOrders,
          canceled: canceledOrders
        },
        balance: {
          outstanding: outstandingBalance,
          credit: creditBalance
        },
        notifications
      });
    } catch (dbError) {
      // If database tables don't exist or other DB error, return mock data
      console.error('Error fetching from database, using mock data instead:', dbError);
      return NextResponse.json(getMockDashboardData(session.id as string));
    }
  } catch (error) {
    console.error('Error in dashboard API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
} 