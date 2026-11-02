import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rscGuard } from './lib/rscGuard';

export async function proxy(req: NextRequest) {
    const blocked = await rscGuard(req);
    return blocked ?? NextResponse.next();
}

export const config = { matcher: ['/((?!_next/static|_next/image).*)'] };
