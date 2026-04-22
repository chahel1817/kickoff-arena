'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AuthProvider } from '@/context/AuthContext';
import InitialLoader from '@/components/ui/InitialLoader';

const ONBOARDING_PATHS = new Set([
    '/',
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
    const [isLoading, setIsLoading] = useState(true);
    const isOnboarding = ONBOARDING_PATHS.has(pathname);

    // Only show loading on initial visit
    useEffect(() => {
        const hasLoaded = sessionStorage.getItem('app-loaded');
        if (hasLoaded) {
            setIsLoading(false);
        }
    }, []);

    const handleLoadingComplete = () => {
        setIsLoading(false);
        sessionStorage.setItem('app-loaded', 'true');
    };

    return (
        <AuthProvider>
            <AnimatePresence mode="wait">
                {isLoading && (
                    <InitialLoader onComplete={handleLoadingComplete} />
                )}
            </AnimatePresence>

            <div className={`transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                {!isOnboarding && <Navbar />}
                <main>{children}</main>
                {!isOnboarding && <Footer />}
            </div>
        </AuthProvider>
    );
}
