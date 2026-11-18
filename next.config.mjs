/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tjaczslkvyhbmjtdzase.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/cabin-images/**',
      },
    ],
  },
  async redirects() {
    return [
      { source: '/cabins', destination: '/rooms', permanent: true },
      { source: '/cabins/:path*', destination: '/rooms/:path*', permanent: true },
    ];
  },
};

export default nextConfig;
