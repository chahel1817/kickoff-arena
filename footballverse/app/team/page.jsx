'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TeamRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/team-select');
    }, [router]);

    return (
        <div className="page-container text-center">
            <h1 className="text-2xl text-muted">Redirecting to team selection...</h1>
        </div>
    );
}
