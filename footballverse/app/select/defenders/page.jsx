'use client';

import { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, Search, ChevronRight, ChevronLeft, Star, Check, X, ShieldCheck, Zap } from 'lucide-react';
import { DEFENDERS } from './data';
import '../../entry.css';

function DefenderSelectPageInner() {
    const router = useRouter();
    const [selectedDefs, setSelectedDefs] = useState([]);
    const [formation, setFormation] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [filterPos, setFilterPos] = useState('ALL');
    const [search, setSearch] = useState('');
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [isExiting, setIsExiting] = useState(false);
    const [brokenIds, setBrokenIds] = useState(new Set());
    const searchParams = useSearchParams();
    const isEditMode = searchParams.get('edit') === 'true';

    useEffect(() => {
        const f = localStorage.getItem('formation');
        if (f) {
            setFormation(JSON.parse(f));
        } else {
            router.push('/formation-select');
            return;
        }
        const t = localStorage.getItem('selectedTeam');
        if (t) setSelectedTeam(JSON.parse(t));
        const d = localStorage.getItem('defenders');
        if (d) setSelectedDefs(JSON.parse(d));
    }, [router, isEditMode]);

    const maxDef = formation?.defenders || 4;

    const filtered = useMemo(() => {
        let list = DEFENDERS.filter(d => !brokenIds.has(d.id));
        if (filterPos !== 'ALL') list = list.filter(d => d.position === filterPos);
        if (search) list = list.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.club.toLowerCase().includes(search.toLowerCase()));
        return list;
    }, [filterPos, search, brokenIds]);

    const handleImageError = (player) => {
        setBrokenIds(prev => {
            const next = new Set(prev);
            next.add(player.id);
            return next;
        });
        if (selectedDefs.some(p => p.id === player.id)) {
            const updated = selectedDefs.filter(p => p.id !== player.id);
            setSelectedDefs(updated);
            localStorage.setItem('defenders', JSON.stringify(updated));
        }
    };

    const handleSelect = useCallback((player) => {
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
    }, [maxDef]);

    // Keyboard Support
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (search !== '') return; // Disable keys when searching for better UX

            if (e.key === 'ArrowRight') {
                setFocusedIndex(prev => Math.min(prev + 1, filtered.length - 1));
            } else if (e.key === 'ArrowLeft') {
                setFocusedIndex(prev => Math.max(prev - 1, 0));
            } else if (e.key === 'Enter' && focusedIndex !== -1) {
                handleSelect(filtered[focusedIndex]);
            } else if (e.key === 'Backspace' && selectedDefs.length > 0) {
                const updated = [...selectedDefs];
                updated.pop();
                setSelectedDefs(updated);
                localStorage.setItem('defenders', JSON.stringify(updated));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [filtered, focusedIndex, handleSelect, search, selectedDefs]);

    const handleConfirm = useCallback(() => {
        if (selectedDefs.length === maxDef) {
            setIsExiting(true);
            setTimeout(() => {
                if (isEditMode) {
                    router.push('/squad/review');
                } else {
                    router.push('/select/midfielders');
                }
            }, 600);
        }
    }, [isEditMode, selectedDefs, maxDef, router]);

    const positions = ['ALL', 'CB', 'LB', 'RB'];

    return (
        <div className={`entry-page no-snap ${isExiting ? 'page-exit' : ''}`}>
            <div className="stadium-bg df-stadium-bg"></div>
            <div className="overlay-gradient"></div>

            <section className="df-page">
                <main className="df-main">

                    {/* Context Bar */}
                    <div className="df-ctx-bar glass">
                        <div className="df-ctx-left">
                            <button onClick={() => isEditMode ? router.push('/squad/review') : router.push('/select/goalkeeper')} className="df-back-btn">
                                <ChevronLeft size={18} /><span>{isEditMode ? 'BACK TO REVIEW' : 'GOALKEEPER'}</span>
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
                            <Shield className="df-orn-icon" size={28} />
                            <div className="df-orn-line"></div>
                        </div>
                        <h1 className="df-mega-title">
                            SELECT YOUR <span className="text-gradient-blue">DEFENDERS</span>
                        </h1>
                        <p className="df-subtitle">Build the backbone of your team. Pick exactly {maxDef} defenders.</p>
                    </div>

                    {/* Position Filter Tabs */}
                    <div className="df-filter-section">
                        <div className="df-tabs-row">
                            <div className="df-tabs">
                                {positions.map(pos => (
                                    <button key={pos} onClick={() => setFilterPos(pos)}
                                        className={`df-tab ${filterPos === pos ? 'active' : ''}`}>
                                        {pos}
                                        {filterPos === pos && <div className="df-tab-dot"></div>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="df-search-row">
                            <div className="df-search-wrapper">
                                <input type="text" placeholder="Search by name, club or country..."
                                    value={search} onChange={e => setSearch(e.target.value)}
                                    className="df-search" />
                                {search && (
                                    <button className="df-search-clear" onClick={() => setSearch('')}>
                                        <X size={16} />
                                    </button>
                                )}
                                <div className="df-search-icon-wrapper">
                                    <Search className="df-search-icon" size={22} />
                                </div>
                            </div>
                        </div>
                        {search && (
                            <div className="df-result-count">
                                <span className="df-result-num">{filtered.length}</span>
                                <span className="df-result-label">defender{filtered.length !== 1 ? 's' : ''} found</span>
                                {filtered.length === 0 && <span className="df-no-results">— Try a different search</span>}
                            </div>
                        )}
                    </div>

                    {/* Selected Summary */}
                    {selectedDefs.length > 0 && (
                        <div className="df-selection-summary glass">
                            <span className="df-sum-label">SELECTED ({selectedDefs.length}/{maxDef})</span>
                            <div className="df-sum-chips">
                                {selectedDefs.map(p => (
                                    <button key={p.id} className="df-chip" onClick={() => handleSelect(p)}>
                                        <span className="df-chip-pos">{p.position}</span>
                                        <span className="df-chip-name">{p.name}</span>
                                        <div className="df-chip-remove">
                                            <X size={12} />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Grid */}
                    <div className="df-grid">
                        {filtered.map((player, index) => {
                            const isSelected = selectedDefs.some(p => p.id === player.id);
                            const isFull = selectedDefs.length >= maxDef && !isSelected;
                            const isCB = player.position === 'CB';
                            const isWing = player.position === 'LB' || player.position === 'RB';
                            const isKeyboardFocused = focusedIndex === index;

                            return (
                                <button key={player.id}
                                    onClick={() => handleSelect(player)}
                                    onMouseEnter={() => setFocusedIndex(index)}
                                    className={`df-card glass ${isSelected ? 'selected' : ''} ${isFull ? 'dimmed' : ''} ${player.tier === 'legend' ? 'legend-card' : ''} ${isCB ? 'df-card-cb' : 'df-card-fb'} ${isKeyboardFocused ? 'kb-focus' : ''}`}>

                                    {/* Role Indicator Tag */}
                                    <div className="df-role-indicator">
                                        {isCB ? <Shield size={10} /> : <Zap size={10} />}
                                        <span>{player.position}</span>
                                    </div>

                                    {/* Removed top legend badge to clear head area */}

                                    {isSelected && (
                                        <div className="df-selected-badge">
                                            <Check size={20} />
                                        </div>
                                    )}

                                    <div className="df-skill-badges">
                                        {player.skills?.slice(0, 2).map(skill => (
                                            <div key={skill} className="df-skill-badge">
                                                {isCB ? <Shield size={8} /> : <Zap size={8} />}
                                                <span>{skill.toUpperCase()}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="df-card-rating">
                                        <span className="df-ovr-label">OVR</span>
                                        <span className="df-ovr-value">{player.rating}</span>
                                    </div>
                                    <div className="df-photo-frame">
                                        <img
                                            src={player.image}
                                            alt={player.name}
                                            className="df-photo"
                                            loading="lazy"
                                            onError={() => handleImageError(player)}
                                        />
                                        <div className="df-photo-vignette"></div>
                                        <div className="df-card-glow"></div>
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
                                <span className="df-bar-tag">{isEditMode ? 'CHANGES PENDING' : 'DEFENSIVE LINE'}</span>
                                <h3 className="df-bar-name">
                                    {selectedDefs.length} / {maxDef} SELECTED
                                </h3>
                                <div className="df-bar-list">
                                    {selectedDefs.map((d, i) => (
                                        <span key={d.id} className="df-bar-player-name">
                                            {d.name}{i < selectedDefs.length - 1 ? ', ' : ''}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={handleConfirm}
                                className={`df-proceed-btn ${selectedDefs.length === maxDef ? 'active' : ''}`}
                                disabled={selectedDefs.length !== maxDef}
                            >
                                <span>{isEditMode ? 'CONFIRM CHANGES' : 'LOCK DEFENDERS'}</span>
                                <ShieldCheck size={22} className="df-btn-icon" />
                            </button>
                        </div>
                    </div>

                    {/* Progress */}
                    {!isEditMode && (
                        <div className="df-progress-footer">
                            <div className="df-progress-steps">
                                {['GK', 'DEF', 'MID', 'FWD', 'DONE'].map((s, i) => (
                                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div className={`df-step ${i === 1 ? 'active' : ''} ${i < 1 ? 'completed' : ''}`}>
                                            <div className="df-step-circle">{i < 1 ? <Check size={12} /> : i + 1}</div>
                                            <span>{s}</span>
                                        </div>
                                        {i < 4 && <div className="df-step-line"></div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </main>
            </section>

            <style jsx>{`
                .df-page { min-height:100vh; display:flex; justify-content:center; padding:3rem 1rem; animation:dfFadeIn .6s ease-out; }
                .page-exit { animation: dfPageExit 0.6s forwards ease-in; pointer-events: none; }
                
                @keyframes dfFadeIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
                @keyframes dfPageExit { from{opacity:1;transform:translateY(0)} to{opacity:0;transform:translateY(-20px)} }
                
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

                /* Title */
                .df-title-section { text-align:center; margin-bottom:2rem; }
                .df-ornament { display:flex; align-items:center; justify-content:center; gap:1rem; margin-bottom:1.25rem; }
                .df-orn-line { width:50px; height:1px; background:rgba(59,130,246,.3); }
                .df-orn-icon { color:#3b82f6; filter:drop-shadow(0 0 10px rgba(59,130,246,.5)); }
                .df-mega-title { font-size:clamp(2.5rem,7vw,4.5rem); font-weight:900; color:white; letter-spacing:-.03em; margin-bottom:1rem; }
                .text-gradient-blue { background:linear-gradient(135deg,#3b82f6,#60a5fa,#3b82f6); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
                .df-subtitle { font-size:1.1rem; color:rgba(255,255,255,.35); line-height:1.7; max-width:520px; margin:0 auto; }

                /* Filter Section */
                .df-filter-section { display:flex; flex-direction:column; gap:2rem; margin-bottom:3rem; }
                .df-tabs-row { display:flex; justify-content:center; }
                .df-tabs { display:flex; gap:.5rem; background:rgba(255,255,255,.03); padding:.4rem; border-radius:16px; border:1px solid rgba(255,255,255,.05); position: relative; }
                .df-tab { position: relative; padding:.7rem 1.8rem; border-radius:12px; border:1px solid transparent; background:transparent; color:rgba(255,255,255,.4); font-weight:900; font-size:.7rem; letter-spacing:.1em; cursor:pointer; transition:.3s; }
                .df-tab.active { background:rgba(59,130,246,0.15); border-color:rgba(59,130,246,.3); color:#3b82f6; box-shadow:0 0 20px rgba(59,130,246,.1); }
                .df-tab:hover:not(.active) { color:white; background:rgba(255,255,255,.05); }
                .df-tab-dot { position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%); width: 4px; height: 4px; border-radius: 50%; background: #3b82f6; animation: dfDotGrow 0.3s ease-out; }
                @keyframes dfDotGrow { from { transform: translateX(-50%) scale(0); } to { transform: translateX(-50%) scale(1); } }

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
                    background: rgba(15,20,40,0.9); border-color: #3b82f6;
                    box-shadow:0 20px 50px rgba(59,130,246,0.25), inset 0 0 15px rgba(59,130,246,0.1);
                    transform: translateY(-3px) scale(1.01);
                }
                .df-search-icon-wrapper { position: absolute; right: 1.5rem; top: 50%; transform: translateY(-50%); width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; pointer-events: none; }
                .df-search-icon { color: #3b82f6; filter: drop-shadow(0 0 10px rgba(59,130,246,0.5)); }
                .df-search-wrapper:focus-within .df-search-icon { color: #60a5fa; transform: scale(1.2) rotate(-5deg); transition: .4s; }
                .df-search::placeholder { color:rgba(255,255,255,0.25); }
                .df-search-clear { position: absolute; right: 4.5rem; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.1); border: none; color: rgba(255,255,255,0.5); cursor: pointer; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: .2s; }
                .df-search-clear:hover { background: rgba(59,130,246,0.2); color: #3b82f6; }
                .df-result-count { display:flex; align-items:center; justify-content:center; gap:.5rem; animation: dfCountIn .3s ease-out; }
                @keyframes dfCountIn { from{opacity:0;transform:translateY(-5px)} to{opacity:1;transform:translateY(0)} }
                .df-result-num { font-size:1.1rem; font-weight:950; color:#3b82f6; }
                .df-result-label { font-size:.75rem; font-weight:700; color:rgba(255,255,255,.4); }
                .df-no-results { font-size:.7rem; color:rgba(255,255,255,.25); font-style:italic; }

                /* Selection Summary */
                .df-selection-summary { padding:.75rem 1.5rem; border-radius:16px; margin-bottom:1.5rem; display:flex; align-items:center; gap:1rem; flex-wrap:wrap; background:rgba(10,10,15,.6); border:1px solid rgba(59,130,246,.15); }
                .df-sum-label { font-size:.55rem; font-weight:900; color:#3b82f6; letter-spacing:.15em; white-space:nowrap; }
                .df-sum-chips { display:flex; gap:.4rem; flex-wrap:wrap; }
                .df-chip { position: relative; display:flex; align-items:center; gap:.5rem; padding:.35rem .8rem; border-radius:8px; background:rgba(59,130,246,.1); border:1px solid rgba(59,130,246,.25); color:white; font-size:.65rem; font-weight:800; cursor:pointer; transition:.3s; overflow: hidden; }
                                .df-chip:hover { background:rgba(239,68,68,.1); border-color:rgba(239,68,68,.3); transform: translateY(-2px); }

                /* Grid */
                .df-grid { display:grid; grid-template-columns:repeat(4, 1fr); gap:1.5rem; margin-bottom:12rem; }

                /* Card */
                .df-card { position:relative; text-align:left; border-radius:24px; overflow:hidden; border:1px solid rgba(255,255,255,.06); background:rgba(10,10,15,.7); cursor:pointer; transition:all .4s cubic-bezier(.23,1,.32,1); }
                .df-card:hover, .df-card.kb-focus { transform:translateY(-10px); border-color:rgba(59,130,246,.4); box-shadow:0 25px 60px -15px rgba(0,0,0,.7), 0 0 25px rgba(59,130,246,.1); }
                .df-card.selected { border-color:#10b981; border-width:2px; box-shadow:0 0 40px rgba(16,185,129,.15); transform:translateY(-10px) scale(1.03); }
                .df-card-cb { border-left: 4px solid #3b82f6 !important; }
                .df-card-fb { border-left: 4px solid #14b8a6 !important; }
                .df-card.dimmed { opacity:.25; filter:grayscale(.6); pointer-events:none; }
                .df-card.legend-card { border-color:rgba(245,158,11,.25); background:linear-gradient(165deg,rgba(30,25,10,.9),rgba(10,10,15,.85)); }
                .df-card.legend-card:hover { border-color:rgba(245,158,11,.5); }

                /* Role Indicator */
                .df-role-indicator {
                    position: absolute; bottom: 1rem; right: 1rem; z-index: 10;
                    display: flex; align-items: center; gap: 0.3rem;
                    background: rgba(0,0,0,0.6); backdrop-filter: blur(5px);
                    padding: 0.25rem 0.5rem; border-radius: 6px;
                    font-size: 0.5rem; font-weight: 900; letter-spacing: 0.1em;
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .df-card-cb .df-role-indicator { color: #3b82f6; border-color: rgba(59,130,246,0.3); }
                .df-card-fb .df-role-indicator { color: #14b8a6; border-color: rgba(20,184,166,0.3); }

                /* Badges */
                .df-legend-badge { position:absolute; top:.8rem; left:.8rem; z-index:10; display:flex; align-items:center; gap:.3rem; background:linear-gradient(135deg,rgba(245,158,11,.2),rgba(245,158,11,.08)); border:1px solid rgba(245,158,11,.35); padding:.2rem .5rem; border-radius:8px; color:#f59e0b; font-size:.45rem; font-weight:900; letter-spacing:.15em; backdrop-filter:blur(10px); }
                .df-selected-badge { position:absolute; top:1rem; left:1rem; z-index:30; width:36px; height:36px; border-radius:50%; background:linear-gradient(135deg,#10b981,#34d399); color:black; display:flex; align-items:center; justify-content:center; box-shadow:0 0 20px rgba(16,185,129,.5); animation:badgePop .4s cubic-bezier(.175,.885,.32,1.275); }
                @keyframes badgePop { from{transform:scale(0)} to{transform:scale(1)} }
                
                .df-skill-badges { position: absolute; top: 1rem; left: 1rem; z-index: 10; display: flex; flex-direction: column; gap: 0.3rem; }
                .df-skill-badge { display: flex; align-items: center; gap: 0.3rem; background: rgba(59,130,246,0.15); border: 1px solid rgba(59,130,246,0.3); padding: 0.2rem 0.5rem; border-radius: 4px; color: #60a5fa; font-size: 0.45rem; font-weight: 900; letter-spacing: 0.05em; backdrop-filter: blur(8px); animation: skillSlide .4s ease-out; }
                @keyframes skillSlide { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
                .df-card-cb .df-skill-badge { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.15); color: rgba(255,255,255,0.8); }
                .legend-card .df-skill-badge { background: rgba(245,158,11,0.15); border-color: rgba(245,158,11,0.3); color: #f59e0b; }

                /* Rating */
                .df-card-rating { position:absolute; bottom:8rem; right:1rem; z-index:10; background:rgba(0,0,0,.85); backdrop-filter:blur(10px); padding:.5rem .8rem; border-radius:12px; border:1px solid rgba(255,255,255,.08); text-align:center; }
                .df-ovr-label { display:block; font-size:.4rem; font-weight:900; color:rgba(255,255,255,.3); letter-spacing:.1em; }
                .df-ovr-value { font-size:1.3rem; font-weight:900; color:white; line-height:1; }

                /* Photo */
                .df-photo-frame { position:relative; height:300px; overflow:hidden; background:#080810; }
                .df-photo { width:100%; height:100%; object-fit:cover; object-position:center top; transition:.6s; filter:saturate(1.15) contrast(1.1); }
                .df-card:hover .df-photo, .df-card.kb-focus .df-photo { transform:scale(1.1); filter:saturate(1.3) contrast(1.15); }
                .df-photo-vignette { position:absolute; bottom:0; left:0; right:0; height:8rem; background:linear-gradient(to top,rgba(10,10,15,1),transparent); }
                .df-card-glow { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: transparent; transition: 0.4s; }
                .df-card:hover .df-card-glow, .df-card.kb-focus .df-card-glow { background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), transparent); box-shadow: 0 0 20px rgba(59, 130, 246, 0.2); }

                /* Info */
                .df-card-info { padding:1.5rem 1.5rem 1.75rem; margin-top:-3rem; position:relative; z-index:5; }
                .df-card-club { font-size:.55rem; font-weight:900; color:#3b82f6; letter-spacing:.25em; opacity:.7; display:block; margin-bottom:.4rem; }
                .legend-card .df-card-club { color:#f59e0b; }
                .df-card-name { font-size:1.35rem; font-weight:900; color:white; line-height:1.1; text-transform:uppercase; font-style:italic; margin-bottom:.6rem; }
                .df-card-meta { display:flex; align-items:center; gap:.4rem; font-size:.7rem; color:rgba(255,255,255,0.3); font-weight:700; }
                .df-meta-dot { opacity:.3; }
                .df-card-pos { background:rgba(59,130,246,.1); color:#3b82f6; padding:.15rem 0.5rem; border-radius:4px; font-size:.6rem; font-weight:900; letter-spacing:.1em; }
                .legend-card .df-card-pos { background:rgba(245,158,11,.1); color:#f59e0b; }

                .df-confirm-bar { position:fixed; bottom:2rem; left:50%; transform:translateX(-50%) translateY(150%); width:calc(100% - 4rem); max-width:950px; padding:1.4rem 2.5rem; border-radius:24px; border:1px solid rgba(59, 130, 246,.3); border-top: 1px solid rgba(59, 130, 246,.6); z-index:3000; box-shadow:0 30px 70px -15px rgba(0,0,0,.9), 0 0 30px rgba(59, 130, 246,.1); transition:all .6s cubic-bezier(.16,1,.3,1); background:rgba(10,10,18,.85); backdrop-filter:blur(40px); }
                .df-confirm-bar.visible { transform:translateX(-50%) translateY(0); }
                .df-bar-content { display:flex; justify-content:space-between; align-items:center; gap: 2rem; }
                .df-bar-info { display:flex; flex-direction:column; gap:.2rem; flex: 1; }
                .df-bar-tag { font-size:.6rem; font-weight:950; color:#3b82f6; letter-spacing:.2em; text-transform: uppercase; }
                .df-bar-status { font-size: 1.25rem; font-weight: 950; color: white; margin: 0.1rem 0; }
                
                .df-bar-list { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.3rem; }
                .df-bar-player-name { font-size: 0.85rem; color: rgba(255,255,255,0.7); font-weight: 500; }
                
                .df-proceed-btn { display: flex; align-items: center; gap: 0.8rem; background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.3); padding: 1.1rem 2.8rem; border-radius: 18px; font-weight: 950; font-size: 1.1rem; border: 1px solid rgba(255,255,255,0.1); cursor: not-allowed; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); white-space:nowrap; overflow: hidden; }
                .df-proceed-btn.active { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; cursor: pointer; border: none; box-shadow: 0 15px 35px rgba(37, 99, 235, 0.3); }
                .df-proceed-btn:not(:disabled) { animation: dfBtnPulse 2s infinite; }
                @keyframes dfBtnPulse { 0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.6); } 70% { box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); } 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); } }
                
                .df-proceed-btn:hover { transform:scale(1.04) translateY(-3px); box-shadow:0 15px 40px rgba(59, 130, 246, 0.4); }
                .df-btn-icon { transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                .df-proceed-btn:disabled { opacity:.4; cursor:not-allowed; transform:none; filter: grayscale(1); }

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
                .df-stadium-bg { filter: brightness(0.25) saturate(1.1) contrast(1.1); }
                @media(max-width:1200px) {
                    .df-grid { grid-template-columns:repeat(3, 1fr); }
                }
                @media(max-width:768px) {
                    .df-ctx-bar { flex-wrap:wrap; gap:.75rem; padding:.75rem 1rem; }
                    .df-ctx-center { gap:.75rem; order: 1; }
                    .df-ctx-left { order: 2; width: auto; }
                    .df-ctx-right { display: none; }
                    .df-mega-title { font-size:2.2rem; }
                    .df-grid { grid-template-columns:1fr 1fr; gap:.75rem; }
                    .df-photo-frame { height:160px; }
                    .df-card-name { font-size:.95rem; }
                    .df-card-rating { top: 0.5rem; right: 0.5rem; padding: 0.25rem 0.5rem; }
                    .df-ovr-value { font-size: 1rem; }
                    .df-filter-section { gap:1rem; }
                    .df-search-wrapper { max-width:100%; }
                    .df-confirm-bar { width:95%; padding:1rem; }
                    .df-bar-content { flex-wrap:wrap; gap:.75rem; justify-content:center; }
                    .df-bar-names { display:none; }
                    .df-proceed-btn { width:100%; justify-content:center; padding:.85rem; font-size:.8rem; }
                }
                @media(max-width:480px) {
                    .df-grid { grid-template-columns:1fr 1fr; gap:0.5rem; }
                    .df-photo-frame { height: 180px; }
                    .df-card-info { padding: 1rem 0.75rem; margin-top: -2.3rem; }
                    .df-card-name { font-size: 0.8rem; }
                    .df-card-club { font-size: 0.4rem; }
                    .df-card-meta { font-size: 0.55rem; }
                    .df-role-indicator { bottom: 0.4rem; right: 0.4rem; padding: 0.15rem 0.35rem; font-size: 0.4rem; }
                    .df-skill-badges { top: 0.4rem; left: 0.4rem; gap: 0.2rem; }
                    .df-skill-badge { padding: 0.15rem 0.35rem; font-size: 0.35rem; gap: 0.2rem; border-radius: 3px; }
                    .df-skill-badge :global(svg) { width: 6px; height: 6px; }
                }
            `}</style>
        </div>
    );
}

export default function DefenderSelectPage() {
    return (
        <Suspense fallback={<div style={{ minHeight: '100vh', background: '#02040a' }} />}>
            <DefenderSelectPageInner />
        </Suspense>
    );
}
