'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomeRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/dashboard');
    }, [router]);

    return (
        <div className="page-container text-center">
            <h1 className="text-2xl text-muted">Redirecting to dashboard...</h1>
        </div>
    );
}
