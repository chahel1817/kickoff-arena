'use client';

import { Zap, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function MidfieldersPage() {
    const players = [
        { id: 4, name: 'Kevin De Bruyne', club: 'Man City', rating: 91 },
        { id: 5, name: 'Jude Bellingham', club: 'Real Madrid', rating: 88 },
        { id: 6, name: 'Rodri', club: 'Man City', rating: 89 },
    ];

    return (
        <div className="page-container">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-4xl mb-2">Select <span className="text-gradient">Midfielders</span></h1>
                    <p className="text-muted">The engine of your team (0/3 selected)</p>
                </div>
                <div className="flex gap-4">
                    <Link href="/squad/defenders" className="btn-primary bg-secondary text-white hover:bg-secondary/80">
                        <ArrowLeft className="mr-2 w-5 h-5" /> Back
                    </Link>
                    <Link href="/squad/forwards" className="btn-primary">
                        Next: Forwards <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {players.map((player) => (
                    <div key={player.id} className="glass p-6 rounded-2xl card-hover flex flex-col items-center">
                        <div className="w-full aspect-[3/4] bg-white/5 rounded-xl mb-4 flex items-center justify-center">
                            <Zap className="w-20 h-20 text-muted/20" />
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
