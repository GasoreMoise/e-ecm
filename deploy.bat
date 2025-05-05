@echo off
echo "🔶 Running deployment script..."

REM 1. Install dependencies
echo "📦 Installing dependencies..."
call npm ci --production

REM 2. Generate Prisma client
echo "🔧 Generating Prisma client..."
call npx prisma generate

REM 3. Set build environment variables
echo "🔨 Setting build environment variables..."
set NEXT_PHASE=build
set NEXT_TELEMETRY_DISABLED=1
set NODE_ENV=production
set SKIP_STATIC_GENERATION=true
set DISABLE_ESLINT_PLUGIN=true

REM 4. Build the application
echo "🏗️ Building the application..."
call npm run build

REM 5. Start the application
echo "🚀 Starting the application..."
call npm run start

REM Deployment complete
echo "✅ Deployment complete!"

