'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ChevronLeft, ChevronRight, Trophy, Star, Globe, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import '../entry.css';

// Import data
import leaguesData from '../../data/leagues.json';
import teamsData from '../../data/teams.json';

export default function TeamSelectPage() {
    const router = useRouter();
    const { user, isLoggedIn, isLoading, saveSquad } = useAuth();
    const [selectedLeague, setSelectedLeague] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);

    useEffect(() => {
        if (!isLoading && !isLoggedIn) {
            router.push('/');
            return;
        }

        const storedLeagueId = localStorage.getItem('selectedLeague');
        if (storedLeagueId) {
            const league = leaguesData.find(l => l.country === storedLeagueId || l.id === storedLeagueId);
            if (league) setSelectedLeague(league);
        } else {
            // Redirect to league selection if none found
            router.push('/league');
        }
    }, [router, isLoggedIn, isLoading]);

    const name = user?.displayName || user?.username || 'Manager';

    const handleBack = () => {
        router.push('/league');
    };

    const handleTeamSelect = (team) => {
        setSelectedTeam(team);
        localStorage.setItem('selectedTeam', JSON.stringify(team));
        if (isLoggedIn) saveSquad({ selectedTeam: team });

        // Brief delay for feedback before moving to next step
        setTimeout(() => {
            router.push('/manager-select');
        }, 600);
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

    const getTeamTier = (team) => {
        if (team.tier) return team.tier;
        if (team.rating >= 86) return 'Elite';
        if (team.rating >= 82) return 'Contender';
        if (team.rating >= 78) return 'Rebuild';
        return 'Underdog';
    };

    const getTeamTraits = (team) => {
        if (team.traits) return team.traits;

        // Dynamic defaults based on rating
        if (team.rating >= 85) return 'Elite Squad • High Expectations • Europe Focus';
        if (team.rating >= 80) return 'Strong Core • Growth Project • Domestic Focus';
        if (team.rating >= 75) return 'Balanced Squad • Mid-Table Stability';
        return 'Underdog • Development Project • Passionate Fanbase';
    };

    const getStadiumHint = (team) => {
        const stadia = {
            'mci': 'Etihad Stadium • Tactical Cauldron',
            'ars': 'Emirates Stadium • Modern Fortress',
            'liv': 'Anfield • Iconic Atmosphere',
            'tot': 'Tottenham Stadium • Elite Facilities',
            'mun': 'Old Trafford • Theatre of Dreams',
            'che': 'Stamford Bridge • London Tradition',
            'rma': 'Santiago Bernabéu • Royal Heritage',
            'bar': 'Spotify Camp Nou • Global Stage',
            'atm': 'Metropolitano • Electric Passion',
            'aja': 'Johan Cruyff Arena • Total Legacy',
            'psv': 'Philips Stadion • High Pressure',
            'fey': 'De Kuip • Traditional Fortress',
            'bvb': 'Signal Iduna Park • Yellow Wall',
            'bay': 'Allianz Arena • German Powerhouse',
            'milan': 'San Siro • Historic Arena',
            'inter': 'San Siro • Tactical Stage',
            'juve': 'Allianz Stadium • Black & White Pride'
        };

        if (stadia[team.id]) return stadia[team.id];

        // Generic defaults
        if (team.rating >= 82) return `Ground Zero • Iconic Fortress`;
        if (team.rating >= 76) return `${team.name} Arena • Passionate Faith`;
        return `${team.name} Ground • Local Identity`;
    };

    return (
        <div className="entry-page no-snap">
            {/* Immersive Locker Room Background */}
            <div className="locker-room-bg"></div>
            <div className="overlay-gradient" style={{ background: 'radial-gradient(circle at center, transparent 20%, rgba(2, 4, 10, 0.75) 100%)' }}></div>

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

                            <div className={`teams-grid-refined ${selectedTeam ? 'has-selection' : ''}`}>
                                {filteredTeams.map((team) => (
                                    <button
                                        key={team.id}
                                        onClick={() => handleTeamSelect(team)}
                                        className={`team-card-premium glass ${selectedTeam?.id === team.id ? 'selected' : ''} ${getTeamTier(team) === 'Elite' ? 'tier-elite-featured' : ''}`}
                                        style={{ '--team-accent': team.colors[0] || 'var(--primary)' }}
                                    >
                                        <div className="card-accent-glow" style={{ background: team.colors[0] }}></div>

                                        <div className="crest-display">
                                            <div className="crest-halo" style={{ borderColor: `${team.colors[0]}44` }}></div>
                                            <div className="crest-inner-fallback">
                                                <Shield size={40} className="fallback-shield-icon" style={{ color: team.colors[0] }} />
                                            </div>
                                            {team.logo && (
                                                <img
                                                    src={team.logo}
                                                    alt={`${team.name} Logo`}
                                                    className="team-logo-img"
                                                    onError={(e) => {
                                                        e.target.style.opacity = '0';
                                                        e.target.nextSibling?.classList.add('show-fallback');
                                                    }}
                                                />
                                            )}
                                        </div>

                                        <div className="team-core-info">
                                            <h3 className="team-name-label">{team.name}</h3>
                                            <div className="identity-stack">
                                                <span className="team-traits-micro">{getTeamTraits(team)}</span>
                                                <div className="stadium-badge">
                                                    <Globe size={10} />
                                                    <span>{getStadiumHint(team)}</span>
                                                </div>
                                            </div>
                                            <div className="team-stats-row">
                                                <div className="stat-pill tier-pill">
                                                    <span className="pill-label">TIER</span>
                                                    <div className="stat-divider"></div>
                                                    <span className="pill-value">{getTeamTier(team)}</span>
                                                </div>
                                                <div className="stat-pill ovr-pill">
                                                    <span className="pill-label">OVR</span>
                                                    <div className="stat-divider"></div>
                                                    <span className="pill-value">{team.rating}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="selection-check">
                                            {selectedTeam?.id === team.id ? (
                                                <div className="check-circle check-animate">
                                                    <Check size={18} />
                                                </div>
                                            ) : (
                                                <div className="arrow-circle">
                                                    <ChevronRight size={18} />
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>

                        </div>
                    )}
                </main>
            </section>

            <style jsx>{`
                /* ─── LOCKER ROOM BACKGROUND ─── */
                .locker-room-bg {
                    position: fixed;
                    inset: 0;
                    background-image: url('/bright_locker_room.png');
                    background-size: cover;
                    background-position: center;
                    filter: brightness(0.85) contrast(1.05);
                    z-index: 0;
                    animation: subtleRoomZoom 30s ease-in-out infinite alternate;
                }

                @keyframes subtleRoomZoom {
                    0% { transform: scale(1); }
                    100% { transform: scale(1.06) translate(1%, 1%); }
                }

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
                    background: rgba(10, 15, 25, 0.55);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 32px;
                    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                    cursor: pointer;
                    overflow: hidden;
                    text-align: center;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
                }

                .team-card-premium:hover {
                    background: rgba(15, 20, 30, 0.75);
                    border-color: var(--team-accent);
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px -10px color-mix(in srgb, var(--team-accent) 40%, transparent), 
                                0 0 20px color-mix(in srgb, var(--team-accent) 15%, transparent);
                }

                .teams-grid-refined.has-selection .team-card-premium:not(.selected) {
                    opacity: 0.25;
                    filter: blur(2px) grayscale(0.8);
                    transform: scale(0.97);
                }

                .team-card-premium.selected {
                    background: rgba(0, 255, 136, 0.12);
                    border-color: var(--primary);
                    border-width: 2px;
                    box-shadow: 0 0 45px rgba(0, 255, 136, 0.3);
                    transform: scale(1.05);
                    z-index: 20;
                }

                /* Elite Featured Enhancement */
                .tier-elite-featured {
                    border: 1px solid rgba(255, 215, 0, 0.15);
                    background: linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
                    box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
                }

                .tier-elite-featured::before {
                    content: 'PRESTIGE CLUB';
                    position: absolute;
                    top: 1.25rem;
                    left: 1.5rem;
                    font-size: 0.5rem;
                    font-weight: 900;
                    color: #FFD700;
                    letter-spacing: 0.2em;
                    opacity: 0.6;
                }

                .tier-elite-featured .crest-halo {
                    border-color: rgba(255, 215, 0, 0.3);
                    opacity: 0.3;
                }

                .tier-elite-featured:hover {
                    border-color: #FFD700 !important;
                    box-shadow: 0 20px 50px -10px rgba(255, 215, 0, 0.15) !important;
                }

                .card-accent-glow {
                    position: absolute;
                    top: -50px;
                    right: -50px;
                    width: 180px;
                    height: 180px;
                    filter: blur(80px);
                    opacity: 0.12;
                    pointer-events: none;
                    transition: all 0.5s ease;
                }

                .team-card-premium:hover .card-accent-glow {
                    opacity: 0.35;
                    transform: scale(1.2);
                }

                .crest-display {
                    position: relative;
                    width: 100px;
                    height: 100px;
                    margin-bottom: 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2;
                }

                .crest-inner-fallback {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 50%;
                    border: 1px dashed rgba(255, 255, 255, 0.1);
                    opacity: 0.5;
                }

                .fallback-shield-icon {
                    filter: drop-shadow(0 0 10px currentColor);
                    opacity: 0.8;
                }

                .crest-halo {
                    position: absolute;
                    inset: -15px;
                    border: 1px solid;
                    border-radius: 50%;
                    opacity: 0.2;
                    transition: 0.6s cubic-bezier(0.23, 1, 0.32, 1);
                    filter: blur(2px);
                }

                .team-card-premium:hover .crest-halo {
                    transform: scale(1.15);
                    opacity: 0.8;
                    filter: blur(8px);
                    box-shadow: 0 0 30px var(--team-accent);
                }

                .team-logo-img {
                    position: relative;
                    width: 80px;
                    height: 80px;
                    object-fit: contain;
                    filter: drop-shadow(0 10px 20px rgba(0,0,0,0.4)) grayscale(0.2);
                    transition: 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                    z-index: 5;
                    background: transparent;
                }

                .team-card-premium:hover .team-logo-img {
                    transform: scale(1.1) translateY(-8px);
                    filter: drop-shadow(0 15px 30px rgba(0,0,0,0.6)) grayscale(0);
                }

                .team-name-label {
                    color: white;
                    font-size: 1.85rem;
                    font-weight: 900;
                    margin-bottom: 0.15rem;
                    letter-spacing: -0.04em;
                    line-height: 1.1;
                    opacity: 0.85;
                    transition: 0.3s ease;
                }

                .team-card-premium:hover .team-name-label {
                    opacity: 1;
                    transform: scale(1.02);
                }

                .team-traits-micro {
                    display: block;
                    font-size: 0.62rem;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.2);
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    transition: 0.3s ease;
                }

                .identity-stack {
                    display: flex;
                    flex-direction: column;
                    gap: 0.4rem;
                    margin-bottom: 2rem;
                }

                .stadium-badge {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.4rem;
                    font-size: 0.58rem;
                    font-weight: 700;
                    color: rgba(255, 255, 255, 0.15);
                    letter-spacing: 0.03em;
                    transition: 0.3s ease;
                }

                .team-card-premium:hover .stadium-badge {
                    color: rgba(0, 255, 136, 0.4);
                }

                .team-card-premium:hover .team-traits-micro {
                    color: rgba(255, 255, 255, 0.5);
                    letter-spacing: 0.08em;
                }

                .team-stats-row {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                }

                .stat-pill {
                    display: flex;
                    align-items: center;
                    background: rgba(255, 255, 255, 0.02);
                    padding: 0.4rem 0.9rem;
                    border-radius: 14px;
                    border: 1px solid rgba(255, 255, 255, 0.04);
                    transition: all 0.3s ease;
                }

                .stat-divider {
                    width: 1px;
                    height: 10px;
                    background: rgba(255, 255, 255, 0.08);
                    margin: 0 0.75rem;
                }

                .tier-pill {
                    background: rgba(0, 255, 136, 0.03);
                    border-color: rgba(0, 255, 136, 0.1);
                }

                .tier-pill .pill-label {
                    color: rgba(0, 255, 136, 0.5);
                }

                .tier-pill .pill-value {
                    color: var(--primary);
                    font-weight: 900;
                    text-shadow: 0 0 10px rgba(0, 255, 136, 0.2);
                }

                .tier-pill .stat-divider {
                    background: rgba(0, 255, 136, 0.2);
                }

                .team-card-premium:hover .stat-pill {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(255, 255, 255, 0.08);
                }

                .team-card-premium:hover .tier-pill {
                    background: rgba(0, 255, 136, 0.06);
                    border-color: rgba(0, 255, 136, 0.3);
                    box-shadow: 0 0 15px rgba(0, 255, 136, 0.1);
                }

                .pill-label {
                    font-size: 0.6rem;
                    color: rgba(255, 255, 255, 0.2);
                    font-weight: 900;
                    letter-spacing: 0.1em;
                    transition: 0.3s;
                }

                .team-card-premium:hover .pill-label {
                    color: rgba(255, 255, 255, 0.4);
                }

                .pill-value {
                    font-size: 0.75rem;
                    color: rgba(255, 255, 255, 0.5);
                    font-weight: 800;
                    letter-spacing: 0.02em;
                    transition: 0.3s;
                }

                .team-card-premium:hover .pill-value {
                    color: rgba(255, 255, 255, 0.9);
                }

                .selection-check {
                    position: absolute;
                    top: 1.5rem;
                    right: 1.5rem;
                    opacity: 0.2;
                    transform: scale(0.8);
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                .team-card-premium:hover .selection-check {
                    opacity: 1;
                    transform: scale(1);
                }

                .team-card-premium.selected .selection-check {
                    opacity: 1;
                    transform: scale(1.1);
                }

                .arrow-circle {
                    width: 36px;
                    height: 36px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: 0.3s;
                }

                .team-card-premium:hover .arrow-circle {
                    background: var(--team-accent);
                    color: black;
                    border-color: var(--team-accent);
                    transform: translateX(3px);
                    box-shadow: 0 0 15px color-mix(in srgb, var(--team-accent) 50%, transparent);
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

                .check-animate {
                    animation: checkPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }

                @keyframes checkPop {
                    0% { transform: scale(0) rotate(-20deg); opacity: 0; }
                    100% { transform: scale(1) rotate(0deg); opacity: 1; }
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
