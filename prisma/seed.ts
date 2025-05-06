import { PrismaClient } from '@prisma/client'

// Define enums that match the schema since Prisma hasn't generated them yet
enum UserType {
  BUYER = 'BUYER',
  SUPPLIER = 'SUPPLIER',
  ADMIN = 'ADMIN'
}

enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  REFUNDED = 'REFUNDED'
}

enum NotificationType {
  ORDER = 'ORDER',
  PAYMENT = 'PAYMENT',
  OFFER = 'OFFER',
  SYSTEM = 'SYSTEM'
}

const prisma = new PrismaClient()
// Use type assertion to access models that TypeScript doesn't know about yet
const db = prisma as any

// Safe access function to check if a model exists before trying to use it
function modelExists(model: string): boolean {
  return typeof (db as any)[model] !== 'undefined';
}

async function main() {
  console.log('Starting seed process...')

  // Create a test buyer user if it doesn't exist
  const mockUserId = 'mock-user-id-123'
  const existingUser = await prisma.user.findUnique({
    where: { id: mockUserId }
  })

  if (!existingUser) {
    console.log('Creating mock buyer user...')
    await prisma.user.create({
      data: {
        id: mockUserId,
        email: 'mock@example.com',
        password: 'hashed_mock_password',
        type: UserType.BUYER,
        emailVerified: true,
        firstName: 'Mock',
        lastName: 'User',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
  } else {
    console.log('Mock user already exists, updating to BUYER type...')
    await prisma.user.update({
      where: { id: mockUserId },
      data: { type: UserType.BUYER }
    })
  }

  // Check if order model exists before trying to use it
  if (modelExists('order')) {
    try {
      // Create some test orders
      console.log('Creating test orders...')
      
      // Clean up existing orders for this user to avoid duplicates
      await db.order.deleteMany({
        where: { userId: mockUserId }
      })
      
      const orders = [
        {
          orderNumber: 'ORD-001',
          status: OrderStatus.COMPLETED,
          totalAmount: 1250.75,
          paymentStatus: 'PAID',
          userId: mockUserId,
          trackingNumber: 'TRK12345',
          shippingMethod: 'Express',
          deliveryAddress: '123 Main St, Anytown, USA'
        },
        {
          orderNumber: 'ORD-002',
          status: OrderStatus.PENDING,
          totalAmount: 850.50,
          paymentStatus: 'AWAITING_PAYMENT',
          userId: mockUserId,
          trackingNumber: null,
          shippingMethod: 'Standard',
          deliveryAddress: '123 Main St, Anytown, USA'
        },
        {
          orderNumber: 'ORD-003',
          status: OrderStatus.CANCELED,
          totalAmount: 450.25,
          paymentStatus: 'REFUNDED',
          userId: mockUserId,
          trackingNumber: null,
          shippingMethod: 'Standard',
          deliveryAddress: '123 Main St, Anytown, USA'
        },
        {
          orderNumber: 'ORD-004',
          status: OrderStatus.SHIPPED,
          totalAmount: 1050.00,
          paymentStatus: 'PAID',
          userId: mockUserId,
          trackingNumber: 'TRK67890',
          shippingMethod: 'Express',
          deliveryAddress: '123 Main St, Anytown, USA'
        },
        {
          orderNumber: 'ORD-005',
          status: OrderStatus.PENDING,
          totalAmount: 750.99,
          paymentStatus: 'AWAITING_PAYMENT',
          userId: mockUserId,
          trackingNumber: null,
          shippingMethod: 'Standard',
          deliveryAddress: '123 Main St, Anytown, USA'
        }
      ]

      for (const order of orders) {
        await db.order.create({ data: order })
      }
      console.log('Successfully created orders');
    } catch (error) {
      console.error('Error creating orders:', error);
    }
  } else {
    console.log('Order model not found in Prisma schema - skipping order creation');
  }

  // Check if financialAccount model exists before trying to use it
  if (modelExists('financialAccount')) {
    try {
      // Create or update financial account
      console.log('Creating financial account...')
      const existingAccount = await db.financialAccount.findUnique({
        where: { userId: mockUserId }
      })

      if (existingAccount) {
        await db.financialAccount.update({
          where: { userId: mockUserId },
          data: {
            outstandingPayments: 1600.50,
            creditBalance: 500.00,
            lastTransactionDate: new Date()
          }
        })
      } else {
        await db.financialAccount.create({
          data: {
            userId: mockUserId,
            outstandingPayments: 1600.50,
            creditBalance: 500.00,
            lastTransactionDate: new Date()
          }
        })
      }
      console.log('Successfully created/updated financial account');
    } catch (error) {
      console.error('Error creating financial account:', error);
    }
  } else {
    console.log('FinancialAccount model not found in Prisma schema - skipping account creation');
  }

  // Check if notification model exists before trying to use it
  if (modelExists('notification')) {
    try {
      // Create some test notifications
      console.log('Creating test notifications...')
      
      // Clean up existing notifications for this user to avoid duplicates
      await db.notification.deleteMany({
        where: { userId: mockUserId }
      })
      
      const notifications = [
        {
          type: NotificationType.ORDER,
          message: 'Your order #ORD-001 has been delivered',
          isRead: true,
          userId: mockUserId,
          createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) // 10 days ago
        },
        {
          type: NotificationType.PAYMENT,
          message: 'Payment received for order #ORD-001',
          isRead: true,
          userId: mockUserId,
          createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000) // 11 days ago
        },
        {
          type: NotificationType.ORDER,
          message: 'Your order #ORD-004 has been shipped',
          isRead: false,
          userId: mockUserId,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
        },
        {
          type: NotificationType.OFFER,
          message: 'Special discount available for bulk orders this week',
          isRead: false,
          userId: mockUserId,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
        },
        {
          type: NotificationType.SYSTEM,
          message: 'Your account has been verified successfully',
          isRead: false,
          userId: mockUserId,
          createdAt: new Date() // Today
        }
      ]

      for (const notification of notifications) {
        await db.notification.create({ data: notification })
      }
      console.log('Successfully created notifications');
    } catch (error) {
      console.error('Error creating notifications:', error);
    }
  } else {
    console.log('Notification model not found in Prisma schema - skipping notification creation');
  }

  console.log('Seed data creation completed!')
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 