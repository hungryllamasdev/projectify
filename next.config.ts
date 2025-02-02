import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: { ignoreBuildErrors: true },
    images: {
        domains: ["lh3.googleusercontent.com"], // Add the required domain here
    },
};

export default nextConfig;
