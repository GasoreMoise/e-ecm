// Script to generate Prisma client for production
const { execSync } = require('child_process')

try {
  console.log('🔶 Generating Prisma client...')
  
  // Generate Prisma client
  execSync('npx prisma generate', { stdio: 'inherit' })
  
  console.log('✅ Prisma client generated successfully')
} catch (error) {
  console.error('❌ Error generating Prisma client:', error)
  process.exit(1)
} 