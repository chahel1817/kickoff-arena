'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SquadMidfieldersRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/select/midfielders');
    }, [router]);

    return (
        <div className="page-container text-center">
            <h1 className="text-2xl text-muted">Redirecting to midfielder selection...</h1>
        </div>
    );
}
