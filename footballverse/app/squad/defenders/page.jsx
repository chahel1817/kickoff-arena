'use client';

import { Shield, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DefendersPage() {
    const players = [
        { id: 1, name: 'Virgil van Dijk', club: 'Liverpool', rating: 89 },
        { id: 2, name: 'Ruben Dias', club: 'Man City', rating: 88 },
        { id: 3, name: 'Alphonso Davies', club: 'Bayern', rating: 84 },
    ];

    return (
        <div className="page-container">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-4xl mb-2">Select <span className="text-gradient">Defenders</span></h1>
                    <p className="text-muted">Reinforce your backline (0/4 selected)</p>
                </div>
                <Link href="/squad/midfielders" className="btn-primary">
                    Next: Midfielders <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {players.map((player) => (
                    <div key={player.id} className="glass p-6 rounded-2xl card-hover flex flex-col items-center">
                        <div className="w-full aspect-[3/4] bg-white/5 rounded-xl mb-4 flex items-center justify-center">
                            <Shield className="w-20 h-20 text-muted/20" />
                        </div>
                        <h3 className="text-xl font-bold">{player.name}</h3>
                        <p className="text-muted">{player.club}</p>
                        <div className="mt-4 w-full">
                            <button className="w-full py-2 rounded-lg border border-primary/50 text-primary hover:bg-primary hover:text-black transition-colors font-bold">
                                SELECT PLAYER
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
