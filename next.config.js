/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  
  // Specify the TypeScript compiler options
  typescript: {
    // Handle TypeScript errors during build (but don't fail the build)
    ignoreBuildErrors: true
  },
  
  // Handle ESLint errors during build (but don't fail the build)
  eslint: {
    ignoreDuringBuilds: true
  }
};

module.exports = nextConfig; 