'use client';

import './globals.css';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const ONBOARDING_PATHS = ['/', '/welcome', '/league', '/team-select', '/manager-select'];

export default function RootLayout({ children }) {
    const pathname = usePathname();
    const isOnboarding = ONBOARDING_PATHS.includes(pathname);

    return (
        <html lang="en">
            <head>
                <title>FootballVerse - Kickoff Arena</title>
                <meta name="description" content="The most advanced football career simulation. Build your dream squad, manage tactics, and dominate the world stage." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </head>
            <body>
                {!isOnboarding && <Navbar />}
                <main>{children}</main>
                {!isOnboarding && <Footer />}
            </body>
        </html>
    );
}
