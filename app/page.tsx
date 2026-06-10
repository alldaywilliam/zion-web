import type { Metadata } from 'next';
import { SubscriptionFlow } from './SubscriptionFlow';

export const metadata: Metadata = {
    title: 'LovinFreq Premium — Zion Enterprises',
    description:
        'Unlock every LovinFreq frequency category, binaural beats, baby frequencies, wellness, manifestation, background playback and unlimited custom frequencies.',
};

// The whole site (lovinfreq.enterpriseszion.com) is the LovinFreq
// subscription page. Server component owns the chrome; the interactive
// login + plan selection is the client component. Premium is sold ONLY
// here on the web — the mobile app never links to this page.
export default function SubscriptionPage() {
    return (
        <main
            style={{
                maxWidth: 880,
                margin: '0 auto',
                padding: '48px 24px 64px',
            }}
        >
            <div style={{ fontSize: 10, letterSpacing: '0.35em', color: 'var(--text-muted)' }}>
                LOVINFREQ
            </div>
            <h1 style={{ marginTop: 6, fontSize: 30, fontWeight: 600 }}>Go Premium</h1>
            <div style={{ marginTop: 12, height: 2, width: 40, background: 'var(--accent)' }} />
            <p style={{ marginTop: 18, fontSize: 14, lineHeight: 1.65, color: 'var(--text-dim)', maxWidth: 560 }}>
                Unlock every frequency category, true binaural beats, the full baby &
                wellness libraries, manifestation protocols, background playback,
                the sleep timer and unlimited custom frequencies. Sign in with your
                LovinFreq account, pick a plan, and premium activates on your device
                automatically.
            </p>

            <SubscriptionFlow />

            <footer style={{ marginTop: 56, borderTop: '1px solid var(--border)', paddingTop: 20, fontSize: 11, color: 'var(--text-muted)' }}>
                © 2026 Zion Enterprises Ltda. ·{' '}
                <a href="https://admin.enterpriseszion.com/legal/privacy" style={{ textDecoration: 'underline' }}>
                    Privacy
                </a>{' '}
                ·{' '}
                <a href="https://admin.enterpriseszion.com/account/delete" style={{ textDecoration: 'underline' }}>
                    Delete account
                </a>
            </footer>
        </main>
    );
}
