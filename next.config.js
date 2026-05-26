/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.unsplash.com' },
      { protocol: 'https', hostname: '**.githubusercontent.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
  experimental: {
    serverActions: { allowedOrigins: ['localhost:3000'] },
  },
}

module.exports = nextConfig
