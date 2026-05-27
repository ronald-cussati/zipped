import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Supabase Storage — update <project-ref> to your project reference
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      // Common user-supplied image sources
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.imgur.com' },
      { protocol: 'https', hostname: 'imgur.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [390, 768, 1024, 1280, 1920],
    imageSizes: [64, 128, 256, 384],
  },
  // Enable React strict mode for catching hydration issues early
  reactStrictMode: true,
  // Compress responses for faster mobile loading
  compress: true,
}

export default nextConfig
