'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, Trophy, Play } from 'lucide-react';

export default function WelcomePage() {
    const [name, setName] = useState('Manager');

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        if (storedName) setName(storedName);
    }, []);

    return (
        <div className="page-container">
            <div className="mb-12">
                <h1 className="text-4xl font-extrabold">Welcome, <span className="text-gradient font-black">{name}</span></h1>
                <p className="text-muted text-lg mt-2">Your stadium is ready. What's the next move?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Link href="/league" className="glass p-8 rounded-3xl card-hover group border-white/5">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                        <Trophy className="w-8 h-8 text-[#00ff88] group-hover:scale-110 transition-transform" />
                    </div>
                    <h3 className="text-2xl mb-2 font-bold uppercase tracking-tight">Select League</h3>
                    <p className="text-muted leading-relaxed">Choose the league where you want to build your legacy.</p>
                </Link>

                <Link href="/squad/review" className="glass p-8 rounded-3xl card-hover group border-white/5">
                    <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                        <Users className="w-8 h-8 text-[#3b82f6] group-hover:scale-110 transition-transform" />
                    </div>
                    <h3 className="text-2xl mb-2 font-bold uppercase tracking-tight">My Squad</h3>
                    <p className="text-muted leading-relaxed">Review and manage your current XI players.</p>
                </Link>

                <Link href="/match" className="glass p-8 rounded-3xl card-hover group border-white/5">
                    <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-500/20 transition-colors">
                        <Play className="w-8 h-8 text-[#ff4444] group-hover:scale-110 transition-transform" />
                    </div>
                    <h3 className="text-2xl mb-2 font-bold uppercase tracking-tight">Kick Off</h3>
                    <p className="text-muted leading-relaxed">Enter the match simulation and test your tactics.</p>
                </Link>
            </div>
        </div>
    );
}
