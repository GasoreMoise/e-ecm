import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure rendering mode
  reactStrictMode: false,
  
  // Disable ESLint during production builds
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  
  // Disable TypeScript errors during production builds
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has TypeScript errors.
    ignoreBuildErrors: true,
  },
  
  // Configure outputs
  output: 'standalone',
  
  // External packages to be bundled with server components
  serverExternalPackages: ['@prisma/client', 'nodemailer'],
  
  // Prisma workarounds
  experimental: {
    // Skip API route collection during build
    disableOptimizedLoading: true,
    
    // Allow Prisma to be properly bundled
    serverMinification: false,
  },
  
  // Set environment variables specifically for the build phase
  env: {
    NEXT_PHASE: process.env.NEXT_PHASE || 'unknown'
  }
};

export default nextConfig;
