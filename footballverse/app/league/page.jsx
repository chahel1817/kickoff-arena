'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, ChevronRight, ChevronLeft, Globe, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import leaguesData from '../../data/leagues.json';
import '../entry.css';

export default function LeagueSelectionPage() {
    const router = useRouter();
    const { user, isLoggedIn, isLoading, saveSquad } = useAuth();
    const [selectedId, setSelectedId] = useState(null);

    useEffect(() => {
        if (!isLoading && !isLoggedIn) {
            router.push('/');
            return;
        }

        // Clear previous selections to ensure a fresh flow for a new career
        const resetCareer = () => {
            localStorage.removeItem('selectedLeague');
            localStorage.removeItem('selectedTeam');
            localStorage.removeItem('selectedManager');
            localStorage.removeItem('formation');
            localStorage.removeItem('goalkeeper');
            localStorage.removeItem('defenders');
            localStorage.removeItem('midfielders');
            localStorage.removeItem('forwards');
        };
        resetCareer();
    }, [isLoggedIn, isLoading, router]);

    const handleLeagueSelect = (league) => {
        setSelectedId(league.id);
        localStorage.setItem('selectedLeague', league.id);
        if (isLoggedIn) saveSquad({ selectedLeague: league.id });

        // Brief delay to show selection feedback
        setTimeout(() => {
            router.push('/team-select');
        }, 600);
    };

    const name = user?.displayName || user?.username || 'Manager';

    if (isLoading || !user) return null;

    return (
        <div className="entry-page no-snap">
            {/* World Map Background */}
            <div className="world-bg"></div>
            <div className="overlay-gradient" style={{ background: 'radial-gradient(circle at center, transparent 0%, rgba(2, 4, 10, 0.95) 100%)' }}></div>

            {/* Geographical Map Nodes Overlay */}
            <div className="map-nodes-container">
                {/* Europe Hub */}
                <div className="map-node eu-node" style={{ top: '35%', left: '48%' }}>
                    <div className="node-pulse"></div>
                    <span className="node-label">ENG</span>
                </div>
                <div className="map-node eu-node" style={{ top: '40%', left: '46%' }}>
                    <div className="node-pulse" style={{ animationDelay: '0.4s' }}></div>
                    <span className="node-label" style={{ transform: 'translate(-50%, 15px)' }}>ESP</span>
                </div>
                <div className="map-node eu-node" style={{ top: '36%', left: '51%' }}>
                    <div className="node-pulse" style={{ animationDelay: '0.8s' }}></div>
                    <span className="node-label" style={{ transform: 'translate(10px, -50%)' }}>GER</span>
                </div>
                <div className="map-node eu-node" style={{ top: '42%', left: '52%' }}>
                    <div className="node-pulse" style={{ animationDelay: '0.6s' }}></div>
                    <span className="node-label">ITA</span>
                </div>
                <div className="map-node eu-node" style={{ top: '38%', left: '49%' }}>
                    <div className="node-pulse" style={{ animationDelay: '1.2s' }}></div>
                    <span className="node-label" style={{ transform: 'translate(-120%, -50%)' }}>FRA</span>
                </div>

                {/* Americas Hubs */}
                <div className="map-node" style={{ top: '45%', left: '22%' }}>
                    <div className="node-pulse" style={{ animationDelay: '1.5s' }}></div>
                    <span className="node-label">USA</span>
                </div>
                <div className="map-node" style={{ top: '65%', left: '32%' }}>
                    <div className="node-pulse" style={{ animationDelay: '2s' }}></div>
                    <span className="node-label">BRA</span>
                </div>
                <div className="map-node" style={{ top: '62%', left: '28%' }}>
                    <div className="node-pulse" style={{ animationDelay: '1.8s' }}></div>
                    <span className="node-label" style={{ transform: 'translate(-120%, -50%)' }}>ARG</span>
                </div>

                <svg className="map-connections" width="100%" height="100%">
                    <line x1="22%" y1="45%" x2="48%" y2="35%" className="glow-line" />
                    <line x1="32%" y1="65%" x2="46%" y2="40%" className="glow-line" />
                    <line x1="28%" y1="62%" x2="46%" y2="40%" className="glow-line" />
                    <line x1="51%" y1="36%" x2="52%" y2="42%" className="glow-line" style={{ animationDuration: '30s' }} />
                    <line x1="48%" y1="35%" x2="51%" y2="36%" className="glow-line" />
                    <line x1="46%" y1="40%" x2="49%" y2="38%" className="glow-line" style={{ animationDuration: '15s' }} />
                </svg>
            </div>

            <section className="league-selection-container">
                <main className="selection-view" style={{ maxWidth: '1200px', width: '95%' }}>

                    {/* Header Nav */}
                    <div className="premium-nav-bar glass">
                        <div className="nav-left-group">
                            <button onClick={() => router.push('/dashboard')} className="nav-back-btn-extreme">
                                <ChevronLeft size={20} />
                                <span>RETURN TO DASHBOARD</span>
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
                            SELECT YOUR <span className="text-gradient">FEDERATION</span>
                        </h2>
                        <p className="subtitle-premium">
                            Choose the operational theater for your tactical deployment.
                            Each league offers unique challenges and financial structures.
                        </p>
                    </div>

                    {/* Leagues Grid */}
                    <div className={`leagues-grid-refined ${selectedId ? 'has-selection' : ''}`}>
                        {leaguesData.map((league) => (
                            <button
                                key={league.id}
                                onClick={() => handleLeagueSelect(league)}
                                className={`league-card-aligned glass ${selectedId === league.id ? 'selected' : ''}`}
                                style={{ '--league-accent': league.id === 'pl' ? '#3b82f6' : league.id === 'laliga' ? '#f59e0b' : league.id === 'bundesliga' ? '#ef4444' : '#00ff88' }}
                            >
                                <div className="flag-circle">
                                    <img
                                        src={`https://flagcdn.com/w160/${league.code}.png`}
                                        alt={league.country}
                                        className="league-flag-img"
                                    />
                                </div>
                                <div className="league-info-box">
                                    <h3 className="league-country-label">{league.country}</h3>
                                    <div className="league-sub-row">
                                        <Trophy size={12} className="league-trophy-icon" />
                                        <span className="league-name-tag">{league.name}</span>
                                    </div>
                                    {league.traits && (
                                        <span className="league-traits-label">{league.traits}</span>
                                    )}
                                </div>
                                <div className="league-arrow-area">
                                    {selectedId === league.id ? (
                                        <Check size={22} className="text-primary check-animate" />
                                    ) : (
                                        <ChevronRight size={22} className="arrow-icon" />
                                    )}
                                </div>
                            </button>
                        ))}

                        {/* Coming Soon Placeholder */}
                        <div className="league-card-aligned glass coming-soon-card">
                            <div className="flag-circle placeholder">
                                <Globe size={28} className="text-muted" />
                            </div>
                            <div className="league-info-box">
                                <h3 className="league-country-label text-muted">Expansion Pending</h3>
                                <div className="league-sub-row muted-row">
                                    <span className="league-name-tag">Coming Soon</span>
                                </div>
                                <span className="league-traits-label">Authorized territories only</span>
                            </div>
                        </div>
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
                /* ─── WORLD MAP BACKGROUND ─── */
                .world-bg {
                    position: fixed;
                    inset: 0;
                    background-image: url('/clean_football_world_map.png');
                    background-size: cover;
                    background-position: center;
                    filter: brightness(0.65) saturate(1.2) contrast(1.1);
                    z-index: 0;
                    animation: subtlePan 30s ease-in-out infinite alternate;
                }

                @keyframes subtlePan {
                    0% { transform: scale(1.02) translate(0, 0); }
                    100% { transform: scale(1.05) translate(-1%, 2%); }
                }

                /* ─── GLOWING MAP NODES ─── */
                .map-nodes-container {
                    position: fixed;
                    inset: 0;
                    z-index: 1;
                    pointer-events: none;
                    opacity: 0.8;
                }

                .map-node {
                    position: absolute;
                    width: 8px;
                    height: 8px;
                    background: #00ff88;
                    border-radius: 50%;
                    box-shadow: 0 0 15px #00ff88, 0 0 30px #00ff88;
                    transform: translate(-50%, -50%);
                }

                .node-pulse {
                    position: absolute;
                    inset: -12px;
                    border-radius: 50%;
                    border: 1px solid rgba(0, 255, 136, 0.6);
                    animation: pulseRing 3s linear infinite;
                }

                .map-node:nth-child(2) .node-pulse { animation-delay: 0.5s; }
                .map-node:nth-child(3) .node-pulse { animation-delay: 1s; }
                .map-node:nth-child(4) .node-pulse { animation-delay: 1.5s; }
                .map-node:nth-child(5) .node-pulse { animation-delay: 2s; }
                .map-node:nth-child(6) .node-pulse { animation-delay: 2.5s; }

                @keyframes pulseRing {
                    0% { transform: scale(0.5); opacity: 1; }
                    100% { transform: scale(2.5); opacity: 0; }
                }

                .map-connections {
                    position: absolute;
                    inset: 0;
                }

                .glow-line {
                    stroke: rgba(0, 255, 136, 0.3);
                    stroke-width: 1.5;
                    stroke-dasharray: 4 8;
                    animation: dashScroll 20s linear infinite;
                    filter: drop-shadow(0 0 5px rgba(0, 255, 136, 0.5));
                }

                @keyframes dashScroll {
                    from { stroke-dashoffset: 1000; }
                    to { stroke-dashoffset: 0; }
                }

                .node-label {
                    position: absolute;
                    top: -24px;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 0.75rem;
                    font-weight: 900;
                    letter-spacing: 0.1em;
                    color: rgba(255, 255, 255, 0.95);
                    text-shadow: 0 0 10px rgba(0, 255, 136, 0.8), 0 0 4px #000;
                    pointer-events: none;
                }

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
                    padding: 1.25rem 2rem;
                    position: sticky;
                    top: 1rem;
                    z-index: 2000;
                    border: 1px solid rgba(255, 255, 255, 0.08); /* changed from border-bottom to full border */
                    margin-bottom: 3rem;
                    background: rgba(10, 15, 25, 0.65);
                    backdrop-filter: blur(20px);
                    border-radius: 20px;
                }

                .nav-left-group {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    justify-content: flex-start;
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
                    justify-content: center;
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
                    flex: 1;
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

                /* ─── GRID ─── */
                .leagues-grid-refined {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 1.5rem;
                    width: 100%;
                    max-width: 1100px;
                    margin: 0 auto;
                }

                /* ─── CARD ─── */
                .league-card-aligned {
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                    background: rgba(10, 15, 25, 0.65);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    border-radius: 20px;
                    padding: 1.25rem 1.5rem;
                    cursor: pointer;
                    width: 100%;
                    text-align: left;
                    color: white;
                    position: relative;
                    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                }

                .league-card-aligned:hover {
                    background: rgba(15, 20, 30, 0.85);
                    border-color: var(--league-accent, var(--primary));
                    transform: translateY(-4px);
                    box-shadow: 0 12px 30px -10px color-mix(in srgb, var(--league-accent, var(--primary)) 40%, transparent),
                                0 0 25px color-mix(in srgb, var(--league-accent, var(--primary)) 15%, transparent);
                }

                .coming-soon-card {
                    opacity: 0.5;
                    cursor: default;
                    pointer-events: none;
                }

                .flag-circle.placeholder {
                    background: rgba(255,255,255,0.03);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .leagues-grid-refined.has-selection .league-card-aligned:not(.selected) {
                    opacity: 0.25;
                    filter: blur(2px) grayscale(0.8);
                    transform: scale(0.97);
                }

                .league-card-aligned.selected {
                    border-color: var(--primary);
                    background: rgba(0, 255, 136, 0.12);
                    border-width: 2px;
                    box-shadow: 0 0 40px rgba(0, 255, 136, 0.2);
                    transform: scale(1.03);
                    z-index: 10;
                }

                .arrow-icon {
                    transition: transform 0.3s ease;
                }

                .league-card-aligned:hover .arrow-icon {
                    transform: translateX(4px);
                }

                .check-animate {
                    animation: checkPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }

                @keyframes checkPop {
                    0% { transform: scale(0) rotate(-20deg); opacity: 0; }
                    100% { transform: scale(1) rotate(0deg); opacity: 1; }
                }

                /* ─── FLAG CIRCLE ─── */
                .flag-circle {
                    width: 64px;
                    height: 64px;
                    border-radius: 50%;
                    overflow: hidden;
                    flex-shrink: 0;
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 4px 16px rgba(0,0,0,0.35);
                    position: relative;
                    transition: all 0.4s ease;
                }

                .league-card-aligned:hover .flag-circle {
                    border-color: rgba(0, 255, 136, 0.4);
                    box-shadow: 0 0 20px rgba(0, 255, 136, 0.1),
                                0 4px 16px rgba(0,0,0,0.35);
                }

                .league-flag-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: 0.6s cubic-bezier(0.23, 1, 0.32, 1);
                }

                .league-card-aligned:hover .league-flag-img {
                    transform: scale(1.15);
                }

                /* ─── INFO ─── */
                .league-info-box {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 0.4rem;
                    min-width: 0;
                }

                .league-country-label {
                    font-size: 1.2rem;
                    margin: 0;
                    color: white;
                    font-weight: 800;
                    letter-spacing: -0.01em;
                    line-height: 1.2;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .league-sub-row {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.45rem;
                    background: rgba(0, 255, 136, 0.06);
                    padding: 0.25rem 0.7rem;
                    border-radius: 8px;
                    width: fit-content;
                    border: 1px solid rgba(0, 255, 136, 0.1);
                }

                .league-trophy-icon {
                    color: var(--primary);
                    flex-shrink: 0;
                }

                .league-name-tag {
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 0.6rem;
                    font-weight: 800;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    white-space: nowrap;
                }

                .league-traits-label {
                    font-size: 0.65rem;
                    font-weight: 500;
                    color: rgba(255, 255, 255, 0.35);
                    letter-spacing: 0.02em;
                    margin-top: 0.15rem;
                }

                /* ─── ARROW ─── */
                .league-arrow-area {
                    flex-shrink: 0;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255, 255, 255, 0.04);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    opacity: 0.4;
                    color: white;
                    transition: all 0.4s ease;
                }

                .league-card-aligned:hover .league-arrow-area {
                    opacity: 1;
                    color: var(--primary);
                    background: rgba(0, 255, 136, 0.08);
                    border-color: rgba(0, 255, 136, 0.25);
                    transform: translateX(2px);
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
                    .flag-circle { width: 52px; height: 52px; }
                    .league-country-label { font-size: 1.1rem; }
                    .subtitle-premium { font-size: 1rem; }
                    .league-card-aligned { padding: 0.9rem 1rem; gap: 1rem; }
                }
            `}</style>
        </div>
    );
}
