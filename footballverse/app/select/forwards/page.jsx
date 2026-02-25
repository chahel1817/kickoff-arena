'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Zap, Target, ChevronRight, ChevronLeft, Star, Check, X, Shield, Activity, Flame, Trophy } from 'lucide-react';
import { FORWARDS } from './data';
import '../../entry.css';

export default function ForwardSelectPage() {
    const router = useRouter();
    const [selectedFwds, setSelectedFwds] = useState([]);
    const [formation, setFormation] = useState(null);
    const [filterPos, setFilterPos] = useState('ALL');
    const [search, setSearch] = useState('');
    const [focusedIndex, setFocusedIndex] = useState(-1);

    const searchParams = useSearchParams();
    const isEditMode = searchParams.get('edit') === 'true';

    useEffect(() => {
        window.scrollTo(0, 0);
        const f = localStorage.getItem('formation');
        if (f) {
            setFormation(JSON.parse(f));
        } else if (!isEditMode) {
            router.push('/formation-select');
            return;
        }
        const saved = localStorage.getItem('forwards');
        if (saved) setSelectedFwds(JSON.parse(saved));
    }, [router, isEditMode]);

    const maxFwd = formation?.forwards || 3;

    const filtered = useMemo(() => {
        let list = FORWARDS;
        if (filterPos !== 'ALL') list = list.filter(p => p.position === filterPos);
        if (search) list = list.filter(p =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.club.toLowerCase().includes(search.toLowerCase()) ||
            p.country.toLowerCase().includes(search.toLowerCase())
        );
        return list;
    }, [filterPos, search]);

    const handleSelect = useCallback((player) => {
        setSelectedFwds(prev => {
            const exists = prev.find(p => p.id === player.id);
            let next;
            if (exists) {
                next = prev.filter(p => p.id !== player.id);
            } else if (prev.length < maxFwd) {
                next = [...prev, player];
            } else return prev;
            localStorage.setItem('forwards', JSON.stringify(next));
            return next;
        });
    }, [maxFwd]);

    const handleConfirm = useCallback(() => {
        if (selectedFwds.length === maxFwd) {
            router.push('/squad/review');
        }
    }, [selectedFwds, maxFwd, router]);

    const positions = ['ALL', 'ST', 'LW', 'RW'];

    return (
        <div className="entry-page no-snap">
            <div className="stadium-bg fw-stadium-bg"></div>
            <div className="overlay-gradient" style={{ background: 'linear-gradient(to bottom, transparent, rgba(15, 5, 5, 0.9))' }}></div>

            <section className="fw-page">
                <main className="fw-main">

                    {/* Context Bar */}
                    <div className="fw-ctx-bar glass">
                        <div className="fw-ctx-left">
                            <button onClick={() => isEditMode ? router.push('/squad/review') : router.push('/select/midfielders')} className="fw-back-btn">
                                <ChevronLeft size={18} /><span>{isEditMode ? 'BACK TO REVIEW' : 'MIDFIELDERS'}</span>
                            </button>
                        </div>
                        <div className="fw-ctx-center">
                            <div className="fw-ctx-item">
                                <span className="fw-ctx-label">FORMATION</span>
                                <span className="fw-ctx-value">{formation?.name || '4-3-3'}</span>
                            </div>
                            <div className="fw-ctx-divider"></div>
                            <div className="fw-ctx-item">
                                <span className="fw-ctx-label">FORWARDS</span>
                                <span className="fw-ctx-value" style={{ color: selectedFwds.length === maxFwd ? '#10b981' : '#ef4444' }}>
                                    {selectedFwds.length} / {maxFwd}
                                </span>
                            </div>
                            <div className="fw-ctx-divider"></div>
                            <div className="fw-ctx-item">
                                <span className="fw-ctx-label">STEP</span>
                                <span className="fw-ctx-value" style={{ color: '#ef4444' }}>4 / 5</span>
                            </div>
                        </div>
                        <div className="fw-ctx-right">
                            <div className="fw-step-badge">
                                <Flame size={16} />
                                <span>ATTACK</span>
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="fw-title-section">
                        <div className="fw-ornament">
                            <div className="fw-orn-line"></div>
                            <Target className="fw-orn-icon" size={28} />
                            <div className="fw-orn-line"></div>
                        </div>
                        <h1 className="fw-mega-title">
                            SELECT YOUR <span className="text-gradient-red">FORWARDS</span>
                        </h1>
                        <p className="fw-subtitle">Unleash devastation. Pick {maxFwd} elite attackers to finish the job.</p>
                    </div>

                    {/* Filters Section */}
                    <div className="fw-filter-section">
                        <div className="fw-tabs-row">
                            <div className="fw-tabs">
                                {positions.map(pos => {
                                    const isActive = filterPos === pos;
                                    return (
                                        <button key={pos} onClick={() => setFilterPos(pos)}
                                            className={`fw-tab ${isActive ? 'active' : ''} tab-${pos.toLowerCase()}`}>
                                            {pos === 'ST' && <Target size={12} className="tab-icon" />}
                                            {pos === 'LW' && <Zap size={12} className="tab-icon" />}
                                            {pos === 'RW' && <Zap size={12} className="tab-icon" />}
                                            <span>{pos}</span>
                                            {isActive && <div className="fw-tab-indicator"></div>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="fw-helper-row">
                            <div className="fw-helper-glass">
                                <span className="fw-helper-icon">⚡</span>
                                <p className="fw-helper-text">
                                    Explosive forwards wins matches. Mix <strong>Power</strong> (ST) with <strong>Pace</strong> (LW/RW) for total domination.
                                </p>
                            </div>
                        </div>

                        <div className="fw-search-row">
                            <div className="fw-search-wrapper">
                                <input type="text" placeholder="Search forwards..."
                                    value={search} onChange={e => setSearch(e.target.value)}
                                    className="fw-search" />
                                <div className="fw-search-icon-wrapper">
                                    <Search className="fw-search-icon" size={22} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Selected Summary */}
                    {selectedFwds.length > 0 && (
                        <div className="fw-selection-summary glass">
                            <span className="fw-sum-label">SELECTED ({selectedFwds.length}/{maxFwd})</span>
                            <div className="fw-sum-chips">
                                {selectedFwds.map(p => (
                                    <button key={p.id} className="fw-chip" onClick={() => handleSelect(p)}>
                                        <span className="fw-chip-pos">{p.position}</span>
                                        <span className="fw-chip-name">{p.name}</span>
                                        <X size={14} className="fw-chip-remove" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Grid */}
                    <div className="fw-grid">
                        {filtered.map((player, index) => {
                            const isSelected = selectedFwds.some(p => p.id === player.id);
                            const isFull = selectedFwds.length >= maxFwd && !isSelected;
                            const isKeyboardFocused = focusedIndex === index;

                            return (
                                <button key={player.id}
                                    onClick={() => handleSelect(player)}
                                    onMouseEnter={() => setFocusedIndex(index)}
                                    className={`fw-card glass ${isSelected ? 'selected' : ''} ${isFull ? 'dimmed' : ''} ${player.tier === 'legend' ? 'legend-card' : ''} badge-${player.position.toLowerCase()}-wrap ${isKeyboardFocused ? 'kb-focus' : ''}`}>

                                    {/* Role Badge */}
                                    <div className={`fw-role-badge badge-${player.position.toLowerCase()}`}>
                                        {player.position === 'ST' && <Target size={10} />}
                                        {player.position === 'LW' && <Zap size={10} />}
                                        {player.position === 'RW' && <Zap size={10} />}
                                        <span>{player.position}</span>
                                    </div>

                                    {/* Skill Qualities */}
                                    <div className="fw-skill-badges">
                                        {player.skills?.slice(0, 2).map(skill => (
                                            <div key={skill} className="fw-skill-badge">
                                                <Flame size={8} />
                                                <span>{skill.toUpperCase()}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Removed top legend badge to clear faces */}
                                    {isSelected && (
                                        <div className="fw-selected-badge"><Check size={20} /></div>
                                    )}
                                    <div className="fw-card-rating">
                                        <span className="fw-ovr-label">OVR</span>
                                        <span className="fw-ovr-value">{player.rating}</span>
                                    </div>
                                    <div className="fw-photo-frame">
                                        <img src={player.image} alt={player.name} className="fw-photo" loading="lazy" />
                                        <div className="fw-photo-vignette"></div>
                                        <div className="fw-card-glow"></div>
                                    </div>
                                    <div className="fw-card-info">
                                        <span className="fw-card-club">{player.club.toUpperCase()}</span>
                                        <h3 className="fw-card-name">{player.name}</h3>
                                        <div className="fw-card-meta">
                                            <span>{player.country}</span>
                                            <span className="fw-meta-dot">•</span>
                                            <span className="fw-card-pos">{player.position}</span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Confirm Bar */}
                    <div className={`fw-confirm-bar glass ${selectedFwds.length === maxFwd ? 'visible' : ''}`}>
                        <div className="fw-bar-content">
                            <div className="fw-bar-info">
                                <span className="fw-bar-tag">{isEditMode ? 'CHANGES PENDING' : 'STRIKE FORCE'}</span>
                                <h3 className="fw-bar-name">
                                    {selectedFwds.length} / {maxFwd} SELECTED
                                </h3>
                                <div className="fw-bar-list">
                                    {selectedFwds.map((f, i) => (
                                        <span key={f.id} className="fw-bar-player-name">
                                            {f.name}{i < selectedFwds.length - 1 ? ', ' : ''}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={handleConfirm}
                                className={`fw-proceed-btn ${selectedFwds.length === maxFwd ? 'active' : ''}`}
                                disabled={selectedFwds.length !== maxFwd}
                            >
                                <span>{isEditMode ? 'CONFIRM CHANGES' : 'LOCK ATTACK'}</span>
                                <Activity size={22} className="fw-btn-icon" />
                            </button>
                        </div>
                    </div>

                    {!isEditMode && (
                        <div className="fw-progress-footer">
                            <div className="fw-progress-steps">
                                {['GK', 'DEF', 'MID', 'FWD', 'DONE'].map((s, i) => (
                                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div className={`fw-step ${i === 3 ? 'active' : ''} ${i < 3 ? 'completed' : ''}`}>
                                            <div className={`fw-step-circle ${i === 3 ? 'active' : ''} ${i < 3 ? 'done' : ''}`}>{i < 3 ? <Check size={12} /> : i + 1}</div>
                                            <span>{s}</span>
                                        </div>
                                        {i < 4 && <div className="fw-step-line"></div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </main>
            </section>

            <style jsx>{`
                .fw-page { min-height:100vh; display:flex; justify-content:center; padding:3rem 1rem; animation:fwFadeIn .6s ease-out; }
                @keyframes fwFadeIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
                .fw-main { max-width:1400px; width:96%; }

                .fw-stadium-bg { 
                    position: fixed; inset: 0; 
                    background: url('/stadium-red.jpg') center/cover no-repeat;
                    filter: brightness(0.06) saturate(1.5) contrast(1.2); z-index: -2; 
                }

                .fw-ctx-bar { display:flex; justify-content:space-between; align-items:center; padding:1rem 2rem; background:rgba(10,10,15,.6); backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,.08); border-radius:18px; margin-bottom:2.5rem; position:sticky; top:0; z-index:100; }
                .fw-back-btn { display:flex; align-items:center; gap:.5rem; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1); padding:.6rem 1.2rem; border-radius:12px; color:rgba(255,255,255,.6); font-weight:900; font-size:.6rem; letter-spacing:.12em; cursor:pointer; transition:.3s; }
                .fw-back-btn:hover { background:#ef4444; color:white; border-color:#ef4444; }
                .fw-ctx-center { display:flex; align-items:center; gap:1.5rem; }
                .fw-ctx-item { text-align:center; }
                .fw-ctx-label { display:block; font-size:.45rem; font-weight:900; color:rgba(255,255,255,.25); letter-spacing:.2em; margin-bottom:.15rem; }
                .fw-ctx-value { font-size:.85rem; font-weight:900; color:#ef4444; letter-spacing:.05em; }
                .fw-ctx-divider { width:1px; height:30px; background:rgba(255,255,255,.08); }
                .fw-step-badge { display:flex; align-items:center; gap:.4rem; background:rgba(239,68,68,.08); border:1px solid rgba(239,68,68,.2); padding:.5rem 1rem; border-radius:12px; color:#ef4444; font-size:.6rem; font-weight:900; letter-spacing:.12em; }

                .fw-title-section { text-align:center; margin-bottom:2rem; }
                .fw-ornamaent { display:flex; align-items:center; justify-content:center; gap:1rem; margin-bottom:1.25rem; }
                .fw-orn-line { width:50px; height:2px; background:linear-gradient(90deg, transparent, #ef4444, transparent); }
                .fw-orn-icon { color:#ef4444; filter:drop-shadow(0 0 10px rgba(239,68,68,.5)); }
                .fw-mega-title { font-size:clamp(2.5rem,7vw,4.5rem); font-weight:950; color:white; letter-spacing:-.03em; margin-bottom:1rem; }
                .text-gradient-red { background:linear-gradient(135deg,#ef4444,#f87171,#ef4444); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
                .fw-subtitle { font-size:1.1rem; color:rgba(255,255,255,.35); line-height:1.7; max-width:520px; margin:0 auto; }

                /* Filter Section */
                .fw-filter-section { display:flex; flex-direction:column; gap:1.5rem; margin-bottom:3rem; }
                .fw-tabs-row { display:flex; justify-content:center; }
                .fw-tabs { display:flex; gap:.4rem; background:rgba(255,255,255,.03); padding:.4rem; border-radius:16px; border:1px solid rgba(255,255,255,.05); position: relative; }
                
                .fw-tab { 
                    position: relative; display: flex; align-items: center; gap: 0.6rem;
                    padding:.7rem 1.8rem; border-radius:12px; border:1px solid transparent; 
                    background:transparent; color:rgba(255,255,255,.4); font-weight:900; 
                    font-size:.7rem; letter-spacing:.1em; cursor:pointer; transition:all .3s cubic-bezier(0.4, 0, 0.2, 1); 
                }
                .fw-tab:hover:not(.active) { color:white; background:rgba(255,255,255,.05); }
                .tab-icon { opacity: 0.5; transition: 0.3s; }
                .fw-tab.active .tab-icon { opacity: 1; transform: scale(1.1); }
                
                .fw-tab.active { color: #ef4444; background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); box-shadow: 0 0 20px rgba(239, 68, 68, 0.15); }
                .fw-tab-indicator {
                    position: absolute; bottom: 0.4rem; left: 1.8rem; right: 1.8rem; height: 2px;
                    border-radius: 10px; background: currentColor;
                    animation: fwTabGrow .3s ease-out;
                }
                @keyframes fwTabGrow { from { opacity: 0; transform: scaleX(0); } to { opacity: 1; transform: scaleX(1); } }

                .fw-helper-row { display: flex; justify-content: center; margin: 0 0 1rem; }
                .fw-helper-glass { 
                    display: flex; align-items: center; gap: 0.75rem; 
                    padding: 0.6rem 1.25rem; border-radius: 100px; 
                    background: rgba(239, 68, 68, 0.05); border: 1px solid rgba(239, 68, 68, 0.1);
                    backdrop-filter: blur(10px); animation: fwHelperSlide .5s ease-out;
                }
                @keyframes fwHelperSlide { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
                .fw-helper-text { font-size: 0.75rem; font-weight: 500; color: rgba(255,255,255,0.5); margin: 0; }
                .fw-helper-text strong { color: #f87171; font-weight: 900; }

                .fw-search-row { display:flex; justify-content:center; width: 100%; margin: 2rem 0; }
                .fw-search-wrapper { position:relative; width:100%; max-width:750px; display: flex; align-items: center; }
                .fw-search { 
                    width:100%; padding:1.2rem 4rem 1.2rem 2rem; border-radius:100px; 
                    border:1px solid rgba(239, 68, 68, 0.3); background:rgba(15, 5, 5, 0.7); 
                    color:white; font-size:1.1rem; outline:none; transition: all .4s cubic-bezier(.165,.84,.44,1); 
                }
                .fw-search:focus { border-color: #ef4444; background: rgba(25, 10, 10, 0.9); box-shadow: 0 0 40px rgba(239, 68, 68, 0.2); transform: translateY(-3px) scale(1.01); }
                .fw-search-icon-wrapper { position: absolute; right: 1.5rem; top: 50%; transform: translateY(-50%); pointer-events: none; display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; }
                .fw-search-icon { color: #ef4444; filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.4)); transition: .3s; }
                .fw-search:focus + .fw-search-icon-wrapper .fw-search-icon { transform: scale(1.2) rotate(-5deg); color: #f87171; }

                .fw-selection-summary { padding:.75rem 1.5rem; border-radius:16px; margin-bottom:1.5rem; display:flex; align-items:center; gap:1rem; flex-wrap:wrap; background:rgba(10,10,15,.6); border:1px solid rgba(239,68,68,.15); }
                .fw-sum-label { font-size:.55rem; font-weight:900; color:#ef4444; letter-spacing:.15em; white-space:nowrap; }
                .fw-sum-chips { display:flex; gap:.4rem; flex-wrap:wrap; }
                .fw-chip { display:flex; align-items:center; gap:.4rem; padding:.35rem .8rem; border-radius:8px; background:rgba(239,68,68,0.08); border:1px solid rgba(239,68,68,0.2); color:white; font-size:.65rem; font-weight:700; cursor:pointer; transition:.3s; }
                .fw-chip:hover { background:rgba(239,68,68,.15); border-color:#ef4444; }
                .fw-chip-pos { color:#ef4444; font-weight:900; font-size:.55rem; }
                .fw-chip-remove { opacity: 0; width: 0; transition: .3s; }
                .fw-chip:hover .fw-chip-remove { opacity: 1; width: 14px; }

                                .fw-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:1.5rem; margin-bottom:12rem; }

                .fw-card { position:relative; text-align:left; border-radius:24px; overflow:hidden; border:1px solid rgba(255,255,255,.06); background:rgba(10,10,15,.7); cursor:pointer; transition:all .45s cubic-bezier(.23,1,.32,1); }
                .fw-card:hover, .fw-card.kb-focus { transform:translateY(-10px); border-color:rgba(239,68,68,.3); box-shadow:0 25px 60px -15px rgba(0,0,0,.7),0 0 20px rgba(239,68,68,0.1); }
                .fw-card.selected { border-color:#10b981 !important; border-width:2px; box-shadow:0 0 40px rgba(16,185,129,.15); transform:translateY(-10px) scale(1.03); }
                .fw-card.dimmed { opacity:.25; filter:grayscale(.6); pointer-events:none; }
                
                .badge-st-wrap { border-left: 4px solid #ef4444 !important; }
                .badge-lw-wrap, .badge-rw-wrap { border-left: 4px solid #f87171 !important; }

                .fw-role-badge {
                    position: absolute; top: 1rem; left: 1rem; z-index: 20;
                    display: flex; align-items: center; gap: 0.3rem;
                    background: rgba(0,0,0,0.7); backdrop-filter: blur(8px);
                    padding: 0.3rem 0.6rem; border-radius: 8px;
                    font-size: 0.5rem; font-weight: 950; color: #ef4444;
                    border: 1px solid rgba(239,68,68,0.3);
                }

                .fw-skill-badges { position: absolute; top: 3.2rem; left: 1rem; z-index: 10; display: flex; flex-direction: column; gap: 0.3rem; }
                .fw-skill-badge { display: flex; align-items: center; gap: 0.3rem; background: rgba(0,0,0,0.4); backdrop-filter: blur(5px); border: 1px solid rgba(255,255,255,0.08); padding: 0.2rem 0.5rem; border-radius: 4px; color: rgba(255,255,255,0.8); font-size: 0.45rem; font-weight: 900; letter-spacing: 0.05em; animation: fwSkillSlide .4s ease-out; }
                .fw-skill-badge :global(svg) { color: #ef4444; }
                @keyframes fwSkillSlide { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }

                .fw-legend-badge { position:absolute; top:.8rem; right:4.5rem; z-index:15; display:flex; align-items:center; gap:.3rem; background:linear-gradient(135deg,rgba(245,158,11,.2),rgba(245,158,11,.08)); border:1px solid rgba(245,158,11,.35); padding:.2rem .5rem; border-radius:8px; color:#f59e0b; font-size:.45rem; font-weight:900; backdrop-filter:blur(10px); }
                .fw-selected-badge { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); z-index:30; width:50px; height:50px; border-radius:50%; background:linear-gradient(135deg,#10b981,#34d399); color:black; display:flex; align-items:center; justify-content:center; box-shadow:0 0 40px rgba(16,185,129,.5); animation:badgePop .4s cubic-bezier(.175,.885,.32,1.275); }
                @keyframes badgePop { from{transform:translate(-50%,-50%) scale(0)} to{transform:translate(-50%,-50%) scale(1)} }

                .fw-card-rating { position:absolute; bottom:8rem; right:1rem; z-index:10; background:rgba(0,0,0,.85); backdrop-filter:blur(10px); padding:.5rem .8rem; border-radius:12px; border:1px solid rgba(255,255,255,.08); text-align:center; }
                .fw-ovr-label { display:block; font-size:.4rem; font-weight:900; color:rgba(255,255,255,.3); letter-spacing:.1em; }
                .fw-ovr-value { font-size:1.3rem; font-weight:900; color:white; line-height:1; }

                .fw-photo-frame { position:relative; height:300px; overflow:hidden; background:#080810; }
                .fw-photo { width:100%; height:100%; object-fit:cover; object-position:center top; transition:.6s; filter:saturate(1.15) contrast(1.1); }
                .fw-card:hover .fw-photo { transform:scale(1.1); filter:saturate(1.3) contrast(1.15); }
                .fw-photo-vignette { position:absolute; bottom:0; left:0; right:0; height:8rem; background:linear-gradient(to top,rgba(10,10,15,1),transparent); }
                .fw-card-glow { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: transparent; transition: 0.4s; }
                .fw-card:hover .fw-card-glow, .fw-card.kb-focus .fw-card-glow { background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.4), transparent); box-shadow: 0 0 20px rgba(239, 68, 68, 0.2); }

                .fw-card-info { padding:1.5rem 1.5rem 1.75rem; margin-top:-3rem; position:relative; z-index:5; }
                .fw-card-club { font-size:.55rem; font-weight:900; color:#ef4444; letter-spacing:.25em; opacity:.7; display:block; margin-bottom:.4rem; }
                .fw-card-name { font-size:1.35rem; font-weight:900; color:white; line-height:1.1; text-transform:uppercase; font-style:italic; margin-bottom:.6rem; }
                .fw-card-meta { display:flex; align-items:center; gap:.4rem; font-size:.7rem; color:rgba(255,255,255,0.3); font-weight:700; }
                .fw-card-pos { background:rgba(239,68,68,.1); color:#ef4444; padding:.15rem 0.5rem; border-radius:4px; font-size:.6rem; font-weight:900; letter-spacing:.1em; }

                .fw-confirm-bar { position:fixed; bottom:2rem; left:50%; transform:translateX(-50%) translateY(150%); width:calc(100% - 4rem); max-width:950px; padding:1.4rem 2.5rem; border-radius:24px; border:1px solid rgba(239, 68, 68, 0.3); border-top: 1px solid rgba(239, 68, 68, 0.6); z-index:3000; box-shadow:0 30px 70px -15px rgba(0,0,0,.9), 0 0 30px rgba(239, 68, 68, 0.1); transition:all .6s cubic-bezier(.16,1,.3,1); background:rgba(18, 5, 5, 0.9); backdrop-filter:blur(40px); }
                .fw-confirm-bar.visible { transform:translateX(-50%) translateY(0); }
                .fw-bar-content { display:flex; justify-content:space-between; align-items:center; gap: 2rem; }
                .fw-bar-info { display:flex; flex-direction:column; gap:.2rem; flex: 1; }
                .fw-bar-tag { font-size:.6rem; font-weight:950; color:#ef4444; letter-spacing:.2em; text-transform: uppercase; }
                .fw-bar-status { font-size: 1.25rem; font-weight: 950; color: white; letter-spacing: -0.01em; margin: 0.1rem 0; }
                .fw-bar-names { font-size:.75rem; color:rgba(255,255,255,.4); font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width: 400px; }
                
                .fw-bar-list { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.3rem; }
                .fw-bar-player-name { font-size: 0.85rem; color: rgba(255,255,255,0.7); font-weight: 500; }
                
                .fw-proceed-btn { display: flex; align-items: center; gap: 0.8rem; background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.3); padding: 1.1rem 2.8rem; border-radius: 18px; font-weight: 950; font-size: 1.1rem; border: 1px solid rgba(255,255,255,0.1); cursor: not-allowed; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                .fw-proceed-btn.active { background: linear-gradient(135deg, #ef4444, #b91c1c); color: white; cursor: pointer; border: none; box-shadow: 0 15px 35px rgba(239, 68, 68, 0.3); }
                .fw-proceed-btn:not(:disabled) { animation: fwBtnPulse 2s infinite; }
                @keyframes fwBtnPulse { 0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); } 70% { box-shadow: 0 0 0 15px rgba(239, 68, 68, 0); } 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } }
                
                .fw-proceed-btn:hover { transform:scale(1.04) translateY(-3px); box-shadow:0 15px 40px rgba(239, 68, 68, 0.4); }
                .fw-btn-icon { transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                .fw-proceed-btn:hover .fw-btn-icon { transform: rotate(15deg) scale(1.2); }
                .fw-proceed-btn:disabled { opacity:.4; cursor:not-allowed; transform:none; filter: grayscale(1); }

                .fw-progress-steps { display:flex; align-items:center; }
                .fw-step { display:flex; flex-direction:column; align-items:center; gap:.25rem; font-size:.5rem; font-weight:900; color:rgba(255,255,255,.2); letter-spacing:.1em; }
                .fw-step.active { color:#ef4444; }
                .fw-step-circle { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:.7rem; font-weight:900; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); color:rgba(255,255,255,.25); }
                .fw-step-circle.active { background:rgba(239, 68, 68, 0.15); border-color:#ef4444; color:#ef4444; box-shadow:0 0 15px rgba(239, 68, 68, 0.3); }
                .fw-step-circle.done { background:#10b981; border-color:#10b981; color:black; }
                .fw-step-line { width:30px; height:1px; background:rgba(255,255,255,.06); margin-bottom:1rem; }

                .fw-progress-footer { position:fixed; bottom:0; left:0; right:0; display:flex; justify-content:center; padding:1rem 2rem; background:linear-gradient(to top,rgba(2,4,10,.95),transparent); pointer-events:none; z-index:50; }

                @media(max-width:768px) {
                    .fw-ctx-bar { flex-wrap:wrap; gap:.75rem; padding:.75rem 1rem; }
                    .fw-ctx-center { gap:.75rem; order: 1; }
                    .fw-ctx-left { order: 2; width: auto; }
                    .fw-ctx-right { display: none; }
                    .fw-mega-title { font-size:2.2rem; }
                    .fw-grid { grid-template-columns:1fr 1fr; gap:.75rem; }
                    .fw-photo-frame { height:160px; }
                    .fw-card-name { font-size:1rem; }
                    .fw-card-rating { top: 0.5rem; right: 0.5rem; padding: 0.25rem 0.5rem; }
                    .fw-ovr-value { font-size: 1rem; }
                    .fw-confirm-bar { width:95%; padding:1rem; }
                    .fw-bar-content { flex-wrap:wrap; gap:.75rem; justify-content:center; }
                    .fw-proceed-btn { width:100%; justify-content:center; }
                }

                @media(max-width:480px) {
                    .fw-grid { grid-template-columns:1fr 1fr; gap:0.5rem; }
                    .fw-photo-frame { height: 180px; }
                    .fw-card-info { padding: 1rem 0.75rem; margin-top: -2.3rem; }
                    .fw-card-name { font-size: 0.8rem; }
                    .fw-card-club { font-size: 0.45rem; }
                    .fw-card-meta { font-size: 0.55rem; }
                    .fw-role-badge { top: 0.4rem; left: 0.4rem; padding: 0.15rem 0.35rem; font-size: 0.4rem; }
                    .fw-skill-badges { top: 0.4rem; left: 0.4rem; gap: 0.15rem; }
                    .fw-skill-badge { padding: 0.12rem 0.3rem; font-size: 0.35rem; gap: 0.15rem; }
                    .fw-skill-badge :global(svg) { width: 6px; height: 6px; }
                }
            `}</style>
        </div>
    );
}
