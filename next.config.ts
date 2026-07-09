import type { NextConfig } from 'next';

const CSP =
    "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; " +
    "form-action 'self'; img-src 'self' data: blob: https:; font-src 'self' data:; " +
    "style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "connect-src 'self' https:";

const nextConfig: NextConfig = {
    // The subscription page reads its plan prices from the backend at
    // runtime, so nothing here needs build-time API config.
    poweredByHeader: false,
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
                    { key: 'Content-Security-Policy', value: CSP },
                ],
            },
        ];
    },
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
