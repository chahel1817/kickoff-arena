'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ChevronLeft, ChevronRight, Star, Users, Globe, Trophy, Search, Cpu, Check, Scan, Layers } from 'lucide-react';
import managersData from '../../data/managers.json';
import '../entry.css';

export default function ManagerSelectPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [selectedManager, setSelectedManager] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const filteredManagers = managersData
        .filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => b.reputation - a.reputation);

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        if (storedName) setName(storedName);

        const storedTeam = localStorage.getItem('selectedTeam');
        if (storedTeam) setSelectedTeam(JSON.parse(storedTeam));
    }, []);

    const handleManagerSelect = (manager) => {
        setSelectedManager(manager);
        localStorage.setItem('selectedManager', JSON.stringify(manager));

        // Brief delay before showing phase complete overlay
        setTimeout(() => {
            setShowSuccess(true);
        }, 600);
    };

    const handleContinue = () => {
        if (selectedManager) {
            setShowSuccess(true);
        }
    };

    const getManagerFit = (manager) => {
        if (!selectedTeam) return null;

        const teamId = selectedTeam.id;
        const managerId = manager.id;

        // Primary Connection Map (Legends/Current)
        const connections = {
            'ferguson': ['mun'],
            'guardiola': ['mci', 'bar'],
            'klopp': ['liv', 'bvb'],
            'cruyff': ['bar', 'aja'],
            'zidane': ['rma'],
            'ancelotti': ['rma', 'milan'],
            'arteta': ['ars'],
            'simeone': ['atm'],
            'flick': ['bar', 'bay'],
            'slot': ['liv', 'fey'],
            'emery': ['avl', 'vlr', 'sevilla'],
            'mourinho': ['che', 'inter', 'rma', 'mun', 'tot']
        };

        if (connections[managerId]?.includes(teamId)) {
            return {
                type: 'strong',
                label: 'Perfect Fit',
                icon: '✔',
                consequences: [
                    { label: 'Team Chemistry', value: '+5', icon: '⚡' },
                    { label: 'Win Morale', value: '+2', icon: '🔥' }
                ]
            };
        }

        // Culture/Rivalry Clash
        const clashes = {
            'mun': ['guardiola', 'cruyff', 'klopp'],
            'mci': ['ferguson', 'mourinho'],
            'liv': ['ferguson', 'mourinho', 'ancelotti'],
            'ars': ['mourinho', 'ferguson'],
            'rma': ['cruyff', 'guardiola', 'flick'],
            'bar': ['zidane', 'mourinho']
        };

        if (clashes[teamId]?.includes(managerId)) {
            return {
                type: 'challenging',
                label: 'Culture Overhaul',
                icon: '⚠',
                consequences: [
                    { label: 'Initial Chemistry', value: '-3', icon: '❄' },
                    { label: 'Growth Ceiling', value: 'ULTRA', icon: '📈' }
                ]
            };
        }

        // Default Neutral
        return {
            type: 'neutral',
            label: 'Tactical Shift',
            icon: '◐',
            consequences: [
                { label: 'Adaptation Period', value: '5 Matches', icon: '⏳' },
                { label: 'System Stability', value: 'Balanced', icon: '⚖' }
            ]
        };
    };

    const getManagerRecommendation = (manager) => {
        const style = manager.style?.toLowerCase() || '';
        const traits = (manager.traits || []).join(' ').toLowerCase();

        if (traits.includes('possession') || traits.includes('tiki-taka') || style.includes('tiki-taka') || style.includes('innovator'))
            return 'Best with possession-heavy squads';
        if (traits.includes('youth') || traits.includes('development') || traits.includes('scout') || style.includes('mentor'))
            return 'Excels with young teams';
        if (traits.includes('rebuilding') || traits.includes('stability') || style.includes('stabilizer') || style.includes('revivalist'))
            return 'Ideal for rebuilding clubs';
        if (traits.includes('defensive') || traits.includes('wall') || traits.includes('organization') || style.includes('specialist'))
            return 'Perfect for defensive systems';
        if (traits.includes('gegenpressing') || traits.includes('intensity') || traits.includes('high press'))
            return 'Ideal for high-energy pressing';
        if (traits.includes('big game') || traits.includes('match specialist') || style.includes('strategist'))
            return 'Proven in elite-level competition';

        return 'Versatile tactical coordinator';
    };

    const getTraitIcon = (trait) => {
        const lower = trait.toLowerCase();
        if (lower.includes('tactical') || lower.includes('positi') || lower.includes('freedom') || lower.includes('mastermind') || lower.includes('innovation')) return '🧠';
        if (lower.includes('press') || lower.includes('intens') || lower.includes('energy') || lower.includes('transit') || lower.includes('attack') || lower.includes('fast') || lower.includes('vertical')) return '⚡';
        if (lower.includes('youth') || lower.includes('develop') || lower.includes('talent') || lower.includes('promotion') || lower.includes('scout') || lower.includes('growth') || lower.includes('mentor')) return '🌱';
        if (lower.includes('discipline') || lower.includes('leadership') || lower.includes('aura') || lower.includes('mentality') || lower.includes('unity') || lower.includes('management') || lower.includes('morale')) return '🛡️';
        if (lower.includes('defensive') || lower.includes('shape') || lower.includes('compact') || lower.includes('solid') || lower.includes('wall') || lower.includes('low risk') || lower.includes('grit')) return '🧱';
        if (lower.includes('possession') || lower.includes('build-up') || lower.includes('build up') || lower.includes('passing') || lower.includes('technical') || lower.includes('tempo')) return '⚽';
        if (lower.includes('set-piece') || lower.includes('mastery') || lower.includes('knocking') || lower.includes('knockout') || lower.includes('specialist')) return '🎯';
        if (lower.includes('global') || lower.includes('icon') || lower.includes('big game') || lower.includes('champion') || lower.includes('tournament') || lower.includes('star') || lower.includes('authority')) return '🏆';
        return '🔹';
    };

    const handleFinalProceed = () => {
        router.push('/formation-select');
    };

    return (
        <div className="entry-page no-snap">
            <div className="stadium-bg" style={{ filter: 'brightness(0.08) grayscale(0.8)' }}></div>
            <div className="overlay-gradient"></div>

            {/* Success Overlay - Full Page Scrollable */}
            {showSuccess && (
                <div className="phase-complete-overlay">
                    <div className="phase-scroll-container">

                        {/* Hero Celebration */}
                        <div className="phase-hero-section">
                            <div className="hero-particles">
                                <div className="particle p1"></div>
                                <div className="particle p2"></div>
                                <div className="particle p3"></div>
                                <div className="particle p4"></div>
                            </div>

                            <div className="phase-badge-large anim-pop-in">
                                <Trophy size={56} className="text-primary icon-glow" />
                                <div className="badge-orbit"></div>
                                <div className="badge-orbit orbit-2"></div>
                            </div>

                            <div className="phase-hero-text anim-pop-in">
                                <span className="phase-eyebrow">AUTHORIZATION COMPLETE</span>
                                <h1 className="phase-mega-title">PHASE ONE <span className="text-gradient">COMPLETE</span></h1>
                                <p className="phase-hero-desc">
                                    Outstanding work, Gaffer. Your club identity has been forged,
                                    your tactical philosophy defined, and your managerial
                                    authority ratified. The board awaits your next move.
                                </p>
                            </div>

                            <div className="scroll-cue">
                                <span>SCROLL TO REVIEW</span>
                                <ChevronRight size={16} style={{ transform: 'rotate(90deg)' }} />
                            </div>
                        </div>

                        {/* Deployment Recap */}
                        <div className="phase-recap-section">
                            <div className="section-tag-row">
                                <div className="tag-line"></div>
                                <span className="section-tag">DEPLOYMENT RECAP</span>
                                <div className="tag-line"></div>
                            </div>

                            <div className="recap-grid-premium">
                                <div className="recap-card-v2 glass-premium">
                                    <div className="card-top-tag">ESTABLISHED CLUB</div>
                                    <div className="recap-hero-visual">
                                        <div className="recap-img-showcase club-showcase">
                                            <div className="showcase-glow" style={{ background: selectedTeam?.colors?.[0] || 'var(--primary)' }}></div>
                                            <div className="showcase-ring"></div>
                                            {selectedTeam?.logo ? (
                                                <img src={selectedTeam.logo} alt="" className="showcase-img" />
                                            ) : (
                                                <Shield size={64} className="text-white" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="recap-text-center">
                                        <span className="recap-item-title-lg">{selectedTeam?.name}</span>
                                        <span className="recap-item-sub">PRIMARY OPERATIONAL BASE</span>
                                    </div>
                                    <div className="recap-card-footer">
                                        <div className="rcf-item">
                                            <span className="rcf-label">RATING</span>
                                            <span className="rcf-value">{selectedTeam?.rating || '—'}</span>
                                        </div>
                                        <div className="rcf-item">
                                            <span className="rcf-label">STATUS</span>
                                            <span className="rcf-value rcf-active">ACTIVE</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="recap-card-v2 glass-premium">
                                    <div className="card-top-tag">APPOINTED LEADER</div>
                                    <div className="recap-hero-visual">
                                        <div className="recap-img-showcase manager-showcase">
                                            <div className="showcase-glow" style={{ background: 'var(--primary)' }}></div>
                                            <div className="showcase-ring"></div>
                                            {selectedManager?.image && (
                                                <img src={selectedManager.image} alt="" className="showcase-img" />
                                            )}
                                        </div>
                                    </div>
                                    <div className="recap-text-center">
                                        <span className="recap-item-title-lg">{selectedManager?.name}</span>
                                        <span className="recap-item-sub">{selectedManager?.style?.toUpperCase()} TACTICIAN</span>
                                    </div>
                                    <div className="recap-card-footer">
                                        <div className="rcf-item">
                                            <span className="rcf-label">REPUTATION</span>
                                            <span className="rcf-value">{selectedManager?.reputation || '—'}/10</span>
                                        </div>
                                        <div className="rcf-item">
                                            <span className="rcf-label">COUNTRY</span>
                                            <span className="rcf-value">{selectedManager?.country || '—'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Systems Check */}
                        <div className="phase-pillars-section">
                            <div className="section-tag-row">
                                <div className="tag-line"></div>
                                <span className="section-tag">SYSTEMS CHECK</span>
                                <div className="tag-line"></div>
                            </div>

                            <div className="pillars-grid">
                                <div className="pillar-card glass-premium">
                                    <Shield size={24} className="text-primary" />
                                    <h4>Brand Identity</h4>
                                    <p>Club heritage and colors synchronized with league database.</p>
                                    <div className="pillar-status">ONLINE</div>
                                </div>
                                <div className="pillar-card glass-premium">
                                    <Scan size={24} className="text-primary" />
                                    <h4>Tactical Engine</h4>
                                    <p>Managerial philosophy and formation preferences loaded.</p>
                                    <div className="pillar-status">ONLINE</div>
                                </div>
                                <div className="pillar-card glass-premium">
                                    <Users size={24} className="text-primary" />
                                    <h4>Squad Module</h4>
                                    <p>Player scouting network ready. Starting XI slots unlocked.</p>
                                    <div className="pillar-status pending">PENDING</div>
                                </div>
                            </div>
                        </div>

                        {/* Next Phase CTA */}
                        <div className="phase-next-section">
                            <div className="next-preview-card glass-premium">
                                <div className="npc-top">
                                    <span className="npc-label">UPCOMING MISSION</span>
                                    <h2 className="npc-title">TACTICAL <span className="text-gradient">BLUEPRINT</span></h2>
                                    <p className="npc-desc">
                                        Choose your battle formation. Attacking, defensive, balanced—your
                                        tactical DNA defines how your squad will be assembled.
                                    </p>
                                </div>

                                <div className="npc-positions-row">
                                    <div className="pos-chip">
                                        <Shield size={14} />
                                        <span>DEFENSIVE</span>
                                    </div>
                                    <div className="pos-chip">
                                        <Layers size={14} />
                                        <span>BALANCED</span>
                                    </div>
                                    <div className="pos-chip">
                                        <Trophy size={14} />
                                        <span>ATTACKING</span>
                                    </div>
                                </div>

                                <button onClick={handleFinalProceed} className="action-btn-neon giant-btn">
                                    <span>SELECT FORMATION</span>
                                    <ChevronRight size={22} />
                                </button>
                            </div>

                            <p className="final-footer-text">FootballVerse • Kickoff Arena • Season 2026/27</p>
                        </div>

                    </div>
                </div>
            )}

            <section className="manager-select-container">
                <main className="selection-view" style={{ maxWidth: '1200px', width: '95%' }}>
                    {/* Header Nav */}
                    <div className="premium-nav-bar">
                        <div className="nav-left-group">
                            <button onClick={() => router.push('/team-select')} className="nav-back-btn-extreme">
                                <ChevronLeft size={20} />
                                <span>RETURN TO TEAM SELECT</span>
                            </button>
                        </div>

                        <div className="center-identity">
                            <div className="club-mini-badge" style={{ borderColor: selectedTeam?.colors?.[0] || 'var(--primary)' }}>
                                <Shield size={14} className="text-primary" />
                            </div>
                            <div className="identity-text-stack">
                                <span className="scouting-label">AUTHORIZED RECRUITMENT</span>
                                <span className="scouting-target">{selectedTeam?.name || 'AGENT PROFILE'}</span>
                            </div>
                        </div>

                        <div className="phase-indicator">
                            <div className="step-count">
                                <span className="text-primary">05</span>
                                <span className="text-muted">/</span>
                                <span className="text-muted">05</span>
                            </div>
                            <div className="phase-dots">
                                <div className="dot filled"></div>
                                <div className="dot filled"></div>
                                <div className="dot filled"></div>
                                <div className="dot filled"></div>
                                <div className="dot active"></div>
                            </div>
                        </div>
                    </div>

                    <div className="selection-titles centered">
                        <div className="title-ornament">
                            <div className="ornament-line"></div>
                            <Users size={16} className="ornament-icon" />
                            <div className="ornament-line"></div>
                        </div>
                        <h1 className="headline text-700 main-selection-title">
                            SELECT YOUR <span className="text-gradient">GAFFER</span>
                        </h1>
                        <p className="subtitle-premium">
                            Choose the tactical genius who will lead your club to glory.
                            Your manager's style influences player development and match-day tactics.
                        </p>
                    </div>

                    {/* Manager Selection Level */}
                    <div className="managers-view">
                        <div className="teams-search-row centered-row">
                            <div className="search-container glass-premium">
                                <div className="search-icon-wrapper">
                                    <div className="pulsating-ring-large"></div>
                                    <Star size={20} className="text-primary" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="SEARCH TACTICAL PROFILES..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="team-search-input-premium"
                                />
                                <div className="search-meta">
                                    <span className="scout-badge">{filteredManagers.length} TACTICIANS FOUND</span>
                                </div>
                            </div>
                        </div>

                        <div className={`managers-grid-refined ${selectedManager ? 'has-selection' : ''}`}>
                            {filteredManagers.map((manager) => (
                                <button
                                    key={manager.id}
                                    onClick={() => handleManagerSelect(manager)}
                                    className={`manager-card-premium glass ${selectedManager?.id === manager.id ? 'selected' : ''}`}
                                >
                                    <div className="card-accent-glow"></div>

                                    <div className="portrait-display">
                                        <div className="portrait-halo"></div>
                                        <div className="portrait-inner" data-initials={manager.name.split(' ').map(n => n[0]).join('')}>
                                            <img
                                                src={manager.image}
                                                alt={manager.name}
                                                className="manager-avatar-img"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.parentElement.classList.add('broken-img');
                                                }}
                                            />
                                        </div>
                                        <div className="reputation-badge">
                                            <Star size={10} fill="currentColor" />
                                            <span>{manager.reputation}</span>
                                        </div>
                                    </div>

                                    <div className="manager-core-info">
                                        <div className="manager-info-header">
                                            <h3 className="manager-name-label">{manager.name}</h3>
                                            {selectedTeam && (
                                                <div className="fit-wrapper">
                                                    <div className={`fit-indicator ${getManagerFit(manager).type}`}>
                                                        <span className="fit-icon">{getManagerFit(manager).icon}</span>
                                                        <span className="fit-label">{getManagerFit(manager).label}</span>

                                                        <div className="fit-tooltip">
                                                            <div className="tooltip-header">Tactical Implications</div>
                                                            <div className="tooltip-consequences">
                                                                {getManagerFit(manager).consequences.map((cons, ci) => (
                                                                    <div key={ci} className="cons-item">
                                                                        <span className="cons-icon">{cons.icon}</span>
                                                                        <span className="cons-label">{cons.label}</span>
                                                                        <span className="cons-value">{cons.value}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                            <div className="tooltip-footer">Choice influences development speed</div>
                                                        </div>
                                                    </div>
                                                    <div className="fit-recommendation-hint">
                                                        {getManagerRecommendation(manager)}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <div className="manager-meta-row">
                                            <div className="meta-item">
                                                <Trophy size={11} className="text-primary" />
                                                <span>{manager.style}</span>
                                            </div>
                                        </div>

                                        <div className="style-panel-mini chips">
                                            {(manager.traits || ['Tactical Balance', 'General Motivation', 'Standard Development']).map((trait, idx) => (
                                                <div key={idx} className="style-trait-chip">
                                                    <span className="trait-icon-mini">{getTraitIcon(trait)}</span>
                                                    <span>{trait}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="selection-check">
                                        {selectedManager?.id === manager.id ? (
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
                </main>
            </section>

            <style jsx>{`
                /* Overlay - Full Page Scrollable */
                .phase-complete-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 5000;
                    background: rgba(2, 4, 10, 0.97);
                    overflow-y: auto;
                    overflow-x: hidden;
                }

                .phase-scroll-container {
                    display: flex;
                    flex-direction: column;
                    min-height: 100%;
                }

                .phase-hero-section {
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    padding: 3rem 2rem;
                    overflow: hidden;
                }

                .hero-particles { position: absolute; inset: 0; pointer-events: none; }
                .particle {
                    position: absolute;
                    width: 4px; height: 4px;
                    background: var(--primary);
                    border-radius: 50%;
                    opacity: 0.4;
                    animation: floatUp 4s ease-in-out infinite;
                }
                .p1 { left: 15%; bottom: 20%; animation-delay: 0s; }
                .p2 { left: 75%; bottom: 30%; animation-delay: 1s; }
                .p3 { left: 40%; bottom: 10%; animation-delay: 2s; }
                .p4 { left: 60%; bottom: 40%; animation-delay: 0.5s; }

                @keyframes floatUp {
                    0%, 100% { transform: translateY(0) scale(1); opacity: 0.4; }
                    50% { transform: translateY(-80px) scale(1.5); opacity: 0.8; }
                }

                .phase-badge-large {
                    width: 120px; height: 120px;
                    background: rgba(0, 255, 136, 0.05);
                    border: 1px solid rgba(0, 255, 136, 0.15);
                    border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    margin-bottom: 3rem;
                    position: relative;
                }

                .badge-orbit {
                    position: absolute; inset: -12px;
                    border: 1px solid rgba(0, 255, 136, 0.1);
                    border-radius: 50%;
                    animation: orbitSpin 8s linear infinite;
                    border-top-color: var(--primary);
                }
                .orbit-2 {
                    inset: -24px;
                    animation-duration: 12s;
                    animation-direction: reverse;
                    border-top-color: rgba(59, 130, 246, 0.3);
                    border-color: rgba(59, 130, 246, 0.05);
                }
                @keyframes orbitSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                .icon-glow { filter: drop-shadow(0 0 25px rgba(0, 255, 136, 0.6)); z-index: 2; }

                .phase-hero-text { text-align: center; max-width: 600px; }
                .phase-eyebrow {
                    font-size: 0.65rem; font-weight: 900; letter-spacing: 0.35em;
                    color: var(--primary); opacity: 0.5; display: block; margin-bottom: 1.25rem;
                }
                .phase-mega-title {
                    font-size: clamp(2.5rem, 7vw, 4rem);
                    font-weight: 900; color: white; letter-spacing: -0.03em;
                    margin-bottom: 1.5rem; line-height: 1.1;
                }
                .phase-hero-desc {
                    font-size: 1.05rem; color: rgba(255,255,255,0.4);
                    line-height: 1.8; max-width: 480px; margin: 0 auto;
                }

                .scroll-cue {
                    position: absolute; bottom: 3rem;
                    display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
                    color: var(--primary); font-size: 0.6rem; font-weight: 800;
                    letter-spacing: 0.2em; opacity: 0.5;
                    animation: bounceDown 2s infinite;
                }
                @keyframes bounceDown {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(8px); }
                }

                /* Section Tags */
                .section-tag-row {
                    display: flex; align-items: center; justify-content: center;
                    gap: 1.5rem; margin-bottom: 3rem;
                }
                .tag-line { width: 50px; height: 1px; background: linear-gradient(90deg, transparent, rgba(0,255,136,0.3)); }
                .section-tag { font-size: 0.65rem; font-weight: 900; letter-spacing: 0.3em; color: var(--primary); opacity: 0.6; }

                /* Recap Section */
                .phase-recap-section {
                    padding: 6rem 2rem;
                    display: flex; flex-direction: column; align-items: center;
                    max-width: 900px; margin: 0 auto; width: 100%;
                }

                .recap-grid-premium {
                    display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; width: 100%;
                }

                .recap-card-v2 {
                    padding: 2.5rem 2rem; border-radius: 28px; text-align: center;
                    border: 1px solid rgba(255,255,255,0.05); position: relative;
                    transition: all 0.4s ease;
                    display: flex; flex-direction: column; align-items: center;
                }
                .recap-card-v2:hover { border-color: rgba(0, 255, 136, 0.15); transform: translateY(-6px); }

                .card-top-tag {
                    font-size: 0.6rem; font-weight: 900; color: var(--primary);
                    letter-spacing: 0.25em; margin-bottom: 2rem; opacity: 0.6;
                }

                /* Large Showcase Images */
                .recap-hero-visual {
                    display: flex; justify-content: center;
                    margin-bottom: 2rem;
                }

                .recap-img-showcase {
                    width: 160px; height: 160px; border-radius: 50%;
                    background: rgba(0,0,0,0.4);
                    display: flex; align-items: center; justify-content: center;
                    position: relative; flex-shrink: 0;
                    border: 2px solid rgba(255,255,255,0.08);
                    overflow: hidden;
                }

                .showcase-glow {
                    position: absolute; inset: -20px; opacity: 0.2;
                    filter: blur(30px); border-radius: 50%;
                }

                .showcase-ring {
                    position: absolute; inset: -8px;
                    border: 1px solid rgba(0, 255, 136, 0.12);
                    border-radius: 50%;
                    animation: orbitSpin 10s linear infinite;
                    border-top-color: var(--primary);
                }

                .showcase-img {
                    width: 85%; height: 85%; object-fit: contain;
                    z-index: 2; position: relative;
                }

                .manager-showcase .showcase-img {
                    width: 100%; height: 100%; object-fit: cover;
                    border-radius: 50%;
                }

                .club-showcase .showcase-img {
                    width: 70%; height: 70%;
                    filter: drop-shadow(0 4px 20px rgba(0,0,0,0.5));
                }

                .recap-text-center {
                    display: flex; flex-direction: column;
                    align-items: center; gap: 0.35rem; margin-bottom: 1.5rem;
                }

                .recap-item-title-lg {
                    font-size: 1.5rem; font-weight: 900; color: white;
                    letter-spacing: -0.01em;
                }

                .recap-item-sub {
                    font-size: 0.65rem; font-weight: 700;
                    color: rgba(255,255,255,0.3); letter-spacing: 0.1em;
                }

                .recap-card-footer {
                    display: flex; gap: 2rem; padding-top: 1.25rem;
                    border-top: 1px solid rgba(255,255,255,0.04);
                    width: 100%; justify-content: center;
                }
                .rcf-item { display: flex; flex-direction: column; gap: 0.2rem; text-align: center; }
                .rcf-label { font-size: 0.5rem; font-weight: 900; color: rgba(255,255,255,0.25); letter-spacing: 0.15em; }
                .rcf-value { font-size: 0.9rem; font-weight: 800; color: white; }
                .rcf-active { color: var(--primary); }

                /* Pillars / Systems Check */
                .phase-pillars-section {
                    padding: 5rem 2rem;
                    display: flex; flex-direction: column; align-items: center;
                    max-width: 900px; margin: 0 auto; width: 100%;
                }
                .pillars-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem; width: 100%; }

                .pillar-card {
                    padding: 2rem 1.5rem; border-radius: 20px; text-align: center;
                    display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
                    border: 1px solid rgba(255,255,255,0.04); transition: all 0.4s ease;
                }
                .pillar-card:hover { border-color: rgba(0,255,136,0.12); transform: translateY(-4px); }
                .pillar-card h4 { font-size: 1rem; font-weight: 800; color: white; }
                .pillar-card p { font-size: 0.78rem; color: rgba(255,255,255,0.35); line-height: 1.5; }

                .pillar-status {
                    font-size: 0.55rem; font-weight: 900; letter-spacing: 0.2em;
                    color: var(--primary); background: rgba(0, 255, 136, 0.08);
                    padding: 0.3rem 0.8rem; border-radius: 20px;
                    border: 1px solid rgba(0, 255, 136, 0.15); margin-top: 0.5rem;
                }
                .pillar-status.pending {
                    color: #f59e0b; background: rgba(245, 158, 11, 0.08);
                    border-color: rgba(245, 158, 11, 0.2);
                }

                /* Next Phase CTA */
                .phase-next-section {
                    padding: 5rem 2rem 4rem;
                    display: flex; flex-direction: column; align-items: center;
                }
                .next-preview-card {
                    max-width: 600px; width: 100%; padding: 3.5rem 3rem;
                    border-radius: 32px; text-align: center;
                    border: 1px solid rgba(0, 255, 136, 0.1); margin-bottom: 3rem;
                }
                .npc-label {
                    font-size: 0.6rem; font-weight: 900; letter-spacing: 0.3em;
                    color: var(--primary); opacity: 0.5; display: block; margin-bottom: 1rem;
                }
                .npc-title {
                    font-size: 2.2rem; font-weight: 900; color: white;
                    margin-bottom: 1rem; letter-spacing: -0.02em;
                }
                .npc-desc {
                    font-size: 0.95rem; color: rgba(255,255,255,0.4);
                    line-height: 1.7; margin-bottom: 2.5rem; max-width: 420px; margin-inline: auto;
                }
                .npc-positions-row {
                    display: flex; justify-content: center; gap: 1rem;
                    margin-bottom: 2.5rem; flex-wrap: wrap;
                }
                .pos-chip {
                    display: flex; align-items: center; gap: 0.5rem;
                    padding: 0.5rem 1rem; background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.06); border-radius: 12px;
                    font-size: 0.68rem; font-weight: 800; color: rgba(255,255,255,0.6); letter-spacing: 0.1em;
                }

                .giant-btn { width: 100%; height: 64px; font-size: 1.05rem; border-radius: 18px; justify-content: center; }
                .final-footer-text { font-size: 0.6rem; font-weight: 700; color: rgba(255,255,255,0.15); letter-spacing: 0.2em; }

                .anim-pop-in { animation: pop-in 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                @keyframes pop-in {
                    from { transform: scale(0.9) translateY(20px); opacity: 0; }
                    to { transform: scale(1) translateY(0); opacity: 1; }
                }

                /* Manager Select Container */
                .manager-select-container {
                    min-height: 100vh; display: flex; align-items: center; justify-content: center;
                    padding: 4rem 1rem; animation: containerFadeIn 0.6s ease-out;
                }
                @keyframes containerFadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* Selection Header Refinement */
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
                    border-radius: 8px;
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

                /* Phase Indicator */
                .phase-indicator {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 0.4rem;
                }

                .step-count {
                    display: flex;
                    gap: 0.3rem;
                    font-size: 1.1rem;
                    font-weight: 900;
                    letter-spacing: -0.05em;
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

                /* Search Bar */
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

                .pulsating-ring-large {
                    position: absolute;
                    width: 40px;
                    height: 40px;
                    border: 1px solid var(--primary);
                    border-radius: 50%;
                    opacity: 0.3;
                    animation: pulse-ring 2s infinite;
                }

                @keyframes pulse-ring {
                    0% { transform: scale(0.8); opacity: 0.5; }
                    100% { transform: scale(1.5); opacity: 0; }
                }

                /* Managers Grid */
                .managers-grid-refined {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 10rem;
                }

                .manager-card-premium {
                    position: relative;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    padding: 1.75rem 1.25rem;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 24px;
                    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                    cursor: pointer;
                    overflow: hidden;
                    text-align: center;
                    backdrop-filter: blur(5px);
                    min-height: 420px;
                }

                .manager-card-premium:hover {
                    background: rgba(255, 255, 255, 0.04);
                    border-color: rgba(0, 255, 136, 0.3);
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 255, 136, 0.05);
                }

                .managers-grid-refined.has-selection .manager-card-premium:not(.selected) {
                    opacity: 0.15;
                    filter: blur(4px) grayscale(1);
                    transform: scale(0.95);
                }

                .manager-card-premium.selected {
                    background: rgba(0, 255, 136, 0.05);
                    border-color: var(--primary);
                    border-width: 1px;
                    box-shadow: 0 0 40px rgba(0, 255, 136, 0.15);
                    transform: scale(1.02);
                    z-index: 10;
                }

                /* Portrait Display */
                .portrait-display {
                    position: relative;
                    width: 110px;
                    height: 110px;
                    margin-bottom: 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .portrait-halo {
                    position: absolute;
                    inset: -10px;
                    border: 1px solid var(--primary);
                    border-radius: 50%;
                    opacity: 0.1;
                    transition: 0.5s;
                }

                .manager-card-premium:hover .portrait-halo {
                    transform: scale(1.1);
                    opacity: 0.3;
                }

                .portrait-inner {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    overflow: hidden;
                    background: rgba(255, 255, 255, 0.03);
                    border: 2px solid rgba(255,255,255,0.08);
                    position: relative;
                }

                .manager-avatar-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    filter: saturate(1.1) contrast(1.1);
                    transition: 0.5s;
                }

                .manager-card-premium:hover .manager-avatar-img {
                    transform: scale(1.1);
                }

                .portrait-inner.broken-img::after {
                    content: attr(data-initials);
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
                    color: white;
                    font-size: 2.5rem;
                    font-weight: 900;
                    letter-spacing: 0.1em;
                }

                .reputation-badge {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    background: var(--primary);
                    color: black;
                    padding: 0.4rem 0.8rem;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    font-size: 0.75rem;
                    font-weight: 800;
                    box-shadow: 0 8px 16px rgba(0, 255, 136, 0.3);
                }

                .manager-core-info {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .manager-info-header {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 1.25rem;
                    width: 100%;
                }

                .manager-name-label {
                    color: white;
                    font-size: 1.2rem;
                    font-weight: 800;
                    margin-bottom: 0;
                    letter-spacing: -0.02em;
                    line-height: 1.1;
                }

                .fit-wrapper {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                    width: 100%;
                }

                .fit-indicator {
                    position: relative;
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    padding: 0.25rem 0.6rem;
                    border-radius: 6px;
                    font-size: 0.55rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    white-space: nowrap;
                    transition: 0.3s;
                    cursor: help;
                }

                .fit-recommendation-hint {
                    font-size: 0.55rem;
                    color: rgba(255, 255, 255, 0.25);
                    font-weight: 600;
                    letter-spacing: 0.02em;
                    text-align: center;
                    transition: 0.3s;
                    max-width: 90%;
                    line-height: 1.3;
                }

                .manager-card-premium:hover .fit-recommendation-hint {
                    color: rgba(255, 255, 255, 0.5);
                }

                .fit-tooltip {
                    position: absolute;
                    bottom: 100%;
                    right: 0;
                    margin-bottom: 0.75rem;
                    width: 220px;
                    background: rgba(10, 15, 25, 0.98);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 1rem;
                    z-index: 100;
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(10px);
                    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
                    backdrop-filter: blur(15px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.6);
                    pointer-events: none;
                }

                .fit-indicator:hover .fit-tooltip {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }

                .tooltip-header {
                    font-size: 0.65rem;
                    color: rgba(255, 255, 255, 0.4);
                    margin-bottom: 0.75rem;
                    letter-spacing: 0.1em;
                }

                .tooltip-consequences {
                    display: flex;
                    flex-direction: column;
                    gap: 0.6rem;
                    margin-bottom: 0.75rem;
                }

                .cons-item {
                    display: flex;
                    align-items: center;
                    gap: 0.6rem;
                    font-size: 0.7rem;
                    color: white;
                }

                .cons-label { flex: 1; color: rgba(255, 255, 255, 0.6); }
                .cons-value { 
                    font-weight: 900; 
                    color: var(--primary);
                    background: rgba(0, 255, 136, 0.05);
                    padding: 0.1rem 0.4rem;
                    border-radius: 4px;
                }

                .fit-indicator.challenging .cons-value {
                    color: #FFAA00;
                    background: rgba(255, 170, 0, 0.05);
                }

                .tooltip-footer {
                    font-size: 0.55rem;
                    color: rgba(255, 255, 255, 0.2);
                    font-style: italic;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                    padding-top: 0.5rem;
                }

                .fit-indicator.strong {
                    background: rgba(0, 255, 136, 0.1);
                    color: var(--primary);
                    border: 1px solid rgba(0, 255, 136, 0.2);
                    box-shadow: 0 0 10px rgba(0, 255, 136, 0.1);
                }

                .fit-indicator.neutral {
                    background: rgba(255, 255, 255, 0.03);
                    color: rgba(255, 255, 255, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                }

                .fit-indicator.challenging {
                    background: rgba(255, 170, 0, 0.1);
                    color: #FFAA00;
                    border: 1px solid rgba(255, 170, 0, 0.2);
                    box-shadow: 0 0 10px rgba(255, 170, 0, 0.1);
                }

                .manager-meta-row {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1.25rem;
                    justify-content: center;
                    padding-top: 0.6rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.05);
                    width: 100%;
                }

                .meta-item {
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                    font-size: 0.65rem;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.4);
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .style-panel-mini.chips {
                    background: transparent;
                    border: none;
                    padding: 0;
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    justify-content: center;
                    width: 100%;
                }

                .style-trait-chip {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    padding: 0.35rem 0.6rem;
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    border-radius: 8px;
                    font-size: 0.58rem;
                    font-weight: 700;
                    color: rgba(255, 255, 255, 0.3);
                    transition: 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                    text-transform: uppercase;
                    letter-spacing: 0.03em;
                }

                .manager-card-premium:hover .style-trait-chip {
                    background: rgba(255, 255, 255, 0.06);
                    border-color: rgba(255, 255, 255, 0.12);
                    color: rgba(255, 255, 255, 0.7);
                    transform: translateY(-2px);
                    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                }

                .trait-icon-mini {
                    font-size: 0.75rem;
                    filter: grayscale(0.5);
                    transition: 0.3s;
                }

                .manager-card-premium:hover .trait-icon-mini {
                    filter: grayscale(0); transform: scale(1.1);
                }

                .selection-check {
                    position: absolute;
                    top: 1.5rem;
                    right: 1.5rem;
                    opacity: 0.2;
                    transform: scale(0.8);
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }

                .manager-card-premium:hover .selection-check {
                    opacity: 1;
                    transform: scale(1);
                }

                .manager-card-premium.selected .selection-check {
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

                .manager-card-premium:hover .arrow-circle {
                    background: var(--primary);
                    color: black;
                    border-color: var(--primary);
                    transform: translateX(3px);
                    box-shadow: 0 0 15px rgba(0, 255, 136, 0.4);
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

                .preview-logo-box.manager-box {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    overflow: hidden;
                    border: 2px solid var(--primary);
                    box-shadow: 0 0 15px rgba(0, 255, 136, 0.3);
                }

                .preview-avatar-mini {
                    width: 100%;
                    height: 100%;
                    background-size: cover;
                    background-position: center;
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
                    .managers-grid-refined { grid-template-columns: 1fr; }
                    .confirmation-bar { width: 95%; padding: 1rem; }
                    .preview-name { font-size: 1.2rem; }
                    .action-btn-neon { padding: 0.8rem 1.5rem; font-size: 0.8rem; }
                    .subtitle-premium { font-size: 1rem; }
                    
                    /* Phase Complete Mobile */
                    .phase-mega-title { font-size: 2rem; }
                    .phase-hero-desc { font-size: 0.9rem; }
                    .recap-grid-premium { grid-template-columns: 1fr; gap: 1.5rem; }
                    .recap-card-v2 { padding: 1.75rem 1.25rem; }
                    .recap-img-showcase { width: 120px; height: 120px; }
                    .recap-item-title-lg { font-size: 1.25rem; }
                    .pillars-grid { grid-template-columns: 1fr; }
                    .pillar-card { padding: 1.5rem 1.25rem; }
                    .next-preview-card { padding: 2.5rem 1.75rem; }
                    .npc-title { font-size: 1.6rem; }
                    .phase-recap-section { padding: 4rem 1.25rem; }
                    .phase-pillars-section { padding: 3rem 1.25rem; }
                }
            `}</style>
        </div >
    );
}
