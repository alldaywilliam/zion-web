import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // The subscription page reads its plan prices from the backend at
    // runtime, so nothing here needs build-time API config.
    poweredByHeader: false,
    // Runs as a normal Next.js server on Railway (service `zion-web`),
    // served at https://lovinfreq.enterpriseszion.com. The subscription
    // page is the site root. No static export, no GitHub Pages.
    async redirects() {
        return [
            // Old Pages path → root, in case any link still points there.
            { source: '/lovinfreq/subscription', destination: '/', permanent: true },
        ];
    },
};

export default nextConfig;
