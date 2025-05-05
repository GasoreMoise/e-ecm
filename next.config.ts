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
  
  // Disable page data collection to skip static pre-rendering issues
  experimental: {
    // Disable static page generation (for pages that need client-side data)
    disableOptimizedLoading: true,
    optimizeCss: false,
    workerThreads: false,
    cpus: 1
  },
  
  // Configure outputs
  output: 'standalone'
};

export default nextConfig;
