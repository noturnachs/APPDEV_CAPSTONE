/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'export', // Enable static site generation
  // Comment out rewrites when using static export
  // Note: API routes won't work in static mode
  // We'll need to update API calls to point to your production backend URL later
  /* 
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ];
  },
  */
}

export default nextConfig;
