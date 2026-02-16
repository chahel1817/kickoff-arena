'use client';

import { CheckCircle2, Share2, Play } from 'lucide-react';
import Link from 'next/link';

export default function ReviewPage() {
    return (
        <div className="page-container">
            <div className="text-center mb-12">
                <h1 className="text-4xl mb-4">Final <span className="text-gradient">Review</span></h1>
                <p className="text-muted">Your Starting XI is ready for the tournament.</p>
            </div>

            <div className="glass p-8 rounded-3xl mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6">
                    <CheckCircle2 className="w-12 h-12 text-primary opacity-20" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-primary uppercase tracking-tighter font-bold">Manager</h3>
                        <div className="p-4 bg-white/5 rounded-xl border border-glass-border">
                            <p className="text-xl font-bold">Pep Guardiola</p>
                            <p className="text-muted text-sm">Tiki-Taka Specialist</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-accent uppercase tracking-tighter font-bold">Key Star</h3>
                        <div className="p-4 bg-white/5 rounded-xl border border-glass-border">
                            <p className="text-xl font-bold">Erling Haaland</p>
                            <p className="text-muted text-sm">Rating: 91</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-muted uppercase tracking-tighter font-bold">Formation</h3>
                        <div className="p-4 bg-white/5 rounded-xl border border-glass-border">
                            <p className="text-xl font-bold">4-3-3 Attack</p>
                            <p className="text-muted text-sm">Balanced & Explosive</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
                <button className="btn-primary">
                    <Play className="mr-2 w-5 h-5" /> Start Match
                </button>
                <button className="btn-primary bg-secondary text-white hover:bg-secondary/80">
                    <Share2 className="mr-2 w-5 h-5" /> Share Squad
                </button>
                <Link href="/home" className="btn-primary bg-transparent border border-glass-border text-white hover:bg-white/5">
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
}
