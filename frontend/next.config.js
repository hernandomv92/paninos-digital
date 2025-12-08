/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable standalone output for optimized Docker builds
    // This reduces image size by only including necessary dependencies
    output: 'standalone',
};

export default nextConfig;
