// Blocks React Server Components / Server Action exploit probes (CVE-2025-55182 family)
// before they reach the app. Real users never send these shapes.
// Same file in every Zion Next.js app; keep the copies identical.
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const MAX_SCAN_BYTES = 512 * 1024;

const EXPLOIT_MARKERS = [
    '__proto__',
    'constructor:constructor',
    '"_prefix"',
    '"_formData"',
    'child_process',
    'execsync',
    'process.mainmodule',
];

const ESCAPE = new RegExp(String.fromCharCode(92) + 'u([0-9a-fA-F]{4})', 'g');

function decodeEscapes(raw: string): string {
    return raw.replace(ESCAPE, (_m, hex: string) => String.fromCharCode(parseInt(hex, 16)));
}

export function hasExploitMarker(body: string): boolean {
    const text = decodeEscapes(body).toLowerCase();
    return EXPLOIT_MARKERS.some((marker) => text.includes(marker));
}

function blocked(): NextResponse {
    return new NextResponse(null, { status: 400, headers: { 'cache-control': 'no-store' } });
}

/** Returns a 400 response for exploit probes, or null when the request is fine. */
export async function rscGuard(request: NextRequest): Promise<NextResponse | null> {
    if (request.method !== 'POST') return null;

    const contentType = (request.headers.get('content-type') || '').toLowerCase();
    if (contentType.startsWith('text/x-component')) return blocked();

    const length = Number(request.headers.get('content-length') || 0);
    if (length > MAX_SCAN_BYTES) return null;
    const scannable =
        contentType.startsWith('multipart/form-data') ||
        contentType.startsWith('text/plain') ||
        contentType.startsWith('application/x-www-form-urlencoded');
    if (!scannable) return null;

    let body = '';
    try {
        body = await request.clone().text();
    } catch {
        return null;
    }
    if (body.length > MAX_SCAN_BYTES) return null;
    return hasExploitMarker(body) ? blocked() : null;
}
