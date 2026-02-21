'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, ChevronRight, ChevronLeft, Swords, Layers, Zap, Crosshair, Crown, Star, AlertTriangle, Target, Wind, ArrowLeftRight, FlaskConical, Gauge, Check, Users, Sparkles } from 'lucide-react';
import formationsData from '../../data/formations.json';
import '../entry.css';

const CATEGORY_META = {
    Balanced: { icon: Layers, color: '#00ff88', desc: 'Stability in all phases' },
    Attacking: { icon: Swords, color: '#3b82f6', desc: 'High scoring, aggressive play' },
    Defensive: { icon: Shield, color: '#f59e0b', desc: 'Compact shape & counter-attacks' },
    Possession: { icon: Target, color: '#a855f7', desc: 'Dominate midfield & tempo' },
    'Counter-Attack': { icon: Zap, color: '#ef4444', desc: 'Quick transitions & pace' },
    'Wide-Play': { icon: ArrowLeftRight, color: '#14b8a6', desc: 'Stretch the pitch using flanks' },
    Narrow: { icon: Gauge, color: '#f97316', desc: 'Attack through the middle' },
    Experimental: { icon: FlaskConical, color: '#ec4899', desc: 'Unusual & rare setups' },
};

const CATEGORIES = Object.keys(CATEGORY_META);

