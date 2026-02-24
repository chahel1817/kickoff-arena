'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const ONBOARDING_PATHS = new Set([
    '/',
    '/welcome',
    '/league',
    '/team-select',
    '/manager-select',
    '/formation-select',
    '/select/goalkeeper',
    '/select/defenders',
    '/select/midfielders',
    '/select/forwards',
    '/squad/review',
]);

export default function ClientChrome({ children }) {
    const pathname = usePathname();
    const isOnboarding = ONBOARDING_PATHS.has(pathname);

    return (
        <>
            {!isOnboarding && <Navbar />}
            <main>{children}</main>
            {!isOnboarding && <Footer />}
        </>
    );
}
