/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@repo/ui", "react-phone-input-2"],
  images: {
    remotePatterns: [
      // Backend API server (user avatars, post images, etc.)
      {
        protocol: 'http',
        hostname: '103.99.202.221',
        port: '8012',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '103.99.202.221',
        pathname: '/**',
      },
      // Avatar service
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        pathname: '/**',
      },
      // Unsplash
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
        pathname: '/**',
      },
       {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;