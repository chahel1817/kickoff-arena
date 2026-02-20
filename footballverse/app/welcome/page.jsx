'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, ChevronRight, Shield, Zap } from 'lucide-react';
import '../entry.css';

export default function WelcomeScreen() {
    const [name, setName] = useState('');
    const [loaded, setLoaded] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        if (storedName) {
            setName(storedName);
        } else {
            router.push('/');
        }
        setTimeout(() => setLoaded(true), 100);
    }, [router]);

    const handleContinue = () => {
        router.push('/league');
    };

    return (
        <div className="entry-page">
            <div className="stadium-bg" style={{ filter: 'brightness(0.12) saturate(1.3)' }}></div>
            <div className="overlay-gradient"></div>

            <section className="welcome-screen">
                <div className={`main-action ${loaded ? 'welcome-loaded' : ''}`} style={{ maxWidth: '520px' }}>
                    <div className="welcome-badge">
                        <Trophy className="badge-icon" />
                        <div className="badge-ring"></div>
                    </div>

                    <div className="welcome-text-container">
                        <h2 className="headline text-700 welcome-title">
                            Welcome <span className="player-name">{name}</span>
                        </h2>
                        <h3 className="sub-headline text-600">to FootballVerse</h3>
                    </div>

                    <p className="text-400 welcome-description">
                        Your professional career in FootballVerse begins now.
                        Prepare to navigate the complexities of club management,
                        lead transfers, and forge a path to glory.
                    </p>

                    <div className="welcome-stats-row">
                        <div className="welcome-stat-item">
                            <Shield size={16} className="text-primary" />
                            <div>
                                <span className="stat-val">200+</span>
                                <span className="stat-desc">CLUBS</span>
                            </div>
                        </div>
                        <div className="welcome-stat-divider"></div>
                        <div className="welcome-stat-item">
                            <Zap size={16} className="text-primary" />
                            <div>
                                <span className="stat-val">5,000+</span>
                                <span className="stat-desc">PLAYERS</span>
                            </div>
                        </div>
                        <div className="welcome-stat-divider"></div>
                        <div className="welcome-stat-item">
                            <Trophy size={16} className="text-primary" />
                            <div>
                                <span className="stat-val">6</span>
                                <span className="stat-desc">LEAGUES</span>
                            </div>
                        </div>
                    </div>

                    <div className="button-group">
                        <button
                            onClick={handleContinue}
                            className="continue-btn text-700"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                        >
                            START FEDERATION SELECTION <ChevronRight size={20} />
                        </button>
                    </div>

                    <div className="progress-indicator">
                        <span className="progress-step text-600">Step 2 of 5</span>
                        <span className="progress-separator">•</span>
                        <span className="progress-label text-500">User Induction</span>
                    </div>
                </div>
            </section>

            <style jsx>{`
                .welcome-screen {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .main-action {
                    opacity: 0;
                    transform: translateY(20px) scale(0.98);
                    transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
                }

                .main-action.welcome-loaded {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }

                .welcome-badge {
                    width: 80px;
                    height: 80px;
                    background: rgba(0, 255, 136, 0.08);
                    border: 1px solid rgba(0, 255, 136, 0.2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 2rem;
                    position: relative;
                }

                .badge-ring {
                    position: absolute;
                    inset: -8px;
                    border: 1px solid rgba(0, 255, 136, 0.15);
                    border-radius: 50%;
                    animation: pulsate 2.5s ease-out infinite;
                }

                @keyframes pulsate {
                    0% { transform: scale(1); opacity: 0.5; }
                    100% { transform: scale(1.5); opacity: 0; }
                }

                .badge-icon {
                    color: #00ff88;
                    width: 36px;
                    height: 36px;
                    filter: drop-shadow(0 0 15px rgba(0, 255, 136, 0.4));
                }

                .welcome-stats-row {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 1.5rem;
                    margin-bottom: 2.5rem;
                    padding: 1.25rem;
                    background: rgba(255,255,255,0.02);
                    border-radius: 16px;
                    border: 1px solid rgba(255,255,255,0.04);
                }

                .welcome-stat-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .welcome-stat-item div {
                    display: flex;
                    flex-direction: column;
                }

                .stat-val {
                    font-size: 1rem;
                    font-weight: 900;
                    color: white;
                }

                .stat-desc {
                    font-size: 0.55rem;
                    font-weight: 700;
                    color: rgba(255,255,255,0.3);
                    letter-spacing: 0.15em;
                }

                .welcome-stat-divider {
                    width: 1px;
                    height: 28px;
                    background: rgba(255,255,255,0.08);
                }

                @media (max-width: 768px) {
                    .welcome-stats-row {
                        gap: 1rem;
                        padding: 1rem;
                    }
                    .stat-val { font-size: 0.85rem; }
                }
            `}</style>
        </div>
    );
}
