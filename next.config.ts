import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: 'assets.example.com', // Example domain
      },
      {
        hostname: 'lh3.googleusercontent.com', // Google-hosted images
      },
      {
        hostname: 'i.ytimg.com', // YouTube thumbnails
      },
    ],
  },
};

export default nextConfig;
