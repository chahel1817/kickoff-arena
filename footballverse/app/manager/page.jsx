'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ManagerRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/manager-select');
    }, [router]);

    return (
        <div className="page-container text-center">
            <h1 className="text-2xl text-muted">Redirecting to manager selection...</h1>
        </div>
    );
}
