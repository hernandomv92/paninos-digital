/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable standalone output for optimized Docker builds
    // This reduces image size by only including necessary dependencies
    output: 'standalone',
    // Disable development indicator
    devIndicators: {
        buildActivity: false,
        appIsrStatus: false,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.supabase.co',
            },
            {
                protocol: 'https',
                hostname: 'paninos.co',
            },
            {
                protocol: 'https',
                hostname: 'api.paninos.co',
            }
        ],
    },
};

export default nextConfig;
