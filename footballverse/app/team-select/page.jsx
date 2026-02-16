'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
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

        const storedLeague = localStorage.getItem('selectedLeague');
        if (storedLeague) {
            const league = leaguesData.find(l => l.country === storedLeague || l.name === storedLeague);
            if (league) setSelectedLeague(league);
        }
    }, []);

    const handleLeagueSelect = (league) => {
        setSelectedLeague(league);
        localStorage.setItem('selectedLeague', league.country);
        setSelectedTeam(null);
    };

    const handleTeamSelect = (team) => {
        setSelectedTeam(team);
        localStorage.setItem('selectedTeam', JSON.stringify(team));
    };

    const handleContinue = () => {
        if (selectedTeam) {
            router.push('/manager/create');
        }
    };

    const filteredTeams = selectedLeague
        ? teamsData.filter(team => team.league === selectedLeague.id)
        : [];

    return (
        <div className="entry-page">
            <div className="stadium-bg" style={{ filter: 'brightness(0.1) grayscale(0.5)' }}></div>
            <div className="overlay-gradient"></div>

            <section className="team-select-container">
                <div className="main-action" style={{ maxWidth: '1000px', width: '95%', padding: '2.5rem' }}>

                    {/* Header */}
                    <div className="selection-header-nav mb-8">
                        <button
                            onClick={() => selectedLeague ? setSelectedLeague(null) : router.push('/welcome')}
                            className="premium-back-btn"
                        >
                            <div className="back-icon-wrapper">
                                <ChevronLeft size={18} />
                            </div>
                            <span className="text-600 uppercase tracking-wider text-xs">
                                {selectedLeague ? 'Change League' : 'Back to Welcome'}
                            </span>
                        </button>
                        <div className="step-badge">
                            <span className="text-600">STEP 03</span>
                            <div className="step-separator"></div>
                            <span className="text-500 opacity-50 uppercase">League Selection</span>
                        </div>
                    </div>

                    <div style={{ textAlign: 'left', marginBottom: '3rem' }}>
                        <h2 className="headline text-700 main-selection-title">
                            {selectedLeague ? `Select your Club` : `Choose your League`}
                        </h2>
                        <p className="text-400 selection-subtitle">
                            {selectedLeague
                                ? `Manager ${name}, which ${selectedLeague.country} club will you lead to glory?`
                                : `Manager ${name}, select the country where your legacy begins.`}
                        </p>
                    </div>

                    {/* League Selection Level */}
                    {!selectedLeague && (
                        <div className="leagues-grid-container">
                            {leaguesData.map((league) => (
                                <button
                                    key={league.id}
                                    onClick={() => handleLeagueSelect(league)}
                                    className="league-card-premium glass"
                                >
                                    <div className="flag-wrapper">
                                        <img
                                            src={`https://flagcdn.com/w160/${league.code}.png`}
                                            alt={league.country}
                                            className="country-flag"
                                        />
                                        <div className="flag-overlay"></div>
                                    </div>
                                    <div className="league-details">
                                        <p className="league-country-name text-700">{league.country}</p>
                                        <div className="league-meta-row">
                                            <Trophy size={12} className="text-primary" />
                                            <span className="league-league-name text-500">{league.name}</span>
                                        </div>
                                    </div>
                                    <div className="select-indicator">
                                        <ChevronRight size={20} />
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Team Selection Level */}
                    {selectedLeague && (
                        <div className="teams-view">
                            <div className="teams-grid-scroll">
                                {filteredTeams.map((team) => (
                                    <button
                                        key={team.id}
                                        onClick={() => handleTeamSelect(team)}
                                        className={`team-selection-card glass ${selectedTeam?.id === team.id ? 'selected' : ''}`}
                                    >
                                        <div className="team-crest-placeholder" style={{ background: `linear-gradient(135deg, ${team.colors[0]}, ${team.colors[1]}66)` }}>
                                            <Shield size={32} color="#fff" />
                                        </div>
                                        <div className="team-meta">
                                            <h4 className="text-600">{team.name}</h4>
                                            <div className="rating-badge">
                                                <span className="text-700">{team.rating}</span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="selection-footer">
                                <div className="selected-summary">
                                    {selectedTeam ? (
                                        <div className="flex items-center gap-4">
                                            <div className="mini-crest" style={{ backgroundColor: selectedTeam.colors[0] }}></div>
                                            <div className="text-left">
                                                <p className="text-400 opacity-50 uppercase text-xs font-bold">Selected Club</p>
                                                <p className="text-700 text-xl">{selectedTeam.name}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-400 italic opacity-40">Please select a club to continue</p>
                                    )}
                                </div>
                                <button
                                    disabled={!selectedTeam}
                                    onClick={handleContinue}
                                    className={`continue-btn text-700 ${!selectedTeam ? 'btn-disabled' : ''}`}
                                    style={{ maxWidth: '240px' }}
                                >
                                    FINALIZE SELECTION →
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <style jsx>{`
                .team-select-container {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 4rem 1rem;
                }

                .selection-header-nav {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                }

                .premium-back-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 0.5rem 1rem 0.5rem 0.5rem;
                    border-radius: 2rem;
                    color: rgba(255, 255, 255, 0.6);
                    transition: all 0.3s ease;
                }

                .premium-back-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    border-color: var(--primary);
                    transform: translateX(-5px);
                }

                .back-icon-wrapper {
                    width: 28px;
                    height: 28px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .step-badge {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 0.75rem;
                    letter-spacing: 0.1em;
                }

                .step-separator {
                    width: 20px;
                    height: 1px;
                    background: rgba(255, 255, 255, 0.2);
                }

                .main-selection-title {
                    font-size: 2.8rem;
                    margin-bottom: 0.5rem;
                }

                .selection-subtitle {
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 1.15rem;
                }

                /* League Grid */
                .leagues-grid-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                    gap: 1.25rem;
                }

                .league-card-premium {
                    display: flex;
                    align-items: center;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 1.25rem;
                    overflow: hidden;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    cursor: pointer;
                    width: 100%;
                }

                .league-card-premium:hover {
                    background: rgba(255, 255, 255, 0.07);
                    border-color: var(--primary);
                    transform: scale(1.02);
                }

                .flag-wrapper {
                    position: relative;
                    width: 120px;
                    height: 80px;
                    overflow: hidden;
                }

                .country-flag {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: 0.5s;
                }

                .flag-overlay {
                    position: absolute;
                    inset: 0;
                    background: linear-gradient(to right, transparent 0%, rgba(2, 4, 10, 0.8) 100%);
                }

                .league-card-premium:hover .country-flag {
                    transform: scale(1.1);
                }

                .league-details {
                    flex: 1;
                    padding: 0 1.5rem;
                    text-align: left;
                }

                .league-country-name {
                    font-size: 1.4rem;
                    margin: 0;
                    color: white;
                }

                .league-meta-row {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-top: 0.25rem;
                    opacity: 0.6;
                }

                .league-league-name {
                    font-size: 0.85rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .select-indicator {
                    padding-right: 1.5rem;
                    opacity: 0.2;
                    transition: 0.3s;
                }

                .league-card-premium:hover .select-indicator {
                    opacity: 1;
                    color: var(--primary);
                    transform: translateX(5px);
                }

                /* Team View */
                .teams-view {
                    animation: fadeIn 0.5s ease;
                }

                .teams-grid-scroll {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                    gap: 1.25rem;
                    max-height: 50vh;
                    overflow-y: auto;
                    padding-right: 1rem;
                }

                .teams-grid-scroll::-webkit-scrollbar { width: 6px; }
                .teams-grid-scroll::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); }
                .teams-grid-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }

                .team-selection-card {
                    display: flex;
                    flex-direction: column;
                    padding: 1.25rem;
                    border-radius: 1rem;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    text-align: left;
                    transition: all 0.3s ease;
                    gap: 1rem;
                }

                .team-selection-card:hover {
                    border-color: rgba(255, 255, 255, 0.2);
                    background: rgba(255, 255, 255, 0.05);
                }

                .team-selection-card.selected {
                    background: rgba(0, 255, 136, 0.12);
                    border-color: var(--primary);
                    box-shadow: 0 0 25px rgba(0, 255, 136, 0.15);
                }

                .team-crest-placeholder {
                    width: 64px;
                    height: 64px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 0.5rem;
                }

                .rating-badge {
                    background: rgba(255, 255, 255, 0.1);
                    padding: 2px 8px;
                    border-radius: 6px;
                    font-size: 0.8rem;
                }

                .selection-footer {
                    margin-top: 2rem;
                    padding-top: 2rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                @media (max-width: 768px) {
                    .leagues-grid-container { grid-template-columns: 1fr; }
                    .main-selection-title { font-size: 2.2rem; }
                    .selection-footer { flex-direction: column; gap: 1.5rem; text-align: center; }
                    .selection-footer .continue-btn { width: 100%; max-width: none; }
                }
            `}</style>
        </div>
    );
}
