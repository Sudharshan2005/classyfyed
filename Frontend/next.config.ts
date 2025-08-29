/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  experimental: {
    serverActions: true,
  },

  env: {
    MONGODB_URI: process.env.MONGODB_URI,
    ZOHO_USER:    process.env.ZOHO_USER,
    ZOHO_PASS:    process.env.ZOHO_PASS,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    ENCRYPTION_SECRET: process.env.ENCRYPTION_SECRET,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'classyfyed.s3.us-east-1.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      },
    ],
  },
};

export default nextConfig;
