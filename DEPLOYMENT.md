# Deployment Guide for Optical Eyewear

This guide covers the necessary steps to deploy the Optical Eyewear application to various platforms.

## Required Environment Variables

To successfully deploy the application, you need to set the following environment variables in your hosting platform:

### Database Configuration
```
DATABASE_URL="postgresql://username:password@localhost:5432/optical_eyewear"
```
This should point to your PostgreSQL database. When using a hosted database service, use their connection string.

### JWT Configuration
```
JWT_SECRET="your-jwt-secret-key-at-least-32-chars"
```
Use a secure random string at least 32 characters long.

### SMTP Configuration for Emails
```
SMTP_HOST="smtp.example.com"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="your-smtp-username"
SMTP_PASSWORD="your-smtp-password"
SMTP_FROM="no-reply@yourdomain.com"
```
These settings are required for password reset and email verification.

### Application URLs
```
NEXT_PUBLIC_APP_URL="https://your-app-domain.com"
```
The public URL of your application.

### Build Configuration
```
NEXT_PHASE="production"
NEXT_TELEMETRY_DISABLED=1
DISABLE_ESLINT_PLUGIN=true
PRISMA_SKIP_DATABASE_VALIDATION=true
```
These settings help optimize the build process.

## Build Steps

1. Ensure your database is properly set up with the Prisma schema.
2. Set all required environment variables.
3. Install dependencies: `npm ci --production`
4. Generate Prisma client: `npx prisma generate`
5. Build the application: `npm run build`
6. Start the application: `npm run start`

## Troubleshooting

### Database Connection Issues

If you're seeing 500 errors on your deployed API routes, check:

1. Your `DATABASE_URL` is correct and the database is accessible from your deployment environment
2. The database user has proper permissions
3. Your Prisma schema has been properly deployed: `npx prisma db push` or `npx prisma migrate deploy`

### Error: Failed to collect page data for /api/auth/*

This is typically caused by:
- Missing environment variables
- Database connection issues
- Issues with Prisma client generation

Try running the build with the environment variable `PRISMA_SKIP_DATABASE_VALIDATION=true`

### Common Fixes for Vercel Deployment

In Vercel, make sure to:
1. Add all environment variables under Project → Settings → Environment Variables
2. Under Build & Development Settings, set the "Build Command" to:
   `npm run prisma:generate && next build`
3. Set "Output Directory" to `.next`

## Healthcheck After Deployment

After deployment, test these endpoints to verify functionality:
- Homepage: Should load without errors
- Registration: Test creating a new account
- Login: Test signing in with credentials
- API endpoints: Check that they return appropriate responses

If any of these fail, check the logs from your hosting provider for specific error messages. 