export default function FormationSelectPage() {
    const router = useRouter();
    const [selectedFormation, setSelectedFormation] = useState(null);
    const [activeCategory, setActiveCategory] = useState('Balanced');
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [selectedManager, setSelectedManager] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const gridRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);

        const storedTeam = localStorage.getItem('selectedTeam');
        if (storedTeam) setSelectedTeam(JSON.parse(storedTeam));

        const storedManager = localStorage.getItem('selectedManager');
        if (storedManager) setSelectedManager(JSON.parse(storedManager));
    }, []);

    const handleSelect = (formation) => {
        setSelectedFormation(formation);
        localStorage.setItem('formation', JSON.stringify({
            name: formation.name,
            defenders: formation.defenders,
            midfielders: formation.midfielders,
            forwards: formation.forwards,
        }));
    };

    const handleProceed = () => {
        if (selectedFormation) {
            setShowSuccess(true);
        }
    };

    const handleFinalProceed = () => {
        router.push('/select/goalkeeper');
    };

    const filteredFormations = formationsData.filter(f => f.category === activeCategory);

    // Generate pitch positions from the formation name
    const getPitchPositions = (formation) => {
        if (!formation) return [];
        const positions = [];
        // Remove any text in parentheses for parsing, e.g. "4-4-2 (Flat)" → "4-4-2"
        const cleanName = formation.name.replace(/\s*\(.*?\)\s*/g, '');
        const parts = cleanName.split('-').map(Number);

        // GK always present
        positions.push({ x: 50, y: 90, label: 'GK', type: 'gk' });

        if (parts.length === 3) {
            const [def, mid, fwd] = parts;
            const defSp = 80 / (def + 1);
            for (let i = 0; i < def; i++) positions.push({ x: 10 + defSp * (i + 1), y: 72, label: 'DEF', type: 'def' });
            const midSp = 80 / (mid + 1);
            for (let i = 0; i < mid; i++) positions.push({ x: 10 + midSp * (i + 1), y: 45, label: 'MID', type: 'mid' });
            const fwdSp = 80 / (fwd + 1);
            for (let i = 0; i < fwd; i++) positions.push({ x: 10 + fwdSp * (i + 1), y: 18, label: 'FWD', type: 'fwd' });
        } else if (parts.length === 4) {
            const [def, l1, l2, l3] = parts;
            const defSp = 80 / (def + 1);
            for (let i = 0; i < def; i++) positions.push({ x: 10 + defSp * (i + 1), y: 72, label: 'DEF', type: 'def' });
            const l1Sp = 80 / (l1 + 1);
            for (let i = 0; i < l1; i++) positions.push({ x: 10 + l1Sp * (i + 1), y: 54, label: 'DM', type: 'mid' });
            const l2Sp = 80 / (l2 + 1);
            for (let i = 0; i < l2; i++) positions.push({ x: 10 + l2Sp * (i + 1), y: 36, label: 'AM', type: 'mid' });
            const l3Sp = 80 / (l3 + 1);
            for (let i = 0; i < l3; i++) positions.push({ x: 10 + l3Sp * (i + 1), y: 18, label: 'FWD', type: 'fwd' });
        } else if (parts.length === 5) {
            const [def, l1, l2, l3, l4] = parts;
            const defSp = 80 / (def + 1);
            for (let i = 0; i < def; i++) positions.push({ x: 10 + defSp * (i + 1), y: 75, label: 'DEF', type: 'def' });
            const l1Sp = 80 / (l1 + 1);
            for (let i = 0; i < l1; i++) positions.push({ x: 10 + l1Sp * (i + 1), y: 58, label: 'DM', type: 'mid' });
            const l2Sp = 80 / (l2 + 1);
            for (let i = 0; i < l2; i++) positions.push({ x: 10 + l2Sp * (i + 1), y: 44, label: 'CM', type: 'mid' });
            const l3Sp = 80 / (l3 + 1);
            for (let i = 0; i < l3; i++) positions.push({ x: 10 + l3Sp * (i + 1), y: 30, label: 'AM', type: 'mid' });
            const l4Sp = 80 / (l4 + 1);
            for (let i = 0; i < l4; i++) positions.push({ x: 10 + l4Sp * (i + 1), y: 16, label: 'FWD', type: 'fwd' });
        }

        return positions;
    };

    const catMeta = CATEGORY_META[activeCategory];

    return (
        <div className="entry-page no-snap">
            <div className="stadium-bg" style={{ filter: 'brightness(0.06) grayscale(0.8)' }}></div>
            <div className="overlay-gradient"></div>

            <section className="formation-select-container">
                <main className="formation-view" style={{ maxWidth: '1400px', width: '96%' }}>

                    {/* Navigation Bar */}
                    <div className="fm-nav-bar glass">
                        <div className="nav-left-group">
                            <button onClick={() => router.push('/manager-select')} className="fm-back-btn">
                                <ChevronLeft size={20} />
                                <span>BACK TO GAFFER</span>
                            </button>
                        </div>

                        <div className="fm-center-id">
                            <div className="fm-mini-badge" style={{ borderColor: selectedTeam?.colors?.[0] || 'var(--primary)' }}>
                                {selectedTeam?.logo ? (
                                    <img src={selectedTeam.logo} alt="" className="fm-mini-logo" />
                                ) : (
                                    <Shield size={14} className="text-primary" />
                                )}
                            </div>
                            <div className="fm-id-text">
                                <span className="fm-id-label">TACTICAL LAYOUT</span>
                                <span className="fm-id-name">{selectedTeam?.name || 'TEAM'}</span>
                            </div>
                        </div>

                        <div className="phase-indicator">
                            <div className="step-count">
                                <span className="text-primary">06</span>
                                <span className="text-muted">/</span>
                                <span className="text-muted">06</span>
                            </div>
                            <div className="phase-dots">
                                <div className="dot filled"></div>
                                <div className="dot filled"></div>
                                <div className="dot filled"></div>
                                <div className="dot filled"></div>
                                <div className="dot filled"></div>
                                <div className="dot active"></div>
                            </div>
                        </div>
                    </div>

                    {/* Title Section */}
                    <div className="fm-titles">
                        <div className="fm-ornament">
                            <div className="ornament-line"></div>
                            <Crosshair size={18} className="ornament-icon" />
                            <div className="ornament-line"></div>
                        </div>
                        <h1 className="fm-mega-title">
                            SELECT <span className="text-gradient">FORMATION</span>
                        </h1>
                        <p className="fm-subtitle">
                            Your tactical DNA defines the structure and soul of your squad.
                            Choose a formation that matches your philosophy.
                        </p>
                    </div>

                    {/* Category Tabs */}
                    <div className="fm-tabs-wrapper">
                        <div className="fm-tabs">
                            {CATEGORIES.map(cat => {
                                const meta = CATEGORY_META[cat];
                                const Icon = meta.icon;
                                const isActive = activeCategory === cat;
                                const count = formationsData.filter(f => f.category === cat).length;
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => { setActiveCategory(cat); setSelectedFormation(null); setTimeout(() => gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100); }}
                                        className={`fm-tab ${isActive ? 'active' : ''}`}
                                        style={{ '--tab-color': meta.color }}
                                    >
                                        <div className="fm-tab-icon-box">
                                            <Icon size={20} />
                                            {isActive && <div className="fm-tab-icon-ring"></div>}
                                        </div>
                                        <div className="fm-tab-text">
                                            <span className="fm-tab-label">{cat.toUpperCase()}</span>
                                            <span className="fm-tab-sub">{count} formations</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Category Description */}
                    <div className="fm-cat-desc" style={{ '--cat-glow': catMeta.color }}>
                        {(() => { const CatIcon = catMeta.icon; return <CatIcon size={16} style={{ color: catMeta.color }} />; })()}
                        <span className="fm-cat-desc-text" style={{ color: catMeta.color }}>{catMeta.desc}</span>
                    </div>

                    {/* Centered Preview (when selected) */}
                    {selectedFormation && (
                        <div className="fm-preview-center">
                            <div className="fm-preview-card glass-premium">
                                <div className="fm-preview-header">
                                    <span className="fm-preview-tag">TACTICAL PREVIEW</span>
                                    <h2 className="fm-preview-name">{selectedFormation.name}</h2>
                                    <span
                                        className="fm-preview-cat"
                                        style={{
                                            color: CATEGORY_META[selectedFormation.category]?.color,
                                            borderColor: (CATEGORY_META[selectedFormation.category]?.color || '#fff') + '44',
                                            background: (CATEGORY_META[selectedFormation.category]?.color || '#fff') + '10',
                                        }}
                                    >
                                        {selectedFormation.category.toUpperCase()}
                                    </span>
                                </div>

                                <div className="fm-pitch">
                                    <div className="pitch-field">
                                        <div className="pitch-center-circle"></div>
                                        <div className="pitch-center-line"></div>
                                        <div className="pitch-box top"></div>
                                        <div className="pitch-box bottom"></div>

                                        {getPitchPositions(selectedFormation).map((pos, i) => (
                                            <div
                                                key={`${selectedFormation.name}-${i}`}
                                                className={`pitch-dot ${pos.type}`}
                                                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                                            >
                                                <span className="dot-label">{pos.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="fm-preview-desc">
                                    <p>{selectedFormation.description}</p>
                                </div>

                                <div className="fm-preview-stats-row">
                                    <div className="fm-prev-stat">
                                        <span className="fps-val">{selectedFormation.defenders}</span>
                                        <span className="fps-lbl">DEFENDERS</span>
                                    </div>
                                    <div className="fm-prev-stat">
                                        <span className="fps-val">{selectedFormation.midfielders}</span>
                                        <span className="fps-lbl">MIDFIELDERS</span>
                                    </div>
                                    <div className="fm-prev-stat">
                                        <span className="fps-val">{selectedFormation.forwards}</span>
                                        <span className="fps-lbl">FORWARDS</span>
                                    </div>
                                </div>

                                {(selectedFormation.category === 'Experimental' || selectedFormation.forwards >= 5) && (
                                    <div className="fm-warning-banner">
                                        <AlertTriangle size={14} />
                                        <span>HIGH-RISK FORMATION — Not for the faint-hearted</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Formations Grid */}
                    <div className="fm-grid" ref={gridRef}>
                        {filteredFormations.map((formation, idx) => {
                            const meta = CATEGORY_META[formation.category];
                            const isSelected = selectedFormation?.name === formation.name && selectedFormation?.category === formation.category;
                            return (
                                <button
                                    key={`${formation.category}-${formation.name}-${idx}`}
                                    onClick={() => handleSelect(formation)}
                                    className={`fm-card glass ${isSelected ? 'selected' : ''}`}
                                >
                                    <div className="fm-card-accent" style={{ background: meta?.color || 'var(--primary)' }}></div>

                                    <div className="fm-card-header">
                                        <span className="fm-card-name">{formation.name}</span>
                                    </div>

                                    <p className="fm-card-desc">{formation.description}</p>

                                    <div className="fm-card-stats">
                                        <div className="fm-stat">
                                            <Shield size={12} />
                                            <span>{formation.defenders} DEF</span>
                                        </div>
                                        <div className="fm-stat">
                                            <Layers size={12} />
                                            <span>{formation.midfielders} MID</span>
                                        </div>
                                        <div className="fm-stat">
                                            <Swords size={12} />
                                            <span>{formation.forwards} FWD</span>
                                        </div>
                                    </div>

                                    <div className="fm-card-check">
                                        <div className="check-circle">
                                            <Star size={14} fill="currentColor" />
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Bottom CTA */}
                    <div className={`fm-confirm-bar glass ${selectedFormation ? 'visible' : ''}`}>
                        <div className="fm-bar-content">
                            <div className="fm-bar-info">
                                <span className="fm-bar-tag">FORMATION LOCKED</span>
                                <h3 className="fm-bar-name">{selectedFormation?.name}</h3>
                            </div>
                            <div className="fm-bar-meta">
                                <span>{selectedFormation?.defenders} DEF</span>
                                <span className="fm-bar-sep">•</span>
                                <span>{selectedFormation?.midfielders} MID</span>
                                <span className="fm-bar-sep">•</span>
                                <span>{selectedFormation?.forwards} FWD</span>
                            </div>
                            <button onClick={handleProceed} className="fm-proceed-btn">
                                <span>DEPLOY FORMATION</span>
                                <ChevronRight size={22} />
                            </button>
                        </div>
                    </div>

                </main>
            </section>

            {/* Success Overlay */}
            {showSuccess && selectedFormation && (
                <div className="fm-success-overlay">
                    <div className="fm-success-scroll">

                        {/* Hero Section */}
                        <div className="fm-success-hero">
                            {/* Particles */}
                            <div className="fm-particle" style={{ top: '15%', left: '10%', animationDelay: '0s' }}></div>
                            <div className="fm-particle" style={{ top: '25%', right: '15%', animationDelay: '0.5s' }}></div>
                            <div className="fm-particle" style={{ top: '60%', left: '20%', animationDelay: '1s' }}></div>
                            <div className="fm-particle" style={{ top: '70%', right: '10%', animationDelay: '1.5s' }}></div>
                            <div className="fm-particle" style={{ top: '40%', left: '5%', animationDelay: '2s' }}></div>
                            <div className="fm-particle" style={{ top: '50%', right: '25%', animationDelay: '0.8s' }}></div>

                            {/* Orbit rings */}
                            <div className="fm-orbit-ring ring-1"></div>
                            <div className="fm-orbit-ring ring-2"></div>

                            <div className="fm-success-badge">
                                <Check size={32} />
                            </div>

                            <span className="fm-success-tag">TACTICAL BLUEPRINT LOCKED</span>
                            <h1 className="fm-success-title">
                                FORMATION <span className="text-gradient">{selectedFormation.name}</span>
                            </h1>
                            <p className="fm-success-sub">Your tactical DNA has been encoded. The battlefield structure is set.</p>
                        </div>

                        {/* Formation Recap */}
                        <div className="fm-success-recap">
                            <div className="fm-recap-pitch-wrapper">
                                <div className="fm-recap-pitch">
                                    <div className="pitch-field">
                                        <div className="pitch-center-circle"></div>
                                        <div className="pitch-center-line"></div>
                                        <div className="pitch-box top"></div>
                                        <div className="pitch-box bottom"></div>
                                        {getPitchPositions(selectedFormation).map((pos, i) => (
                                            <div
                                                key={`success-${i}`}
                                                className={`pitch-dot ${pos.type}`}
                                                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                                            >
                                                <span className="dot-label">{pos.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="fm-recap-stats">
                                <div className="fm-recap-stat-card glass">
                                    <Shield size={22} className="frs-icon" style={{ color: '#3b82f6' }} />
                                    <span className="frs-val">{selectedFormation.defenders}</span>
                                    <span className="frs-label">DEFENDERS</span>
                                </div>
                                <div className="fm-recap-stat-card glass">
                                    <Layers size={22} className="frs-icon" style={{ color: '#00ff88' }} />
                                    <span className="frs-val">{selectedFormation.midfielders}</span>
                                    <span className="frs-label">MIDFIELDERS</span>
                                </div>
                                <div className="fm-recap-stat-card glass">
                                    <Swords size={22} className="frs-icon" style={{ color: '#ef4444' }} />
                                    <span className="frs-val">{selectedFormation.forwards}</span>
                                    <span className="frs-label">FORWARDS</span>
                                </div>
                            </div>
                        </div>

                        {/* Context Cards */}
                        <div className="fm-success-context">
                            <div className="section-tag-row">
                                <div className="tag-line"></div>
                                <span className="section-tag">YOUR SETUP</span>
                                <div className="tag-line"></div>
                            </div>

                            <div className="fm-context-grid">
                                {selectedTeam && (
                                    <div className="fm-ctx-card glass">
                                        <div className="fm-ctx-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', borderColor: 'rgba(59, 130, 246, 0.2)' }}>
                                            {selectedTeam.logo ? (
                                                <img src={selectedTeam.logo} alt="" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                                            ) : (
                                                <Shield size={20} style={{ color: '#3b82f6' }} />
                                            )}
                                        </div>
                                        <div className="fm-ctx-text">
                                            <span className="fm-ctx-label">CLUB</span>
                                            <span className="fm-ctx-value">{selectedTeam.name}</span>
                                        </div>
                                    </div>
                                )}
                                {selectedManager && (
                                    <div className="fm-ctx-card glass">
                                        <div className="fm-ctx-icon" style={{ background: 'rgba(168, 85, 247, 0.1)', borderColor: 'rgba(168, 85, 247, 0.2)' }}>
                                            <Users size={20} style={{ color: '#a855f7' }} />
                                        </div>
                                        <div className="fm-ctx-text">
                                            <span className="fm-ctx-label">MANAGER</span>
                                            <span className="fm-ctx-value">{selectedManager.name}</span>
                                        </div>
                                    </div>
                                )}
                                <div className="fm-ctx-card glass">
                                    <div className="fm-ctx-icon" style={{ background: 'rgba(0, 255, 136, 0.1)', borderColor: 'rgba(0, 255, 136, 0.2)' }}>
                                        <Crosshair size={20} style={{ color: '#00ff88' }} />
                                    </div>
                                    <div className="fm-ctx-text">
                                        <span className="fm-ctx-label">FORMATION</span>
                                        <span className="fm-ctx-value">{selectedFormation.name}</span>
                                    </div>
                                </div>
                                <div className="fm-ctx-card glass">
                                    <div className="fm-ctx-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.2)' }}>
                                        <Sparkles size={20} style={{ color: '#f59e0b' }} />
                                    </div>
                                    <div className="fm-ctx-text">
                                        <span className="fm-ctx-label">STYLE</span>
                                        <span className="fm-ctx-value">{selectedFormation.category}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Next Mission CTA */}
                        <div className="fm-success-cta">
                            <div className="fm-cta-card glass">
                                <div className="fm-cta-top">
                                    <span className="fm-cta-label">NEXT MISSION</span>
                                    <h2 className="fm-cta-title">TIME TO BUILD YOUR <span className="text-gradient">STARTING XI</span></h2>
                                    <p className="fm-cta-desc">
                                        Your formation demands {selectedFormation.defenders} defenders, {selectedFormation.midfielders} midfielders,
                                        and {selectedFormation.forwards} forwards. Scout the best talent and assemble your dream squad.
                                    </p>
                                </div>

                                <button onClick={handleFinalProceed} className="fm-cta-btn">
                                    <span>BEGIN SQUAD SELECTION</span>
                                    <ChevronRight size={24} />
                                </button>
                            </div>
                            <p className="fm-footer-text">FootballVerse • Kickoff Arena • Season 2026/27</p>
                        </div>

                    </div>
                </div>
            )}

            <style jsx>{`
                .formation-select-container {
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    padding: 3rem 1rem;
                    animation: containerFadeIn 0.6s ease-out;
                }
                @keyframes containerFadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* Nav Bar */
                .fm-nav-bar {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 1.25rem 2.5rem;
                    position: sticky; top: 0; z-index: 2000;
                    border: 1px solid rgba(255,255,255,0.08);
                    margin-bottom: 3rem;
                    background: rgba(10, 10, 15, 0.6);
                    backdrop-filter: blur(20px);
                    border-radius: 20px;
                }
                .fm-back-btn {
                    display: flex; align-items: center; gap: 0.8rem;
                    background: rgba(0, 255, 136, 0.05);
                    border: 1px solid rgba(0, 255, 136, 0.25);
                    padding: 0.7rem 1.5rem; border-radius: 14px;
                    font-size: 0.7rem; font-weight: 900; color: var(--primary);
                    letter-spacing: 0.15em;
                    transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    cursor: pointer;
                }
                .fm-back-btn:hover {
                    background: var(--primary); color: black;
                    transform: translateX(-4px);
                    box-shadow: 0 0 30px rgba(0, 255, 136, 0.4);
                }
                .fm-center-id {
                    display: flex; align-items: center; gap: 1rem;
                    background: rgba(255, 255, 255, 0.03);
                    padding: 0.5rem 1.5rem; border-radius: 50px;
                    border: 1px solid rgba(255,255,255,0.06);
                }
                .fm-mini-badge {
                    width: 30px; height: 30px;
                    border: 1.5px solid var(--primary); border-radius: 8px;
                    display: flex; align-items: center; justify-content: center;
                    background: rgba(0,0,0,0.2); overflow: hidden;
                }
                .fm-mini-logo { width: 100%; height: 100%; object-fit: contain; }
                .fm-id-text { display: flex; flex-direction: column; gap: 0.05rem; }
                .fm-id-label { font-size: 0.5rem; font-weight: 900; color: rgba(255,255,255,0.3); letter-spacing: 0.15em; }
                .fm-id-name { font-size: 0.8rem; font-weight: 900; color: white; letter-spacing: 0.05em; }

                .phase-indicator { display: flex; flex-direction: column; align-items: flex-end; gap: 0.4rem; }
                .step-count { display: flex; gap: 0.3rem; font-size: 1rem; font-weight: 900; letter-spacing: -0.05em; }
                .text-primary { color: var(--primary); }
                .text-muted { color: rgba(255,255,255,0.2); }
                .phase-dots { display: flex; gap: 0.35rem; }
                .dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(255,255,255,0.1); transition: 0.3s; }
                .dot.filled { background: var(--primary); opacity: 0.4; }
                .dot.active { background: var(--primary); transform: scale(1.4); box-shadow: 0 0 10px var(--primary); }

                /* Titles */
                .fm-titles { text-align: center; margin-bottom: 3rem; }
                .fm-ornament { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-bottom: 1rem; }
                .ornament-line { width: 40px; height: 1px; background: var(--primary); opacity: 0.3; }
                .ornament-icon { color: var(--primary); }
                .fm-mega-title {
                    font-size: clamp(2.5rem, 7vw, 4.2rem);
                    font-weight: 900; color: white;
                    letter-spacing: -0.03em; margin-bottom: 1rem;
                }
                .text-gradient {
                    background: linear-gradient(135deg, #00ff88, #3b82f6);
                    -webkit-background-clip: text; background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .fm-subtitle {
                    font-size: 1.1rem; color: rgba(255,255,255,0.4);
                    line-height: 1.7; max-width: 550px; margin: 0 auto;
                }

                /* Category Tabs */
                .fm-tabs-wrapper {
                    margin-bottom: 1.5rem;
                    max-width: 1000px;
                    margin-left: auto;
                    margin-right: auto;
                }

                .fm-tabs {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 0.75rem;
                    padding: 0;
                }

                .fm-tab {
                    display: flex; align-items: center; gap: 1rem;
                    padding: 1rem 1.25rem; border-radius: 18px;
                    border: 1px solid rgba(255,255,255,0.06);
                    background: rgba(255, 255, 255, 0.02);
                    color: rgba(255,255,255,0.35);
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                    white-space: nowrap;
                    position: relative;
                    overflow: hidden;
                }

                .fm-tab::before {
                    content: '';
                    position: absolute; inset: 0;
                    background: radial-gradient(circle at 30% 50%, var(--tab-color), transparent 70%);
                    opacity: 0; transition: opacity 0.4s;
                }

                .fm-tab:hover {
                    background: rgba(255,255,255,0.04);
                    border-color: rgba(255,255,255,0.12);
                    transform: translateY(-3px);
                    color: white;
                }
                .fm-tab:hover::before { opacity: 0.06; }

                .fm-tab.active {
                    background: rgba(0,0,0,0.3);
                    border-color: var(--tab-color);
                    color: white;
                    box-shadow: 0 0 30px rgba(0, 0, 0, 0.4), inset 0 0 20px rgba(0,0,0,0.2);
                    transform: translateY(-3px);
                }
                .fm-tab.active::before { opacity: 0.12; }

                /* Icon Box */
                .fm-tab-icon-box {
                    position: relative;
                    width: 42px; height: 42px;
                    border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.06);
                    color: var(--tab-color);
                    transition: all 0.4s;
                    flex-shrink: 0;
                }

                .fm-tab:hover .fm-tab-icon-box {
                    background: rgba(255,255,255,0.08);
                    border-color: rgba(255,255,255,0.12);
                }

                .fm-tab.active .fm-tab-icon-box {
                    background: var(--tab-color);
                    color: black;
                    border-color: var(--tab-color);
                    box-shadow: 0 0 20px color-mix(in srgb, var(--tab-color) 40%, transparent);
                }

                .fm-tab-icon-ring {
                    position: absolute; inset: -6px;
                    border: 1.5px solid var(--tab-color);
                    border-radius: 16px;
                    opacity: 0.3;
                    animation: tabRingPulse 2s ease-out infinite;
                }

                @keyframes tabRingPulse {
                    0% { transform: scale(0.9); opacity: 0.4; }
                    100% { transform: scale(1.3); opacity: 0; }
                }

                /* Tab Text */
                .fm-tab-text {
                    display: flex; flex-direction: column; gap: 0.1rem;
                    text-align: left;
                }

                .fm-tab-label {
                    font-size: 0.72rem; font-weight: 900;
                    letter-spacing: 0.08em;
                }

                .fm-tab-sub {
                    font-size: 0.55rem; font-weight: 600;
                    opacity: 0.45;
                    letter-spacing: 0.02em;
                }

                .fm-tab.active .fm-tab-label { color: var(--tab-color); }
                .fm-tab.active .fm-tab-sub { opacity: 0.6; }

                /* Category Description */
                .fm-cat-desc {
                    display: flex; align-items: center; justify-content: center;
                    gap: 0.6rem; margin-bottom: 3rem;
                    padding: 0.55rem 1.5rem;
                    background: rgba(255,255,255,0.02);
                    border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 50px; width: fit-content;
                    margin-left: auto; margin-right: auto;
                    box-shadow: 0 0 20px color-mix(in srgb, var(--cat-glow, #00ff88) 8%, transparent);
                }
                .fm-cat-desc-text {
                    font-size: 0.72rem; font-weight: 700;
                    letter-spacing: 0.08em;
                }

                /* Centered Preview */
                .fm-preview-center {
                    display: flex; justify-content: center;
                    margin-bottom: 3.5rem;
                    animation: previewSlideIn 0.5s ease-out;
                }
                @keyframes previewSlideIn {
                    from { opacity: 0; transform: translateY(20px) scale(0.97); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .fm-preview-card {
                    max-width: 480px; width: 100%;
                    padding: 2.5rem 2rem; border-radius: 28px;
                    background: rgba(10, 10, 15, 0.8);
                    border: 1px solid rgba(255,255,255,0.08);
                    backdrop-filter: blur(20px);
                }
                .glass-premium {
                    background: rgba(10, 10, 15, 0.7);
                    backdrop-filter: blur(20px);
                }
                .fm-preview-header { text-align: center; margin-bottom: 1.5rem; }
                .fm-preview-tag {
                    font-size: 0.55rem; font-weight: 900; color: var(--primary);
                    letter-spacing: 0.3em; opacity: 0.5; display: block; margin-bottom: 0.5rem;
                }
                .fm-preview-name {
                    font-size: 2.8rem; font-weight: 900; color: white;
                    letter-spacing: -0.03em; margin-bottom: 0.75rem;
                }
                .fm-preview-cat {
                    display: inline-block; font-size: 0.6rem;
                    font-weight: 900; letter-spacing: 0.15em;
                    padding: 0.35rem 1rem; border-radius: 10px; border: 1px solid;
                }

                /* Pitch */
                .fm-pitch { margin: 1.5rem 0; }
                .pitch-field {
                    position: relative; width: 100%; aspect-ratio: 3 / 4;
                    background: linear-gradient(180deg, rgba(0, 80, 30, 0.25) 0%, rgba(0, 60, 20, 0.35) 100%);
                    border: 2px solid rgba(255,255,255,0.1);
                    border-radius: 16px; overflow: hidden;
                }
                .pitch-center-line {
                    position: absolute; top: 50%; left: 0; right: 0;
                    height: 1px; background: rgba(255,255,255,0.1);
                }
                .pitch-center-circle {
                    position: absolute; top: 50%; left: 50%;
                    width: 60px; height: 60px;
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 50%; transform: translate(-50%, -50%);
                }
                .pitch-box {
                    position: absolute; left: 25%; right: 25%; height: 15%;
                    border: 1px solid rgba(255,255,255,0.08);
                }
                .pitch-box.top { top: 0; border-top: none; }
                .pitch-box.bottom { bottom: 0; border-bottom: none; }

                .pitch-dot {
                    position: absolute; transform: translate(-50%, -50%);
                    display: flex; flex-direction: column; align-items: center; gap: 0.25rem;
                    animation: dotAppear 0.5s ease-out backwards;
                }
                .pitch-dot::before {
                    content: ''; width: 14px; height: 14px; border-radius: 50%;
                    background: var(--primary);
                    box-shadow: 0 0 12px rgba(0, 255, 136, 0.5);
                }
                .pitch-dot.gk::before { background: #f59e0b; box-shadow: 0 0 12px rgba(245, 158, 11, 0.5); }
                .pitch-dot.fwd::before { background: #ef4444; box-shadow: 0 0 12px rgba(239, 68, 68, 0.5); }
                .pitch-dot.def::before { background: #3b82f6; box-shadow: 0 0 12px rgba(59, 130, 246, 0.5); }
                .pitch-dot.mid::before { background: var(--primary); }
                .dot-label { font-size: 0.45rem; font-weight: 900; color: rgba(255,255,255,0.5); letter-spacing: 0.05em; }
                @keyframes dotAppear {
                    from { opacity: 0; transform: translate(-50%, -50%) scale(0); }
                    to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                }

                .fm-preview-desc { text-align: center; margin-bottom: 1.25rem; }
                .fm-preview-desc p { font-size: 0.85rem; color: rgba(255,255,255,0.4); line-height: 1.7; }

                .fm-preview-stats-row {
                    display: flex; justify-content: center; gap: 2rem;
                    padding: 1.25rem 0; border-top: 1px solid rgba(255,255,255,0.05);
                }
                .fm-prev-stat { text-align: center; }
                .fps-val { display: block; font-size: 1.8rem; font-weight: 900; color: white; }
                .fps-lbl { font-size: 0.55rem; font-weight: 800; color: rgba(255,255,255,0.3); letter-spacing: 0.1em; }

                .fm-warning-banner {
                    display: flex; align-items: center; justify-content: center; gap: 0.5rem;
                    padding: 0.75rem 1.25rem;
                    background: rgba(239, 68, 68, 0.08);
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    border-radius: 12px; margin-top: 1.25rem;
                    color: #ef4444; font-size: 0.65rem; font-weight: 800; letter-spacing: 0.08em;
                }

                /* Formation Grid */
                .fm-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 1.25rem;
                    margin-bottom: 10rem;
                }
                .fm-card {
                    position: relative; text-align: left;
                    padding: 1.75rem 1.5rem;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    border-radius: 22px; cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                    overflow: hidden;
                }
                .fm-card:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(255,255,255,0.15);
                    transform: translateY(-6px);
                }
                .fm-card.selected {
                    background: rgba(0, 255, 136, 0.05);
                    border-color: var(--primary); border-width: 2px;
                    box-shadow: 0 0 40px rgba(0, 255, 136, 0.1);
                }
                .fm-card-accent {
                    position: absolute; top: 0; left: 0; right: 0; height: 3px;
                    opacity: 0; transition: opacity 0.4s;
                }
                .fm-card:hover .fm-card-accent,
                .fm-card.selected .fm-card-accent { opacity: 1; }

                .fm-card-header {
                    display: flex; justify-content: space-between;
                    align-items: center; margin-bottom: 0.75rem;
                }
                .fm-card-name {
                    font-size: 1.6rem; font-weight: 900; color: white;
                    letter-spacing: -0.02em;
                }
                .fm-card-desc {
                    font-size: 0.8rem; color: rgba(255,255,255,0.35);
                    line-height: 1.6; margin-bottom: 1.25rem;
                }
                .fm-card-stats { display: flex; gap: 1rem; }
                .fm-stat {
                    display: flex; align-items: center; gap: 0.4rem;
                    font-size: 0.65rem; font-weight: 800;
                    color: rgba(255,255,255,0.45); letter-spacing: 0.05em;
                }

                .fm-card-check {
                    position: absolute; top: 1.25rem; right: 1.25rem;
                    opacity: 0; transform: scale(0.5);
                    transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .fm-card.selected .fm-card-check { opacity: 1; transform: scale(1); }
                .check-circle {
                    width: 32px; height: 32px;
                    background: var(--primary); color: black; border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 0 20px rgba(0, 255, 136, 0.4);
                }

                /* Confirmation Bar */
                .fm-confirm-bar {
                    position: fixed; bottom: 2rem; left: 50%;
                    transform: translateX(-50%) translateY(150%);
                    width: calc(100% - 4rem); max-width: 900px;
                    padding: 1.25rem 2.5rem; border-radius: 24px;
                    border: 1px solid rgba(0, 255, 136, 0.3);
                    z-index: 3000;
                    box-shadow: 0 25px 60px -12px rgba(0,0,0,0.8);
                    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    background: rgba(10, 10, 15, 0.85);
                    backdrop-filter: blur(30px);
                }
                .fm-confirm-bar.visible { transform: translateX(-50%) translateY(0); }
                .fm-bar-content { display: flex; justify-content: space-between; align-items: center; }
                .fm-bar-info { display: flex; flex-direction: column; gap: 0.15rem; }
                .fm-bar-tag { font-size: 0.55rem; font-weight: 900; color: var(--primary); letter-spacing: 0.15em; }
                .fm-bar-name { font-size: 1.6rem; color: white; font-weight: 900; margin: 0; }
                .fm-bar-meta {
                    display: flex; align-items: center; gap: 0.5rem;
                    font-size: 0.75rem; font-weight: 800;
                    color: rgba(255,255,255,0.4); letter-spacing: 0.05em;
                }
                .fm-bar-sep { opacity: 0.3; }
                .fm-proceed-btn {
                    display: flex; align-items: center; gap: 1rem;
                    background: var(--primary); color: black;
                    padding: 1rem 2.5rem; border-radius: 14px;
                    font-weight: 900; font-size: 0.9rem; letter-spacing: 0.05em;
                    border: none; cursor: pointer; transition: 0.3s;
                    box-shadow: 0 0 25px rgba(0, 255, 136, 0.3);
                }
                .fm-proceed-btn:hover {
                    transform: scale(1.05);
                    box-shadow: 0 0 45px rgba(0, 255, 136, 0.5);
                }

                /* ============ SUCCESS OVERLAY ============ */
                .fm-success-overlay {
                    position: fixed; inset: 0; z-index: 5000;
                    background: rgba(2, 4, 10, 0.97);
                    overflow-y: auto; overflow-x: hidden;
                    animation: overlayFadeIn 0.6s ease-out;
                }
                @keyframes overlayFadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .fm-success-scroll {
                    min-height: 100vh;
                }

                /* Hero */
                .fm-success-hero {
                    min-height: 100vh;
                    display: flex; flex-direction: column;
                    align-items: center; justify-content: center;
                    position: relative; padding: 3rem 2rem;
                    overflow: hidden;
                }

                .fm-particle {
                    position: absolute; width: 4px; height: 4px;
                    background: var(--primary); border-radius: 50%;
                    animation: particleFloat 4s ease-in-out infinite;
                    box-shadow: 0 0 10px var(--primary);
                }
                @keyframes particleFloat {
                    0%, 100% { transform: translateY(0) scale(1); opacity: 0.6; }
                    50% { transform: translateY(-30px) scale(1.5); opacity: 1; }
                }

                .fm-orbit-ring {
                    position: absolute; border-radius: 50%;
                    border: 1px solid rgba(0, 255, 136, 0.06);
                }
                .ring-1 {
                    width: 500px; height: 500px;
                    top: 50%; left: 50%; transform: translate(-50%, -50%);
                    animation: orbitSpin 25s linear infinite;
                    border-top-color: rgba(0, 255, 136, 0.15);
                }
                .ring-2 {
                    width: 700px; height: 700px;
                    top: 50%; left: 50%; transform: translate(-50%, -50%);
                    animation: orbitSpin 40s linear infinite reverse;
                    border-right-color: rgba(59, 130, 246, 0.1);
                }
                @keyframes orbitSpin { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }

                .fm-success-badge {
                    width: 80px; height: 80px; border-radius: 50%;
                    background: linear-gradient(135deg, #00ff88, #00cc6a);
                    display: flex; align-items: center; justify-content: center;
                    color: black; margin-bottom: 2rem;
                    box-shadow: 0 0 60px rgba(0, 255, 136, 0.4);
                    animation: badgePop 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.3s both;
                }
                @keyframes badgePop {
                    from { transform: scale(0); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }

                .fm-success-tag {
                    font-size: 0.7rem; font-weight: 900; color: var(--primary);
                    letter-spacing: 0.3em; margin-bottom: 1.5rem;
                    animation: fadeSlideUp 0.6s ease-out 0.5s both;
                }

                .fm-success-title {
                    font-size: clamp(2.5rem, 8vw, 5rem);
                    font-weight: 900; color: white;
                    letter-spacing: -0.03em; text-align: center;
                    margin-bottom: 1.25rem;
                    animation: fadeSlideUp 0.6s ease-out 0.7s both;
                }

                .fm-success-sub {
                    font-size: 1.15rem; color: rgba(255,255,255,0.4);
                    text-align: center; max-width: 500px; line-height: 1.7;
                    animation: fadeSlideUp 0.6s ease-out 0.9s both;
                }

                @keyframes fadeSlideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* Formation Recap */
                .fm-success-recap {
                    padding: 5rem 2rem;
                    display: flex; flex-direction: column; align-items: center;
                    max-width: 700px; margin: 0 auto; width: 100%;
                }

                .fm-recap-pitch-wrapper {
                    width: 100%; max-width: 380px; margin-bottom: 3rem;
                }

                .fm-recap-pitch {
                    border-radius: 20px; overflow: hidden;
                    border: 1px solid rgba(255,255,255,0.08);
                    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                }

                .fm-recap-stats {
                    display: flex; gap: 1.5rem; width: 100%; justify-content: center;
                }

                .fm-recap-stat-card {
                    flex: 1; max-width: 180px;
                    padding: 2rem 1.5rem; border-radius: 20px;
                    display: flex; flex-direction: column;
                    align-items: center; gap: 0.75rem;
                    border: 1px solid rgba(255,255,255,0.06);
                    text-align: center;
                    transition: all 0.3s;
                }
                .fm-recap-stat-card:hover {
                    border-color: rgba(255,255,255,0.12);
                    transform: translateY(-4px);
                }

                .frs-icon { opacity: 0.8; }
                .frs-val {
                    font-size: 2.5rem; font-weight: 900; color: white;
                    line-height: 1;
                }
                .frs-label {
                    font-size: 0.55rem; font-weight: 900;
                    color: rgba(255,255,255,0.3); letter-spacing: 0.15em;
                }

                /* Context Cards */
                .fm-success-context {
                    padding: 4rem 2rem;
                    max-width: 800px; margin: 0 auto; width: 100%;
                }

                .section-tag-row {
                    display: flex; align-items: center;
                    justify-content: center; gap: 1rem;
                    margin-bottom: 2.5rem;
                }
                .tag-line { width: 40px; height: 1px; background: rgba(255,255,255,0.1); }
                .section-tag {
                    font-size: 0.65rem; font-weight: 900;
                    color: var(--primary); letter-spacing: 0.25em;
                }

                .fm-context-grid {
                    display: grid; grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }

                .fm-ctx-card {
                    display: flex; align-items: center; gap: 1rem;
                    padding: 1.25rem 1.5rem; border-radius: 18px;
                    border: 1px solid rgba(255,255,255,0.06);
                    transition: all 0.3s;
                }
                .fm-ctx-card:hover {
                    border-color: rgba(255,255,255,0.12);
                    transform: translateY(-3px);
                }

                .fm-ctx-icon {
                    width: 44px; height: 44px; border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    flex-shrink: 0; border: 1px solid;
                }
                .fm-ctx-text { display: flex; flex-direction: column; gap: 0.15rem; }
                .fm-ctx-label {
                    font-size: 0.5rem; font-weight: 900;
                    color: rgba(255,255,255,0.3); letter-spacing: 0.15em;
                }
                .fm-ctx-value {
                    font-size: 1rem; font-weight: 900; color: white;
                }

                /* Next Mission CTA */
                .fm-success-cta {
                    padding: 5rem 2rem 4rem;
                    display: flex; flex-direction: column; align-items: center;
                    max-width: 700px; margin: 0 auto; width: 100%;
                }

                .fm-cta-card {
                    width: 100%; padding: 3.5rem 3rem;
                    border-radius: 28px; text-align: center;
                    border: 1px solid rgba(0, 255, 136, 0.12);
                    background: rgba(0, 255, 136, 0.02);
                    margin-bottom: 2rem;
                }

                .fm-cta-label {
                    font-size: 0.6rem; font-weight: 900;
                    color: var(--primary); letter-spacing: 0.3em;
                    display: block; margin-bottom: 1rem;
                }

                .fm-cta-title {
                    font-size: clamp(1.8rem, 4vw, 2.8rem);
                    font-weight: 900; color: white;
                    letter-spacing: -0.02em; margin-bottom: 1.25rem;
                }

                .fm-cta-desc {
                    font-size: 1rem; color: rgba(255,255,255,0.4);
                    line-height: 1.7; max-width: 450px; margin: 0 auto 2.5rem;
                }

                .fm-cta-btn {
                    display: inline-flex; align-items: center; gap: 1rem;
                    background: var(--primary); color: black;
                    padding: 1.1rem 3rem; border-radius: 16px;
                    font-weight: 900; font-size: 1rem; letter-spacing: 0.05em;
                    border: none; cursor: pointer; transition: all 0.3s;
                    box-shadow: 0 0 35px rgba(0, 255, 136, 0.3);
                }
                .fm-cta-btn:hover {
                    transform: scale(1.05);
                    box-shadow: 0 0 55px rgba(0, 255, 136, 0.5);
                }

                .fm-footer-text {
                    font-size: 0.7rem; color: rgba(255,255,255,0.15);
                    letter-spacing: 0.1em; text-align: center;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .fm-nav-bar { padding: 1rem; flex-wrap: wrap; gap: 0.75rem; }
                    .fm-center-id { display: none; }
                    .fm-mega-title { font-size: 2.5rem; }
                    .fm-subtitle { font-size: 0.95rem; }
                    .fm-tabs { grid-template-columns: repeat(2, 1fr); gap: 0.5rem; }
                    .fm-tab { padding: 0.75rem 0.85rem; gap: 0.7rem; }
                    .fm-tab-icon-box { width: 34px; height: 34px; }
                    .fm-grid { grid-template-columns: 1fr; }
                    .fm-preview-name { font-size: 2rem; }
                    .fm-confirm-bar { width: 95%; padding: 1rem; }
                    .fm-bar-content { flex-wrap: wrap; gap: 0.75rem; justify-content: center; }
                    .fm-bar-meta { display: none; }
                    .fm-bar-name { font-size: 1.2rem; }
                    .fm-proceed-btn {
                        width: 100%; justify-content: center;
                        padding: 0.85rem 1.5rem; font-size: 0.8rem;
                    }

                    /* Success overlay mobile */
                    .fm-success-title { font-size: 2.5rem; }
                    .fm-success-sub { font-size: 0.95rem; }
                    .fm-recap-stats { flex-direction: column; align-items: center; }
                    .fm-recap-stat-card { max-width: 100%; width: 100%; }
                    .fm-context-grid { grid-template-columns: 1fr; }
                    .fm-cta-card { padding: 2.5rem 1.75rem; }
                    .fm-cta-title { font-size: 1.6rem; }
                    .fm-cta-btn { width: 100%; justify-content: center; padding: 1rem 2rem; font-size: 0.85rem; }
                }
            `}</style>
        </div>
    );
}
