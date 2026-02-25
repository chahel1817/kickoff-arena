'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
    Trophy, Zap, ChevronRight, Activity,
    Sparkles, Shield, Crown, Star,
    Target, BarChart3, Globe, Users2
} from 'lucide-react';
import '../../entry.css';

export default function SquadSuccessPage() {
    const router = useRouter();
    const [team, setTeam] = useState(null);
    const [manager, setManager] = useState(null);
    const [formation, setFormation] = useState(null);
    const [gk, setGk] = useState(null);
    const [defenders, setDefenders] = useState([]);
    const [midfielders, setMidfielders] = useState([]);
    const [forwards, setForwards] = useState([]);
    const [captainId, setCaptainId] = useState(null);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
        const storedTeam = localStorage.getItem('selectedTeam');
        const storedManager = localStorage.getItem('selectedManager');
        const storedFormation = localStorage.getItem('formation');
        const storedGK = localStorage.getItem('goalkeeper');
        const storedDefs = localStorage.getItem('defenders');
        const storedMids = localStorage.getItem('midfielders');
        const storedFwds = localStorage.getItem('forwards');
        const storedCap = localStorage.getItem('selectedCaptain');

        if (storedTeam) setTeam(JSON.parse(storedTeam));
        if (storedManager) setManager(JSON.parse(storedManager));
        if (storedFormation) setFormation(JSON.parse(storedFormation));
        if (storedGK) setGk(JSON.parse(storedGK));
        if (storedDefs) setDefenders(JSON.parse(storedDefs));
        if (storedMids) setMidfielders(JSON.parse(storedMids));
        if (storedFwds) setForwards(JSON.parse(storedFwds));
        if (storedCap) setCaptainId(storedCap);
    }, []);

    const stats = useMemo(() => {
        const allPlayers = [gk, ...defenders, ...midfielders, ...forwards].filter(Boolean);
        if (allPlayers.length === 0) return { avg: 0, chem: 0 };
        const avg = Math.round(allPlayers.reduce((acc, p) => acc + p.rating, 0) / allPlayers.length);
        const chem = Math.min(100, (allPlayers.length / 11) * 100);
        return { avg, chem };
    }, [gk, defenders, midfielders, forwards]);

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
        <div className="entry-page no-snap success-view">
            <div className="stadium-bg" style={{ filter: 'brightness(0.05) saturate(0.8)' }}></div>
            <div className="particles-overlay"></div>

            <main className="success-content">
                <div className="aurora-layer"></div>
                <div className="grid-overlay"></div>

                {/* 1. HERO CELEBRATION */}
                <header className="celeb-header">
                    <div className="celeb-trophy-ring">
                        <div className="ring-pulse"></div>
                        <Trophy size={48} className="text-amber-400" />
                    </div>
                    <div className="celeb-text">
                        <div className="celeb-label">SQUAD REGISTRATION SUCCESSFUL</div>
                        <h1 className="celeb-title">ELITE <span className="text-gradient">XI</span> CONFIRMED</h1>
                        <p className="celeb-desc">Your tactical blueprint is locked. The league awaits.</p>
                    </div>
                    <div className="celeb-badges">
                        <span className="celeb-badge"><Sparkles size={14} /> Championship Ready</span>
                        <span className="celeb-badge"><Shield size={14} /> Defensive Core</span>
                        <span className="celeb-badge"><Zap size={14} /> High Press</span>
                    </div>
                </header>

                <div className="success-grid">
                    {/* 2. TACTICAL PITCH (CENTER PIECE) */}
                    <div className="pitch-canvas-wrapper glass">
                        <div className="pitch-perspective">
                            <div className="pitch-field">
                                <div className="pitch-lines">
                                    <div className="p-circle"></div>
                                    <div className="p-half"></div>
                                    <div className="p-box-top"></div>
                                    <div className="p-box-bottom"></div>
                                    <div className="p-scan-line"></div>
                                </div>

                                {pitchPositions.map((pos, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-node ${pos.type}`}
                                        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                                    >
                                        <div className="p-avatar-box">
                                            <div className="p-avatar-glow"></div>
                                            {pos.player?.image ? (
                                                <img src={pos.player.image} alt="" className="p-avatar-img" />
                                            ) : (
                                                <div className="p-avatar-placeholder">?</div>
                                            )}
                                            {pos.player?.id === captainId && (
                                                <div className="p-cap-star"><Crown size={10} /></div>
                                            )}
                                        </div>
                                        <div className="p-node-info">
                                            <span className="p-node-name">{pos.player?.name?.split(' ').pop() || 'SCOUT'}</span>
                                            <span className="p-node-rating">{pos.player?.rating || '--'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Position Shortcuts */}
                        <div className="pitch-quick-actions">
                            <button onClick={() => handleEdit('goalkeeper')} className="p-action-btn glass">
                                <Shield size={14} className="text-amber-400" /> <span>GK</span>
                            </button>
                            <button onClick={() => handleEdit('defenders')} className="p-action-btn glass">
                                <Shield size={14} className="text-blue-400" /> <span>DEF</span>
                            </button>
                            <button onClick={() => handleEdit('midfielders')} className="p-action-btn glass">
                                <Zap size={14} className="text-emerald-400" /> <span>MID</span>
                            </button>
                            <button onClick={() => handleEdit('forwards')} className="p-action-btn glass">
                                <Target size={14} className="text-red-400" /> <span>FWD</span>
                            </button>
                        </div>
                    </div>

                    {/* 3. SIDEBAR ANALYTICS */}
                    <aside className="success-sidebar">
                        <div className="data-card glass">
                            <div className="card-header">
                                <BarChart3 size={18} className="text-primary" />
                                <h3>SQUAD ANALYTICS</h3>
                            </div>
                            <div className="kpi-ring">
                                <div className="kpi-ring-inner">
                                    <div className="kpi-value">{stats.avg}</div>
                                    <div className="kpi-label">POWER INDEX</div>
                                </div>
                            </div>
                            <div className="stats-row">
                                <div className="stat-item">
                                    <span className="stat-val">{stats.avg}</span>
                                    <span className="stat-lab">AVG RATING</span>
                                </div>
                                <div className="stat-item">
                                    <span className="stat-val">{stats.chem}%</span>
                                    <span className="stat-lab">TEAM COHESION</span>
                                </div>
                            </div>
                            <div className="progress-stack">
                                <div className="progress-row">
                                    <div className="progress-label">
                                        <Activity size={14} /> Match Readiness
                                    </div>
                                    <div className="progress-track">
                                        <div className="progress-fill" style={{ width: `${Math.min(100, stats.chem + 10)}%` }}></div>
                                    </div>
                                </div>
                                <div className="progress-row">
                                    <div className="progress-label">
                                        <Star size={14} /> Leadership Sync
                                    </div>
                                    <div className="progress-track">
                                        <div className="progress-fill alt" style={{ width: `${Math.min(100, stats.avg + 5)}%` }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="team-meta">
                                <div className="meta-item">
                                    <Globe size={14} />
                                    <span>{team?.name || 'GLOBAL SCOUTED'}</span>
                                </div>
                                <div className="meta-item">
                                    <Users2 size={14} />
                                    <span>{manager?.name || 'HEAD COACH'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="cta-group">
                            <button onClick={() => router.push('/summary')} className="primary-cta-v3">
                                <div className="cta-icon-box"><Sparkles size={20} /></div>
                                <div className="cta-text">
                                    <span className="cta-sub">VIEW FULL BRIEFING</span>
                                    <span className="cta-main">SEASON SUMMARY</span>
                                </div>
                                <ChevronRight size={20} />
                            </button>

                            <button onClick={() => router.push('/match')} className="secondary-cta-v3 glass">
                                <Zap size={20} className="text-red-500" />
                                <span>ENTER SHOOTOUT ARENA</span>
                            </button>
                        </div>
                    </aside>
                </div>
            </main>

            <style jsx>{`
                .success-view { 
                    background: #02040a; 
                    min-height: 100vh;
                    overflow-x: hidden;
                }

                .aurora-layer {
                    position: absolute;
                    inset: -20% -10% auto -10%;
                    height: 60%;
                    background: radial-gradient(circle at 20% 20%, rgba(0, 255, 136, 0.2), transparent 55%),
                                radial-gradient(circle at 80% 10%, rgba(59, 130, 246, 0.2), transparent 60%),
                                radial-gradient(circle at 50% 40%, rgba(245, 158, 11, 0.18), transparent 55%);
                    filter: blur(60px);
                    opacity: 0.7;
                    pointer-events: none;
                }

                .grid-overlay {
                    position: absolute;
                    inset: 0;
                    background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
                    background-size: 60px 60px;
                    opacity: 0.15;
                    pointer-events: none;
                }
                
                .particles-overlay {
                    position: fixed; inset: 0;
                    background-image: 
                        radial-gradient(circle at 20% 30%, rgba(0, 255, 136, 0.05) 0%, transparent 50%),
                        radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.05) 0%, transparent 50%);
                    pointer-events: none;
                }

                .success-content {
                    max-width: 1320px;
                    margin: 0 auto;
                    padding: clamp(5rem, 7vw, 9rem) clamp(2rem, 5vw, 4rem) 6rem;
                    display: flex;
                    flex-direction: column;
                    gap: clamp(3rem, 5vw, 5rem);
                    animation: viewEntry 1s cubic-bezier(0.23, 1, 0.32, 1);
                    position: relative;
                }

                @keyframes viewEntry {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* Header */
                .celeb-header { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; position: relative; }
                .celeb-trophy-ring {
                    width: 100px; height: 100px; border-radius: 50%;
                    background: radial-gradient(circle, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.05));
                    border: 1px solid rgba(245, 158, 11, 0.3);
                    display: flex; align-items: center; justify-content: center;
                    position: relative;
                    box-shadow: 0 20px 60px rgba(245, 158, 11, 0.25);
                }
                .ring-pulse {
                    position: absolute; inset: -15px; border: 2px solid rgba(245, 158, 11, 0.2);
                    border-radius: 50%; animation: ringPulse 3s infinite;
                }
                @keyframes ringPulse {
                    0% { transform: scale(1); opacity: 1; }
                    100% { transform: scale(1.5); opacity: 0; }
                }
                .celeb-label { font-size: 0.7rem; font-weight: 900; letter-spacing: 0.45em; color: rgba(255,255,255,0.5); }
                .celeb-title { font-size: clamp(2.6rem, 6vw, 4.5rem); font-weight: 950; letter-spacing: -0.04em; color: white; margin: 0.2rem 0; }
                .celeb-desc { font-size: 1.1rem; color: rgba(255,255,255,0.5); max-width: 520px; }

                .celeb-badges {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 0.75rem;
                }
                .celeb-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.45rem 0.9rem;
                    border-radius: 999px;
                    background: rgba(255,255,255,0.06);
                    border: 1px solid rgba(255,255,255,0.12);
                    color: rgba(255,255,255,0.7);
                    font-size: 0.7rem;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                }

                /* Grid Layout — pitch top, sidebar below */
                .success-grid {
                    display: flex;
                    flex-direction: column;
                    gap: 4rem;
                }

                /* Pitch Canvas */
                .pitch-canvas-wrapper {
                    padding: 2rem 2.5rem 5.5rem; border-radius: 40px;
                    background: rgba(8, 12, 25, 0.6);
                    border: 1px solid rgba(255,255,255,0.1);
                    position: relative;
                    box-shadow: 0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,255,136,0.03);
                    overflow: visible;
                }
                .pitch-canvas-wrapper::before {
                    content: '';
                    position: absolute;
                    inset: 0; border-radius: 40px;
                    background: radial-gradient(circle at 10% 10%, rgba(0,255,136,0.1), transparent 45%),
                                radial-gradient(circle at 90% 0%, rgba(59,130,246,0.08), transparent 45%);
                    opacity: 0.9;
                    pointer-events: none;
                }
                .pitch-perspective {
                    transform: none;
                }
                .pitch-field {
                    position: relative;
                    width: 100%;
                    aspect-ratio: 1.8 / 1;
                    min-height: 520px;
                    background: 
                        repeating-linear-gradient(
                            180deg,
                            rgba(30, 70, 50, 0.6) 0px,
                            rgba(30, 70, 50, 0.6) 40px,
                            rgba(20, 55, 38, 0.6) 40px,
                            rgba(20, 55, 38, 0.6) 80px
                        ),
                        linear-gradient(to bottom, rgba(12, 40, 28, 1) 0%, rgba(5, 22, 14, 1) 100%);
                    border: 2px solid rgba(255,255,255,0.08);
                    border-radius: 28px; overflow: hidden;
                    box-shadow: 
                        0 0 80px rgba(0,130,60,0.12),
                        inset 0 0 60px rgba(0,0,0,0.5),
                        inset 0 0 0 1px rgba(255,255,255,0.04);
                }
                .pitch-lines { position: absolute; inset: 0; pointer-events: none; opacity: 0.22; }
                .p-circle { position: absolute; top:50%; left:50%; width:130px; height:130px; border:1.5px solid white; border-radius:50%; transform:translate(-50%,-50%); }
                .p-half { position: absolute; top:50%; left:0; width:100%; height:1.5px; background:white; }
                .p-box-top { position: absolute; top:0; left:25%; width:50%; height:20%; border:1.5px solid white; border-top:0; border-radius:0 0 8px 8px; }
                .p-box-bottom { position: absolute; bottom:0; left:25%; width:50%; height:20%; border:1.5px solid white; border-bottom:0; border-radius:8px 8px 0 0; }
                
                .p-scan-line {
                    position: absolute; top: -50%; left: 0; width: 100%; height: 50%;
                    background: linear-gradient(to bottom, transparent, rgba(0, 255, 136, 0.1), transparent);
                    animation: fieldScan 4s linear infinite;
                }
                @keyframes fieldScan {
                    0% { top: -50%; }
                    100% { top: 150%; }
                }

                /* Nodes */
                .p-node { 
                    position: absolute; transform: translate(-50%, -50%); 
                    display: flex; flex-direction: column; align-items: center; gap: 0.35rem;
                    z-index: 10; cursor: default; width: 76px;
                }
                .p-avatar-box { position: relative; width: 46px; height: 46px; flex-shrink: 0; }
                .p-avatar-img { 
                    width: 100%; height: 100%; border-radius: 50%; object-fit: cover; 
                    border: 2px solid white; position: relative; z-index: 2;
                }
                .p-avatar-glow { 
                    position: absolute; inset: -4px; border-radius: 50%; 
                    opacity: 0.3; filter: blur(8px); 
                }
                .p-avatar-placeholder { 
                    width: 100%; height: 100%; border-radius: 50%; background: #222;
                    border: 1px dashed #444; display: flex; align-items: center; justify-content: center;
                    color: #666; font-weight: 900;
                }
                .p-cap-star {
                    position: absolute; top: -4px; right: -4px; z-index: 5;
                    background: #f59e0b; color: black; padding: 2px; border-radius: 50%;
                    border: 1px solid white; box-shadow: 0 0 10px rgba(245,158,11,0.5);
                }

                .p-node.gk .p-avatar-img { border-color: #f59e0b; }
                .p-node.gk .p-avatar-glow { background: #f59e0b; }
                .p-node.def .p-avatar-img { border-color: #3b82f6; }
                .p-node.def .p-avatar-glow { background: #3b82f6; }
                .p-node.mid .p-avatar-img { border-color: #10b981; }
                .p-node.mid .p-avatar-glow { background: #10b981; }
                .p-node.fwd .p-avatar-img { border-color: #ef4444; }
                .p-node.fwd .p-avatar-glow { background: #ef4444; }

                .p-node-info { display: flex; flex-direction: column; align-items: center; gap: 0.15rem; width: 100%; }
                .p-node-name { 
                    font-size: 0.6rem; 
                    font-weight: 900; 
                    color: white; 
                    text-shadow: 0 1px 4px rgba(0,0,0,1); 
                    letter-spacing: 0.06em; 
                    text-transform: uppercase; 
                    text-align: center;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    width: 100%;
                    background: rgba(0,0,0,0.65);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 6px;
                    padding: 0.12rem 0.3rem;
                }
                .p-node-rating { 
                    font-size: 0.58rem; font-weight: 950; line-height: 1;
                    color: rgba(255,255,255,0.8);
                    background: rgba(0,0,0,0.6);
                    border: 1px solid rgba(255,255,255,0.12);
                    border-radius: 999px;
                    padding: 0.1rem 0.4rem;
                    width: fit-content;
                }

                .pitch-quick-actions {
                    position: absolute; bottom: -3rem; left: 50%; transform: translateX(-50%);
                    display: flex; gap: 0.75rem; z-index: 100; white-space: nowrap;
                }
                .p-action-btn {
                    padding: 0.5rem 1.4rem; border-radius: 100px; border: 1px solid rgba(255,255,255,0.08);
                    display: flex; align-items: center; gap: 0.5rem; font-size: 0.7rem; font-weight: 900;
                    color: rgba(255,255,255,0.5); cursor: pointer; transition: 0.3s; background: rgba(10,10,20,0.8);
                }
                .p-action-btn:hover { background: rgba(255,255,255,0.08); color: white; transform: translateY(-3px); border-color: rgba(255,255,255,0.25); }

                /* Sidebar Analytics — horizontal row below pitch */
                .success-sidebar { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
                .data-card { padding: 2.2rem; border-radius: 30px; border: 1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); }
                .card-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; }
                .card-header h3 { font-size: 0.75rem; font-weight: 900; letter-spacing: 0.18em; color: rgba(255,255,255,0.5); }

                .kpi-ring {
                    width: 140px;
                    height: 140px;
                    border-radius: 50%;
                    margin: 0 auto 2rem;
                    background: conic-gradient(#00ff88 0deg, #00ff88 ${Math.min(360, stats.avg * 3.6)}deg, rgba(255,255,255,0.08) 0deg);
                    display: grid;
                    place-items: center;
                    box-shadow: 0 20px 40px rgba(0,255,136,0.15);
                }
                .kpi-ring-inner {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    background: rgba(4, 10, 12, 0.95);
                    border: 1px solid rgba(255,255,255,0.1);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 0.2rem;
                }
                .kpi-value { font-size: 2rem; font-weight: 950; color: white; letter-spacing: -0.04em; }
                .kpi-label { font-size: 0.55rem; letter-spacing: 0.2em; color: rgba(255,255,255,0.45); font-weight: 800; }
                
                .stats-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; }
                .stat-item { 
                    padding: 1.5rem; border-radius: 20px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.04);
                    text-align: center;
                }
                .stat-val { display: block; font-size: 2.5rem; font-weight: 950; color: white; letter-spacing: -0.05em; }
                .stat-lab { font-size: 0.6rem; font-weight: 800; color: rgba(255,255,255,0.2); letter-spacing: 0.1em; }

                .progress-stack { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 2rem; }
                .progress-row { display: flex; flex-direction: column; gap: 0.6rem; }
                .progress-label { display: flex; align-items: center; gap: 0.5rem; font-size: 0.7rem; letter-spacing: 0.08em; font-weight: 800; color: rgba(255,255,255,0.55); text-transform: uppercase; }
                .progress-track {
                    width: 100%; height: 10px; border-radius: 999px;
                    background: rgba(255,255,255,0.08);
                    overflow: hidden; border: 1px solid rgba(255,255,255,0.08);
                }
                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #00ff88, #22c55e);
                    box-shadow: 0 0 10px rgba(0,255,136,0.4);
                }
                .progress-fill.alt {
                    background: linear-gradient(90deg, #60a5fa, #3b82f6);
                    box-shadow: 0 0 10px rgba(59,130,246,0.4);
                }

                .team-meta { display: flex; flex-direction: column; gap: 1rem; }
                .meta-item { display: flex; align-items: center; gap: 1rem; color: rgba(255,255,255,0.55); font-size: 0.9rem; font-weight: 700; }
                
                /* CTAs */
                .cta-group { display: flex; flex-direction: column; gap: 1rem; }
                
                .primary-cta-v3 {
                    display: flex; align-items: center; gap: 1.5rem;
                    padding: 1.25rem 2rem; border-radius: 24px; border: none;
                    background: linear-gradient(135deg, #00ff88, #059669);
                    color: #01160d; cursor: pointer; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    box-shadow: 0 10px 40px rgba(0, 255, 136, 0.2);
                }
                .cta-icon-box { 
                    width: 44px; height: 44px; border-radius: 12px;
                    background: rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center;
                }
                .cta-text { display: flex; flex-direction: column; align-items: flex-start; flex: 1; }
                .cta-sub { font-size: 0.65rem; font-weight: 800; opacity: 0.6; }
                .cta-main { font-size: 1rem; font-weight: 950; letter-spacing: -0.01em; }
                .primary-cta-v3:hover { transform: translateY(-4px) translateX(6px); box-shadow: 0 25px 70px rgba(0, 255, 136, 0.45); }

                .secondary-cta-v3 {
                    display: flex; align-items: center; justify-content: center; gap: 1rem;
                    padding: 1.25rem; border-radius: 24px; border: 1px solid rgba(255,255,255,0.08);
                    color: rgba(255,255,255,0.6); font-size: 0.9rem; font-weight: 800;
                    cursor: pointer; transition: 0.3s;
                }
                .secondary-cta-v3:hover { background: rgba(255,255,255,0.05); color: white; border-color: rgba(255,255,255,0.2); }

                @media (max-width: 768px) {
                    .pitch-canvas-wrapper { padding: 1rem 1rem 4.5rem; }
                    .pitch-field { aspect-ratio: 1.4 / 1; min-height: 320px; }
                    .success-sidebar { grid-template-columns: 1fr; }
                    .p-avatar-box { width: 32px; height: 32px; }
                    .p-node { width: 54px; }
                    .p-action-btn span { display: none; }
                    .celeb-badges { gap: 0.5rem; }
                    .kpi-ring { width: 120px; height: 120px; }
                    .kpi-ring-inner { width: 88px; height: 88px; }
                }
            `}</style>
        </div>
    );
}
