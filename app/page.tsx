// Apex placeholder. The full marketing landing page is a separate
// effort (see _res/_landing prompt); this keeps enterpriseszion.com
// from 404-ing while the subscription page lives at /lovinfreq/subscription.
export default function Home() {
    return (
        <main
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 16,
                padding: 24,
                textAlign: 'center',
            }}
        >
            <div style={{ fontSize: 11, letterSpacing: '0.35em', color: 'var(--text-muted)' }}>
                ZION ENTERPRISES LTDA.
            </div>
            <h1 style={{ fontSize: 30, fontWeight: 600 }}>Privacy-first software.</h1>
            <p style={{ fontSize: 14, color: 'var(--text-dim)', maxWidth: 420, lineHeight: 1.6 }}>
                LovinFreq · OneGigTicket · Mizracha — built in Curitiba, Brazil.
            </p>
            <div style={{ marginTop: 8, display: 'flex', gap: 18, fontSize: 12 }}>
                <a href="/lovinfreq/subscription" style={{ color: 'var(--accent)' }}>
                    LovinFreq Premium →
                </a>
                <a href="https://admin.enterpriseszion.com/legal/privacy" style={{ color: 'var(--text-muted)' }}>
                    Privacy
                </a>
            </div>
        </main>
    );
}
