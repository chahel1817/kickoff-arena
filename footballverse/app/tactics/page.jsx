'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Shield, Save, RotateCcw, Layers, Check, Info } from 'lucide-react';
import PlayerStatsModal from '@/components/modals/PlayerStatsModal';
import { getSafePlayerImage } from '@/lib/playerImage';

const POS_COLORS = {
    gk: '#f59e0b',
    def: '#3b82f6',
    mid: '#a855f7',
    fwd: '#ef4444',
};

export default function TacticsBoardPage() {
    const { user, saveSquad } = useAuth();
    const pitchRef = useRef(null);

    // Layout: array of { id, x, y, type, player }
    const [positions, setPositions] = useState([]);
    const [dragging, setDragging] = useState(null); // { id, startX, startY, offsetX, offsetY }
    const [saved, setSaved] = useState(false);
    const [formation, setFormation] = useState(null);
    const [viewingStats, setViewingStats] = useState(null);

    useEffect(() => {
        if (!user) return;
        setFormation(user.formation);

        // If user has a custom tactics layout, use that
        if (user.tacticsLayout?.length) {
            setPositions(user.tacticsLayout);
            return;
        }

        // Otherwise build from formation
        buildDefaultLayout(user);
    }, [user]);

    function buildDefaultLayout(u) {
        if (!u) return;
        const form = u.formation;
        const pos = [];

        // GK
        if (u.goalkeeper) pos.push({ id: 'gk', x: 50, y: 88, type: 'gk', player: u.goalkeeper });

        const cleanName = form?.name?.replace(/\s*\(.*?\)\s*/g, '') || '4-3-3';
        const parts = cleanName.split('-').map(Number);

        const buildRow = (players, y, type, count) => {
            const sp = 80 / (count + 1);
            for (let i = 0; i < count; i++) {
                pos.push({
                    id: `${type}-${i}`,
                    x: Math.round(10 + sp * (i + 1)),
                    y,
                    type,
                    player: players[i] || null,
                });
            }
        };

        if (parts.length >= 3) {
            buildRow(u.defenders || [], 72, 'def', parts[0]);
            if (parts.length === 3) {
                buildRow(u.midfielders || [], 48, 'mid', parts[1]);
                buildRow(u.forwards || [], 20, 'fwd', parts[2]);
            } else if (parts.length === 4) {
                buildRow(u.midfielders || [], 55, 'mid', parts[1]);
                buildRow(u.midfielders?.slice(parts[1]) || [], 35, 'mid', parts[2]);
                buildRow(u.forwards || [], 18, 'fwd', parts[3]);
            }
        }

        setPositions(pos);
    }

    // Drag handlers
    const onPointerDown = useCallback((e, id) => {
        e.preventDefault();
        const pitch = pitchRef.current;
        if (!pitch) return;
        const rect = pitch.getBoundingClientRect();
        const pct = positions.find(p => p.id === id);
        if (!pct) return;
        const currentPx = {
            x: (pct.x / 100) * rect.width,
            y: (pct.y / 100) * rect.height,
        };
        setDragging({
            id,
            offsetX: e.clientX - rect.left - currentPx.x,
            offsetY: e.clientY - rect.top - currentPx.y,
        });
    }, [positions]);

    const onPointerMove = useCallback((e) => {
        if (!dragging) return;
        const pitch = pitchRef.current;
        if (!pitch) return;
        const rect = pitch.getBoundingClientRect();
        const rawX = e.clientX - rect.left - dragging.offsetX;
        const rawY = e.clientY - rect.top - dragging.offsetY;
        const x = Math.min(95, Math.max(5, (rawX / rect.width) * 100));
        const y = Math.min(95, Math.max(5, (rawY / rect.height) * 100));
        setPositions(prev => prev.map(p => p.id === dragging.id ? { ...p, x, y } : p));
    }, [dragging]);

    const onPointerUp = useCallback(() => {
        setDragging(null);
    }, []);

    async function handleSave() {
        await saveSquad({ tacticsLayout: positions });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    }

    function handleReset() {
        if (user) buildDefaultLayout(user);
    }

    const posColor = (type) => POS_COLORS[type] || '#fff';

    return (
        <div
            className="tb-root"
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            style={{ touchAction: 'none' }}
        >
            <div className="tb-bg" />

            <div className="tb-header">
                <div className="tb-header-left">
                    <div className="tb-icon"><Layers size={22} /></div>
                    <div>
                        <h1 className="tb-title">TACTICS BOARD</h1>
                        <p className="tb-sub">{formation?.name || 'Formation'} · Drag players to reposition</p>
                    </div>
                </div>
                <div className="tb-actions">
                    <button className="tb-btn reset" onClick={handleReset}>
                        <RotateCcw size={16} /> Reset
                    </button>
                    <button className="tb-btn save" onClick={handleSave}>
                        {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Layout</>}
                    </button>
                </div>
            </div>

            <div className="tb-pitch-wrap">
                <div
                    ref={pitchRef}
                    className="tb-pitch"
                    style={{ userSelect: 'none' }}
                >
                    {/* Field markings */}
                    <div className="tb-center-circle" />
                    <div className="tb-center-line" />
                    <div className="tb-penalty-top" />
                    <div className="tb-penalty-bottom" />
                    <div className="tb-goal-top" />
                    <div className="tb-goal-bottom" />

                    {/* Players */}
                    {positions.map(pos => (
                        <div
                            key={pos.id}
                            className={`tb-player ${dragging?.id === pos.id ? 'dragging' : ''}`}
                            style={{
                                left: `${pos.x}%`,
                                top: `${pos.y}%`,
                                transform: 'translate(-50%,-50%)',
                                '--pc': posColor(pos.type),
                            }}
                            onPointerDown={e => onPointerDown(e, pos.id)}
                        >
                            <div className="tb-player-avatar">
                                {pos.player ? (
                                    <img src={getSafePlayerImage(pos.player, { proxify: true })} alt={pos.player.name} />
                                ) : (
                                    <span>{pos.player?.name?.charAt(0) || '?'}</span>
                                )}
                                <div className="tb-player-pos-badge">{pos.type.toUpperCase()}</div>

                                {pos.player && (
                                    <button
                                        className="tb-info-btn"
                                        onPointerDown={e => e.stopPropagation()}
                                        onClick={() => setViewingStats(pos.player)}
                                    >
                                        <Info size={10} />
                                    </button>
                                )}
                            </div>
                            <div className="tb-player-name">
                                {pos.player?.name?.split(' ').pop() || '—'}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Legend */}
                <div className="tb-legend">
                    {Object.entries(POS_COLORS).map(([type, color]) => (
                        <div key={type} className="tb-leg-item">
                            <div className="tb-leg-dot" style={{ background: color }} />
                            <span>{type.toUpperCase()}</span>
                        </div>
                    ))}
                    <div className="tb-leg-item">
                        <Shield size={12} style={{ color: 'rgba(255,255,255,.3)' }} />
                        <span>Drag to reposition</span>
                    </div>
                </div>
            </div>

            {viewingStats && (
                <PlayerStatsModal
                    player={viewingStats}
                    onClose={() => setViewingStats(null)}
                />
            )}

            <style>{`
                .tb-root { min-height:100vh; background:#02040a; padding:2rem; box-sizing:border-box; position:relative; }
                .tb-bg { position:fixed; inset:0; background:radial-gradient(ellipse 70% 50% at 50% 0%, rgba(0,255,136,0.04) 0%, transparent 70%); pointer-events:none; }
                .tb-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem; flex-wrap:wrap; gap:1rem; position:relative; z-index:10; }
                .tb-header-left { display:flex; align-items:center; gap:1rem; }
                .tb-icon { width:52px; height:52px; border-radius:16px; background:rgba(0,255,136,.07); border:1px solid rgba(0,255,136,.2); display:flex; align-items:center; justify-content:center; color:#00ff88; }
                .tb-title { font-size:1.8rem; font-weight:950; color:white; letter-spacing:-.02em; }
                .tb-sub { font-size:.75rem; color:rgba(255,255,255,.3); font-weight:600; }
                .tb-actions { display:flex; gap:.75rem; }
                .tb-btn { display:flex; align-items:center; gap:.5rem; padding:.7rem 1.4rem; border-radius:14px; font-size:.8rem; font-weight:900; cursor:pointer; transition:.25s; letter-spacing:.05em; border:none; }
                .tb-btn.reset { background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1); color:rgba(255,255,255,.6); }
                .tb-btn.reset:hover { background:rgba(255,255,255,.1); color:white; }
                .tb-btn.save { background:linear-gradient(135deg,#00ff88,#059669); color:#01160d; box-shadow:0 8px 25px rgba(0,255,136,.2); }
                .tb-btn.save:hover { transform:translateY(-2px); box-shadow:0 12px 30px rgba(0,255,136,.35); }

                .tb-pitch-wrap { display:flex; flex-direction:column; align-items:center; gap:1.5rem; position:relative; z-index:5; }
                .tb-pitch {
                    position:relative; width:100%; max-width:700px; aspect-ratio:3/4;
                    background:linear-gradient(180deg, rgba(15,40,25,0.95) 0%, rgba(8,20,12,1) 100%);
                    border:2px solid rgba(255,255,255,.12); border-radius:24px; overflow:hidden;
                    box-shadow:0 40px 100px -20px rgba(0,0,0,.9), inset 0 0 60px rgba(0,0,0,.3);
                    cursor:grab;
                }
                .tb-pitch:active { cursor:grabbing; }

                /* Field markings */
                .tb-center-circle { position:absolute; top:50%; left:50%; width:100px; height:100px; border:1.5px solid rgba(255,255,255,.12); border-radius:50%; transform:translate(-50%,-50%); }
                .tb-center-line { position:absolute; top:50%; left:0; right:0; height:1.5px; background:rgba(255,255,255,.1); }
                .tb-penalty-top { position:absolute; top:0; left:22%; right:22%; height:18%; border:1.5px solid rgba(255,255,255,.1); border-top:none; border-radius:0 0 6px 6px; }
                .tb-penalty-bottom { position:absolute; bottom:0; left:22%; right:22%; height:18%; border:1.5px solid rgba(255,255,255,.1); border-bottom:none; border-radius:6px 6px 0 0; }
                .tb-goal-top { position:absolute; top:0; left:36%; right:36%; height:6%; border:1.5px solid rgba(255,255,255,.1); border-top:none; }
                .tb-goal-bottom { position:absolute; bottom:0; left:36%; right:36%; height:6%; border:1.5px solid rgba(255,255,255,.1); border-bottom:none; }

                /* Players */
                .tb-player {
                    position:absolute; display:flex; flex-direction:column; align-items:center; gap:.35rem;
                    cursor:grab; z-index:10; transition:filter .2s;
                }
                .tb-player:active, .tb-player.dragging { cursor:grabbing; z-index:100; filter:drop-shadow(0 0 20px var(--pc)); }
                .tb-player-avatar {
                    position:relative; width:44px; height:44px; border-radius:50%;
                    border:2.5px solid var(--pc); overflow:hidden;
                    background:rgba(0,0,0,.6); box-shadow:0 0 15px rgba(0,0,0,.5);
                    display:flex; align-items:center; justify-content:center;
                    transition:.25s;
                }
                .tb-player.dragging .tb-player-avatar { transform:scale(1.18); box-shadow:0 0 25px var(--pc); }
                .tb-player-avatar img { width:100%; height:100%; object-fit:cover; object-position:top; }
                .tb-player-avatar span { font-size:.9rem; font-weight:900; color:var(--pc); }
                .tb-player-pos-badge {
                    position:absolute; bottom:-2px; right:-2px; background:var(--pc); color:#000;
                    font-size:.4rem; font-weight:950; padding:.1rem .3rem; border-radius:4px; border:1px solid rgba(0,0,0,.3);
                }
                .tb-player-name {
                    background:rgba(0,0,0,.7); backdrop-filter:blur(4px); padding:2px 8px;
                    border-radius:100px; color:white; font-size:.5rem; font-weight:900;
                    white-space:nowrap; border:1px solid rgba(255,255,255,.08);
                    letter-spacing:.03em; max-width:80px; overflow:hidden; text-overflow:ellipsis; text-align:center;
                }

                .tb-info-btn {
                    position: absolute; top: -2px; right: -2px; z-index: 20;
                    width: 16px; height: 16px; border-radius: 50%;
                    background: #111; color: white; border: 1px solid rgba(255,255,255,0.2);
                    display: flex; align-items: center; justify-content: center;
                    cursor: pointer; opacity: 0; transition: .2s;
                }
                .tb-player:hover .tb-info-btn { opacity: 1; }
                .tb-info-btn:hover { background: var(--pc); border-color: white; color: black; }

                /* Legend */
                .tb-legend { display:flex; align-items:center; gap:1.5rem; flex-wrap:wrap; justify-content:center; }
                .tb-leg-item { display:flex; align-items:center; gap:.4rem; font-size:.6rem; font-weight:700; color:rgba(255,255,255,.3); }
                .tb-leg-dot { width:10px; height:10px; border-radius:50%; }

                @media(max-width:600px) {
                    .tb-title { font-size:1.3rem; }
                    .tb-header { flex-direction:column; align-items:flex-start; }
                }
            `}</style>
        </div>
    );
}
