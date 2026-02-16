'use client';

import { Trophy } from 'lucide-react';
import Link from 'next/link';

const leagues = [
    { id: 'pl', name: 'Premier League', country: 'England', image: '/images/clubs/pl.png' },
    { id: 'laliga', name: 'La Liga', country: 'Spain', image: '/images/clubs/laliga.png' },
    { id: 'bundesliga', name: 'Bundesliga', country: 'Germany', image: '/images/clubs/bundesliga.png' },
    { id: 'seriea', name: 'Serie A', country: 'Italy', image: '/images/clubs/seriea.png' },
];

export default function LeagueSelection() {
    return (
        <div className="page-container">
            <div className="text-center mb-12">
                <h1 className="text-4xl mb-4">Choose Your <span className="text-gradient">League</span></h1>
                <p className="text-muted">Pick a top-tier league to start building your squad from.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {leagues.map((league) => (
                    <Link key={league.id} href={`/team?league=${league.id}`} className="glass p-6 rounded-2xl card-hover flex flex-col items-center text-center">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-4">
                            <Trophy className="w-12 h-12 text-primary" />
                        </div>
                        <h3 className="text-xl font-bold">{league.name}</h3>
                        <p className="text-muted text-sm">{league.country}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
