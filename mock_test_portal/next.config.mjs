/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { hostname: 'images.unsplash.com' },
      { hostname: 'api.dicebear.com' },
    ],
  },
  async rewrites() {
    const fastapiUrl = process.env.FASTAPI_BACKEND_URL || 'http://127.0.0.1:8000';
    return [
      {
        source: '/api/:path*',
        destination: `${fastapiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
