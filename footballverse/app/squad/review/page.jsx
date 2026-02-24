'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    Shield,
    User,
    Layers,
    ChevronLeft,
    ChevronRight,
    Edit3,
    CheckCircle2,
    Play,
    Star,
    Trophy,
    Target,
    Crown
} from 'lucide-react';
import '../../entry.css';

export default function SquadReviewPage() {
    const router = useRouter();

    const [formation, setFormation] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [selectedManager, setSelectedManager] = useState(null);
    const [gk, setGk] = useState(null);
    const [defenders, setDefenders] = useState([]);
    const [midfielders, setMidfielders] = useState([]);
    const [forwards, setForwards] = useState([]);
    const [userCaptainId, setUserCaptainId] = useState(null);

    useEffect(() => {
        const storedFormation = localStorage.getItem('formation');
        const storedTeam = localStorage.getItem('selectedTeam');
        const storedManager = localStorage.getItem('selectedManager');
        const storedGK = localStorage.getItem('goalkeeper');
        const storedDefs = localStorage.getItem('defenders');
        const storedMids = localStorage.getItem('midfielders');
        const storedFwds = localStorage.getItem('forwards');
        const storedCap = localStorage.getItem('selectedCaptain');

        if (storedFormation) setFormation(JSON.parse(storedFormation));
        if (storedTeam) setSelectedTeam(JSON.parse(storedTeam));
        if (storedManager) setSelectedManager(JSON.parse(storedManager));
        if (storedGK) setGk(JSON.parse(storedGK));
        if (storedDefs) setDefenders(JSON.parse(storedDefs));
        if (storedMids) setMidfielders(JSON.parse(storedMids));
        if (storedFwds) setForwards(JSON.parse(storedFwds));
        if (storedCap) setUserCaptainId(storedCap);

        if (!storedFormation) {
            router.push('/formation-select');
        }
    }, [router]);

    const handleSetCaptain = (id) => {
        setUserCaptainId(id);
        localStorage.setItem('selectedCaptain', id);
    };

    const pitchPositions = useMemo(() => {
        if (!formation) return [];
        const positions = [];
        const cleanName = formation.name.replace(/\s*\(.*?\)\s*/g, '');
        const parts = cleanName.split('-').map(Number);

        // GK always present
        positions.push({ x: 50, y: 88, type: 'gk', player: gk });

        if (parts.length === 3) {
            const [defCount, midCount, fwdCount] = parts;
            const defSp = 80 / (defCount + 1);
            for (let i = 0; i < defCount; i++) positions.push({ x: 10 + defSp * (i + 1), y: 70, type: 'def', player: defenders[i] });
            const midSp = 80 / (midCount + 1);
            for (let i = 0; i < midCount; i++) positions.push({ x: 10 + midSp * (i + 1), y: 44, type: 'mid', player: midfielders[i] });
            const fwdSp = 80 / (fwdCount + 1);
            for (let i = 0; i < fwdCount; i++) positions.push({ x: 10 + fwdSp * (i + 1), y: 18, type: 'fwd', player: forwards[i] });
        } else if (parts.length === 4) {
            const [defCount, l1, l2, l3] = parts;
            const defSp = 80 / (defCount + 1);
            for (let i = 0; i < defCount; i++) positions.push({ x: 10 + defSp * (i + 1), y: 72, type: 'def', player: defenders[i] });

            // Middle parts are usually midfielders unless it's the last one
            const midParts = [l1, l2];
            const midY = [54, 36];
            let mIdx = 0;
            for (let j = 0; j < 2; j++) {
                const sp = 80 / (midParts[j] + 1);
                for (let i = 0; i < midParts[j]; i++) {
                    positions.push({ x: 10 + sp * (i + 1), y: midY[j], type: 'mid', player: midfielders[mIdx++] });
                }
            }

            const fwdSp = 80 / (l3 + 1);
            for (let i = 0; i < l3; i++) positions.push({ x: 10 + fwdSp * (i + 1), y: 18, type: 'fwd', player: forwards[i] });
        } else if (parts.length === 5) {
            const [defCount, l1, l2, l3, l4] = parts;
            const defSp = 80 / (defCount + 1);
            for (let i = 0; i < defCount; i++) positions.push({ x: 10 + defSp * (i + 1), y: 74, type: 'def', player: defenders[i] });

            const midParts = [l1, l2, l3];
            const midY = [58, 44, 30];
            let mIdx = 0;
            for (let j = 0; j < 3; j++) {
                const sp = 80 / (midParts[j] + 1);
                for (let i = 0; i < midParts[j]; i++) {
                    positions.push({ x: 10 + sp * (i + 1), y: midY[j], type: 'mid', player: midfielders[mIdx++] });
                }
            }

            const fwdSp = 80 / (l4 + 1);
            for (let i = 0; i < l4; i++) positions.push({ x: 10 + fwdSp * (i + 1), y: 16, type: 'fwd', player: forwards[i] });
        }

        return positions;
    }, [formation, gk, defenders, midfielders, forwards]);

    const chemistryLines = useMemo(() => {
        if (pitchPositions.length === 0) return [];
        const lines = [];
        const defs = pitchPositions.filter(p => p.type === 'def');
        const mids = pitchPositions.filter(p => p.type === 'mid');
        const fwds = pitchPositions.filter(p => p.type === 'fwd');

        const connectRows = (rowA, rowB, isOverload) => {
            rowA.forEach(a => {
                rowB.forEach(b => {
                    const dist = Math.abs(a.x - b.x);
                    if (dist < 35) { // Only connect nearby players for a clean look
                        lines.push({
                            x1: a.x, y1: a.y,
                            x2: b.x, y2: b.y,
                            color: isOverload ? 'rgba(245, 158, 11, 0.4)' : 'rgba(0, 255, 136, 0.2)'
                        });
                    }
                });
            });
        };

        const defOverload = defs.length > 4;
        const midOverload = mids.length > 5;
        const fwdOverload = fwds.length > 3;

        connectRows(defs, mids, defOverload);
        connectRows(mids, fwds, midOverload || fwdOverload);

        return lines;
    }, [pitchPositions]);

    const handleStartCareer = () => {
        // Ultimate goal page
        router.push('/dashboard');
    };

    const captain = useMemo(() => {
        if (userCaptainId) return userCaptainId;
        if (pitchPositions.length === 0) return null;
        let highest = pitchPositions.find(p => p.player) || pitchPositions[0];
        pitchPositions.forEach(p => {
            if (p.player && p.player.rating > (highest.player?.rating || 0)) {
                highest = p;
            }
        });
        return highest.player?.id;
    }, [pitchPositions, userCaptainId]);

    return (
        <div className="entry-page no-snap">
            <div className="stadium-bg rev-stadium-bg"></div>
            <div className="overlay-gradient" style={{ background: 'radial-gradient(circle at center, transparent 0%, rgba(2, 4, 10, 0.6) 100%)' }}></div>

            <section className="rev-container">
                <main className="rev-main">

                    {/* 1. TOP CONTEXT BAR */}
                    <div className="rev-context-bar glass">
                        <div className="rev-ctx-item">
                            <Layers className="rev-ctx-icon text-accent" size={18} />
                            <div className="rev-ctx-text">
                                <span className="rev-ctx-label">FORMATION</span>
                                <span className="rev-ctx-val">{formation?.name || '4-3-3'}</span>
                            </div>
                        </div>
                        <div className="rev-ctx-sep"></div>
                        <div className="rev-ctx-item">
                            <Shield className="rev-ctx-icon text-primary" size={18} />
                            <div className="rev-ctx-text">
                                <span className="rev-ctx-label">TEAM</span>
                                <span className="rev-ctx-val">{selectedTeam?.name || 'ARSENAL'}</span>
                            </div>
                        </div>
                        <div className="rev-ctx-sep"></div>
                        <div className="rev-ctx-item">
                            <User className="rev-ctx-icon text-white" size={18} />
                            <div className="rev-ctx-text">
                                <span className="rev-ctx-label">MANAGER</span>
                                <span className="rev-ctx-val">{selectedManager?.name || 'PEP GUARDIOLA'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="rev-header">
                        <h1 className="rev-title">REVIEW YOUR <span className="text-gradient">SQUAD</span></h1>
                        <p className="rev-subtitle">This is your final lineup. Make changes if needed.</p>

                        <div className="rev-cap-instruction glass">
                            <Star size={14} className="text-amber-400" fill="currentColor" />
                            <span>Select any player on the pitch or list to appoint your <strong>Captain</strong></span>
                        </div>
                    </div>

                    {/* 2. MAIN ATTRACTION: PITCH VIEW */}
                    <div className="rev-pitch-section">
                        <div className="rev-pitch-card glass">
                            <div className="pitch-canvas">
                                {/* Field Markings */}
                                <div className="pitch-center-circle"></div>
                                <div className="pitch-center-line"></div>
                                <div className="pitch-penalty-top"></div>
                                <div className="pitch-penalty-bottom"></div>

                                {/* Chemistry Lines SVG Overlay */}
                                <svg className="pitch-links" viewBox="0 0 100 100" preserveAspectRatio="none">
                                    {chemistryLines.map((line, i) => (
                                        <line
                                            key={i}
                                            x1={line.x1} y1={line.y1}
                                            x2={line.x2} y2={line.y2}
                                            stroke={line.color}
                                            strokeWidth="0.15"
                                            strokeDasharray="0.5, 1.5"
                                            className="chim-line"
                                        />
                                    ))}
                                </svg>

                                {pitchPositions.map((pos, idx) => (
                                    <div
                                        key={idx}
                                        className={`pitch-player ${pos.type} ${pos.player ? 'clickable' : ''}`}
                                        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                                        onClick={() => pos.player && handleSetCaptain(pos.player.id)}
                                    >
                                        <div className="player-avatar-wrapper">
                                            <div className="player-avatar-glow"></div>

                                            {/* Captain Badge */}
                                            {pos.player?.id === captain && (
                                                <div className="captain-badge">
                                                    <span>C</span>
                                                </div>
                                            )}

                                            {pos.player?.image ? (
                                                <img src={pos.player.image} alt="" className="player-avatar-img" />
                                            ) : (
                                                <div className="player-avatar-placeholder">
                                                    {pos.player?.name?.charAt(0) || '?'}
                                                </div>
                                            )}
                                            <div className="player-avatar-pos">{pos.player?.position || pos.type.toUpperCase()}</div>
                                        </div>
                                        <div className="player-name-plate">
                                            {pos.player?.name?.split(' ').pop() || 'SCOUTING...'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 3. SQUAD LIST & 4. EDIT ACTIONS */}
                    <div className="rev-details-section">
                        <div className="rev-list-grid">

                            {/* GOALKEEPER */}
                            <div className="rev-pos-group glass">
                                <div className="rev-group-header">
                                    <h3 className="rev-group-title">GOALKEEPER</h3>
                                    <button onClick={() => router.push('/select/goalkeeper')} className="rev-edit-btn">
                                        <Edit3 size={14} /> <span>EDIT</span>
                                    </button>
                                </div>
                                <div className="rev-player-list">
                                    {gk ? (
                                        <div
                                            className={`rev-player-item current ${captain === gk.id ? 'is-cap' : ''}`}
                                            onClick={() => handleSetCaptain(gk.id)}
                                        >
                                            <img src={gk.image} alt="" className="rev-p-img" />
                                            <div className="rev-p-info">
                                                <span className="rev-p-name">{gk.name} {captain === gk.id && <span className="cap-tag">(C)</span>}</span>
                                                <span className="rev-p-meta">{gk.club} • Rating {gk.rating}</span>
                                            </div>
                                            {captain === gk.id ? <Crown size={18} className="text-amber-400" /> : <CheckCircle2 size={18} className="text-primary" />}
                                        </div>
                                    ) : (
                                        <div className="rev-player-empty">NO GK SELECTED</div>
                                    )}
                                </div>
                            </div>

                            {/* DEFENDERS */}
                            <div className="rev-pos-group glass">
                                <div className="rev-group-header">
                                    <h3 className="rev-group-title">DEFENDERS</h3>
                                    <button onClick={() => router.push('/select/defenders')} className="rev-edit-btn">
                                        <Edit3 size={14} /> <span>EDIT</span>
                                    </button>
                                </div>
                                <div className="rev-player-list">
                                    {defenders.map(p => (
                                        <div
                                            key={p.id}
                                            className={`rev-player-item ${captain === p.id ? 'is-cap' : ''}`}
                                            onClick={() => handleSetCaptain(p.id)}
                                        >
                                            <img src={p.image} alt="" className="rev-p-img" />
                                            <div className="rev-p-info">
                                                <span className="rev-p-name">{p.name} {captain === p.id && <span className="cap-tag">(C)</span>}</span>
                                                <span className="rev-p-meta">{p.position} • {p.club}</span>
                                            </div>
                                            <div className="rev-p-rating">{captain === p.id ? <Crown size={14} /> : p.rating}</div>
                                        </div>
                                    ))}
                                    {defenders.length === 0 && <div className="rev-player-empty">NO DEFENDERS SELECTED</div>}
                                </div>
                            </div>

                            {/* MIDFIELDERS */}
                            <div className="rev-pos-group glass">
                                <div className="rev-group-header">
                                    <h3 className="rev-group-title">MIDFIELDERS</h3>
                                    <button onClick={() => router.push('/select/midfielders')} className="rev-edit-btn">
                                        <Edit3 size={14} /> <span>EDIT</span>
                                    </button>
                                </div>
                                <div className="rev-player-list">
                                    {midfielders.map(p => (
                                        <div
                                            key={p.id}
                                            className={`rev-player-item ${captain === p.id ? 'is-cap' : ''}`}
                                            onClick={() => handleSetCaptain(p.id)}
                                        >
                                            <img src={p.image} alt="" className="rev-p-img" />
                                            <div className="rev-p-info">
                                                <span className="rev-p-name">{p.name} {captain === p.id && <span className="cap-tag">(C)</span>}</span>
                                                <span className="rev-p-meta">{p.position} • {p.club}</span>
                                            </div>
                                            <div className="rev-p-rating">{captain === p.id ? <Crown size={14} /> : p.rating}</div>
                                        </div>
                                    ))}
                                    {midfielders.length === 0 && <div className="rev-player-empty">NO MIDFIELDERS SELECTED</div>}
                                </div>
                            </div>

                            {/* FORWARDS */}
                            <div className="rev-pos-group glass">
                                <div className="rev-group-header">
                                    <h3 className="rev-group-title">FORWARDS</h3>
                                    <button onClick={() => router.push('/select/forwards')} className="rev-edit-btn">
                                        <Edit3 size={14} /> <span>EDIT</span>
                                    </button>
                                </div>
                                <div className="rev-player-list">
                                    {forwards.map(p => (
                                        <div
                                            key={p.id}
                                            className={`rev-player-item ${captain === p.id ? 'is-cap' : ''}`}
                                            onClick={() => handleSetCaptain(p.id)}
                                        >
                                            <img src={p.image} alt="" className="rev-p-img" />
                                            <div className="rev-p-info">
                                                <span className="rev-p-name">{p.name} {captain === p.id && <span className="cap-tag">(C)</span>}</span>
                                                <span className="rev-p-meta">{p.position} • {p.club}</span>
                                            </div>
                                            <div className="rev-p-rating">{captain === p.id ? <Crown size={14} /> : p.rating}</div>
                                        </div>
                                    ))}
                                    {forwards.length === 0 && <div className="rev-player-empty">NO FORWARDS SELECTED</div>}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* 5. FINAL CONFIRMATION CTA */}
                    <div className="rev-footer">
                        <div className="rev-footer-content">
                            <div className="rev-step-info">
                                <div className="rev-step-pill">STEP 5 OF 5</div>
                                <span className="rev-step-text">SQUAD COMPLETE</span>
                                <div className="rev-locking-line">
                                    <CheckCircle2 size={12} className="text-primary" />
                                    <span>Squad locked. Ready to begin your journey.</span>
                                </div>
                            </div>

                            <div className="rev-actions">
                                <button onClick={() => router.back()} className="rev-back-link">
                                    <div className="back-icon-frame">
                                        <ChevronLeft size={16} />
                                    </div>
                                    <span>GO BACK</span>
                                </button>
                                <button onClick={handleStartCareer} className="rev-confirm-btn">
                                    <span>CONFIRM SQUAD & START CAREER</span>
                                    <div className="confirm-icon-box">
                                        <ChevronRight size={22} strokeWidth={3} />
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                </main>
            </section>

            <style jsx>{`
                .rev-container {
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    padding: 2rem 1rem 8rem;
                    animation: revFadeIn 0.8s ease-out;
                }
                @keyframes revFadeIn {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .rev-main { width: 100%; max-width: 1200px; display: flex; flex-direction: column; gap: 2.5rem; }

                .rev-stadium-bg {
                    filter: brightness(0.06) saturate(0.5);
                }

                /* 1. Context Bar */
                .rev-context-bar {
                    display: flex; align-items: center; justify-content: center;
                    padding: 1rem 3rem; border-radius: 50px;
                    border: 1px solid rgba(255,255,255,0.08); gap: 2.5rem;
                }
                .rev-ctx-item { display: flex; align-items: center; gap: 0.75rem; }
                .rev-ctx-icon { opacity: 0.8; }
                .rev-ctx-text { display: flex; flex-direction: column; }
                .rev-ctx-label { font-size: 0.55rem; font-weight: 900; color: rgba(255,255,255,0.3); letter-spacing: 0.2em; }
                .rev-ctx-val { font-size: 0.85rem; font-weight: 900; color: white; letter-spacing: 0.05em; }
                .rev-ctx-sep { width: 1px; height: 24px; background: rgba(255,255,255,0.08); }

                .rev-header { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
                .rev-title { font-size: 3.5rem; font-weight: 950; letter-spacing: -0.02em; color: white; margin-bottom: 0.2rem; }
                .rev-subtitle { font-size: 1.1rem; color: rgba(255,255,255,0.4); font-weight: 500; margin-bottom: 1rem; }

                .rev-cap-instruction {
                    display: flex; align-items: center; gap: 0.75rem;
                    padding: 0.6rem 1.25rem; border-radius: 100px;
                    background: rgba(245, 158, 11, 0.05);
                    border: 1px solid rgba(245, 158, 11, 0.2);
                    animation: instructionSlide 0.8s cubic-bezier(0.23, 1, 0.32, 1) backwards;
                    animation-delay: 0.5s;
                }
                .rev-cap-instruction span {
                    font-size: 0.75rem; color: rgba(255,255,255,0.6);
                    letter-spacing: 0.02em;
                }
                .rev-cap-instruction strong { color: #f59e0b; font-weight: 900; }

                @keyframes instructionSlide {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* 2. Pitch Section */
                .rev-pitch-section { display: flex; justify-content: center; }
                .rev-pitch-card {
                    width: 100%; max-width: 720px; padding: 2.5rem; border-radius: 40px;
                    border: 1px solid rgba(255,255,255,0.1); background: rgba(10,10,22,0.5);
                    box-shadow: 0 40px 100px -20px rgba(0,0,0,0.9), 0 0 40px rgba(0, 255, 136, 0.05);
                    position: relative;
                }
                .rev-pitch-card::before {
                    content: ''; position: absolute; inset: -1px; border-radius: 40px;
                    padding: 1px; background: linear-gradient(to bottom, rgba(255,255,255,0.15), transparent);
                    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
                    -webkit-mask-composite: xor; mask-composite: exclude;
                    pointer-events: none;
                }
                .pitch-canvas {
                    position: relative; width: 100%; aspect-ratio: 3.2 / 4;
                    background: linear-gradient(180deg, rgba(20, 50, 35, 0.5) 0%, rgba(10, 25, 15, 0.7) 100%);
                    border: 2px solid rgba(255,255,255,0.12); border-radius: 24px;
                    overflow: hidden;
                    box-shadow: inset 0 0 50px rgba(0,0,0,0.3), 0 0 20px rgba(0, 255, 136, 0.1);
                }
                
                /* Field Lines */
                .pitch-center-circle { position: absolute; top:50%; left:50%; width:80px; height:80px; border:1px solid rgba(255,255,255,0.1); border-radius:50%; transform:translate(-50%,-50%); }
                .pitch-center-line { position: absolute; top:50%; left:0; right:0; height:1px; background:rgba(255,255,255,0.1); }
                .pitch-penalty-top { position: absolute; top:0; left:25%; right:25%; height:15%; border:1px solid rgba(255,255,255,0.1); border-top:none; }
                .pitch-penalty-bottom { position: absolute; bottom:0; left:25%; right:25%; height:15%; border:1px solid rgba(255,255,255,0.1); border-bottom:none; }

                /* Chemistry Lines */
                .pitch-links {
                    position: absolute; inset: 0;
                    width: 100%; height: 100%;
                    z-index: 1; pointer-events: none;
                }
                .chim-line {
                    animation: chimPulse 3s ease-in-out infinite;
                }
                @keyframes chimPulse {
                    0%, 100% { opacity: 0.3; stroke-width: 0.15; }
                    50% { opacity: 0.7; stroke-width: 0.25; }
                }

                /* Players on Pitch */
                .pitch-player {
                    position: absolute; transform: translate(-50%, -50%);
                    display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
                    z-index: 10; transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                }
                .pitch-player.clickable { cursor: pointer; }
                .pitch-player.clickable:hover { z-index: 100; transform: translate(-50%, -60%) scale(1.1); }
                .pitch-player.clickable:hover .player-avatar-img { border-color: #f59e0b !important; box-shadow: 0 0 20px rgba(245, 158, 11, 0.4); }

                .player-avatar-wrapper { position: relative; width: 44px; height: 44px; }
                .player-avatar-img { 
                    width: 100%; height: 100%; border-radius: 50%; object-fit: cover; 
                    border: 2px solid white; box-shadow: 0 0 15px rgba(255,255,255,0.2);
                    position: relative; z-index: 2;
                }
                .player-avatar-glow { 
                    position: absolute; inset: -5px; border-radius: 50%; 
                    background: white; opacity: 0.1; filter: blur(8px); 
                }
                .captain-badge {
                    position: absolute; top: -2px; left: -2px; z-index: 10;
                    width: 16px; height: 16px; border-radius: 50%;
                    background: #f59e0b; color: black;
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
                    border: 1px solid white;
                    animation: captainPulse 2s infinite;
                }
                .captain-badge span {
                    font-size: 0.65rem;
                    font-weight: 950;
                    line-height: 1;
                }
                @keyframes captainPulse {
                    0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.6); }
                    70% { transform: scale(1.1); box-shadow: 0 0 0 8px rgba(245, 158, 11, 0); }
                    100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
                }
                .player-avatar-placeholder {
                    width:100%; height:100%; border-radius:50%; background:rgba(255,255,255,0.05);
                    border:2px dashed rgba(255,255,255,0.2); display:flex; align-items:center; justify-content:center;
                    color:rgba(255,255,255,0.3); font-weight:900;
                }
                .player-avatar-pos {
                    position: absolute; bottom: -4px; right: -4px;
                    background: white; color: black; font-size: 0.5rem; font-weight: 950;
                    padding: 2px 4px; border-radius: 4px; z-index: 5;
                }

                .pitch-player.gk .player-avatar-img { border-color: #f59e0b; }
                .pitch-player.gk .player-avatar-glow { background: #f59e0b; }
                .pitch-player.gk .player-avatar-pos { background: #f59e0b; }

                .pitch-player.def .player-avatar-img { border-color: #3b82f6; }
                .pitch-player.def .player-avatar-glow { background: #3b82f6; }
                .pitch-player.def .player-avatar-pos { background: #3b82f6; color: white; }

                .pitch-player.mid .player-avatar-img { border-color: var(--primary); }
                .pitch-player.mid .player-avatar-glow { background: var(--primary); }
                .pitch-player.mid .player-avatar-pos { background: var(--primary); color: black; }

                .pitch-player.fwd .player-avatar-img { border-color: #ef4444; }
                .pitch-player.fwd .player-avatar-glow { background: #ef4444; }
                .pitch-player.fwd .player-avatar-pos { background: #ef4444; color: white; }

                .player-name-plate {
                    background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
                    padding: 2px 8px; border-radius: 100px;
                    color: white; font-size: 0.55rem; font-weight: 800;
                    letter-spacing: 0.02em; white-space: nowrap;
                    border: 1px solid rgba(255,255,255,0.1);
                }

                /* 3. Squad List */
                .rev-list-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; }
                .rev-pos-group { padding: 1.5rem; border-radius: 24px; border: 1px solid rgba(255,255,255,0.06); background: rgba(10,10,15,0.6); }
                .rev-group-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; }
                .rev-group-title { font-size: 0.75rem; font-weight: 900; color: rgba(255,255,255,0.4); letter-spacing: 0.15em; }
                .rev-edit-btn { 
                    display: flex; align-items: center; gap: 0.4rem; padding: 0.4rem 0.8rem;
                    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 8px; color: rgba(255,255,255,0.6); font-size: 0.6rem; font-weight: 900;
                    cursor: pointer; transition: 0.3s;
                }
                .rev-edit-btn:hover { background: rgba(255,255,255,0.08); border-color: white; color: white; }

                .rev-player-list { display: flex; flex-direction: column; gap: 0.75rem; }
                .rev-player-item { 
                    display: flex; align-items: center; gap: 1rem; padding: 0.75rem;
                    background: rgba(255,255,255,0.02); border-radius: 16px; border: 1px solid rgba(255,255,255,0.04);
                    cursor: pointer; transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .rev-player-item:hover { background: rgba(255,255,255,0.05); transform: translateX(5px); border-color: rgba(255,255,255,0.1); }
                .rev-player-item.is-cap { background: rgba(245, 158, 11, 0.08); border-color: rgba(245, 158, 11, 0.3); }
                .rev-player-item.current { background: rgba(0, 255, 136, 0.05); border-color: rgba(0, 255, 136, 0.15); }
                .rev-player-item.current.is-cap { background: rgba(245, 158, 11, 0.12); border-color: rgba(245, 158, 11, 0.4); }
                
                .cap-tag { color: #f59e0b; font-weight: 900; margin-left: 0.5rem; font-size: 0.7rem; }
                
                .rev-p-img { width: 40px; height: 40px; border-radius: 10px; object-fit: cover; }
                .rev-p-info { flex: 1; display: flex; flex-direction: column; }
                .rev-p-name { font-size: 0.9rem; font-weight: 800; color: white; }
                .rev-p-meta { font-size: 0.65rem; color: rgba(255,255,255,0.3); font-weight: 600; }
                .rev-p-rating { font-size: 1.1rem; font-weight: 950; color: var(--primary); font-style: italic; }

                .rev-player-empty { padding: 2rem; text-align: center; font-size: 0.7rem; color: rgba(255,255,255,0.2); font-weight: 700; border: 2px dashed rgba(255,255,255,0.05); border-radius: 16px; }

                /* 5. Footer */
                .rev-footer {
                    position: fixed; bottom: 0; left: 0; right: 0; z-index: 1000;
                    background: linear-gradient(to top, #02040a 60%, transparent);
                    padding: 2rem 1rem 3rem; display: flex; justify-content: center;
                }
                .rev-footer-content {
                    width: 100%; max-width: 900px; display: flex; justify-content: space-between; align-items: center;
                    background: rgba(10, 10, 15, 0.85); backdrop-filter: blur(40px);
                    padding: 1.5rem 3rem; border-radius: 30px; border: 1px solid rgba(255,255,255,0.1);
                    border-top: 1px solid rgba(0, 255, 136, 0.3);
                    box-shadow: 0 40px 100px rgba(0,0,0,0.8);
                }
                .rev-step-info { display: flex; flex-direction: column; gap: 0.2rem; }
                .rev-step-pill { 
                    font-size: 0.55rem; font-weight: 950; padding: 0.2rem 0.6rem; 
                    background: rgba(0, 255, 136, 0.1); color: var(--primary); 
                    border-radius: 100px; width: fit-content; letter-spacing: 0.1em;
                }
                .rev-step-text { font-size: 1.1rem; font-weight: 900; color: white; letter-spacing: -0.01em; }

                .rev-locking-line {
                    display: flex; align-items: center; gap: 0.5rem; 
                    margin-top: 0.4rem; padding-top: 0.4rem; border-top: 1px solid rgba(255,255,255,0.05);
                }
                .rev-locking-line span {
                    font-size: 0.65rem; font-weight: 700; color: rgba(255,255,255,0.3);
                    letter-spacing: 0.05em; text-transform: uppercase;
                }

                .rev-actions { display: flex; align-items: center; gap: 1.5rem; }
                
                .rev-back-link { 
                    display: flex; align-items: center; gap: 0.75rem; 
                    background: rgba(255,255,255,0.03); 
                    border: 1px solid rgba(255,255,255,0.08);
                    padding: 0.9rem 1.8rem; border-radius: 16px;
                    color: rgba(255,255,255,0.5); font-size: 0.8rem; font-weight: 850; 
                    cursor: pointer; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    letter-spacing: 0.05em;
                }
                .rev-back-link:hover { 
                    background: rgba(255,255,255,0.08); 
                    border-color: rgba(255,255,255,0.2);
                    color: white; 
                    transform: translateX(-4px); 
                }
                .back-icon-frame {
                    width: 24px; height: 24px; border-radius: 50%;
                    background: rgba(255,255,255,0.05);
                    display: flex; align-items: center; justify-content: center;
                    border: 1px solid rgba(255,255,255,0.1);
                }
                
                .rev-confirm-btn {
                    position: relative;
                    display: flex; align-items: center; gap: 1.25rem;
                    background: linear-gradient(135deg, #00ff88, #059669, #10b981);
                    background-size: 200% auto;
                    padding: 1.1rem 2.8rem; border-radius: 18px; border: none;
                    color: #01160d; font-weight: 950; font-size: 1rem; letter-spacing: 0.04em;
                    cursor: pointer; transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    box-shadow: 0 10px 40px rgba(0, 255, 136, 0.3);
                    animation: btnFinalGlow 5s infinite, gradientMove 4s linear infinite;
                    overflow: hidden;
                    text-transform: uppercase;
                }
                .rev-confirm-btn::after {
                    content: '';
                    position: absolute;
                    top: -50%; left: -60%;
                    width: 40px; height: 200%;
                    background: rgba(255, 255, 255, 0.3);
                    transform: rotate(35deg);
                    animation: shimmerAction 3s infinite;
                    filter: blur(15px);
                }
                @keyframes shimmerAction {
                    0% { left: -60%; }
                    30%, 100% { left: 160%; }
                }
                @keyframes gradientMove {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .rev-confirm-btn:hover {
                    transform: scale(1.03) translateX(10px);
                    box-shadow: 0 20px 60px rgba(0, 255, 136, 0.5);
                    filter: brightness(1.1);
                }
                .rev-confirm-btn:active { transform: scale(0.96); }
                
                .confirm-icon-box {
                    display: flex; align-items: center; justify-content: center;
                    background: rgba(0,0,0,0.15);
                    padding: 0.4rem; border-radius: 10px;
                }
                .rev-confirm-btn:active { transform: scale(0.98); }

                @keyframes btnFinalGlow {
                    0%, 80%, 100% { box-shadow: 0 10px 40px rgba(0, 255, 136, 0.3); }
                    90% { box-shadow: 0 10px 60px rgba(0, 255, 136, 0.7), 0 0 20px rgba(255, 255, 255, 0.2); }
                }

                @media (max-width: 768px) {
                    .rev-context-bar { flex-direction: column; padding: 1.5rem; gap: 1rem; border-radius: 24px; }
                    .rev-ctx-sep { display: none; }
                    .rev-title { font-size: 2.5rem; }
                    .rev-footer-content { flex-direction: column; gap: 1.5rem; padding: 1.5rem; }
                    .rev-actions { width: 100%; flex-direction: column-reverse; gap: 1rem; }
                    .rev-confirm-btn { width: 100%; justify-content: center; }
                }
            `}</style>
        </div>
    );
}
