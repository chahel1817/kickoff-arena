'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, ChevronRight } from 'lucide-react';
import '../entry.css';

export default function WelcomeScreen() {
    const [name, setName] = useState('');
    const router = useRouter();

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        if (storedName) {
            setName(storedName);
        } else {
            router.push('/');
        }
    }, [router]);

    const handleContinue = () => {
        router.push('/team-select');
    };

    return (
        <div className="entry-page">
            {/* Background elements consistent with entry page */}
            <div className="stadium-bg" style={{ filter: 'brightness(0.15) saturate(1.2)' }}></div>
            <div className="overlay-gradient"></div>

            <section className="welcome-screen">
                <div className="main-action" style={{ maxWidth: '500px' }}>
                    <div className="welcome-badge">
                        <Trophy className="badge-icon" />
                    </div>

                    <div className="welcome-text-container">
                        <h2 className="headline text-700 welcome-title">
                            Welcome <span className="player-name">{name}</span>
                        </h2>
                        <h3 className="sub-headline text-600">to FootballVerse</h3>
                    </div>

                    <p className="text-400 welcome-description">
                        Your tactical journey to architectural greatness starts here.
                        Prepare to dominate the world stage.
                    </p>

                    <div className="button-group">
                        <button
                            onClick={handleContinue}
                            className="continue-btn text-700"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                        >
                            START TEAM SELECTION <ChevronRight size={20} />
                        </button>
                    </div>

                    <div className="progress-indicator">
                        <span className="progress-step text-600">Step 2 of 5</span>
                        <span className="progress-separator">•</span>
                        <span className="progress-label text-500">Welcome Screen</span>
                    </div>
                </div>
            </section>

            {/* Ambient Glows */}
            <div className="glow-left" style={{ background: 'rgba(0, 255, 136, 0.1)' }}></div>
            <div className="glow-right" style={{ background: 'rgba(59, 130, 246, 0.1)' }}></div>

            <style jsx>{`
                .welcome-screen {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .welcome-badge {
                    width: 70px;
                    height: 70px;
                    background: rgba(0, 255, 136, 0.1);
                    border: 1px solid rgba(0, 255, 136, 0.3);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.5rem;
                }
                .badge-icon {
                    color: #00ff88;
                    width: 32px;
                    height: 32px;
                }
            `}</style>
        </div>
    );
}
