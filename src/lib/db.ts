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
    // Log the database connection attempt
    console.log('Initializing Prisma client...')
    
    // Verify DATABASE_URL is set and properly formatted
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL environment variable is not set')
      if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'build') {
        return createMockPrismaClient()
      }
      throw new Error('DATABASE_URL is required')
    }
    
    if (!process.env.DATABASE_URL.startsWith('postgresql://')) {
      console.error('DATABASE_URL does not appear to be in the correct format')
      console.error('Expected format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE')
      if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'build') {
        return createMockPrismaClient()
      }
      throw new Error('DATABASE_URL is in an invalid format')
    }
    
    // Initialize Prisma client with logging options
    const client = new PrismaClient({
      // Reduce logging noise during builds
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
    })
    
    console.log('Prisma client initialized successfully')
    
    return client
  } catch (error: any) {
    console.error('Failed to create Prisma client:', error)
    console.error('Error details:', error.message || 'No error message available')
    console.error('Stack trace:', error.stack || 'No stack trace available')
    
    // Return a mock client during build if real one can't be created
    if (process.env.NODE_ENV === 'production' && process.env.NEXT_PHASE === 'build') {
      console.log('Using mock Prisma client for build phase')
      return createMockPrismaClient()
    }
    
    throw error
  }
}

// Mock client for build time
function createMockPrismaClient() {
  console.log('Creating mock Prisma client for build/deployment')
  
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