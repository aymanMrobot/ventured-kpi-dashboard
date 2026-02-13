/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    // Ensure the /data directory is included in Vercel serverless function bundles
    outputFileTracingIncludes: {
      '/*': ['./data/**/*'],
    },
  },
};

module.exports = nextConfig;