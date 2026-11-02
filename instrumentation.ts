import { initServerSentry } from './lib/sentryServer';

export async function register(): Promise<void> {
    if (process.env.NEXT_RUNTIME === 'nodejs') initServerSentry();
}

export { onRequestError } from './lib/sentryServer';
