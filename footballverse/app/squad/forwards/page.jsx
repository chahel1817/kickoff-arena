'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SquadForwardsRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/select/forwards');
    }, [router]);

    return (
        <div className="page-container text-center">
            <h1 className="text-2xl text-muted">Redirecting to forward selection...</h1>
        </div>
    );
}
