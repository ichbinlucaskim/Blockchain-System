import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // Optimize images
  images: {
    domains: [],
  },
  // Use Turbopack (default in Next.js 16)
  turbopack: {},
};

export default nextConfig;
