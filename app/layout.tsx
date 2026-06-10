import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Zion Enterprises',
    description: 'Zion Enterprises Ltda. — privacy-first software from Curitiba, Brazil.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
