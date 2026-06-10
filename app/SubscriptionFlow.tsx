'use client';

import { useEffect, useState } from 'react';

// Backend (multi-tenant). LovinFreq is X-App-Id: lovinfreq.
const API = 'https://api.enterpriseszion.com';
const APP_ID = 'lovinfreq';

type Plan = 'monthly' | 'annual' | 'lifetime';

const PLANS: { id: Plan; name: string; price: string; cadence: string; note?: string }[] = [
    { id: 'monthly', name: 'Monthly', price: 'US$ 4.99', cadence: 'per month' },
    { id: 'annual', name: 'Annual', price: 'US$ 29.99', cadence: 'per year', note: 'Save 50%' },
    { id: 'lifetime', name: 'Lifetime', price: 'US$ 79.99', cadence: 'one-time', note: 'Pay once' },
];

export function SubscriptionFlow() {
    const [token, setToken] = useState<string | null>(null);
    const [userEmail, setUserEmail] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [banner, setBanner] = useState<string | null>(null);
    const [alreadyPremium, setAlreadyPremium] = useState(false);

    // Surface the success/cancel return from Stripe.
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const status = params.get('status');
        if (status === 'success') {
            setBanner('Payment received — premium is unlocking on your device now. You can close this page and reopen LovinFreq.');
        } else if (status === 'cancelled') {
            setBanner('Checkout cancelled. No charge was made.');
        }
    }, []);

    async function login(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setBusy(true);
        try {
            const res = await fetch(`${API}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'X-App-Id': APP_ID },
                body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
            });
            const data = await res.json().catch(() => null);
            if (!res.ok || !data?.accessToken) {
                setError('Incorrect email or password.');
                return;
            }
            setToken(data.accessToken);
            setUserEmail(data.user?.email || email.trim().toLowerCase());
            // Check current entitlement so we don't sell to someone who's
            // already premium.
            try {
                const st = await fetch(`${API}/api/subscriptions/status`, {
                    headers: { 'X-App-Id': APP_ID, Authorization: `Bearer ${data.accessToken}` },
                });
                const sj = await st.json().catch(() => null);
                if (sj?.isPremium) setAlreadyPremium(true);
            } catch {
                /* ignore */
            }
        } catch {
            setError("Couldn't reach our servers. Check your connection.");
        } finally {
            setBusy(false);
        }
    }

    async function choose(plan: Plan) {
        if (!token) return;
        setError(null);
        setBusy(true);
        try {
            const res = await fetch(`${API}/api/subscriptions/checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-App-Id': APP_ID,
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ plan, origin: window.location.origin }),
            });
            const data = await res.json().catch(() => null);
            if (!res.ok || !data?.url) {
                setError(data?.error || 'Could not start checkout. Try again.');
                return;
            }
            window.location.href = data.url; // → Stripe Checkout
        } catch {
            setError("Couldn't reach our servers. Check your connection.");
        } finally {
            setBusy(false);
        }
    }

    async function manage() {
        if (!token) return;
        setBusy(true);
        try {
            const res = await fetch(`${API}/api/subscriptions/portal`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-App-Id': APP_ID,
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ origin: window.location.origin }),
            });
            const data = await res.json().catch(() => null);
            if (data?.url) window.location.href = data.url;
            else setError('Could not open billing portal.');
        } finally {
            setBusy(false);
        }
    }

    return (
        <div style={{ marginTop: 28 }}>
            {banner && (
                <div style={box('var(--accent)')}>{banner}</div>
            )}
            {error && <div style={box('var(--danger)')}>{error}</div>}

            {!token ? (
                <form onSubmit={login} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 380 }}>
                    <div style={{ fontSize: 10, letterSpacing: '0.2em', color: 'var(--text-muted)' }}>
                        SIGN IN WITH YOUR LOVINFREQ ACCOUNT
                    </div>
                    <input
                        type="email" required autoComplete="email" placeholder="you@email.com"
                        value={email} onChange={(e) => setEmail(e.target.value)} style={input()}
                    />
                    <input
                        type="password" required autoComplete="current-password" placeholder="Password"
                        value={password} onChange={(e) => setPassword(e.target.value)} style={input()}
                    />
                    <button type="submit" disabled={busy} style={primaryBtn()}>
                        {busy ? 'SIGNING IN…' : 'CONTINUE'}
                    </button>
                </form>
            ) : alreadyPremium ? (
                <div style={box('var(--accent)')}>
                    <strong>{userEmail}</strong> already has LovinFreq Premium. 🎉
                    <div style={{ marginTop: 12 }}>
                        <button onClick={manage} disabled={busy} style={ghostBtn()}>
                            MANAGE SUBSCRIPTION
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <div style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 16 }}>
                        Signed in as <strong>{userEmail}</strong>. Choose a plan:
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                        {PLANS.map((p) => (
                            <button key={p.id} onClick={() => choose(p.id)} disabled={busy} style={planCard(p.id === 'annual')}>
                                {p.note && <div style={badge()}>{p.note}</div>}
                                <div style={{ fontSize: 11, letterSpacing: '0.2em', color: 'var(--text-muted)' }}>
                                    {p.name.toUpperCase()}
                                </div>
                                <div style={{ marginTop: 10, fontSize: 28, fontWeight: 700 }}>{p.price}</div>
                                <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>{p.cadence}</div>
                                <div style={{ marginTop: 16, fontSize: 11, letterSpacing: '0.15em', color: 'var(--accent)' }}>
                                    {busy ? '…' : 'CHOOSE →'}
                                </div>
                            </button>
                        ))}
                    </div>
                    <p style={{ marginTop: 18, fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                        Secure payment via Stripe. Monthly and annual renew automatically
                        until cancelled; lifetime is a one-time payment. Cancel anytime
                        from the billing portal.
                    </p>
                </>
            )}
        </div>
    );
}

function box(color: string): React.CSSProperties {
    return {
        marginBottom: 18, padding: '12px 16px', borderRadius: 2,
        border: `1px solid ${color}55`, background: `${color}11`,
        fontSize: 13, color: 'var(--text)', lineHeight: 1.5,
    };
}
function input(): React.CSSProperties {
    return {
        padding: '11px 14px', borderRadius: 2, border: '1px solid var(--border)',
        background: 'var(--surface)', color: 'var(--text)', fontSize: 14, outline: 'none',
    };
}
function primaryBtn(): React.CSSProperties {
    return {
        marginTop: 4, padding: '12px 18px', borderRadius: 2, border: 'none',
        background: 'var(--accent)', color: '#04201b', fontWeight: 700,
        fontSize: 12, letterSpacing: '0.15em',
    };
}
function ghostBtn(): React.CSSProperties {
    return {
        padding: '9px 16px', borderRadius: 2, border: '1px solid var(--border)',
        background: 'transparent', color: 'var(--text)', fontSize: 11, letterSpacing: '0.15em',
    };
}
function planCard(highlight: boolean): React.CSSProperties {
    return {
        position: 'relative', textAlign: 'left', padding: 20, borderRadius: 4,
        border: `1px solid ${highlight ? 'var(--accent)' : 'var(--border)'}`,
        background: highlight ? 'rgba(0,229,192,0.06)' : 'var(--surface)',
        color: 'var(--text)',
    };
}
function badge(): React.CSSProperties {
    return {
        position: 'absolute', top: -10, right: 12, fontSize: 9, letterSpacing: '0.15em',
        padding: '3px 8px', borderRadius: 2, background: 'var(--accent)', color: '#04201b', fontWeight: 700,
    };
}
