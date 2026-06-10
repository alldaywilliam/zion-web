import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // The subscription page reads its plan prices from the backend at
    // runtime, so nothing here needs build-time API config.
    poweredByHeader: false,
    // Static export → plain HTML/JS in `out/`, hosted on GitHub Pages at
    // the apex enterpriseszion.com. No Node server, no Railway.
    output: 'export',
    images: { unoptimized: true },
    trailingSlash: true,
};

export default nextConfig;
