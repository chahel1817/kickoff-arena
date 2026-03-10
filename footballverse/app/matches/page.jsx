'use client';

import { useAuth } from '@/context/AuthContext';
import { Trophy, Target, Check, X, Calendar, BarChart3 } from 'lucide-react';

function fmt(d) {
    try { return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); } catch { return '—'; }
}

const ZONE_LABELS = { tl: 'Top-L', tc: 'Top-C', tr: 'Top-R', ml: 'Mid-L', mc: 'Centre', mr: 'Mid-R', bl: 'Low-L', bc: 'Low-C', br: 'Low-R' };

export default function MatchHistoryPage() {
    const { matchHistory, isLoggedIn } = useAuth();
    const sorted = [...(matchHistory || [])].reverse();

    const overall = {
        total: sorted.length,
        perfect: sorted.filter(m => m.score === m.total).length,
        avgScore: sorted.length ? (sorted.reduce((s, m) => s + m.score, 0) / sorted.length).toFixed(1) : '—',
        goals: sorted.reduce((s, m) => s + m.score, 0),
        shots: sorted.reduce((s, m) => s + (m.total || 5), 0),
    };

    return (
        <div className="mh-root">
            <div className="mh-bg" />

            <div className="mh-header">
                <div className="mh-icon"><Trophy size={22} /></div>
                <div>
                    <h1 className="mh-title">MATCH HISTORY</h1>
                    <p className="mh-sub">Penalty shootout records</p>
                </div>
            </div>

            {/* Stats overview */}
            {sorted.length > 0 && (
                <div className="mh-stats-row">
                    <div className="mh-stat glass">
                        <span className="mh-stat-val">{overall.total}</span>
                        <span className="mh-stat-label">MATCHES</span>
                    </div>
                    <div className="mh-stat glass">
                        <span className="mh-stat-val">{overall.goals}</span>
                        <span className="mh-stat-label">TOTAL GOALS</span>
                    </div>
                    <div className="mh-stat glass">
                        <span className="mh-stat-val">{overall.avgScore}</span>
                        <span className="mh-stat-label">AVG SCORE</span>
                    </div>
                    <div className="mh-stat glass">
                        <span className="mh-stat-val">{overall.perfect}</span>
                        <span className="mh-stat-label">PERFECT 5/5</span>
                    </div>
                    <div className="mh-stat glass">
                        <span className="mh-stat-val">{overall.shots > 0 ? Math.round((overall.goals / overall.shots) * 100) : 0}%</span>
                        <span className="mh-stat-label">CONVERSION</span>
                    </div>
                </div>
            )}

            {sorted.length === 0 && (
                <div className="mh-empty glass">
                    <Target size={48} className="mh-empty-icon" />
                    <h3>No matches yet</h3>
                    <p>Complete a penalty shootout to see your history here.</p>
                    {!isLoggedIn && <p className="mh-empty-warn">⚠️ Sign in to save your history across sessions.</p>}
                </div>
            )}

            <div className="mh-list">
                {sorted.map((match, i) => {
                    const isPerfect = match.score === match.total;
                    const pct = Math.round((match.score / (match.total || 5)) * 100);
                    return (
                        <div key={i} className={`mh-card glass ${isPerfect ? 'perfect' : ''}`}>
                            <div className="mh-card-header">
                                <div className="mh-card-left">
                                    <div className={`mh-score-circle ${isPerfect ? 'perfect' : pct >= 60 ? 'good' : 'poor'}`}>
                                        <span className="mh-score-big">{match.score}</span>
                                        <span className="mh-score-total">/{match.total || 5}</span>
                                    </div>
                                    <div>
                                        <div className="mh-result-label">
                                            {isPerfect ? '🏆 PERFECT' : pct >= 80 ? '⭐ EXCELLENT' : pct >= 60 ? '✅ SOLID' : pct >= 40 ? '😤 DISAPPOINTIN' : '💥 POOR'}
                                        </div>
                                        <div className="mh-date"><Calendar size={12} /> {fmt(match.date)}</div>
                                    </div>
                                </div>
                                {/* Score bar */}
                                <div className="mh-pct-bar">
                                    <div className="mh-pct-fill" style={{ width: `${pct}%`, background: isPerfect ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' : pct >= 60 ? 'linear-gradient(90deg,#00ff88,#059669)' : '#ef4444' }} />
                                    <span className="mh-pct-txt">{pct}%</span>
                                </div>
                            </div>

                            {/* Per-shot breakdown */}
                            {match.breakdown?.length > 0 && (
                                <div className="mh-breakdown">
                                    {match.breakdown.map((shot, j) => (
                                        <div key={j} className={`mh-shot ${shot.outcome}`}>
                                            <div className="mh-shot-num">#{j + 1}</div>
                                            <div className={`mh-shot-dot ${shot.outcome}`}>
                                                {shot.outcome === 'goal' ? <Check size={10} /> : <X size={10} />}
                                            </div>
                                            <div className="mh-shot-info">
                                                <span>{ZONE_LABELS[shot.zone] || shot.zone}</span>
                                                <span className="mh-shot-pwr">PWR {shot.power}%</span>
                                            </div>
                                            {match.shooters?.[j] && (
                                                <span className="mh-shot-shooter">{match.shooters[j].name?.split(' ').pop()}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <style>{`
                .mh-root { min-height:100vh; background:#02040a; padding:2rem; }
                .mh-bg { position:fixed; inset:0; background:radial-gradient(ellipse 70% 50% at 50% 0%,rgba(245,158,11,.04) 0%,transparent 70%); pointer-events:none; }
                .mh-header { display:flex; align-items:center; gap:1rem; margin-bottom:2rem; }
                .mh-icon { width:52px; height:52px; border-radius:16px; background:rgba(245,158,11,.08); border:1px solid rgba(245,158,11,.25); display:flex; align-items:center; justify-content:center; color:#f59e0b; }
                .mh-title { font-size:1.8rem; font-weight:950; color:white; letter-spacing:-.02em; }
                .mh-sub { font-size:.75rem; color:rgba(255,255,255,.3); font-weight:600; }

                .mh-stats-row { display:flex; gap:1rem; flex-wrap:wrap; margin-bottom:2rem; }
                .mh-stat { flex:1; min-width:100px; padding:1rem; border-radius:18px; border:1px solid rgba(255,255,255,.07); background:rgba(8,10,20,.7); text-align:center; }
                .mh-stat-val { display:block; font-size:1.8rem; font-weight:950; color:#f59e0b; }
                .mh-stat-label { font-size:.5rem; font-weight:900; color:rgba(255,255,255,.25); letter-spacing:.15em; }

                .mh-empty { border-radius:24px; padding:4rem 2rem; text-align:center; border:1px solid rgba(255,255,255,.06); }
                .mh-empty-icon { color:rgba(255,255,255,.1); margin-bottom:1rem; }
                .mh-empty h3 { font-size:1.3rem; font-weight:900; color:rgba(255,255,255,.4); margin-bottom:.5rem; }
                .mh-empty p { color:rgba(255,255,255,.2); font-size:.85rem; }
                .mh-empty-warn { color:rgba(245,158,11,.6); margin-top:.75rem; font-size:.8rem; }

                .mh-list { display:flex; flex-direction:column; gap:1rem; }
                .mh-card { border-radius:22px; border:1px solid rgba(255,255,255,.07); background:rgba(8,10,20,.7); padding:1.5rem; overflow:hidden; }
                .mh-card.perfect { border-color:rgba(245,158,11,.3); background:rgba(20,15,5,.85); }

                .mh-card-header { display:flex; align-items:center; justify-content:space-between; gap:1rem; flex-wrap:wrap; margin-bottom:1rem; }
                .mh-card-left { display:flex; align-items:center; gap:1rem; }
                .mh-score-circle { display:flex; align-items:baseline; gap:.1rem; padding:.5rem 1rem; border-radius:14px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); }
                .mh-score-circle.perfect { background:rgba(245,158,11,.08); border-color:rgba(245,158,11,.25); }
                .mh-score-circle.good { background:rgba(0,255,136,.05); border-color:rgba(0,255,136,.2); }
                .mh-score-circle.poor { background:rgba(239,68,68,.05); border-color:rgba(239,68,68,.2); }
                .mh-score-big { font-size:2rem; font-weight:950; color:white; }
                .mh-score-total { font-size:1rem; color:rgba(255,255,255,.35); font-weight:700; }
                .mh-result-label { font-size:.7rem; font-weight:900; color:rgba(255,255,255,.7); letter-spacing:.05em; }
                .mh-date { display:flex; align-items:center; gap:.3rem; font-size:.65rem; color:rgba(255,255,255,.25); font-weight:700; margin-top:.25rem; }

                .mh-pct-bar { flex:1; position:relative; height:26px; background:rgba(255,255,255,.04); border-radius:8px; overflow:hidden; min-width:120px; }
                .mh-pct-fill { position:absolute; inset-y:0; left:0; border-radius:8px; transition:.6s; }
                .mh-pct-txt { position:absolute; right:.6rem; top:50%; transform:translateY(-50%); font-size:.7rem; font-weight:900; color:white; }

                /* Breakdown */
                .mh-breakdown { display:flex; flex-direction:column; gap:.4rem; }
                .mh-shot { display:flex; align-items:center; gap:1rem; padding:.5rem .75rem; border-radius:10px; background:rgba(255,255,255,.02); }
                .mh-shot.goal { background:rgba(0,255,136,.03); }
                .mh-shot.miss, .mh-shot.save { background:rgba(239,68,68,.03); }
                .mh-shot-num { font-size:.6rem; font-weight:900; color:rgba(255,255,255,.3); width:20px; }
                .mh-shot-dot { width:18px; height:18px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
                .mh-shot-dot.goal { background:rgba(0,255,136,.2); color:#00ff88; }
                .mh-shot-dot.miss,.mh-shot-dot.save { background:rgba(239,68,68,.2); color:#ef4444; }
                .mh-shot-info { flex:1; display:flex; gap:1rem; font-size:.75rem; color:rgba(255,255,255,.6); font-weight:700; }
                .mh-shot-pwr { color:rgba(255,255,255,.3); font-size:.7rem; }
                .mh-shot-shooter { font-size:.7rem; color:rgba(255,255,255,.3); font-weight:700; font-style:italic; }
            `}</style>
        </div>
    );
}
