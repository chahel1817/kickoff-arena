'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ChevronLeft, ChevronRight, Trophy, Star, Globe, Check } from 'lucide-react';
import '../entry.css';

// Import data
import leaguesData from '../../data/leagues.json';
import teamsData from '../../data/teams.json';

export default function TeamSelectPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [selectedLeague, setSelectedLeague] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        if (storedName) setName(storedName);

        const storedLeagueId = localStorage.getItem('selectedLeague');
        if (storedLeagueId) {
            const league = leaguesData.find(l => l.country === storedLeagueId || l.id === storedLeagueId);
            if (league) setSelectedLeague(league);
        } else {
            // Redirect to league selection if none found
            router.push('/league');
        }
    }, [leaguesData, router]);

    const handleBack = () => {
        router.push('/league');
    };

    const handleTeamSelect = (team) => {
        setSelectedTeam(team);
        localStorage.setItem('selectedTeam', JSON.stringify(team));
    };

    const handleContinue = () => {
        if (selectedTeam) {
            router.push('/manager-select');
        }
    };

    const [searchTerm, setSearchTerm] = useState('');

    const filteredTeams = selectedLeague
        ? teamsData
            .filter(team => team.league === selectedLeague.id)
            .filter(team => team.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => b.rating - a.rating)
        : [];

    return (
        <div className="entry-page no-snap">
            <div className="stadium-bg" style={{ filter: 'brightness(0.08) grayscale(0.8)' }}></div>
            <div className="overlay-gradient"></div>

            <section className="team-select-container">
                <main className="selection-view" style={{ maxWidth: '1200px', width: '95%' }}>
                    {/* Header Nav */}
                    <div className="premium-nav-bar glass">
                        <div className="nav-left-group">
                            <button onClick={handleBack} className="nav-back-btn-extreme">
                                <ChevronLeft size={20} />
                                <span>RETURN TO FEDERATIONS</span>
                            </button>
                        </div>

                        <div className="center-identity">
                            <div className="club-mini-badge" style={{ borderColor: 'var(--primary)' }}>
                                <Shield size={14} className="text-primary" />
                            </div>
                            <div className="identity-text-stack">
                                <span className="scouting-label">AUTHORIZED RECRUITMENT</span>
                                <span className="scouting-target">{selectedLeague?.country} // {selectedLeague?.name}</span>
                            </div>
                        </div>

                        <div className="phase-indicator">
                            <div className="step-count">
                                <span className="text-primary">04</span>
                                <span className="text-muted">/</span>
                                <span className="text-muted">05</span>
                            </div>
                            <div className="phase-dots">
                                <div className="dot filled"></div>
                                <div className="dot filled"></div>
                                <div className="dot filled"></div>
                                <div className="dot active"></div>
                                <div className="dot"></div>
                            </div>
                        </div>
                    </div>

                    <div className="selection-titles centered">
                        <div className="title-ornament">
                            <div className="ornament-line"></div>
                            <Trophy size={16} className="ornament-icon" />
                            <div className="ornament-line"></div>
                        </div>
                        <h2 className="headline text-700 main-selection-title">
                            SELECT <span className="text-gradient">CLUB</span>
                        </h2>
                        <p className="subtitle-premium">
                            Partner with a historic institution. Your choice will define your starting
                            resources, stadium atmosphere, and fan expectations.
                        </p>
                    </div>

                    {/* Team Selection Level */}
                    {selectedLeague && (
                        <div className="teams-view">
                            <div className="teams-search-row centered-row">
                                <div className="search-container glass-premium">
                                    <div className="search-icon-wrapper">
                                        <div className="pulsating-ring-large"></div>
                                        <Star size={20} className="text-primary" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="SEARCH CLUB DATABASE..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="team-search-input-premium"
                                    />
                                    <div className="search-meta">
                                        <span className="scout-badge">{filteredTeams.length} CLUBS FOUND</span>
                                    </div>
                                </div>
                            </div>

                            <div className="teams-grid-refined">
                                {filteredTeams.map((team) => (
                                    <button
                                        key={team.id}
                                        onClick={() => handleTeamSelect(team)}
                                        className={`team-card-premium glass ${selectedTeam?.id === team.id ? 'selected' : ''}`}
                                    >
                                        <div className="card-accent-glow" style={{ background: team.colors[0] }}></div>

                                        <div className="crest-display">
                                            <div className="crest-halo" style={{ borderColor: `${team.colors[0]}44` }}></div>
                                            {team.logo ? (
                                                <img
                                                    src={team.logo}
                                                    alt={`${team.name} Logo`}
                                                    className="team-logo-img"
                                                />
                                            ) : (
                                                <Shield size={40} color="#fff" strokeWidth={1.5} />
                                            )}
                                        </div>

                                        <div className="team-core-info">
                                            <h3 className="team-name-label">{team.name}</h3>
                                            <div className="team-stats-row">
                                                <div className="stat-pill">
                                                    <span className="pill-label">OVR</span>
                                                    <span className="pill-value">{team.rating}</span>
                                                </div>
                                                <div className="stat-pill">
                                                    <Shield size={10} className="text-primary" />
                                                    <span className="pill-value">PRO</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="selection-check">
                                            <div className="check-circle">
                                                <Check size={16} />
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Sticky Confirmation Bar */}
                            <div className={`confirmation-bar glass ${selectedTeam ? 'visible' : ''}`}>
                                <div className="bar-content">
                                    <div className="selected-preview">
                                        <div className="preview-logo-box" style={{ background: selectedTeam?.colors?.[0] || 'var(--primary)' }}>
                                            {selectedTeam?.logo ? (
                                                <img src={selectedTeam.logo} alt="" />
                                            ) : (
                                                <Shield size={24} color="#fff" />
                                            )}
                                        </div>
                                        <div className="preview-text">
                                            <span className="preview-status">ASSIGNMENT PENDING</span>
                                            <h4 className="preview-name">{selectedTeam?.name}</h4>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleContinue}
                                        className="action-btn-neon"
                                    >
                                        <span>SIGN CONTRACT</span>
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </section>

            <style jsx>{`
                .team-select-container {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 4rem 1rem;
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

                .club-mini-badge {
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

                .step-badge {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .step-separator {
                    width: 32px;
                    height: 1px;
                    background: rgba(255, 255, 255, 0.15);
                }

                /* Titles & Ornaments */
                .selection-titles.centered {
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    margin-bottom: 4rem;
                }

                .main-selection-title {
                    font-size: 3.8rem;
                    margin-bottom: 0.75rem;
                    letter-spacing: -0.02em;
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

                /* League Grid Refined */
                .leagues-grid-refined {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
                    gap: 1.5rem;
                    width: 100%;
                }

                .league-card-aligned {
                    display: flex;
                    align-items: center;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 20px;
                    overflow: hidden;
                    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                    cursor: pointer;
                    width: 100%;
                    text-align: left;
                }

                .league-card-aligned:hover {
                    background: rgba(255, 255, 255, 0.08);
                    border-color: var(--primary);
                    transform: translateY(-5px) scale(1.02);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                }

                .flag-box {
                    position: relative;
                    width: 140px;
                    height: 90px;
                    flex-shrink: 0;
                    overflow: hidden;
                }

                .league-flag-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: 0.6s;
                }

                .league-card-aligned:hover .league-flag-img {
                    transform: scale(1.15);
                }

                .flag-overlay-glass {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to right, transparent 0%, rgba(2, 4, 10, 0.9) 100%);
                }

                .league-info-box {
                    flex: 1;
                    padding: 0 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .league-country-label {
                    font-size: 1.6rem;
                    margin: 0;
                    color: white;
                    letter-spacing: -0.01em;
                }

                .league-sub-row {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .league-arrow-area {
                    padding: 0 1.5rem;
                    opacity: 0.2;
                    transition: 0.3s;
                    color: white;
                }

                .league-card-aligned:hover .league-arrow-area {
                    opacity: 1;
                    color: var(--primary);
                    transform: translateX(5px);
                }

                /* Team Search Row */
                .teams-search-row {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 3rem;
                    position: sticky;
                    top: 1.5rem;
                    z-index: 1000;
                }

                .search-container.glass-premium {
                    display: flex;
                    align-items: center;
                    padding: 0 2rem;
                    height: 64px;
                    width: 100%;
                    max-width: 800px;
                    background: rgba(10, 10, 15, 0.6);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 20px;
                    box-shadow: 0 15px 35px rgba(0,0,0,0.4);
                }

                .team-search-input-premium {
                    flex: 1;
                    background: transparent;
                    border: none;
                    color: white;
                    padding: 0 1.5rem;
                    font-size: 1rem;
                    outline: none;
                    font-weight: 500;
                }

                .search-meta {
                    padding-left: 1.5rem;
                    border-left: 1px solid rgba(255,255,255,0.1);
                    margin-left: 1rem;
                }

                .scout-badge {
                    font-size: 0.6rem;
                    color: var(--primary);
                    font-weight: 900;
                    letter-spacing: 0.1em;
                    white-space: nowrap;
                }

                /* Teams Grid & Cards */
                .teams-grid-refined {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 10rem;
                }

                 .teams-grid-scroll {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 2rem;
                    padding: 2rem 0 12rem;
                    scroll-behavior: smooth;
                }

                .team-card-premium {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 2.5rem 2rem;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 32px;
                    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                    cursor: pointer;
                    overflow: hidden;
                    text-align: center;
                }

                .team-card-premium:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(255, 255, 255, 0.2);
                    transform: translateY(-8px);
                }

                .team-card-premium.selected {
                    background: rgba(0, 255, 136, 0.05);
                    border-color: var(--primary);
                    border-width: 2px;
                    box-shadow: 0 0 30px rgba(0, 255, 136, 0.1);
                }

                .card-accent-glow {
                    position: absolute;
                    top: -50px;
                    right: -50px;
                    width: 150px;
                    height: 150px;
                    filter: blur(80px);
                    opacity: 0.15;
                    pointer-events: none;
                }

                .crest-display {
                    position: relative;
                    width: 100px;
                    height: 100px;
                    margin-bottom: 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .crest-halo {
                    position: absolute;
                    inset: -15px;
                    border: 1px solid;
                    border-radius: 50%;
                    opacity: 0.3;
                    transition: 0.5s;
                }

                .team-card-premium:hover .crest-halo {
                    transform: scale(1.1);
                    opacity: 0.6;
                }

                .team-logo-img {
                    width: 80px;
                    height: 80px;
                    object-fit: contain;
                    filter: drop-shadow(0 10px 20px rgba(0,0,0,0.4));
                    transition: 0.5s;
                }

                .team-card-premium:hover .team-logo-img {
                    transform: scale(1.1) translateY(-5px);
                }

                .team-name-label {
                    color: white;
                    font-size: 1.4rem;
                    font-weight: 800;
                    margin-bottom: 1rem;
                    letter-spacing: -0.02em;
                }

                .team-stats-row {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                }

                .stat-pill {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: rgba(255, 255, 255, 0.04);
                    padding: 0.4rem 0.8rem;
                    border-radius: 12px;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .pill-label {
                    font-size: 0.6rem;
                    color: rgba(255, 255, 255, 0.4);
                    font-weight: 800;
                }

                .pill-value {
                    font-size: 0.85rem;
                    color: white;
                    font-weight: 700;
                }

                .selection-check {
                    position: absolute;
                    top: 1.5rem;
                    right: 1.5rem;
                    opacity: 0;
                    transform: scale(0.5);
                    transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                .team-card-premium.selected .selection-check {
                    opacity: 1;
                    transform: scale(1);
                }

                .check-circle {
                    width: 36px;
                    height: 36px;
                    background: var(--primary);
                    color: black;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 0 20px rgba(0, 255, 136, 0.4);
                }

                .selected-glow-line {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 4px;
                    background: var(--primary);
                    box-shadow: 0 0 15px var(--primary);
                }

                /* Confirmation Bar */
                .confirmation-bar {
                    position: fixed;
                    bottom: 2rem;
                    left: 50%;
                    transform: translateX(-50%) translateY(150%);
                    width: calc(100% - 4rem);
                    max-width: 800px;
                    padding: 1.25rem 2.5rem;
                    border-radius: 24px;
                    border: 1px solid rgba(0, 255, 136, 0.3);
                    z-index: 2000;
                    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.8);
                    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                .confirmation-bar.visible {
                    transform: translateX(-50%) translateY(0);
                }

                .bar-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .selected-preview {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }

                .preview-logo-box {
                    width: 56px;
                    height: 56px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 8px;
                    box-shadow: 0 8px 15px rgba(0,0,0,0.3);
                }

                .preview-logo-box img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }

                .preview-text { display: flex; flex-direction: column; line-height: 1.2; }
                .preview-status { font-size: 0.6rem; color: var(--primary); font-weight: 800; letter-spacing: 0.15em; }
                .preview-name { font-size: 1.5rem; color: white; margin: 0; font-weight: 900; }

                .action-btn-neon {
                    background: var(--primary);
                    color: black;
                    padding: 1rem 2.5rem;
                    border-radius: 12px;
                    font-weight: 900;
                    font-size: 0.95rem;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    border: none;
                    cursor: pointer;
                    transition: 0.3s;
                    box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
                }

                .action-btn-neon:hover {
                    transform: scale(1.05);
                    box-shadow: 0 0 40px rgba(0, 255, 136, 0.5);
                }

                @media (max-width: 768px) {
                    .premium-nav-bar { padding: 1rem 1.25rem; flex-wrap: wrap; gap: 0.75rem; }
                    .center-identity { display: none; }
                    .main-selection-title { font-size: 2.5rem; }
                    .teams-grid-refined { grid-template-columns: 1fr; }
                    .confirmation-bar { width: 95%; padding: 1rem; }
                    .preview-name { font-size: 1.2rem; }
                    .action-btn-neon { padding: 0.8rem 1.5rem; font-size: 0.8rem; }
                    .subtitle-premium { font-size: 1rem; }
                }
            `}</style>
        </div>
    );
}
