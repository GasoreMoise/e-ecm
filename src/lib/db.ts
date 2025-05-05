import { PrismaClient } from '@prisma/client'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined }

export const db = globalForPrisma.prisma || getPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

function getPrismaClient() {
  try {
    const client = new PrismaClient({
      // Reduce logging noise during builds
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
    })
    return client
  } catch (error) {
    console.error('Failed to create Prisma client:', error)
    
    // Return a mock client during build if real one can't be created
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'build') {
      return createMockPrismaClient()
    }
    
    throw error
  }
}

// Mock client for build time
function createMockPrismaClient() {
  const mockHandler = {
    get: () => {
      return new Proxy({}, {
        get: () => async () => {
          console.log('Mock Prisma client method called during build')
          return null
        }
      })
    }
  }
  
  return new Proxy({}, mockHandler) as PrismaClient
} 