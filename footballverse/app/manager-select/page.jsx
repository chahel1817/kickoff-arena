'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ChevronLeft, ChevronRight, Star, Users, Globe, Trophy, Search, Cpu, Check, Scan, Layers, Zap, Info, Target, Brain, Sprout, BrickWall, Activity, Compass, TrendingUp } from 'lucide-react';
import managersData from '../../data/managers.json';
import '../entry.css';

export default function ManagerSelectPage() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [selectedManager, setSelectedManager] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [intelManager, setIntelManager] = useState(null);
    const [isIntelOpen, setIsIntelOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const filteredManagers = managersData
        .filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => b.reputation - a.reputation);

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        if (storedName) setName(storedName);

        const storedTeam = localStorage.getItem('selectedTeam');
        if (storedTeam) {
            setSelectedTeam(JSON.parse(storedTeam));
        } else {
            router.push('/team-select');
        }
    }, [router]);

    const handleManagerSelect = (manager) => {
        setSelectedManager(manager);
        localStorage.setItem('selectedManager', JSON.stringify(manager));
        setIsIntelOpen(false);

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

        // Primary Connection Map
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
                label: 'Perfect Fit for Your Squad',
                icon: '✅'
            };
        }

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
                label: 'Major Club Identity Shift',
                icon: '⚠️'
            };
        }

        return {
            type: 'neutral',
            label: 'System Adaptation Required',
            icon: '🔄'
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

    const calculateTacticalMetrics = (manager) => {
        const rep = manager.reputation || 80;
        const traits = (manager.traits || []).join(' ').toLowerCase();
        const primaryFormation = manager.formations?.[0] || '4-3-3';

        // 1. TACTICAL STABILITY - Legendary Floor Focus
        let stabilityScore = rep * 0.8 + 20; // Big names start high (99 rep -> 99.2 score)
        if (traits.includes('discipline') || traits.includes('compact')) stabilityScore += 5;

        // Interpretation
        let stabilityLabel = 'Structural Development';
        if (stabilityScore >= 95) stabilityLabel = 'Master-Class Control';
        else if (stabilityScore >= 85) stabilityLabel = 'Elite Tactical System';
        else if (stabilityScore >= 70) stabilityLabel = 'Reliable Foundation';

        // 2. RISK TOLERANCE - Dynamic based on style context
        const riskStyleValues = { 'tiki-taka': 88, 'high-energy': 92, 'attacking': 95, 'counter': 45, 'defensive': 20, 'balanced': 55 };
        const styleKey = Object.keys(riskStyleValues).find(k => manager.style?.toLowerCase().includes(k)) || 'balanced';
        let riskScore = (riskStyleValues[styleKey] * 0.7) + (rep * 0.3); // High rep boosts risk conviction

        // Formation DNA (25%)
        const formRiskValues = { "3-4-3": 90, "3-2-4-1": 95, "4-3-3": 75, "4-2-3-1": 65, "4-4-2": 50, "5-3-2": 35, "3-5-2": 70 };
        const formRisk = formRiskValues[primaryFormation] || 60;
        riskScore = (riskScore * 0.7) + (formRisk * 0.3);

        // Interpretation
        let riskLabel = 'Disciplined/Measured';
        if (riskScore >= 80) riskLabel = 'High-Impact Aggression';
        else if (riskScore >= 60) riskLabel = 'Controlled Proactivity';
        else if (riskScore >= 40) riskLabel = 'Neutral/Strategic';

        return {
            stability: Math.min(stabilityScore, 99).toFixed(0),
            stabilityLabel,
            risk: Math.min(riskScore, 99).toFixed(0),
            riskLabel
        };
    };

    const getTraitIcon = (trait, size = 14) => {
        const lower = trait.toLowerCase();
        const props = { size, className: "trait-lucide-icon" };

        if (lower.includes('tactical') || lower.includes('positi') || lower.includes('freedom') || lower.includes('mastermind') || lower.includes('innovation')) return <Brain {...props} />;
        if (lower.includes('press') || lower.includes('intens') || lower.includes('energy') || lower.includes('transit') || lower.includes('attack') || lower.includes('fast') || lower.includes('vertical')) return <Zap {...props} />;
        if (lower.includes('youth') || lower.includes('develop') || lower.includes('talent') || lower.includes('promotion') || lower.includes('scout') || lower.includes('growth') || lower.includes('mentor')) return <Sprout {...props} />;
        if (lower.includes('discipline') || lower.includes('leadership') || lower.includes('aura') || lower.includes('mentality') || lower.includes('unity') || lower.includes('authority')) return <Shield {...props} />;
        if (lower.includes('defensive') || lower.includes('shape') || lower.includes('compact') || lower.includes('solid') || lower.includes('wall') || lower.includes('grit')) return <BrickWall {...props} />;
        if (lower.includes('possession') || lower.includes('build-up') || lower.includes('build up') || lower.includes('passing') || lower.includes('technical') || lower.includes('tempo')) return <Activity {...props} />;
        if (lower.includes('set-piece') || lower.includes('mastery') || lower.includes('knocking') || lower.includes('knockout') || lower.includes('specialist') || lower.includes('target')) return <Target {...props} />;
        if (lower.includes('global') || lower.includes('icon') || lower.includes('big game') || lower.includes('champion') || lower.includes('tournament') || lower.includes('star')) return <Trophy {...props} />;
        if (lower.includes('management') || lower.includes('morale') || lower.includes('relation') || lower.includes('people') || lower.includes('squad')) return <Users {...props} />;
        if (lower.includes('philosophy') || lower.includes('visionary') || lower.includes('creative') || lower.includes('expression')) return <Compass {...props} />;
        if (lower.includes('winning') || lower.includes('mentality') || lower.includes('resilience') || lower.includes('comeback')) return <TrendingUp {...props} />;

        return <div className="trait-dot"></div>;
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

                        <div className="search-instruction-row">
                            <div className="search-instruction">
                                <Info size={14} className="text-primary" />
                                <span>Hover <span className="text-primary" style={{ fontWeight: 800, textTransform: 'uppercase' }}>Tactical Intel</span> to view the detailed tactical dossier.</span>
                            </div>
                        </div>

                        <div className={`managers-grid-refined ${selectedManager ? 'has-selection' : ''}`}>
                            {filteredManagers.map((manager) => (
                                <button
                                    key={manager.id}
                                    onClick={() => handleManagerSelect(manager)}
                                    className={`manager-card-premium glass ${selectedManager?.id === manager.id ? 'selected' : ''} ${intelManager?.id === manager.id && isIntelOpen ? 'intel-scanning' : ''}`}
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
                                        <div className={`reputation-badge ${manager.reputation >= 99 ? 'rep-legendary' : manager.reputation >= 95 ? 'rep-elite' : 'rep-tactical'}`}>
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
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="style-panel-mini chips">
                                            <div className="passive-traits-list">
                                                {(manager.traits || []).slice(0, 2).map((t, i) => (
                                                    <div key={i} className="passive-trait">
                                                        {getTraitIcon(t, 10)}
                                                        <span>{t}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="traits-single-line-container">
                                                <div className="elite-duo-row">
                                                    <div className="intel-trigger-wrapper">
                                                        <div
                                                            className="intel-button-glow"
                                                            onMouseEnter={() => { if (!isMobile) { setIntelManager(manager); setIsIntelOpen(true); } }}
                                                            onMouseLeave={() => { if (!isMobile) setIsIntelOpen(false); }}
                                                            onClick={(e) => {
                                                                if (isMobile) {
                                                                    e.stopPropagation();
                                                                    setIntelManager(manager);
                                                                    setIsIntelOpen(true);
                                                                }
                                                            }}
                                                        >
                                                            <Cpu size={12} className="text-primary" />
                                                            <span>TACTICAL INTEL</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
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
                    font-size: clamp(3rem, 10vw, 6rem);
                    font-weight: 900; color: white; letter-spacing: -0.05em;
                    margin-bottom: 2rem; line-height: 0.9;
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
                    gap: 0.75rem; margin-bottom: 1rem;
                }
                .tag-line { width: 30px; height: 1px; background: linear-gradient(90deg, transparent, rgba(0,255,136,0.2)); }
                .section-tag { font-size: 0.55rem; font-weight: 900; letter-spacing: 0.3em; color: var(--primary); opacity: 0.6; }

                /* Recap Section */
                .phase-recap-section {
                    padding: 3rem 2rem 2rem;
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
                    padding: 2.5rem 2rem;
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
                    padding: 2.5rem 2rem 6rem;
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
                    white-space: nowrap;
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
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    cursor: pointer;
                }

                .center-identity:hover {
                    background: rgba(255,255,255,0.07);
                    border-color: rgba(0, 255, 136, 0.4);
                    transform: translateY(-2px);
                    box-shadow: 0 5px 20px rgba(0,0,0,0.3);
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
                    transition: 0.4s;
                }

                .center-identity:hover .club-mini-badge {
                    transform: scale(1.1) rotate(5deg);
                    box-shadow: 0 0 15px var(--primary);
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
                    width: 100%;
                    max-width: 720px;
                    height: 64px;
                    background: rgba(6, 8, 12, 0.85);
                    backdrop-filter: blur(24px);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 100px;
                    box-shadow: 0 25px 50px rgba(0,0,0,0.5);
                    padding: 0 2rem;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    margin: 0 auto;
                }

                .teams-search-row.centered-row {
                    display: flex;
                    justify-content: center;
                    width: 100%;
                    margin-bottom: 0.5rem;
                }

                .search-instruction-row {
                    display: flex;
                    justify-content: center;
                    margin-top: 0.5rem;
                    margin-bottom: 3.5rem;
                }

                .search-instruction {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 0.85rem;
                    color: rgba(255, 255, 255, 0.4);
                    font-weight: 500;
                    letter-spacing: 0.02em;
                    padding: 0.6rem 1.5rem;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 100px;
                    backdrop-filter: blur(10px);
                }

                .search-icon-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 42px;
                    height: 42px;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 50%;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                }

                .fm-success-context {
                    padding: 2.5rem 2rem;
                    max-width: 800px; margin: 0 auto; width: 100%;
                    background: rgba(10, 10, 15, 0.6);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 20px;
                    box-shadow: 0 15px 35px rgba(0,0,0,0.4);
                }

                .team-search-input-premium::placeholder {
                    color: rgba(255, 255, 255, 0.2);
                    letter-spacing: 0.1em;
                    font-size: 0.85rem;
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
                    padding: 1.25rem 0.75rem;
                    background: rgba(255, 255, 255, 0.015);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 20px;
                    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                    cursor: pointer;
                    text-align: center;
                    backdrop-filter: blur(10px);
                    min-height: 330px;
                    box-shadow: 0 4px 24px rgba(0,0,0,0.1);
                }

                .manager-card-premium:hover {
                    background: rgba(255, 255, 255, 0.04);
                    border-color: rgba(0, 255, 136, 0.3);
                    transform: scale(0.97) translateY(-4px);
                    box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.6), 0 0 15px rgba(0, 255, 136, 0.03);
                    z-index: 100;
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
                    width: 85px;
                    height: 85px;
                    margin-bottom: 0.5rem;
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
                    bottom: -8px;
                    right: -8px;
                    background: #111;
                    padding: 0.35rem 0.6rem;
                    border-radius: 50px;
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    font-size: 0.7rem;
                    font-weight: 800;
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
                    z-index: 10;
                    transition: all 0.3s ease;
                }

                .reputation-badge.rep-legendary {
                    background: linear-gradient(135deg, #FFD700, #FFA500);
                    color: black;
                    border: 1px solid #FFF5B7;
                    box-shadow: 0 0 15px rgba(255, 215, 0, 0.4), inset 0 0 10px rgba(255, 255, 255, 0.5);
                    animation: goldShimmer 3s ease-in-out infinite;
                }

                @keyframes goldShimmer {
                    0%, 100% { filter: brightness(1); }
                    50% { filter: brightness(1.3) contrast(1.1); box-shadow: 0 0 25px rgba(255, 215, 0, 0.6); }
                }

                .reputation-badge.rep-elite {
                    background: rgba(0, 255, 136, 0.9);
                    color: black;
                    border: 1px solid #A7FFD8;
                    box-shadow: 0 0 12px rgba(0, 255, 136, 0.3);
                }

                .reputation-badge.rep-tactical {
                    background: rgba(255, 255, 255, 0.1);
                    color: rgba(255, 255, 255, 0.7);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    backdrop-filter: blur(10px);
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
                    gap: 0.4rem;
                    margin-bottom: 0.4rem;
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
                    gap: 0.3rem;
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

                .fit-indicator:hover {
                    background: rgba(255, 255, 255, 0.08);
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
                    gap: 0.4rem;
                    margin-bottom: 0.4rem;
                    justify-content: center;
                    padding-top: 0.3rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.03);
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
                                    width: 100%;
                                    padding: 0;
                                    margin-top: 1rem;
                                }

                                .passive-traits-list {
                                    display: flex;
                                    flex-direction: column;
                                    gap: 0.4rem;
                                    align-items: center;
                                    margin-bottom: 1.25rem;
                                    opacity: 0.4;
                                    transition: opacity 0.3s ease;
                                }

                                .manager-card-premium:hover .passive-traits-list {
                                    opacity: 0.8;
                                }

                                .passive-trait {
                                    display: flex;
                                    align-items: center;
                                    gap: 0.4rem;
                                    font-size: 0.62rem;
                                    color: white;
                                    font-weight: 700;
                                    letter-spacing: 0.02em;
                                    text-transform: uppercase;
                                }

                                .trait-bullet {
                                    width: 4px;
                                    height: 4px;
                                    background: var(--primary);
                                    border-radius: 50%;
                                    box-shadow: 0 0 5px var(--primary);
                                }

                                .traits-single-line-container {
                                    display: flex;
                                    justify-content: center;
                                    width: 100%;
                                }

                                .elite-duo-row {
                                    display: flex;
                                    align-items: center;
                                    gap: 0.6rem;
                                    flex-wrap: wrap;
                                    justify-content: center;
                                }

                                .duo-chip {
                                    position: relative;
                                    display: flex;
                                    align-items: center;
                                    background: rgba(255, 255, 255, 0.01);
                                    border: 1px solid rgba(255, 255, 255, 0.03);
                                    border-radius: 50px;
                                    padding: 0.3rem 0.6rem;
                                    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                                }

                                .duo-chip-inner {
                                    display: flex;
                                    align-items: center;
                                    gap: 0.45rem;
                                }

                                .trait-lucide-icon {
                                    color: var(--primary);
                                    opacity: 0.6;
                                    filter: drop-shadow(0 0 5px rgba(0, 255, 136, 0.2));
                                }

                                .duo-label {
                                    font-size: 0.55rem;
                                    font-weight: 900;
                                    color: rgba(255, 255, 255, 0.25);
                                    letter-spacing: 0.08em;
                                    text-transform: uppercase;
                                }

                                .manager-card-premium:hover .duo-chip {
                                    background: rgba(255, 255, 255, 0.04);
                                    border-color: rgba(0, 255, 136, 0.1);
                                    transform: translateY(-2px);
                                }

                                .manager-card-premium:hover .trait-lucide-icon {
                                    opacity: 1;
                                    color: white;
                                }

                                .manager-card-premium:hover .duo-label { 
                                    color: rgba(255, 255, 255, 0.9); 
                                }

                                .intel-trigger-wrapper {
                                    position: relative;
                                    z-index: 50;
                                }

                                .intel-button-glow {
                                    display: flex;
                                    align-items: center;
                                    gap: 0.35rem;
                                    background: rgba(0, 255, 136, 0.03);
                                    border: 1px solid rgba(0, 255, 136, 0.15);
                                    border-radius: 50px;
                                    padding: 0.3rem 0.75rem;
                                    font-size: 0.52rem;
                                    font-weight: 900;
                                    color: var(--primary);
                                    cursor: pointer;
                                    transition: all 0.3s ease;
                                    letter-spacing: 0.12em;
                                    backdrop-filter: blur(5px);
                                }

                                .intel-button-glow:hover {
                                    background: var(--primary);
                                    color: black;
                                    box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
                                    transform: scale(1.02);
                                }

                                .intelligence-hub-panel {
                                    position: absolute;
                                    top: calc(100% + 0.75rem);
                                    left: 50%;
                                    transform: translateX(-50%) translateY(-8px);
                                    width: 280px;
                                    background: rgba(6, 12, 18, 0.98);
                                    border: 1px solid rgba(0, 255, 136, 0.2);
                                    border-radius: 20px;
                                    padding: 1.25rem;
                                    opacity: 0;
                                    visibility: hidden;
                                    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                                    backdrop-filter: blur(35px);
                                    box-shadow: 0 30px 60px rgba(0,0,0,0.9), 0 0 50px rgba(0, 255, 136, 0.1);
                                    z-index: 5000;
                                    overflow: hidden;
                                }

                                .hub-scanline {
                                    position: absolute;
                                    inset: 0;
                                    height: 100%;
                                    width: 100%;
                                    background: linear-gradient(
                                        to bottom,
                                        transparent 0%,
                                        rgba(0, 255, 136, 0.02) 50%,
                                        transparent 100%
                                    );
                                    background-size: 100% 4px;
                                    pointer-events: none;
                                    opacity: 0.4;
                                }

                                .intel-trigger-wrapper:hover .intelligence-hub-panel {
                                    opacity: 1;
                                    visibility: visible;
                                    transform: translateX(-50%) translateY(0);
                                }

                                .hub-header {
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                    margin-bottom: 1.5rem;
                                    border-bottom: 1px solid rgba(255,255,255,0.06);
                                    padding-bottom: 0.75rem;
                                }

                                .hub-header-main { display: flex; align-items: center; gap: 0.8rem; }
                                .hub-identity-group { display: flex; flex-direction: column; gap: 0.1rem; text-align: left; }
                                .hub-title { font-size: 0.65rem; font-weight: 900; color: white; letter-spacing: 0.15em; }
                                .hub-subtitle { font-size: 0.55rem; font-weight: 600; color: var(--primary); opacity: 0.8; letter-spacing: 0.05em; }
                                .hub-icon-anim { animation: hub-pulse 2s infinite ease-in-out; }

                                .hub-status-bar {
                                    display: flex;
                                    align-items: center;
                                    gap: 0.4rem;
                                    font-size: 0.45rem;
                                    font-weight: 900;
                                    color: rgba(255,255,255,0.3);
                                }

                                .status-dot { width: 4px; height: 4px; background: var(--primary); border-radius: 50%; box-shadow: 0 0 6px var(--primary); }

                                .hub-traits-list {
                                    display: flex;
                                    flex-direction: column;
                                    gap: 0.75rem;
                                    margin-bottom: 1.5rem;
                                }

                                .hub-trait-row {
                                    display: flex;
                                    align-items: center;
                                    gap: 1rem;
                                    padding: 0.5rem 0.75rem;
                                    background: rgba(255,255,255,0.015);
                                    border-radius: 12px;
                                    border: 1px solid rgba(255,255,255,0.03);
                                    transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
                                }

                                .hub-trait-row:hover {
                                    background: rgba(0, 255, 136, 0.04);
                                    border-color: rgba(0, 255, 136, 0.2);
                                    transform: translateX(6px);
                                    box-shadow: 0 4px 15px rgba(0, 255, 136, 0.05);
                                }

                                .hub-trait-icon-box {
                                    width: 28px;
                                    height: 28px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    background: rgba(0, 255, 136, 0.05);
                                    border-radius: 8px;
                                    color: var(--primary);
                                }

                                .hub-trait-name {
                                    font-size: 0.72rem;
                                    font-weight: 700;
                                    color: rgba(255, 255, 255, 0.5);
                                    letter-spacing: 0.04em;
                                    text-transform: uppercase;
                                }

                                .hub-trait-row:hover .hub-trait-name {
                                    color: white;
                                }

                                .trait-dot {
                                    width: 6px;
                                    height: 6px;
                                    background: rgba(255,255,255,0.2);
                                    border-radius: 50%;
                                }

                                .hub-footer {
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    gap: 0.5rem;
                                    font-size: 0.55rem;
                                    font-weight: 800;
                                    color: rgba(255,255,255,0.15);
                                    letter-spacing: 0.15em;
                                    border-top: 1px solid rgba(255,255,255,0.05);
                                    padding-top: 1rem;
                                    text-align: center;
                                }

                                @keyframes hub-pulse {
                                    0%, 100% { opacity: 0.6; transform: scale(1); }
                                    50% { opacity: 1; transform: scale(1.1); filter: drop-shadow(0 0 10px var(--primary)); }
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
                    background: rgba(6, 12, 18, 0.95);
                    backdrop-filter: blur(20px);
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

                @media (max-width: 1024px) {
                    .premium-nav-bar { padding: 1rem 1.25rem; flex-wrap: wrap; gap: 0.75rem; }
                    .center-identity { display: none; }
                    .main-selection-title { font-size: 2.5rem; }
                    .managers-grid-refined { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); padding: 1rem; }
                    .confirmation-bar { width: 95%; padding: 1rem; bottom: 1rem; }
                    .preview-name { font-size: 1.2rem; }
                    .action-btn-neon { padding: 0.8rem 1.5rem; font-size: 0.8rem; }
                    .subtitle-premium { font-size: 0.95rem; }

                    /* Phase Overlay Mobile */
                    .phase-hero-section { min-height: 80vh; padding: 2rem 1.5rem; }
                    .phase-mega-title { font-size: 3rem; }
                    .recap-grid-premium { grid-template-columns: 1fr; gap: 2rem; }
                    .pillars-grid { grid-template-columns: 1fr; gap: 1rem; }
                    .recap-img-showcase { width: 140px; height: 140px; }
                    .phase-recap-section, .phase-pillars-section, .phase-next-section { padding: 4rem 1.5rem; }

                    .intel-modal-overlay {
                        pointer-events: auto;
                        background: rgba(0,0,0,0.6);
                        backdrop-filter: blur(8px);
                        justify-content: flex-end;
                        align-items: flex-end;
                    }

                    .intel-drawer { 
                        width: 100% !important; 
                        height: 75vh !important; 
                        border-radius: 32px 32px 0 0 !important; 
                        border-left: none;
                        border-top: 1px solid rgba(0, 255, 136, 0.3);
                        animation: slideUp 0.5s cubic-bezier(0.19, 1, 0.22, 1);
                        pointer-events: auto;
                    }

                    .drawer-header { padding: 1.5rem; text-align: center; }
                    .hub-header-main { flex-direction: column; align-items: center; gap: 1rem; }
                    .drawer-body { padding: 1.5rem; overflow-y: auto !important; }
                    
                    /* Selection Grid Mobile */
                    .managers-grid-refined { grid-template-columns: 1fr; gap: 1rem; }
                    .manager-card-premium { min-height: auto; padding: 1.5rem; }

                    @keyframes slideUp {
                        from { transform: translateY(100%); }
                        to { transform: translateY(0); }
                    }
                }

                @media (max-width: 480px) {
                    .main-selection-title { font-size: 1.8rem; }
                    .subtitle-premium { font-size: 0.85rem; }
                    .phase-mega-title { font-size: 2.2rem; }
                    .phase-hero-desc { font-size: 0.9rem; }
                    .recap-img-showcase { width: 120px; height: 120px; }
                    .recap-item-title-lg { font-size: 1.3rem; }
                }

                .intel-modal-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 9999;
                    background: transparent;
                    backdrop-filter: none;
                    display: flex;
                    justify-content: flex-end;
                    pointer-events: none;
                    overflow: hidden;
                }

                .intel-drawer {
                    width: 380px;
                    background: rgba(6, 8, 12, 0.85);
                    height: 100vh;
                    border-left: 1px solid rgba(0, 255, 136, 0.2);
                    display: flex;
                    flex-direction: column;
                    box-shadow: -20px 0 60px rgba(0,0,0,0.8);
                    animation: slideInRight 0.4s cubic-bezier(0.19, 1, 0.22, 1);
                    position: relative;
                    overflow: hidden;
                    pointer-events: none;
                    backdrop-filter: blur(30px);
                }

                .drawer-header {
                    padding: 1.25rem 1.75rem;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                    position: relative;
                    background: rgba(0,0,0,0.2);
                }

                .drawer-body {
                    flex: 1;
                    padding: 1.5rem 1.75rem;
                    overflow-y: hidden;
                    display: flex;
                    flex-direction: column;
                    gap: 1.25rem;
                }

                .intel-section-title {
                    font-size: 0.6rem;
                    font-weight: 900;
                    color: rgba(255,255,255,0.25);
                    letter-spacing: 0.25em;
                    margin-bottom: 1.25rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .intel-section-title::after { content: ""; flex: 1; height: 1px; background: rgba(255,255,255,0.05); }

                .formation-grid { display: flex; flex-wrap: wrap; gap: 0.75rem; }
                .formation-chip-large {
                    background: rgba(0, 255, 136, 0.04);
                    border: 1px solid rgba(0, 255, 136, 0.12);
                    padding: 0.6rem 1rem;
                    border-radius: 10px;
                    color: var(--primary);
                    font-weight: 800;
                    font-size: 0.8rem;
                    letter-spacing: 0.05em;
                }

                .meter-stack { display: flex; flex-direction: column; gap: 1.5rem; }
                .meter-item { display: flex; flex-direction: column; gap: 0.5rem; }
                .meter-label-row { display: flex; justify-content: space-between; align-items: center; }
                .meter-name { font-size: 0.7rem; font-weight: 800; color: white; opacity: 0.6; }
                .meter-value { font-size: 0.6rem; font-weight: 900; color: var(--primary); }
                
                .meter-track { height: 4px; background: rgba(255,255,255,0.05); border-radius: 10px; position: relative; overflow: hidden; margin-bottom: 0.25rem; }
                .meter-fill { height: 100%; background: var(--primary); border-radius: 10px; box-shadow: 0 0 10px var(--primary); transition: width 0.8s cubic-bezier(0.19, 1, 0.22, 1); }
                .meter-interpretation { font-size: 0.5rem; color: rgba(255,255,255,0.2); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }

                .bias-row { display: flex; justify-content: space-between; padding: 1.25rem; background: rgba(255,255,255,0.015); border-radius: 16px; border: 1px solid rgba(255,255,255,0.04); }
                .bias-side { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; flex: 1; }
                .bias-label { font-size: 0.6rem; font-weight: 800; color: rgba(255,255,255,0.3); letter-spacing: 0.1em; }
                .bias-val { font-size: 1rem; font-weight: 900; color: white; }
                .bias-divider { width: 1px; background: rgba(255,255,255,0.1); margin: 0 1rem; }

                .bonus-card { display: flex; align-items: center; gap: 1rem; background: rgba(255,255,255,0.01); padding: 1rem; border-radius: 14px; border: 1px solid rgba(255,255,255,0.02); margin-bottom: 0.5rem; }
                .bonus-icon-box { width: 34px; height: 34px; background: rgba(0, 255, 136, 0.04); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--primary); }
                .bonus-name { font-size: 0.75rem; font-weight: 800; color: white; }
                .bonus-desc { font-size: 0.6rem; color: rgba(255,255,255,0.25); font-weight: 600; line-height: 1.4; }

                .mobile-drawer-handle {
                    width: 100%;
                    padding: 1rem;
                    display: flex;
                    justify-content: center;
                    cursor: pointer;
                }
                .handle-bar {
                    width: 40px;
                    height: 4px;
                    background: rgba(255,255,255,0.2);
                    border-radius: 10px;
                }

                @keyframes slideInRight {
                    from { transform: translateX(100%); }
                    to { transform: translateX(0); }
                }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            `}</style>
            {isIntelOpen && intelManager && (
                <div className="intel-modal-overlay" onClick={() => setIsIntelOpen(false)}>
                    <div className="intel-drawer" onClick={(e) => e.stopPropagation()}>
                        <div className="hub-scanline"></div>

                        {isMobile && (
                            <div className="mobile-drawer-handle" onClick={() => setIsIntelOpen(false)}>
                                <div className="handle-bar"></div>
                            </div>
                        )}

                        <div className="drawer-header">
                            <div className="hub-header-main">
                                <Zap size={24} className="text-primary hub-icon-anim" />
                                <div className="hub-identity-group">
                                    <span className="hub-title" style={{ fontSize: '0.8rem' }}>TACTICAL DOSSIER</span>
                                    <h2 style={{ fontSize: '1.8rem', color: 'white', fontWeight: 900, margin: 0 }}>{intelManager.name}</h2>
                                    <span className="hub-subtitle" style={{ fontSize: '0.75rem' }}>{intelManager.style}</span>
                                </div>
                            </div>
                        </div>

                        <div className="drawer-body">
                            <div className="intel-data-section">
                                <div className="intel-section-title">PREFERRED FORMATIONS</div>
                                <div className="formation-grid">
                                    {(intelManager.formations || ['4-3-3', '4-2-3-1', '4-4-2']).map(form => (
                                        <div key={form} className="formation-chip-large">{form}</div>
                                    ))}
                                </div>
                            </div>

                            <div className="intel-data-section">
                                <div className="intel-section-title">SQUAD METERS</div>
                                {(() => {
                                    const metrics = calculateTacticalMetrics(intelManager);
                                    return (
                                        <div className="meter-stack">
                                            <div className="meter-item">
                                                <div className="meter-label-row">
                                                    <span className="meter-name">TACTICAL STABILITY</span>
                                                    <span className="meter-value">{metrics.stability}%</span>
                                                </div>
                                                <div className="meter-track">
                                                    <div className="meter-fill" style={{ width: `${metrics.stability}%` }}></div>
                                                </div>
                                                <div className="meter-interpretation">{metrics.stabilityLabel}</div>
                                            </div>
                                            <div className="meter-item">
                                                <div className="meter-label-row">
                                                    <span className="meter-name">RISK TOLERANCE</span>
                                                    <span className="meter-value">{metrics.risk}%</span>
                                                </div>
                                                <div className="meter-track">
                                                    <div className="meter-fill" style={{ width: `${metrics.risk}%` }}></div>
                                                </div>
                                                <div className="meter-interpretation">{metrics.riskLabel}</div>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>

                            <div className="intel-data-section">
                                <div className="intel-section-title">RECRUITMENT BIAS</div>
                                <div className="bias-row">
                                    <div className="bias-side">
                                        <span className="bias-label">YOUTH TRUST</span>
                                        <span className="bias-val">{intelManager.traits?.some(t => t.includes('Youth')) ? 'ELITE' : 'MODERATE'}</span>
                                    </div>
                                    <div className="bias-divider"></div>
                                    <div className="bias-side">
                                        <span className="bias-label">VETERAN USE</span>
                                        <span className="bias-val">{intelManager.reputation > 95 ? 'HIGH' : 'LOW'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="intel-data-section">
                                <div className="intel-section-title">TRAINING BONUSES</div>
                                <div className="bonus-stack">
                                    <div className="bonus-card">
                                        <div className="bonus-icon-box"><Zap size={18} /></div>
                                        <div className="bonus-info">
                                            <span className="bonus-name">Tactical Coherence</span>
                                            <span className="bonus-desc">Reduces system adaptation period by 25%.</span>
                                        </div>
                                    </div>
                                    <div className="bonus-card">
                                        <div className="bonus-icon-box"><Shield size={18} /></div>
                                        <div className="bonus-info">
                                            <span className="bonus-name">Board Confidence</span>
                                            <span className="bonus-desc">Increased protection during initial season dip.</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="hub-footer" style={{ padding: '2rem' }}>
                            <Shield size={14} />
                            <span>ENCRYPTED BOARD DATA • NOT FOR PUBLIC RELEASE</span>
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}
