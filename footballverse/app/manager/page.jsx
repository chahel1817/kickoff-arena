'use client';

import { UserCircle } from 'lucide-react';
import Link from 'next/link';

export default function ManagerSelection() {
    const managers = [
        { id: 1, name: 'Pep Guardiola', style: 'Tiki-Taka', reputation: 'World Class' },
        { id: 2, name: 'Jurgen Klopp', style: 'Gegenpressing', reputation: 'World Class' },
        { id: 3, name: 'Carlo Ancelotti', style: 'Balanced', reputation: 'Legendary' },
    ];

    return (
        <div className="page-container">
            <div className="text-center mb-12">
                <h1 className="text-4xl mb-4">Appoint Your <span className="text-gradient">Manager</span></h1>
                <p className="text-muted">Choose a tactician to lead your project.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {managers.map((manager) => (
                    <Link key={manager.id} href="/squad/defenders" className="glass p-8 rounded-2xl card-hover flex flex-col items-center text-center">
                        <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center mb-6 border-2 border-primary/20">
                            <UserCircle className="w-16 h-16 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{manager.name}</h3>
                        <p className="text-primary font-semibold text-sm mb-1">{manager.style}</p>
                        <p className="text-muted text-xs uppercase tracking-widest">{manager.reputation}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
