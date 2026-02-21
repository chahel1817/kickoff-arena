'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Search, ChevronRight, ChevronLeft, Star, Check, X } from 'lucide-react';
import { DEFENDERS } from './data';
import '../../entry.css';

export default function DefenderSelectPage() {
    const router = useRouter();
    const [selectedDefs, setSelectedDefs] = useState([]);
    const [formation, setFormation] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [filterPos, setFilterPos] = useState('ALL');
    const [search, setSearch] = useState('');

    useEffect(() => {
        const f = localStorage.getItem('formation');
        if (f) setFormation(JSON.parse(f));
        const t = localStorage.getItem('selectedTeam');
        if (t) setSelectedTeam(JSON.parse(t));
        const d = localStorage.getItem('defenders');
        if (d) setSelectedDefs(JSON.parse(d));
    }, []);

    const maxDef = formation?.defenders || 4;

    const filtered = useMemo(() => {
        let list = DEFENDERS;
        if (filterPos !== 'ALL') list = list.filter(d => d.position === filterPos);
        if (search) list = list.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.club.toLowerCase().includes(search.toLowerCase()));
        return list;
    }, [filterPos, search]);

    const handleSelect = (player) => {
        setSelectedDefs(prev => {
            const exists = prev.find(p => p.id === player.id);
            let next;
            if (exists) {
                next = prev.filter(p => p.id !== player.id);
            } else if (prev.length < maxDef) {
                next = [...prev, player];
            } else return prev;
            localStorage.setItem('defenders', JSON.stringify(next));
            return next;
        });
    };

    const handleConfirm = () => {
        if (selectedDefs.length === maxDef) router.push('/select/midfielders');
    };

    const positions = ['ALL', 'CB', 'LB', 'RB'];

    return (
        <div className="entry-page no-snap">
            <div className="stadium-bg" style={{ filter: 'brightness(0.06) grayscale(0.8)' }}></div>
            <div className="overlay-gradient"></div>

            <section className="df-page">
                <main className="df-main">

                    {/* Context Bar */}
                    <div className="df-ctx-bar glass">
                        <div className="df-ctx-left">
                            <button onClick={() => router.push('/select/goalkeeper')} className="df-back-btn">
                                <ChevronLeft size={18} /><span>GOALKEEPER</span>
                            </button>
                        </div>
                        <div className="df-ctx-center">
                            <div className="df-ctx-item">
                                <span className="df-ctx-label">FORMATION</span>
                                <span className="df-ctx-value">{formation?.name || '4-4-2'}</span>
                            </div>
                            <div className="df-ctx-divider"></div>
                            <div className="df-ctx-item">
                                <span className="df-ctx-label">DEFENDERS</span>
                                <span className="df-ctx-value" style={{ color: selectedDefs.length === maxDef ? '#10b981' : '#3b82f6' }}>
                                    {selectedDefs.length} / {maxDef}
                                </span>
                            </div>
                            <div className="df-ctx-divider"></div>
                            <div className="df-ctx-item">
                                <span className="df-ctx-label">STEP</span>
                                <span className="df-ctx-value" style={{ color: '#3b82f6' }}>2 / 5</span>
                            </div>
                        </div>
                        <div className="df-ctx-right">
                            <div className="df-step-badge">
                                <Shield size={16} />
                                <span>DEFENDERS</span>
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="df-title-section">
                        <div className="df-ornament">
                            <div className="df-orn-line"></div>
                            <span className="df-orn-emoji">🛡️</span>
                            <div className="df-orn-line"></div>
                        </div>
                        <h1 className="df-mega-title">
                            SELECT YOUR <span className="text-gradient-blue">DEFENDERS</span>
                        </h1>
                        <p className="df-subtitle">Build the backbone of your team. Pick exactly {maxDef} defenders.</p>
                    </div>

                    {/* Position Filter Tabs */}
                    {/* Filters Section */}
                    <div className="df-filter-section">
                        <div className="df-tabs-row">
                            <div className="df-tabs">
                                {positions.map(pos => (
                                    <button key={pos} onClick={() => setFilterPos(pos)}
                                        className={`df-tab ${filterPos === pos ? 'active' : ''}`}>
                                        {pos}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="df-search-row">
                            <div className="df-search-wrapper">
                                <input type="text" placeholder="Search defenders..."
                                    value={search} onChange={e => setSearch(e.target.value)}
                                    className="df-search" />
                                <div className="df-search-icon-wrapper">
                                    <Search className="df-search-icon" size={22} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Selected Summary */}
                    {selectedDefs.length > 0 && (
                        <div className="df-selection-summary glass">
                            <span className="df-sum-label">SELECTED ({selectedDefs.length}/{maxDef})</span>
                            <div className="df-sum-chips">
                                {selectedDefs.map(p => (
                                    <button key={p.id} className="df-chip" onClick={() => handleSelect(p)}>
                                        <span className="df-chip-pos">{p.position}</span>
                                        <span>{p.name}</span>
                                        <X size={14} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Grid */}
                    <div className="df-grid">
                        {filtered.map(player => {
                            const isSelected = selectedDefs.some(p => p.id === player.id);
                            const isFull = selectedDefs.length >= maxDef && !isSelected;
                            return (
                                <button key={player.id} onClick={() => handleSelect(player)}
                                    className={`df-card glass ${isSelected ? 'selected' : ''} ${isFull ? 'dimmed' : ''} ${player.tier === 'legend' ? 'legend-card' : ''}`}>
                                    {player.tier === 'legend' && (
                                        <div className="df-legend-badge"><Star size={12} /><span>LEGEND</span></div>
                                    )}
                                    {isSelected && (
                                        <div className="df-selected-badge"><Check size={20} /></div>
                                    )}
                                    <div className="df-card-rating">
                                        <span className="df-ovr-label">OVR</span>
                                        <span className="df-ovr-value">{player.rating}</span>
                                    </div>
                                    <div className="df-photo-frame">
                                        <img src={player.image} alt={player.name} className="df-photo" loading="lazy" />
                                        <div className="df-photo-vignette"></div>
                                    </div>
                                    <div className="df-card-info">
                                        <span className="df-card-club">{player.club.toUpperCase()}</span>
                                        <h3 className="df-card-name">{player.name}</h3>
                                        <div className="df-card-meta">
                                            <span>{player.country}</span>
                                            <span className="df-meta-dot">•</span>
                                            <span className="df-card-pos">{player.position}</span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Confirm Bar */}
                    <div className={`df-confirm-bar glass ${selectedDefs.length === maxDef ? 'visible' : ''}`}>
                        <div className="df-bar-content">
                            <div className="df-bar-info">
                                <span className="df-bar-tag">DEFENSE LOCKED — {selectedDefs.length}/{maxDef}</span>
                                <div className="df-bar-names">{selectedDefs.map(p => p.name).join(' • ')}</div>
                            </div>
                            <button onClick={handleConfirm} className="df-proceed-btn"
                                disabled={selectedDefs.length !== maxDef}>
                                <span>CONFIRM DEFENDERS</span>
                                <ChevronRight size={22} />
                            </button>
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="df-progress-footer">
                        <div className="df-progress-steps">
                            {['GK', 'DEF', 'MID', 'FWD', 'REVIEW'].map((s, i) => (
                                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div className={`df-step ${i <= 1 ? 'active' : ''}`}>
                                        <div className={`df-step-circle ${i <= 1 ? 'active' : ''} ${i === 0 ? 'done' : ''}`}>{i + 1}</div>
                                        <span>{s}</span>
                                    </div>
                                    {i < 4 && <div className="df-step-line"></div>}
                                </div>
                            ))}
                        </div>
                    </div>

                </main>
            </section>

            <style jsx>{`
                .df-page { min-height:100vh; display:flex; justify-content:center; padding:3rem 1rem; animation:dfFadeIn .6s ease-out; }
                @keyframes dfFadeIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
                .df-main { max-width:1400px; width:96%; }

                /* Context Bar */
                .df-ctx-bar { display:flex; justify-content:space-between; align-items:center; padding:1rem 2rem; background:rgba(10,10,15,.6); backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,.08); border-radius:20px; margin-bottom:2.5rem; position:sticky; top:0; z-index:100; }
                .df-back-btn { display:flex; align-items:center; gap:.5rem; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1); padding:.6rem 1.2rem; border-radius:12px; color:rgba(255,255,255,.6); font-weight:900; font-size:.6rem; letter-spacing:.12em; cursor:pointer; transition:.3s; }
                .df-back-btn:hover { background:#3b82f6; color:white; border-color:#3b82f6; }
                .df-ctx-center { display:flex; align-items:center; gap:1.5rem; }
                .df-ctx-item { text-align:center; }
                .df-ctx-label { display:block; font-size:.45rem; font-weight:900; color:rgba(255,255,255,.25); letter-spacing:.2em; margin-bottom:.15rem; }
                .df-ctx-value { font-size:.85rem; font-weight:900; color:#3b82f6; letter-spacing:.05em; }
                .df-ctx-divider { width:1px; height:30px; background:rgba(255,255,255,.08); }
                .df-step-badge { display:flex; align-items:center; gap:.4rem; background:rgba(59,130,246,.08); border:1px solid rgba(59,130,246,.2); padding:.5rem 1rem; border-radius:12px; color:#3b82f6; font-size:.6rem; font-weight:900; letter-spacing:.12em; }
                .df-ctx-right { }

                /* Title */
                .df-title-section { text-align:center; margin-bottom:2rem; }
                .df-ornament { display:flex; align-items:center; justify-content:center; gap:1rem; margin-bottom:1.25rem; }
                .df-orn-line { width:50px; height:1px; background:rgba(59,130,246,.3); }
                .df-orn-emoji { font-size:1.8rem; filter:drop-shadow(0 0 10px rgba(59,130,246,.3)); }
                .df-mega-title { font-size:clamp(2.5rem,7vw,4.5rem); font-weight:900; color:white; letter-spacing:-.03em; margin-bottom:1rem; }
                .text-gradient-blue { background:linear-gradient(135deg,#3b82f6,#60a5fa,#3b82f6); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
                .df-subtitle { font-size:1.1rem; color:rgba(255,255,255,.35); line-height:1.7; max-width:520px; margin:0 auto; }

                /* Filter Section */
                .df-filter-section { display:flex; flex-direction:column; gap:2rem; margin-bottom:3rem; }
                .df-tabs-row { display:flex; justify-content:center; }
                .df-tabs { display:flex; gap:.5rem; background:rgba(255,255,255,.03); padding:.4rem; border-radius:16px; border:1px solid rgba(255,255,255,.05); }
                .df-tab { padding:.7rem 1.8rem; border-radius:12px; border:1px solid transparent; background:transparent; color:rgba(255,255,255,.4); font-weight:900; font-size:.7rem; letter-spacing:.1em; cursor:pointer; transition:.3s; }
                .df-tab.active { background:rgba(59,130,246,.1); border-color:rgba(59,130,246,.3); color:#3b82f6; box-shadow:0 0 20px rgba(59,130,246,.1); }
                .df-tab:hover:not(.active) { color:white; background:rgba(255,255,255,.05); }

                .df-search-row { display:flex; justify-content:center; width: 100%; }
                .df-search-wrapper { position:relative; width:100%; max-width:750px; display: flex; align-items: center; }
                .df-search { 
                    width:100%; padding:1.4rem 5rem 1.4rem 2.5rem; border-radius:100px; 
                    border:1px solid rgba(59,130,246,0.3); background:rgba(10,15,30,0.7); 
                    color:white; font-size:1.2rem; font-weight:500; 
                    outline:none; transition:all .4s cubic-bezier(0.23, 1, 0.32, 1); 
                    box-shadow:0 10px 40px rgba(0,0,0,0.4), inset 0 0 20px rgba(59,130,246,0.05);
                    backdrop-filter: blur(20px);
                }
                .df-search:focus { 
                    background: rgba(15,20,40,0.9);
                    border-color: #3b82f6;
                    box-shadow:0 20px 50px rgba(59,130,246,0.25), inset 0 0 15px rgba(59,130,246,0.1);
                    transform: translateY(-3px) scale(1.01);
                }
                .df-search-icon-wrapper {
                    position: absolute; right: 1.5rem; top: 50%; transform: translateY(-50%);
                    width: 50px; height: 50px; display: flex; align-items: center; justify-content: center;
                    pointer-events: none;
                }
                .df-search-icon { 
                    color: #3b82f6;
                    filter: drop-shadow(0 0 10px rgba(59,130,246,0.5));
                }
                .df-search-wrapper:focus-within .df-search-icon { 
                    color: #60a5fa; transform: scale(1.2) rotate(-5deg); transition: .4s;
                }
                .df-search::placeholder { color:rgba(255,255,255,0.25); }

                /* Selection Summary */
                .df-selection-summary { padding:.75rem 1.5rem; border-radius:16px; margin-bottom:1.5rem; display:flex; align-items:center; gap:1rem; flex-wrap:wrap; background:rgba(10,10,15,.6); border:1px solid rgba(59,130,246,.15); }
                .df-sum-label { font-size:.55rem; font-weight:900; color:#3b82f6; letter-spacing:.15em; white-space:nowrap; }
                .df-sum-chips { display:flex; gap:.4rem; flex-wrap:wrap; }
                .df-chip { display:flex; align-items:center; gap:.4rem; padding:.35rem .8rem; border-radius:8px; background:rgba(59,130,246,.1); border:1px solid rgba(59,130,246,.25); color:white; font-size:.65rem; font-weight:700; cursor:pointer; transition:.3s; }
                .df-chip:hover { background:rgba(239,68,68,.15); border-color:rgba(239,68,68,.3); }
                .df-chip-pos { color:#3b82f6; font-weight:900; font-size:.55rem; }

                /* Grid */
                .df-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:1.25rem; margin-bottom:12rem; }

                /* Card */
                .df-card { position:relative; text-align:left; border-radius:20px; overflow:hidden; border:1px solid rgba(255,255,255,.06); background:rgba(10,10,15,.7); cursor:pointer; transition:all .45s cubic-bezier(.23,1,.32,1); }
                .df-card:hover { transform:translateY(-8px); border-color:rgba(59,130,246,.3); box-shadow:0 20px 50px -15px rgba(0,0,0,.7),0 0 20px rgba(59,130,246,.08); }
                .df-card.selected { border-color:#10b981; border-width:2px; box-shadow:0 0 40px rgba(16,185,129,.15); transform:translateY(-8px) scale(1.02); }
                .df-card.dimmed { opacity:.25; filter:grayscale(.6); pointer-events:none; }
                .df-card.legend-card { border-color:rgba(245,158,11,.25); background:linear-gradient(165deg,rgba(30,25,10,.9),rgba(10,10,15,.85)); }
                .df-card.legend-card:hover { border-color:rgba(245,158,11,.5); }

                /* Badges */
                .df-legend-badge { position:absolute; top:.8rem; left:.8rem; z-index:10; display:flex; align-items:center; gap:.3rem; background:linear-gradient(135deg,rgba(245,158,11,.2),rgba(245,158,11,.08)); border:1px solid rgba(245,158,11,.35); padding:.2rem .5rem; border-radius:8px; color:#f59e0b; font-size:.45rem; font-weight:900; letter-spacing:.15em; backdrop-filter:blur(10px); }
                .df-selected-badge { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); z-index:30; width:50px; height:50px; border-radius:50%; background:linear-gradient(135deg,#10b981,#34d399); color:black; display:flex; align-items:center; justify-content:center; box-shadow:0 0 40px rgba(16,185,129,.5); animation:badgePop .4s cubic-bezier(.175,.885,.32,1.275); }
                @keyframes badgePop { from{transform:translate(-50%,-50%) scale(0)} to{transform:translate(-50%,-50%) scale(1)} }

                /* Rating */
                .df-card-rating { position:absolute; top:.8rem; right:.8rem; z-index:10; background:rgba(0,0,0,.85); backdrop-filter:blur(10px); padding:.3rem .7rem; border-radius:10px; border:1px solid rgba(255,255,255,.08); text-align:center; }
                .df-ovr-label { display:block; font-size:.35rem; font-weight:900; color:rgba(255,255,255,.3); letter-spacing:.1em; }
                .df-ovr-value { font-size:1.2rem; font-weight:900; color:white; line-height:1; }

                /* Photo */
                .df-photo-frame { position:relative; height:260px; overflow:hidden; background:#080810; }
                .df-photo { width:100%; height:100%; object-fit:cover; object-position:center top; transition:.6s; filter:saturate(1.15) contrast(1.1); }
                .df-card:hover .df-photo { transform:scale(1.1); filter:saturate(1.3) contrast(1.15); }
                .df-photo-vignette { position:absolute; bottom:0; left:0; right:0; height:7rem; background:linear-gradient(to top,rgba(10,10,15,1),transparent); }

                /* Info */
                .df-card-info { padding:1.2rem 1.2rem 1.4rem; margin-top:-2.5rem; position:relative; z-index:5; }
                .df-card-club { font-size:.5rem; font-weight:900; color:#3b82f6; letter-spacing:.25em; opacity:.7; display:block; margin-bottom:.3rem; }
                .legend-card .df-card-club { color:#f59e0b; }
                .df-card-name { font-size:1.15rem; font-weight:900; color:white; line-height:1.1; text-transform:uppercase; font-style:italic; margin-bottom:.5rem; }
                .df-card-meta { display:flex; align-items:center; gap:.4rem; font-size:.65rem; color:rgba(255,255,255,.3); font-weight:700; }
                .df-meta-dot { opacity:.3; }
                .df-card-pos { background:rgba(59,130,246,.1); color:#3b82f6; padding:.15rem .5rem; border-radius:4px; font-size:.55rem; font-weight:900; letter-spacing:.1em; }
                .legend-card .df-card-pos { background:rgba(245,158,11,.1); color:#f59e0b; }

                /* Confirm Bar */
                .df-confirm-bar { position:fixed; bottom:2rem; left:50%; transform:translateX(-50%) translateY(150%); width:calc(100% - 4rem); max-width:900px; padding:1.25rem 2.5rem; border-radius:24px; border:1px solid rgba(16,185,129,.3); z-index:3000; box-shadow:0 25px 60px -12px rgba(0,0,0,.8); transition:all .5s cubic-bezier(.175,.885,.32,1.275); background:rgba(10,10,15,.9); backdrop-filter:blur(30px); }
                .df-confirm-bar.visible { transform:translateX(-50%) translateY(0); }
                .df-bar-content { display:flex; justify-content:space-between; align-items:center; }
                .df-bar-info { display:flex; flex-direction:column; gap:.15rem; }
                .df-bar-tag { font-size:.55rem; font-weight:900; color:#10b981; letter-spacing:.15em; }
                .df-bar-names { font-size:.75rem; color:rgba(255,255,255,.4); font-weight:700; max-width:450px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
                .df-proceed-btn { display:flex; align-items:center; gap:.8rem; background:linear-gradient(135deg,#10b981,#34d399); color:black; padding:1rem 2.5rem; border-radius:14px; font-weight:900; font-size:.9rem; letter-spacing:.05em; border:none; cursor:pointer; transition:.3s; box-shadow:0 0 30px rgba(16,185,129,.25); white-space:nowrap; }
                .df-proceed-btn:hover { transform:scale(1.05); box-shadow:0 0 50px rgba(16,185,129,.4); }
                .df-proceed-btn:disabled { opacity:.5; cursor:not-allowed; transform:none; }

                /* Progress */
                .df-progress-footer { position:fixed; bottom:0; left:0; right:0; display:flex; justify-content:center; padding:1rem 2rem; background:linear-gradient(to top,rgba(2,4,10,.95),transparent); pointer-events:none; z-index:50; }
                .df-progress-steps { display:flex; align-items:center; }
                .df-step { display:flex; flex-direction:column; align-items:center; gap:.25rem; font-size:.5rem; font-weight:900; color:rgba(255,255,255,.2); letter-spacing:.1em; }
                .df-step.active { color:#3b82f6; }
                .df-step-circle { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:.7rem; font-weight:900; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); color:rgba(255,255,255,.25); }
                .df-step-circle.active { background:rgba(59,130,246,.15); border-color:#3b82f6; color:#3b82f6; box-shadow:0 0 15px rgba(59,130,246,.3); }
                .df-step-circle.done { background:#10b981; border-color:#10b981; color:black; }
                .df-step-line { width:30px; height:1px; background:rgba(255,255,255,.06); margin-bottom:1rem; }

                /* Responsive */
                @media(max-width:768px) {
                    .df-ctx-bar { flex-wrap:wrap; gap:.75rem; padding:.75rem 1rem; }
                    .df-ctx-center { gap:.75rem; }
                    .df-mega-title { font-size:2.3rem; }
                    .df-grid { grid-template-columns:1fr 1fr; gap:.75rem; }
                    .df-photo-frame { height:180px; }
                    .df-card-name { font-size:.9rem; }
                    .df-filter-section { gap:1rem; }
                    .df-search-wrapper { max-width:100%; }
                    .df-confirm-bar { width:95%; padding:1rem; }
                    .df-bar-content { flex-wrap:wrap; gap:.75rem; justify-content:center; }
                    .df-bar-names { display:none; }
                    .df-proceed-btn { width:100%; justify-content:center; padding:.85rem; font-size:.8rem; }
                }
                @media(max-width:480px) {
                    .df-grid { grid-template-columns:1fr; }
                    .df-ctx-right { display:none; }
                }
            `}</style>
        </div>
    );
}
