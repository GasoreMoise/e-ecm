import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // Generates static HTML/CSS/JS
  images: {
    unoptimized: true  // Required for static image export
  },
  trailingSlash: true,  // Adds trailing slashes to URLs
};

export default nextConfig;
