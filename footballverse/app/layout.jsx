'use client';

import './globals.css';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function RootLayout({ children }) {
    const pathname = usePathname();
    const isEntryPage = pathname === '/';

    return (
        <html lang="en">
            <body>
                {!isEntryPage && <Navbar />}
                <main>{children}</main>
                {!isEntryPage && <Footer />}
            </body>
        </html>
    );
}
