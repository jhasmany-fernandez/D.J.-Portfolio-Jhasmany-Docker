import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  output: 'standalone',

  // Suprimir warnings de hydration en desarrollo (solo cosméticos)
  reactStrictMode: true,

  // Opcional: logging reducido en desarrollo
  logging: {
    fetches: {
      fullUrl: false,
    },
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
    ],
  },
}

export default nextConfig
