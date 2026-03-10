/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Isse TypeScript errors build ke waqt ignore ho jayenge
    ignoreBuildErrors: true,
  },
  eslint: {
    // Isse ESLint warnings bhi ignore ho jayengi
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;