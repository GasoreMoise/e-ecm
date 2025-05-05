#!/bin/bash

# Prisma Database Deployment Steps
echo "🔶 Running deployment script..."

# 1. Install dependencies
echo "📦 Installing dependencies..."
npm ci --production

# 2. Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# 3. Set build environment variables
echo "🔨 Setting build environment variables..."
export NEXT_PHASE=build
export NEXT_TELEMETRY_DISABLED=1
export NODE_ENV=production
export SKIP_STATIC_GENERATION=true
export DISABLE_ESLINT_PLUGIN=true

# 4. Build the application
echo "🏗️ Building the application..."
npm run build

# 5. Start the application
echo "🚀 Starting the application..."
npm run start

# Deployment complete
echo "✅ Deployment complete!" 