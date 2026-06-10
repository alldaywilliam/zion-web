import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // The subscription page reads its plan prices from the backend at
    // runtime, so nothing here needs build-time API config.
    poweredByHeader: false,
};

export default nextConfig;
