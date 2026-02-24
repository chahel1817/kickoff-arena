'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SquadDefendersRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/select/defenders');
    }, [router]);

    return (
        <div className="page-container text-center">
            <h1 className="text-2xl text-muted">Redirecting to defender selection...</h1>
        </div>
    );
}
