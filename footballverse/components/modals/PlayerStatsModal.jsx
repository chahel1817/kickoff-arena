'use client';

import { X, Star, Zap, Shield, Target, Activity, Move, Share2 } from 'lucide-react';
import { useEffect, useRef } from 'react';

export default function PlayerStatsModal({ player, onClose }) {
    const scrollRef = useRef(null);

    useEffect(() => {
        if (player && scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [player]);

    if (!player) return null;

    const isFwd = ['ST', 'LW', 'RW', 'CF'].some(p => player.position?.includes(p));
    const isMid = ['CM', 'CAM', 'CDM', 'LM', 'RM'].some(p => player.position?.includes(p));
    const isDef = ['CB', 'LB', 'RB', 'LWB', 'RWB'].some(p => player.position?.includes(p));
    const isGk = player.position === 'GK';

    // Role-aware Derived stats
    const stats = player.stats || {
        pace: Math.min(99, player.rating + (isFwd ? 8 : isDef ? -5 : 0) + Math.floor(Math.random() * 6)),
        shooting: Math.min(99, player.rating + (isFwd ? 10 : isDef ? -20 : -5) + Math.floor(Math.random() * 6)),
        passing: Math.min(99, player.rating + (isMid ? 8 : isDef ? -5 : 0) + Math.floor(Math.random() * 6)),
        dribbling: Math.min(99, player.rating + (isFwd || isMid ? 7 : -10) + Math.floor(Math.random() * 6)),
        defending: Math.min(99, isGk ? 15 : player.rating + (isDef ? 10 : -35) + Math.floor(Math.random() * 6)),
        physical: Math.min(99, player.rating + (isDef || isGk ? 5 : -5) + Math.floor(Math.random() * 6)),
    };

    const posColor = (p = '') => {
        const u = p.toUpperCase();
        if (['GK'].some(x => u.includes(x))) return '#f59e0b';
        if (['FW', 'ST', 'LW', 'RW'].some(x => u.includes(x))) return '#ef4444';
        if (['MF', 'CM', 'CAM', 'CDM', 'LM', 'RM'].some(x => u.includes(x))) return '#a855f7';
        return '#3b82f6';
    };

    return (
        <div className="psm-overlay" onClick={onClose}>
            <div className="psm-card glass" ref={scrollRef} onClick={e => e.stopPropagation()}>
                <button className="psm-close" onClick={onClose}><X size={20} /></button>

                <div className="psm-header">
                    <div className="psm-photo-wrap" style={{ borderColor: posColor(player.position) }}>
                        <img src={player.image || '/players/placeholder.png'} alt={player.name} className="psm-photo" />
                        <div className="psm-rating-badge" style={{ background: posColor(player.position) }}>{player.rating}</div>
                    </div>
                    <div className="psm-info">
                        <span className="psm-pos" style={{ color: posColor(player.position) }}>{player.position}</span>
                        <h2 className="psm-name">{player.name}</h2>
                        <p className="psm-club">{player.club || 'Elite Squad'}</p>
                    </div>
                </div>

                <div className="psm-stats-grid">
                    {Object.entries(stats).map(([key, val]) => (
                        <div key={key} className="psm-stat-row">
                            <div className="psm-stat-label">
                                {key === 'pace' && <Zap size={12} />}
                                {key === 'shooting' && <Target size={12} />}
                                {key === 'passing' && <Share2 size={12} />}
                                {key === 'dribbling' && <Move size={12} />}
                                {key === 'defending' && <Shield size={12} />}
                                {key === 'physical' && <Activity size={12} />}
                                <span className="uppercase">{key}</span>
                            </div>
                            <div className="psm-stat-bar-wrap">
                                <div className="psm-stat-bar-fill" style={{ width: `${val}%`, background: posColor(player.position) }} />
                                <span className="psm-stat-val">{val}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="psm-footer">
                    <div className="psm-trait"><Star size={12} /> {isFwd ? 'Clinical Finisher' : isMid ? 'Maestro' : isDef ? 'Tank' : 'Cat-like'}</div>
                    <div className="psm-trait"><Star size={12} /> {player.tier === 'legend' ? 'Iconic Aura' : 'Career Master'}</div>
                </div>
            </div>

            <style jsx>{`
                .psm-overlay {
                    position: fixed; inset: 0; background: rgba(0,0,0,0.85); 
                    backdrop-filter: blur(8px); z-index: 9999;
                    display: flex; align-items: center; justify-content: center; padding: 2rem;
                    animation: fadeIn 0.3s ease;
                }
                .psm-card {
                    width: 100%; max-width: 440px; background: rgba(10,12,25,0.9);
                    border: 1px solid rgba(255,255,255,0.1); border-radius: 32px;
                    padding: 2.5rem; position: relative;
                    box-shadow: 0 40px 100px rgba(0,0,0,0.8);
                    animation: slideUp 0.4s cubic-bezier(0.19, 1, 0.22, 1);
                    max-height: 90vh; overflow-y: auto;
                }
                .psm-close {
                    position: absolute; top: 1.5rem; right: 1.5rem; background: rgba(255,255,255,0.05);
                    border: none; color: white; cursor: pointer; width: 36px; height: 36px; 
                    border-radius: 50%; display: flex; align-items: center; justify-content: center;
                    transition: 0.2s;
                }
                .psm-close:hover { background: rgba(239,68,68,0.2); color: #ef4444; }

                .psm-header { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2rem; }
                .psm-photo-wrap {
                    position: relative; width: 90px; height: 90px; border-radius: 20px;
                    border: 2px solid; overflow: hidden; background: rgba(0,0,0,0.4);
                }
                .psm-photo { width: 100%; height: 100%; object-fit: cover; object-position: top; }
                .psm-rating-badge {
                    position: absolute; bottom: 0; left: 0; right: 0;
                    text-align: center; color: black; font-weight: 950; font-size: 0.9rem;
                    padding: 2px 0;
                }
                .psm-info { flex: 1; }
                .psm-pos { font-size: 0.75rem; font-weight: 900; letter-spacing: 0.1em; }
                .psm-name { font-size: 1.8rem; font-weight: 950; color: white; margin: 0.2rem 0; letter-spacing: -0.02em; }
                .psm-club { font-size: 0.85rem; color: rgba(255,255,255,0.4); font-weight: 600; }

                .psm-stats-grid { display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: 2rem; }
                .psm-stat-row { display: flex; align-items: center; gap: 1rem; }
                .psm-stat-label { 
                    width: 100px; display: flex; align-items: center; gap: 0.5rem;
                    font-size: 0.65rem; font-weight: 800; color: rgba(255,255,255,0.3);
                }
                .psm-stat-bar-wrap {
                    flex: 1; height: 10px; background: rgba(255,255,255,0.05);
                    border-radius: 100px; position: relative; overflow: hidden;
                    display: flex; align-items: center;
                }
                .psm-stat-bar-fill { height: 100%; border-radius: 100px; transition: 1s cubic-bezier(0.19, 1, 0.22, 1); }
                .psm-stat-val { 
                    position: absolute; right: 0.6rem; top: 50%; transform: translateY(-50%);
                    font-size: 0.6rem; font-weight: 900; color: white;
                }

                .psm-footer { display: flex; gap: 0.8rem; flex-wrap: wrap; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 1.5rem; }
                .psm-trait {
                    display: flex; align-items: center; gap: 0.4rem; font-size: 0.65rem; font-weight: 800;
                    color: rgba(255,255,255,0.6); background: rgba(255,255,255,0.05); padding: 0.5rem 1rem;
                    border-radius: 100px; border: 1px solid rgba(255,255,255,0.08);
                }

                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
}
