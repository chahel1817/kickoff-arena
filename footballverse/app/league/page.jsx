'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, ChevronRight, ChevronLeft, Globe, Cpu } from 'lucide-react';
import leaguesData from '../../data/leagues.json';
import '../entry.css';

export default function LeagueSelectionPage() {
    const router = useRouter();
    const [name, setName] = useState('');

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        if (storedName) setName(storedName);

        // Clear previous selections to ensure a fresh flow
        localStorage.removeItem('selectedLeague');
        localStorage.removeItem('selectedTeam');
    }, []);

    const handleLeagueSelect = (league) => {
        localStorage.setItem('selectedLeague', league.id);
        router.push('/team-select');
    };

    return (
        <div className="entry-page no-snap">
            <div className="stadium-bg" style={{ filter: 'brightness(0.12) saturate(0.8)' }}></div>
            <div className="overlay-gradient"></div>

            <section className="league-selection-container">
                <main className="selection-view" style={{ maxWidth: '1200px', width: '95%' }}>

                    {/* Header Nav */}
                    <div className="premium-nav-bar glass">
                        <div className="nav-left-group">
                            <button onClick={() => router.push('/welcome')} className="nav-back-btn-extreme">
                                <ChevronLeft size={20} />
                                <span>RETURN TO WELCOME</span>
                            </button>
                        </div>

                        <div className="center-identity">
                            <div className="user-mini-badge">
                                <Globe size={14} className="text-primary" />
                            </div>
                            <div className="identity-text-stack">
                                <span className="scouting-label">AUTHORIZED RECRUITMENT</span>
                                <span className="scouting-target">{name.toUpperCase() || 'AGENT'}</span>
                            </div>
                        </div>

                        <div className="phase-indicator">
                            <div className="step-count">
                                <span className="text-primary">03</span>
                                <span className="text-muted">/</span>
                                <span className="text-muted">05</span>
                            </div>
                            <div className="phase-dots">
                                <div className="dot filled"></div>
                                <div className="dot filled"></div>
                                <div className="dot active"></div>
                                <div className="dot"></div>
                                <div className="dot"></div>
                            </div>
                        </div>
                    </div>

                    <div className="selection-titles centered">
                        <div className="title-ornament">
                            <div className="ornament-line"></div>
                            <Globe size={16} className="ornament-icon" />
                            <div className="ornament-line"></div>
                        </div>
                        <h2 className="headline text-700 main-selection-title">
                            SELECT <span className="text-gradient">FEDERATION</span>
                        </h2>
                        <p className="subtitle-premium">
                            Choose the operational theater for your tactical deployment.
                            Each league offers unique challenges and financial structures.
                        </p>
                    </div>

                    {/* Leagues Grid */}
                    <div className="leagues-grid-refined">
                        {leaguesData.map((league) => (
                            <button
                                key={league.id}
                                onClick={() => handleLeagueSelect(league)}
                                className="league-card-aligned glass"
                            >
                                <div className="flag-box">
                                    <img
                                        src={`https://flagcdn.com/w160/${league.code}.png`}
                                        alt={league.country}
                                        className="league-flag-img"
                                    />
                                    <div className="flag-overlay-glass"></div>
                                </div>
                                <div className="league-info-box">
                                    <h3 className="text-700 league-country-label">{league.country}</h3>
                                    <div className="league-sub-row">
                                        <Trophy size={14} className="text-primary" />
                                        <span className="league-name-tag">{league.name}</span>
                                    </div>
                                </div>
                                <div className="league-arrow-area">
                                    <ChevronRight size={24} />
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Progress Footer */}
                    <div className="progress-indicator mt-12">
                        <span className="progress-step text-600">Step 3 of 5</span>
                        <span className="progress-separator">•</span>
                        <span className="progress-label text-500">Operation Theater Selection</span>
                    </div>
                </main>
            </section>

            <style jsx>{`
                .league-selection-container {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 4rem 1rem 8rem;
                    animation: fadeInUp 0.6s ease-out;
                }

                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .premium-nav-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem 3rem;
                    position: sticky;
                    top: 0;
                    z-index: 2000;
                    border-bottom: 1px solid rgba(255,255,255,0.08);
                    margin-bottom: 3rem;
                    background: rgba(10, 10, 15, 0.4);
                    backdrop-filter: blur(20px);
                    border-radius: 20px;
                }

                .nav-left-group {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }

                .nav-back-btn-extreme {
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    background: rgba(0, 255, 136, 0.05);
                    border: 1px solid rgba(0, 255, 136, 0.3);
                    padding: 0.75rem 1.75rem;
                    border-radius: 14px;
                    font-size: 0.75rem;
                    font-weight: 900;
                    color: var(--primary);
                    letter-spacing: 0.2em;
                    transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    cursor: pointer;
                }

                .nav-back-btn-extreme:hover {
                    background: var(--primary);
                    color: black;
                    transform: translateX(-4px);
                    box-shadow: 0 0 30px rgba(0, 255, 136, 0.5);
                }

                .center-identity {
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                    background: rgba(255, 255, 255, 0.03);
                    padding: 0.6rem 1.5rem;
                    border-radius: 50px;
                    border: 1px solid rgba(255,255,255,0.06);
                }

                .user-mini-badge {
                    width: 32px;
                    height: 32px;
                    border: 1.5px solid var(--primary);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(0,0,0,0.2);
                }

                .identity-text-stack {
                    display: flex;
                    flex-direction: column;
                    gap: 0.1rem;
                }

                .scouting-label {
                    font-size: 0.55rem;
                    font-weight: 900;
                    color: rgba(255,255,255,0.3);
                    letter-spacing: 0.2em;
                }

                .scouting-target {
                    font-size: 0.85rem;
                    font-weight: 900;
                    color: white;
                    letter-spacing: 0.05em;
                }

                .phase-indicator {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 0.4rem;
                }

                .phase-dots {
                    display: flex;
                    gap: 0.4rem;
                }

                .dot {
                    width: 5px;
                    height: 5px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.1);
                    transition: 0.3s;
                }

                .dot.filled { background: var(--primary); opacity: 0.4; }
                .dot.active { background: var(--primary); transform: scale(1.4); box-shadow: 0 0 10px var(--primary); }

                .step-count {
                    display: flex;
                    gap: 0.3rem;
                    font-size: 1.1rem;
                    font-weight: 900;
                    letter-spacing: -0.05em;
                }

                .text-muted { color: rgba(255,255,255,0.2); }

                .main-selection-title {
                    font-size: 3.8rem;
                    margin-bottom: 0.75rem;
                    letter-spacing: -0.02em;
                }

                .selection-titles.centered {
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-top: 2rem;
                    margin-bottom: 5rem;
                }

                .subtitle-premium {
                    color: rgba(255, 255, 255, 0.45);
                    font-size: 1.25rem;
                    max-width: 700px;
                    margin: 0 auto;
                    line-height: 1.6;
                }

                .title-ornament { 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    gap: 1rem; 
                    margin-bottom: 1rem; 
                }
                .ornament-line { width: 40px; height: 1px; background: var(--primary); opacity: 0.3; }
                .ornament-icon { color: var(--primary); }

                .leagues-grid-refined {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
                    gap: 1.5rem;
                    width: 100%;
                }

                .league-card-aligned {
                    display: flex;
                    align-items: center;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 24px;
                    overflow: hidden;
                    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                    cursor: pointer;
                    width: 100%;
                    text-align: left;
                    padding: 0.5rem;
                    color: white;
                    position: relative;
                }

                .league-card-aligned:hover {
                    background: rgba(255, 255, 255, 0.07);
                    border-color: var(--primary);
                    transform: translateY(-8px) scale(1.02);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 
                                0 0 20px rgba(0, 255, 136, 0.1);
                }

                .flag-box {
                    position: relative;
                    width: 120px;
                    height: 80px;
                    flex-shrink: 0;
                    overflow: hidden;
                    border-radius: 16px;
                    box-shadow: 0 5px 15px rgba(0,0,0,0.3);
                }

                .league-flag-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: 0.8s cubic-bezier(0.23, 1, 0.32, 1);
                }

                .league-card-aligned:hover .league-flag-img {
                    transform: scale(1.2) rotate(2deg);
                }

                .flag-overlay-glass {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to right, transparent 0%, rgba(2, 4, 10, 0.4) 100%);
                }

                .league-info-box {
                    flex: 1;
                    padding: 0 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.35rem;
                    z-index: 1;
                }

                .league-country-label {
                    font-size: 1.5rem;
                    margin: 0;
                    color: white;
                    letter-spacing: -0.01em;
                    font-weight: 800;
                    text-shadow: 0 2px 10px rgba(0,0,0,0.3);
                }

                .league-sub-row {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    background: rgba(255, 255, 255, 0.04);
                    padding: 0.3rem 0.8rem;
                    border-radius: 20px;
                    width: fit-content;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .league-name-tag {
                    color: rgba(255, 255, 255, 0.85);
                    font-size: 0.7rem;
                    font-weight: 700;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                }

                .league-arrow-area {
                    padding-right: 1.25rem;
                    opacity: 0.3;
                    transition: 0.4s;
                    color: white;
                }

                .league-card-aligned:hover .league-arrow-area {
                    opacity: 1;
                    color: var(--primary);
                    transform: translateX(3px);
                }

                .scouting-text { 
                    font-size: 0.7rem; 
                    font-weight: 800; 
                    letter-spacing: 0.2rem; 
                    color: rgba(255, 255, 255, 0.3); 
                }

                @media (max-width: 768px) {
                    .premium-nav-bar { padding: 1rem 1.25rem; flex-wrap: wrap; gap: 0.75rem; }
                    .center-identity { display: none; }
                    .main-selection-title { font-size: 2.5rem; }
                    .leagues-grid-refined { grid-template-columns: 1fr; }
                    .flag-box { width: 100px; height: 70px; }
                    .league-country-label { font-size: 1.3rem; }
                    .subtitle-premium { font-size: 1rem; }
                }
            `}</style>
        </div>
    );
}
