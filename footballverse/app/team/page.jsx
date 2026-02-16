'use client';

import { Shield } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function TeamSelection() {
    const searchParams = useSearchParams();
    const league = searchParams.get('league') || 'Premier League';

    const teams = [
        { id: 1, name: 'Manchester City', rating: 88 },
        { id: 2, name: 'Real Madrid', rating: 89 },
        { id: 3, name: 'Bayern Munich', rating: 87 },
        { id: 4, name: 'Liverpool', rating: 86 },
    ];

    return (
        <div className="page-container">
            <div className="text-center mb-12">
                <h1 className="text-4xl mb-4">Select <span className="text-gradient">Team</span></h1>
                <p className="text-muted">Showing clubs for {league.toUpperCase()}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {teams.map((team) => (
                    <Link key={team.id} href={`/manager?team=${team.id}`} className="glass p-6 rounded-2xl card-hover flex flex-col items-center text-center">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <Shield className="w-12 h-12 text-accent" />
                        </div>
                        <h3 className="text-xl font-bold">{team.name}</h3>
                        <p className="text-muted text-sm">Rating: {team.rating}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
