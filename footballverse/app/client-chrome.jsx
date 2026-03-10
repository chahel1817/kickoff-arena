'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/context/AuthContext';

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
    '/summary',
    '/auth',
]);

export default function ClientChrome({ children }) {
    const pathname = usePathname();
    const isOnboarding = ONBOARDING_PATHS.has(pathname);

    return (
        <AuthProvider>
            {!isOnboarding && <Navbar />}
            <main>{children}</main>
            {!isOnboarding && <Footer />}
        </AuthProvider>
    );
}
