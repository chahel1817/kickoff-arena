'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Trophy, Zap, ChevronRight, Activity,
    Sparkles, Shield, Crown, Star,
    Target, BarChart3, Globe, Users2,
    CheckCircle2, AlertCircle, Info
} from 'lucide-react';
import '../../entry.css';
import { useAuth } from '@/context/AuthContext';
import { getSafePlayerImage } from '@/lib/playerImage';
import { computeSquadChemistry } from '@/lib/squadChemistry';

export default function SquadSuccessPage() {
    const router = useRouter();
    const { saveSquad, isLoggedIn } = useAuth();

    const [team, setTeam] = useState(null);
    const [manager, setManager] = useState(null);
    const [formation, setFormation] = useState(null);
    const [gk, setGk] = useState(null);
    const [defenders, setDefenders] = useState([]);
    const [midfielders, setMidfielders] = useState([]);
    const [forwards, setForwards] = useState([]);
    const [captainId, setCaptainId] = useState(null);
    const [squadSnapshot, setSquadSnapshot] = useState(null);
    const hasSyncedRef = useRef(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const parse = (key, fallback) => {
            try {
                const raw = localStorage.getItem(key);
                return raw ? JSON.parse(raw) : fallback;
            } catch {
                return fallback;
            }
        };

        window.scrollTo({ top: 0, behavior: 'instant' });
        const parsedTeam = parse('selectedTeam', null);
        const parsedManager = parse('selectedManager', null);
        const parsedFormation = parse('formation', null);
        const parsedGK = parse('goalkeeper', null);
        const parsedDefs = parse('defenders', []);
        const parsedMids = parse('midfielders', []);
        const parsedFwds = parse('forwards', []);
        const storedCap = localStorage.getItem('selectedCaptain');

        if (parsedTeam) setTeam(parsedTeam);
        if (parsedManager) setManager(parsedManager);
        if (parsedFormation) setFormation(parsedFormation);
        if (parsedGK) setGk(parsedGK);
        setDefenders(parsedDefs);
        setMidfielders(parsedMids);
        setForwards(parsedFwds);
        if (storedCap) setCaptainId(storedCap);

        setSquadSnapshot({
            selectedTeam: parsedTeam,
            selectedManager: parsedManager,
            formation: parsedFormation,
            goalkeeper: parsedGK,
            defenders: parsedDefs,
            midfielders: parsedMids,
            forwards: parsedFwds,
            selectedCaptain: storedCap || null,
        });

        // Add class to body to indicate we are in success view for CSS purposes
        document.body.classList.add('success-open');

        import('canvas-confetti').then(({ default: confetti }) => {
            confetti({ particleCount: 180, spread: 120, origin: { x: 0.5, y: 0.45 }, colors: ['#00ff88', '#f59e0b', '#ffffff', '#3b82f6', '#ef4444'] });
        }).catch(() => { });

        return () => {
            document.body.classList.remove('success-open');
        };
    }, []);

    useEffect(() => {
        if (!isLoggedIn || !squadSnapshot || hasSyncedRef.current) return;
        hasSyncedRef.current = true;
        saveSquad(squadSnapshot).catch(() => {
            hasSyncedRef.current = false;
        });
    }, [isLoggedIn, saveSquad, squadSnapshot]);

    const stats = useMemo(() => {
        const allPlayers = [gk, ...defenders, ...midfielders, ...forwards].filter(Boolean);
        if (allPlayers.length === 0) return { avg: 0, chem: 0, potential: 0 };
        const avg = Math.round(allPlayers.reduce((acc, p) => acc + p.rating, 0) / allPlayers.length);
        const chemRes = computeSquadChemistry({
            formation, gk, defenders, midfielders, forwards,
        });
        const chem = chemRes.score;
        const potential = Math.round(avg * (1 + (chem / 200)));
        return { avg, chem, potential };
    }, [formation, gk, defenders, midfielders, forwards]);

    const pitchPositions = useMemo(() => {
        if (!formation) return [];
        const positions = [];
        const cleanName = formation.name.replace(/\s*\(.*?\)\s*/g, '');
        const parts = cleanName.split('-').map(Number);
        positions.push({ x: 50, y: 88, type: 'gk', player: gk });
        if (parts.length === 3) {
            const [defCount, midCount, fwdCount] = parts;
            const defSp = 88 / (defCount + 1);
            for (let i = 0; i < defCount; i++) positions.push({ x: 6 + defSp * (i + 1), y: 70, type: 'def', player: defenders[i] });
            const midSp = 88 / (midCount + 1);
            for (let i = 0; i < midCount; i++) positions.push({ x: 6 + midSp * (i + 1), y: 44, type: 'mid', player: midfielders[i] });
            const fwdSp = 88 / (fwdCount + 1);
            for (let i = 0; i < fwdCount; i++) positions.push({ x: 6 + fwdSp * (i + 1), y: 18, type: 'fwd', player: forwards[i] });
        } else if (parts.length === 4) {
            const [defCount, l1, l2, l3] = parts;
            const defSp = 88 / (defCount + 1);
            for (let i = 0; i < defCount; i++) positions.push({ x: 6 + defSp * (i + 1), y: 72, type: 'def', player: defenders[i] });
            const midParts = [l1, l2];
            const midY = [54, 36];
            let mIdx = 0;
            for (let j = 0; j < 2; j++) {
                const sp = 88 / (midParts[j] + 1);
                for (let i = 0; i < midParts[j]; i++) positions.push({ x: 6 + sp * (i + 1), y: midY[j], type: 'mid', player: midfielders[mIdx++] });
            }
            const fwdSp = 88 / (l3 + 1);
            for (let i = 0; i < l3; i++) positions.push({ x: 6 + fwdSp * (i + 1), y: 18, type: 'fwd', player: forwards[i] });
        } else if (parts.length === 5) {
            const [defCount, l1, l2, l3, l4] = parts;
            const defSp = 88 / (defCount + 1);
            for (let i = 0; i < defCount; i++) positions.push({ x: 6 + defSp * (i + 1), y: 74, type: 'def', player: defenders[i] });
            const midParts = [l1, l2, l3];
            const midY = [58, 44, 30];
            let mIdx = 0;
            for (let j = 0; j < 3; j++) {
                const sp = 88 / (midParts[j] + 1);
                for (let i = 0; i < midParts[j]; i++) positions.push({ x: 6 + sp * (i + 1), y: midY[j], type: 'mid', player: midfielders[mIdx++] });
            }
            const fwdSp = 88 / (l4 + 1);
            for (let i = 0; i < l4; i++) positions.push({ x: 6 + fwdSp * (i + 1), y: 16, type: 'fwd', player: forwards[i] });
        }
        return positions;
    }, [formation, gk, defenders, midfielders, forwards]);

    const handleEdit = (category) => {
        router.push(`/select/${category}?edit=true`);
    };

    return (
        <div className="sc-root">
            {/* Background elements */}
            <div className="sc-bg">
                <div className="stadium-bg" />
                <div className="sc-bg-overlay" />
                <div className="sc-bg-scan-lines" />
            </div>

            <main className="sc-container">
                {/* 1. TOP CELEBRATION HEADER */}
                <header className="sc-header">
                    <div className="sc-header-top">
                        <div className="sc-badge-glow">
                            <Trophy className="sc-trophy-icon" />
                        </div>
                        <div className="sc-meta-info">
                            <span className="sc-eyebrow">REGISTRATION COMPLETE</span>
                            <h1 className="sc-title">THE ELITE <span className="text-primary italic">XI</span></h1>
                        </div>
                        <div className="sc-stats-pill">
                            <div className="sc-sp-item">
                                <span className="sc-sp-val">{stats.avg}</span>
                                <span className="sc-sp-lbl">OVR</span>
                            </div>
                            <div className="sc-sp-sep" />
                            <div className="sc-sp-item">
                                <span className="sc-sp-val text-primary">{stats.chem}%</span>
                                <span className="sc-sp-lbl">CHEM</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="sc-main-grid">
                    {/* 2. PITCH VIEW (FULL WIDTH ON TOP) */}
                    <div className="sc-pitch-card glass-premium">
                        <div className="sc-pitch-header">
                            <div className="sc-ph-left">
                                <div className="sc-ph-tag"><Activity size={12} /> TACTICAL BOARD</div>
                                <h2 className="sc-ph-title">{formation?.name || '4-3-3'}</h2>
                            </div>
                            <div className="sc-ph-right">
                                <div className="sc-team-badge">
                                    <Globe size={14} className="text-primary" />
                                    <span>{team?.name || 'GLOBAL SCOUTED'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="sc-field-container">
                            <div className="sc-field">
                                <div className="sc-field-lines">
                                    <div className="sc-line-circle" />
                                    <div className="sc-line-half" />
                                    <div className="sc-line-box-t" />
                                    <div className="sc-line-box-b" />
                                </div>

                                {pitchPositions.map((pos, idx) => (
                                    <div
                                        key={idx}
                                        className={`sc-player-node ${pos.type}`}
                                        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                                    >
                                        <div className="sc-pn-avatar">
                                            <div className="sc-pn-glow" />
                                            {pos.player ? (
                                                <img src={getSafePlayerImage(pos.player, { proxify: true })} alt="" className="sc-pn-img" />
                                            ) : (
                                                <div className="sc-pn-empty">?</div>
                                            )}
                                            {pos.player?.id === captainId && (
                                                <div className="sc-pn-cap"><Crown size={10} /></div>
                                            )}
                                        </div>
                                        <div className="sc-pn-info">
                                            <span className="sc-pn-name">{pos.player?.name?.split(' ').pop() || 'SCOUT'}</span>
                                            <span className="sc-pn-rtg">{pos.player?.rating || '--'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="sc-field-controls">
                            <button onClick={() => handleEdit('goalkeeper')} className="sc-f-btn gk"><Shield size={14} /> GK</button>
                            <button onClick={() => handleEdit('defenders')} className="sc-f-btn def"><Shield size={14} /> DEF</button>
                            <button onClick={() => handleEdit('midfielders')} className="sc-f-btn mid"><Zap size={14} /> MID</button>
                            <button onClick={() => handleEdit('forwards')} className="sc-f-btn fwd"><Target size={14} /> FWD</button>
                        </div>
                    </div>

                    {/* 3. BOTTOM ANALYTICS ROW */}
                    <div className="sc-analytics-row">
                        <div className="sc-ana-card glass-premium">
                            <div className="sc-ac-hdr">
                                <BarChart3 size={18} className="text-primary" />
                                <h3>SQUAD POWER</h3>
                            </div>
                            <div className="sc-ac-body">
                                <div className="sc-power-circle">
                                    <svg viewBox="0 0 100 100">
                                        <circle className="sc-pc-bg" cx="50" cy="50" r="45" />
                                        <circle className="sc-pc-fill" cx="50" cy="50" r="45" style={{ strokeDashoffset: `${282 - (282 * stats.avg) / 100}` }} />
                                    </svg>
                                    <div className="sc-pc-val">
                                        <span className="v-num">{stats.avg}</span>
                                        <span className="v-lbl">RATING</span>
                                    </div>
                                </div>
                                <div className="sc-ac-summary">
                                    <div className="sc-as-item">
                                        <span className="as-label">COHESION</span>
                                        <div className="as-track"><div className="as-fill" style={{ width: `${stats.chem}%` }} /></div>
                                        <span className="as-val">{stats.chem}%</span>
                                    </div>
                                    <div className="sc-as-item">
                                        <span className="as-label">POTENTIAL</span>
                                        <div className="as-track"><div className="as-fill alt" style={{ width: `${Math.min(100, stats.potential)}%` }} /></div>
                                        <span className="as-val">{stats.potential}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="sc-ana-card glass-premium">
                            <div className="sc-ac-hdr">
                                <Users2 size={18} className="text-primary" />
                                <h3>MANAGEMENT</h3>
                            </div>
                            <div className="sc-ac-body mgr-cell">
                                <div className="sc-mgr-av">
                                    <div className="sc-mgr-img">
                                        <Crown className="text-amber-400" />
                                    </div>
                                    <div className="sc-mgr-info">
                                        <span className="mgr-name">{manager?.name || 'HEAD COACH'}</span>
                                        <span className="mgr-role">SYSTEM DIRECTOR</span>
                                    </div>
                                </div>
                                <div className="sc-mgr-stats">
                                    <div className="m-stat"><CheckCircle2 size={14} /> Tactically Balanced</div>
                                    <div className="m-stat"><Sparkles size={14} /> Chemistry Optimized</div>
                                    <div className="m-stat"><Shield size={14} /> Registered Locked</div>
                                </div>
                            </div>
                        </div>

                        <div className="sc-cta-card">
                            <button onClick={() => router.push('/summary')} className="sc-main-cta">
                                <div className="sc-cta-inner">
                                    <div className="icon-pulse"><Zap size={24} /></div>
                                    <div className="text-stack">
                                        <span className="ts-sub">READY FOR KICKOFF</span>
                                        <span className="ts-main">SEASON SUMMARY</span>
                                    </div>
                                    <ChevronRight size={20} />
                                </div>
                                <div className="sc-cta-glow" />
                            </button>
                            <div className="sc-status-pill">
                                <Info size={14} />
                                <span>Proceed to final briefing</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <style jsx>{`
                /* ROOT & BACKGROUND */
                .sc-root {
                    min-height: 100vh;
                    background: #020408;
                    color: white;
                    overflow-x: hidden;
                    font-family: 'Outfit', sans-serif;
                }
                .sc-bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
                .sc-bg-overlay {
                    position: absolute; inset: 0;
                    background: radial-gradient(circle at 50% 10%, rgba(0, 255, 136, 0.12), transparent 70%);
                }
                .sc-bg-scan-lines {
                    position: absolute; inset: 0;
                    background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.01) 3px);
                    background-size: 100% 4px;
                }

                /* CONTAINER */
                .sc-container {
                    position: relative;
                    z-index: 1;
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: clamp(4rem, 6vw, 8rem) 2rem 6rem;
                    display: flex;
                    flex-direction: column;
                    gap: 3rem;
                    animation: fadeIn 0.8s cubic-bezier(0.23, 1, 0.32, 1);
                }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } }

                /* HEADER */
                .sc-header { position: relative; }
                .sc-header-top { 
                    display: flex; align-items: center; gap: 2rem; 
                    background: rgba(255, 255, 255, 0.02);
                    padding: 1.5rem 2.5rem;
                    border-radius: 28px;
                    border: 1px solid rgba(255,255,255,0.08);
                    backdrop-filter: blur(10px);
                }
                .sc-badge-glow {
                    width: 72px; height: 72px; border-radius: 20px;
                    background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.1));
                    border: 1px solid rgba(245, 158, 11, 0.3);
                    display: grid; place-items: center;
                    box-shadow: 0 0 30px rgba(245, 158, 11, 0.2);
                }
                .sc-trophy-icon { color: #f59e0b; width: 32px; height: 32px; }
                .sc-meta-info { flex: 1; }
                .sc-eyebrow { font-size: 0.75rem; font-weight: 800; letter-spacing: 0.4em; color: rgba(255,255,255,0.4); }
                .sc-title { font-size: 3rem; font-weight: 950; letter-spacing: -0.04em; margin-top: 0.2rem; }
                
                .sc-stats-pill { 
                    display: flex; align-items: center; gap: 1.5rem;
                    background: rgba(0,0,0,0.4);
                    padding: 0.8rem 1.8rem;
                    border-radius: 100px;
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .sc-sp-item { display: flex; flex-direction: column; align-items: center; }
                .sc-sp-val { font-size: 1.8rem; font-weight: 950; line-height: 1; }
                .sc-sp-lbl { font-size: 0.6rem; font-weight: 900; color: rgba(255,255,255,0.4); letter-spacing: 0.1em; margin-top: 0.2rem; }
                .sc-sp-sep { width: 1px; height: 30px; background: rgba(255,255,255,0.1); }

                /* MAIN GRID */
                .sc-main-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }

                /* PITCH CARD */
                .sc-pitch-card {
                    padding: 2.5rem; border-radius: 40px; border: 1px solid rgba(255,255,255,0.1);
                    position: relative; overflow: hidden;
                    background: radial-gradient(circle at top right, rgba(0, 255, 136, 0.05), transparent 40%),
                                rgba(10, 15, 25, 0.4);
                }
                .sc-pitch-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 2rem; }
                .sc-ph-tag { font-size: 0.65rem; font-weight: 900; color: rgba(255,255,255,0.4); display: flex; align-items: center; gap: 0.5rem; letter-spacing: 0.15em; margin-bottom: 0.5rem; }
                .sc-ph-title { font-size: 2rem; font-weight: 950; }
                .sc-team-badge { display: flex; align-items: center; gap: 0.8rem; padding: 0.6rem 1.2rem; background: rgba(0,255,136,0.06); border: 1px solid rgba(0,255,136,0.15); border-radius: 12px; font-size: 0.8rem; font-weight: 800; }

                .sc-field-container { 
                    position: relative; width: 100%; aspect-ratio: 1.8 / 1; min-height: 500px;
                    background: linear-gradient(135deg, #0a1f14, #050d0a);
                    border-radius: 30px; border: 2px solid rgba(255,255,255,0.05);
                    box-shadow: inset 0 0 100px rgba(0,0,0,0.8), 0 0 40px rgba(0,255,136,0.1);
                    overflow: hidden;
                }
                .sc-field-lines { position: absolute; inset: 0; opacity: 0.15; pointer-events: none; }
                .sc-line-circle { position: absolute; top: 50%; left: 50%; width: 140px; height: 140px; border: 2px solid white; border-radius: 50%; transform: translate(-50%, -50%); }
                .sc-line-half { position: absolute; top: 50%; left: 0; right: 0; height: 2px; background: white; }
                .sc-line-box-t { position: absolute; top: 0; left: 25%; width: 50%; height: 20%; border: 2px solid white; border-top: 0; border-radius: 0 0 15px 15px; }
                .sc-line-box-b { position: absolute; bottom: 0; left: 25%; width: 50%; height: 20%; border: 2px solid white; border-bottom: 0; border-radius: 15px 15px 0 0; }

                .sc-player-node { 
                    position: absolute; transform: translate(-50%, -50%); 
                    width: 80px; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
                }
                .sc-pn-avatar { position: relative; width: 52px; height: 52px; }
                .sc-pn-img { width: 100%; height: 100%; border-radius: 50%; border: 2.5px solid white; object-fit: cover; position: relative; z-index: 2; box-shadow: 0 5px 15px rgba(0,0,0,0.4); }
                .sc-pn-glow { position: absolute; inset: -4px; border-radius: 50%; filter: blur(10px); opacity: 0.4; }
                .sc-pn-empty { width: 100%; height: 100%; border-radius: 50%; border: 1.5px dashed rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.2); font-weight: 800; }
                .sc-pn-cap { position: absolute; top: -5px; right: -5px; z-index: 5; background: #f59e0b; color: black; padding: 3px; border-radius: 50%; border: 1.5px solid white; }

                .gk .sc-pn-img { border-color: #f59e0b; } .gk .sc-pn-glow { background: #f59e0b; }
                .def .sc-pn-img { border-color: #3b82f6; } .def .sc-pn-glow { background: #3b82f6; }
                .mid .sc-pn-img { border-color: #00ff88; } .mid .sc-pn-glow { background: #00ff88; }
                .fwd .sc-pn-img { border-color: #ef4444; } .fwd .sc-pn-glow { background: #ef4444; }

                .sc-pn-info { display: flex; flex-direction: column; align-items: center; width: 100%; }
                .sc-pn-name { 
                    font-size: 0.65rem; font-weight: 900; color: white; text-transform: uppercase; letter-spacing: 0.05em;
                    background: rgba(0,0,0,0.7); padding: 0.2rem 0.5rem; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1);
                    width: 100%; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
                }
                .sc-pn-rtg { font-size: 0.6rem; font-weight: 950; color: rgba(0,255,136,0.9); margin-top: 0.1rem; }

                .sc-field-controls { 
                    display: flex; gap: 1rem; justify-content: center; margin-top: 2rem;
                    background: rgba(0,0,0,0.3); padding: 0.8rem; border-radius: 20px; align-self: center;
                    border: 1px solid rgba(255,255,255,0.05);
                }
                .sc-f-btn { 
                    padding: 0.6rem 1.4rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); 
                    background: transparent; color: white; font-size: 0.75rem; font-weight: 900; 
                    cursor: pointer; display: flex; align-items: center; gap: 0.6rem; transition: 0.3s;
                }
                .sc-f-btn:hover { background: rgba(255,255,255,0.05); transform: translateY(-3px); border-color: rgba(255,255,255,0.3); }

                /* ANALYTICS ROW */
                .sc-analytics-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.5rem; }
                .sc-ana-card { padding: 2rem; border-radius: 30px; border: 1px solid rgba(255,255,255,0.1); display: flex; flex-direction: column; gap: 1.5rem; }
                .sc-ac-hdr { display: flex; align-items: center; gap: 0.8rem; }
                .sc-ac-hdr h3 { font-size: 0.8rem; font-weight: 900; letter-spacing: 0.2em; color: rgba(255,255,255,0.4); }

                .sc-ac-body { flex: 1; display: flex; flex-direction: column; gap: 1.5rem; }
                .sc-power-circle { position: relative; width: 120px; height: 120px; margin: 0 auto; display: grid; place-items: center; }
                .sc-power-circle svg { transform: rotate(-90deg); width: 100%; height: 100%; }
                .sc-pc-bg { fill: none; stroke: rgba(255,255,255,0.05); stroke-width: 8; }
                .sc-pc-fill { fill: none; stroke: #00ff88; stroke-width: 8; stroke-linecap: round; stroke-dasharray: 282; transition: stroke-dashoffset 1s ease-out; }
                .sc-pc-val { position: absolute; display: flex; flex-direction: column; align-items: center; }
                .v-num { font-size: 2.2rem; font-weight: 950; line-height: 1; }
                .v-lbl { font-size: 0.5rem; font-weight: 800; color: rgba(255,255,255,0.4); letter-spacing: 0.2em; }

                .sc-ac-summary { display: flex; flex-direction: column; gap: 1rem; }
                .sc-as-item { display: grid; grid-template-columns: 70px 1fr 35px; align-items: center; gap: 0.8rem; }
                .as-label { font-size: 0.6rem; font-weight: 900; color: rgba(255,255,255,0.3); }
                .as-track { height: 6px; background: rgba(255,255,255,0.05); border-radius: 10px; overflow: hidden; }
                .as-fill { height: 100%; background: #00ff88; box-shadow: 0 0 10px rgba(0,255,136,0.3); transition: 1s; }
                .as-fill.alt { background: #3b82f6; box-shadow: 0 0 10px rgba(59,130,246,0.3); }
                .as-val { font-size: 0.75rem; font-weight: 900; text-align: right; }

                .sc-mgr-av { display: flex; align-items: center; gap: 1.2rem; margin-bottom: 0.5rem; }
                .sc-mgr-img { width: 56px; height: 56px; border-radius: 16px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); display: grid; place-items: center; }
                .mgr-name { display: block; font-size: 1.1rem; font-weight: 900; }
                .mgr-role { display: block; font-size: 0.65rem; font-weight: 800; color: #f59e0b; letter-spacing: 0.1em; }
                
                .sc-mgr-stats { display: flex; flex-direction: column; gap: 0.8rem; }
                .m-stat { display: flex; align-items: center; gap: 0.8rem; font-size: 0.8rem; font-weight: 700; color: rgba(255,255,255,0.6); }

                /* CTA CARD */
                .sc-cta-card { display: flex; flex-direction: column; gap: 1.2rem; }
                .sc-main-cta {
                    position: relative; width: 100%; padding: 2.2rem; border: none; border-radius: 35px;
                    background: linear-gradient(135deg, #00ff88, #00bd65);
                    color: #01160d; cursor: pointer; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    overflow: hidden;
                }
                .sc-cta-inner { position: relative; z-index: 2; display: flex; align-items: center; gap: 1.5rem; }
                .icon-pulse { animation: ctaPulse 2s infinite; }
                @keyframes ctaPulse { 0% { transform: scale(1); filter: drop-shadow(0 0 0px #01160d); } 50% { transform: scale(1.15); filter: drop-shadow(0 0 10px rgba(0,0,0,0.3)); } 100% { transform: scale(1); } }
                .text-stack { flex: 1; display: flex; flex-direction: column; align-items: flex-start; }
                .ts-sub { font-size: 0.7rem; font-weight: 800; opacity: 0.7; }
                .ts-main { font-size: 1.4rem; font-weight: 950; letter-spacing: -0.02em; }
                .sc-cta-glow { position: absolute; inset: 0; background: radial-gradient(circle at 50% 120%, rgba(255,255,255,0.4), transparent 70%); opacity: 0; transition: 0.4s; }
                .sc-main-cta:hover { transform: translateY(-10px) scale(1.02); box-shadow: 0 30px 60px rgba(0, 255, 136, 0.4); }
                .sc-main-cta:hover .sc-cta-glow { opacity: 1; }

                .sc-status-pill { display: flex; align-items: center; gap: 0.8rem; padding: 0.8rem 1.5rem; background: rgba(255, 255, 255, 0.04); border-radius: 100px; color: rgba(255,255,255,0.5); font-size: 0.75rem; font-weight: 800; }

                @media (max-width: 1024px) {
                    .sc-analytics-row { grid-template-columns: 1fr; }
                    .sc-title { font-size: 2.2rem; }
                    .sc-header-top { flex-direction: column; text-align: center; }
                    .sc-container { padding-top: 6rem; }
                }
            `}</style>
        </div>
    );
}
