import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['lh3.googleusercontent.com'], // Add the required domain here
  },
  typescript: { 
    ignoreBuildErrors: true 
  },
};

export default nextConfig;
