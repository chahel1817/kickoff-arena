'use client';

import { useState, useEffect, useMemo, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Zap, Layers, ChevronRight, ChevronLeft, Star, Check, X, Shield, Activity } from 'lucide-react';
import { MIDFIELDERS } from './data';
import { usePlayerImageResolver } from '@/hooks/usePlayerImageResolver';
import '../../entry.css';

function MidfielderSelectPageInner() {
    const router = useRouter();
    const [selectedMids, setSelectedMids] = useState([]);
    const [formation, setFormation] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [filterPos, setFilterPos] = useState('ALL');
    const [search, setSearch] = useState('');
    const searchParams = useSearchParams();
    const isEditMode = searchParams.get('edit') === 'true';
    const { getImageSrc, handleImageError } = usePlayerImageResolver(MIDFIELDERS);
    const dedupedMidfielders = useMemo(() => {
        const seen = new Set();
        return MIDFIELDERS.filter((player) => {
            const key = player.name.toLowerCase();
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
        const f = localStorage.getItem('formation');
        if (f) {
            setFormation(JSON.parse(f));
        } else {
            router.push('/formation-select');
            return;
        }
        const t = localStorage.getItem('selectedTeam');
        if (t) setSelectedTeam(JSON.parse(t));
        const m = localStorage.getItem('midfielders');
        if (m) setSelectedMids(JSON.parse(m));
    }, [router, isEditMode]);

    const maxMid = formation?.midfielders || 3;

    const filtered = useMemo(() => {
        let list = dedupedMidfielders;
        if (filterPos !== 'ALL') list = list.filter(m => m.position === filterPos);
        if (search) list = list.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.club.toLowerCase().includes(search.toLowerCase()));
        return list;
    }, [filterPos, search, dedupedMidfielders]);

    const handleSelect = useCallback((player) => {
        setSelectedMids(prev => {
            const exists = prev.find(p => p.id === player.id);
            let next;
            if (exists) {
                next = prev.filter(p => p.id !== player.id);
            } else if (prev.length < maxMid) {
                next = [...prev, player];
            } else return prev;
            localStorage.setItem('midfielders', JSON.stringify(next));
            return next;
        });
    }, [maxMid]);

    const handleConfirm = useCallback(() => {
        if (selectedMids.length === maxMid) {
            if (isEditMode) {
                router.push('/squad/review');
            } else {
                router.push('/select/forwards');
            }
        }
    }, [isEditMode, selectedMids, maxMid, router]);

    const positions = ['ALL', 'CDM', 'CM', 'CAM'];

    return (
        <div className="entry-page no-snap">
            <div className="stadium-bg mf-stadium-bg"></div>
            <div className="overlay-gradient"></div>

            <section className="mf-page">
                <main className="mf-main">

                    {/* Context Bar */}
                    <div className="mf-ctx-bar glass">
                        <div className="mf-ctx-left">
                            <button onClick={() => isEditMode ? router.push('/squad/review') : router.push('/select/defenders')} className="mf-back-btn">
                                <ChevronLeft size={18} /><span>{isEditMode ? 'BACK TO REVIEW' : 'DEFENDERS'}</span>
                            </button>
                        </div>
                        <div className="mf-ctx-center">
                            <div className="mf-ctx-item">
                                <span className="mf-ctx-label">FORMATION</span>
                                <span className="mf-ctx-value">{formation?.name || '4-4-2'}</span>
                            </div>
                            <div className="mf-ctx-divider"></div>
                            <div className="mf-ctx-item">
                                <span className="mf-ctx-label">MIDFIELDERS</span>
                                <span className="mf-ctx-value" style={{ color: selectedMids.length === maxMid ? '#10b981' : '#a855f7' }}>
                                    {selectedMids.length} / {maxMid}
                                </span>
                            </div>
                            <div className="mf-ctx-divider"></div>
                            <div className="mf-ctx-item">
                                <span className="mf-ctx-label">STEP</span>
                                <span className="mf-ctx-value" style={{ color: '#a855f7' }}>3 / 5</span>
                            </div>
                        </div>
                        <div className="mf-ctx-right">
                            <div className="mf-step-badge">
                                <Layers size={16} />
                                <span>MIDFIELD</span>
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="mf-title-section">
                        <div className="mf-ornament">
                            <div className="mf-orn-line"></div>
                            <Zap className="mf-orn-icon" size={28} />
                            <div className="mf-orn-line"></div>
                        </div>
                        <h1 className="mf-mega-title">
                            SELECT YOUR <span className="text-gradient-purple">MIDFIELDERS</span>
                        </h1>
                        <p className="mf-subtitle">Control the engine room. Pick exactly {maxMid} midfielders to dominate the pitch.</p>
                    </div>

                    {/* Filters Section */}
                    <div className="mf-filter-section">
                        <div className="mf-tabs-row">
                            <div className="mf-tabs">
                                {positions.map(pos => {
                                    const isActive = filterPos === pos;
                                    return (
                                        <button key={pos} onClick={() => setFilterPos(pos)}
                                            className={`mf-tab ${isActive ? 'active' : ''} tab-${pos.toLowerCase()}`}>
                                            {pos === 'CDM' && <Shield size={12} className="tab-icon" />}
                                            {pos === 'CM' && <Activity size={12} className="tab-icon" />}
                                            {pos === 'CAM' && <Zap size={12} className="tab-icon" />}
                                            <span>{pos}</span>
                                            {isActive && <div className="mf-tab-indicator"></div>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mf-helper-row">
                            <div className="mf-helper-glass">
                                <span className="mf-helper-icon">💡</span>
                                <p className="mf-helper-text">
                                    Balanced midfields usually include a <strong>CDM</strong> (Defense), <strong>CM</strong> (Engine), and <strong>CAM</strong> (Attack).
                                </p>
                            </div>
                        </div>

                        <div className="mf-search-row">
                            <div className="mf-search-wrapper">
                                <input type="text" placeholder="Search by name, club or country..."
                                    value={search} onChange={e => setSearch(e.target.value)}
                                    className="mf-search" />
                                {search && (
                                    <button className="mf-search-clear" onClick={() => setSearch('')}>
                                        <X size={16} />
                                    </button>
                                )}
                                <div className="mf-search-icon-wrapper">
                                    <Search className="mf-search-icon" size={22} />
                                </div>
                            </div>
                        </div>
                        {search && (
                            <div className="mf-result-count">
                                <span className="mf-result-num">{filtered.length}</span>
                                <span className="mf-result-label">midfielder{filtered.length !== 1 ? 's' : ''} found</span>
                                {filtered.length === 0 && <span className="mf-no-results">— Try a different search</span>}
                            </div>
                        )}
                    </div>

                    {/* Selected Summary */}
                    {selectedMids.length > 0 && (
                        <div className="mf-selection-summary glass">
                            <span className="mf-sum-label">SELECTED ({selectedMids.length}/{maxMid})</span>
                            <div className="mf-sum-chips">
                                {selectedMids.map(p => (
                                    <button key={p.id} className="mf-chip" onClick={() => handleSelect(p)}>
                                        <span className="mf-chip-pos">{p.position}</span>
                                        <span>{p.name}</span>
                                        <X size={14} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Grid */}
                    <div className="mf-grid">
                        {filtered.map(player => {
                            const isSelected = selectedMids.some(p => p.id === player.id);
                            const isFull = selectedMids.length >= maxMid && !isSelected;
                            return (
                                <button key={player.id} onClick={() => handleSelect(player)}
                                    className={`mf-card glass ${isSelected ? 'selected' : ''} ${isFull ? 'dimmed' : ''} ${player.tier === 'legend' ? 'legend-card' : ''} badge-${player.position.toLowerCase()}-wrap`}>
                                    {/* Role Badge */}
                                    <div className={`mf-role-badge badge-${player.position.toLowerCase()}`}>
                                        {player.position === 'CDM' && <Shield size={10} />}
                                        {player.position === 'CM' && <Activity size={10} />}
                                        {player.position === 'CAM' && <Zap size={10} />}
                                        <span>{player.position}</span>
                                    </div>

                                    {/* Skill Qualities */}
                                    <div className="mf-skill-badges">
                                        {player.skills?.slice(0, 2).map(skill => (
                                            <div key={skill} className="mf-skill-badge">
                                                {player.position === 'CDM' && <Shield size={8} />}
                                                {player.position === 'CM' && <Activity size={8} />}
                                                {player.position === 'CAM' && <Zap size={8} />}
                                                <span>{skill.toUpperCase()}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Top legend badge removed to clear heads */}
                                    {isSelected && (
                                        <div className="mf-selected-badge"><Check size={20} /></div>
                                    )}
                                    <div className="mf-card-rating">
                                        <span className="mf-ovr-label">OVR</span>
                                        <span className="mf-ovr-value">{player.rating}</span>
                                    </div>
                                    <div className="mf-photo-frame">
                                        <img
                                            src={getImageSrc(player)}
                                            alt={player.name}
                                            className="mf-photo"
                                            loading="lazy"
                                            onError={() => handleImageError(player)}
                                        />
                                        <div className="mf-photo-vignette"></div>
                                    </div>
                                    <div className="mf-card-info">
                                        <span className="mf-card-club">{player.club.toUpperCase()}</span>
                                        <h3 className="mf-card-name">{player.name}</h3>
                                        <div className="mf-card-meta">
                                            <span>{player.country}</span>
                                            <span className="mf-meta-dot">•</span>
                                            <span className="mf-card-pos">{player.position}</span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Confirm Bar */}
                    <div className={`mf-confirm-bar glass ${selectedMids.length === maxMid ? 'visible' : ''}`}>
                        <div className="mf-bar-content">
                            <div className="mf-bar-info">
                                <span className="mf-bar-tag">{isEditMode ? 'CHANGES PENDING' : 'CORE ENGINE'}</span>
                                <h3 className="mf-bar-name">
                                    {selectedMids.length} / {maxMid} SELECTED
                                </h3>
                                <div className="mf-bar-list">
                                    {selectedMids.map((m, i) => (
                                        <span key={m.id} className="mf-bar-player-name">
                                            {m.name}{i < selectedMids.length - 1 ? ', ' : ''}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={handleConfirm}
                                className={`mf-proceed-btn ${selectedMids.length === maxMid ? 'active' : ''}`}
                                disabled={selectedMids.length !== maxMid}
                            >
                                <span>{isEditMode ? 'CONFIRM CHANGES' : 'LOCK MIDFIELD'}</span>
                                <Zap size={22} className="mf-btn-icon" />
                            </button>
                        </div>
                    </div>

                    {!isEditMode && (
                        <div className="mf-progress-footer">
                            <div className="mf-progress-steps">
                                {['GK', 'DEF', 'MID', 'FWD', 'DONE'].map((s, i) => (
                                    <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
                                        <div className={`mf-step ${i === 2 ? 'active' : ''} ${i < 2 ? 'completed' : ''}`}>
                                            <div className="mf-step-circle">{i < 2 ? <Check size={12} /> : i + 1}</div>
                                            <span>{s}</span>
                                        </div>
                                        {i < 4 && <div className="mf-step-line"></div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </main>
            </section>

            <style jsx>{`
                .mf-page { min-height:100vh; display:flex; justify-content:center; padding:3rem 1rem; animation:mfFadeIn .6s ease-out; }
                @keyframes mfFadeIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
                .mf-main { max-width:1400px; width:96%; }

                .mf-ctx-bar { display:flex; justify-content:space-between; align-items:center; padding:1rem 2rem; background:rgba(10,10,15,.6); backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,.08); border-radius:20px; margin-bottom:2.5rem; position:sticky; top:0; z-index:100; }
                .mf-back-btn { display:flex; align-items:center; gap:.5rem; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1); padding:.6rem 1.2rem; border-radius:12px; color:rgba(255,255,255,.6); font-weight:900; font-size:.6rem; letter-spacing:.12em; cursor:pointer; transition:.3s; }
                .mf-back-btn:hover { background:#a855f7; color:white; border-color:#a855f7; }
                .mf-ctx-center { display:flex; align-items:center; gap:1.5rem; }
                .mf-ctx-item { text-align:center; }
                .mf-ctx-label { display:block; font-size:.45rem; font-weight:900; color:rgba(255,255,255,.25); letter-spacing:.2em; margin-bottom:.15rem; }
                .mf-ctx-value { font-size:.85rem; font-weight:900; color:#a855f7; letter-spacing:.05em; }
                .mf-ctx-divider { width:1px; height:30px; background:rgba(255,255,255,.08); }
                .mf-step-badge { display:flex; align-items:center; gap:.4rem; background:rgba(168,85,247,.08); border:1px solid rgba(168,85,247,.2); padding:.5rem 1rem; border-radius:12px; color:#a855f7; font-size:.6rem; font-weight:900; letter-spacing:.12em; }

                .mf-title-section { text-align:center; margin-bottom:2rem; }
                .mf-ornament { display:flex; align-items:center; justify-content:center; gap:1rem; margin-bottom:1.25rem; }
                .mf-orn-line { width:50px; height:1px; background:rgba(168,85,247,.3); }
                .mf-orn-icon { color:#a855f7; filter:drop-shadow(0 0 10px rgba(168,85,247,.5)); }
                .mf-mega-title { font-size:clamp(2.5rem,7vw,4.5rem); font-weight:900; color:white; letter-spacing:-.03em; margin-bottom:1rem; }
                .text-gradient-purple { background:linear-gradient(135deg,#a855f7,#c084fc,#a855f7); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
                .mf-subtitle { font-size:1.1rem; color:rgba(255,255,255,.35); line-height:1.7; max-width:520px; margin:0 auto; }

                /* Filter Section */
                .mf-filter-section { display:flex; flex-direction:column; gap:1.5rem; margin-bottom:3rem; }
                .mf-tabs-row { display:flex; justify-content:center; }
                .mf-tabs { display:flex; gap:.4rem; background:rgba(255,255,255,.03); padding:.4rem; border-radius:16px; border:1px solid rgba(255,255,255,.05); position: relative; }
                
                .mf-tab { 
                    position: relative; display: flex; align-items: center; gap: 0.6rem;
                    padding:.7rem 1.8rem; border-radius:12px; border:1px solid transparent; 
                    background:transparent; color:rgba(255,255,255,.4); font-weight:900; 
                    font-size:.7rem; letter-spacing:.1em; cursor:pointer; transition:all .3s cubic-bezier(0.4, 0, 0.2, 1); 
                }
                .mf-tab:hover:not(.active) { color:white; background:rgba(255,255,255,.05); }
                
                .tab-icon { opacity: 0.5; transition: 0.3s; }
                .mf-tab.active .tab-icon { opacity: 1; transform: scale(1.1); }
                
                /* Role Specific Active States */
                .mf-tab.active.tab-cdm { color: #7c3aed; background: rgba(124, 58, 237, 0.1); border-color: rgba(124, 58, 237, 0.3); box-shadow: 0 0 20px rgba(124, 58, 237, 0.15); }
                .mf-tab.active.tab-cm { color: #a855f7; background: rgba(168, 85, 247, 0.1); border-color: rgba(168, 85, 247, 0.3); box-shadow: 0 0 20px rgba(168, 85, 247, 0.15); }
                .mf-tab.active.tab-cam { color: #d8b4fe; background: rgba(216, 180, 254, 0.1); border-color: rgba(216, 180, 254, 0.3); box-shadow: 0 0 20px rgba(216, 180, 254, 0.15); }
                .mf-tab.active.tab-all { color: white; background: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.2); }

                .mf-tab-indicator {
                    position: absolute; bottom: 0.4rem; left: 1.8rem; right: 1.8rem; height: 2px;
                    border-radius: 10px; background: currentColor;
                    animation: mfTabGrow .3s ease-out;
                }
                @keyframes mfTabGrow { from { opacity: 0; transform: scaleX(0); } to { opacity: 1; transform: scaleX(1); } }

                /* Helper Message */
                .mf-helper-row { display: flex; justify-content: center; margin: -0.5rem 0 1rem; }
                .mf-helper-glass { 
                    display: flex; align-items: center; gap: 0.75rem; 
                    padding: 0.6rem 1.25rem; border-radius: 100px; 
                    background: rgba(168, 85, 247, 0.05); border: 1px solid rgba(168, 85, 247, 0.1);
                    backdrop-filter: blur(10px); animation: mfHelperSlide .5s ease-out;
                }
                @keyframes mfHelperSlide { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
                .mf-helper-icon { font-size: 0.9rem; }
                .mf-helper-text { font-size: 0.75rem; font-weight: 500; color: rgba(255,255,255,0.5); margin: 0; }
                .mf-helper-text strong { color: #d8b4fe; font-weight: 900; }

                .mf-search-row { display:flex; justify-content:center; width: 100%; }
                .mf-search-wrapper { position:relative; width:100%; max-width:750px; display: flex; align-items: center; }
                .mf-search { 
                    width:100%; padding:1.4rem 5rem 1.4rem 2.5rem; border-radius:100px; 
                    border:1px solid rgba(168,85,247,0.3); background:rgba(15,10,25,0.7); 
                    color:white; font-size:1.2rem; font-weight:500; 
                    outline:none; transition:all .4s cubic-bezier(0.23, 1, 0.32, 1); 
                    box-shadow:0 10px 40px rgba(0,0,0,0.4), inset 0 0 20px rgba(168,85,247,0.05);
                    backdrop-filter: blur(20px);
                }
                .mf-search:focus { 
                    background: rgba(25,15,40,0.9);
                    border-color: #a855f7;
                    box-shadow:0 20px 50px rgba(168,85,247,0.25), inset 0 0 15px rgba(168,85,247,0.1);
                    transform: translateY(-3px) scale(1.01);
                }
                .mf-search-icon-wrapper {
                    position: absolute; right: 1.5rem; top: 50%; transform: translateY(-50%);
                    width: 50px; height: 50px; display: flex; align-items: center; justify-content: center;
                    pointer-events: none;
                }
                .mf-search-icon { 
                    color: #a855f7;
                    filter: drop-shadow(0 0 10px rgba(168,85,247,0.5));
                }
                .mf-search-wrapper:focus-within .mf-search-icon { 
                    color: #c084fc; transform: scale(1.2) rotate(-5deg); transition: .4s;
                }
                .mf-search::placeholder { color:rgba(255,255,255,0.25); }
                .mf-search-clear { position: absolute; right: 4.5rem; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.1); border: none; color: rgba(255,255,255,0.5); cursor: pointer; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: .2s; }
                .mf-search-clear:hover { background: rgba(168,85,247,0.2); color: #a855f7; }
                .mf-result-count { display:flex; align-items:center; justify-content:center; gap:.5rem; animation: mfCountIn .3s ease-out; }
                @keyframes mfCountIn { from{opacity:0;transform:translateY(-5px)} to{opacity:1;transform:translateY(0)} }
                .mf-result-num { font-size:1.1rem; font-weight:950; color:#a855f7; }
                .mf-result-label { font-size:.75rem; font-weight:700; color:rgba(255,255,255,.4); }
                .mf-no-results { font-size:.7rem; color:rgba(255,255,255,.25); font-style:italic; }

                .mf-selection-summary { padding:.75rem 1.5rem; border-radius:16px; margin-bottom:1.5rem; display:flex; align-items:center; gap:1rem; flex-wrap:wrap; background:rgba(10,10,15,.6); border:1px solid rgba(168,85,247,.15); }
                .mf-sum-label { font-size:.55rem; font-weight:900; color:#a855f7; letter-spacing:.15em; white-space:nowrap; }
                .mf-sum-chips { display:flex; gap:.4rem; flex-wrap:wrap; }
                                .mf-chip { display:flex; align-items:center; gap:.4rem; padding:.35rem .8rem; border-radius:8px; background:rgba(168,85,247,.1); border:1px solid rgba(168,85,247,.25); color:white; font-size:.65rem; font-weight:700; cursor:pointer; transition:.3s; }

                .mf-grid { display:grid; grid-template-columns:repeat(4, 1fr); gap:1.5rem; margin-bottom:12rem; }

                .mf-card { position:relative; text-align:left; border-radius:24px; overflow:hidden; border:1px solid rgba(255,255,255,.06); background:rgba(10,10,15,.7); cursor:pointer; transition:all .45s cubic-bezier(.23,1,.32,1); }
                .mf-card:hover { transform:translateY(-10px); border-color:rgba(168,85,247,.3); box-shadow:0 25px 60px -15px rgba(0,0,0,.7),0 0 20px rgba(168,85,247,.08); }
                .mf-card.selected { border-color:#10b981 !important; border-width:2px; box-shadow:0 0 40px rgba(16,185,129,.15); transform:translateY(-10px) scale(1.03); }
                
                /* Role Accents */
                .mf-card.badge-cdm-wrap { border-left: 4px solid #7c3aed !important; }
                .mf-card.badge-cm-wrap { border-left: 4px solid #a855f7 !important; }
                .mf-card.badge-cam-wrap { border-left: 4px solid #d8b4fe !important; }
                
                .mf-card.dimmed { opacity:.25; filter:grayscale(.6); pointer-events:none; }
                .mf-card.legend-card { border-color:rgba(245,158,11,.25); background:linear-gradient(165deg,rgba(30,25,10,.9),rgba(10,10,15,.85)); }
                .mf-card.legend-card:hover { border-color:rgba(245,158,11,.5); }

                /* Role Badge */
                .mf-role-badge {
                    position: absolute; top: 1rem; left: 1rem; z-index: 20;
                    display: flex; align-items: center; gap: 0.3rem;
                    background: rgba(0,0,0,0.7); backdrop-filter: blur(8px);
                    padding: 0.3rem 0.6rem; border-radius: 8px;
                    font-size: 0.5rem; font-weight: 950; letter-spacing: 0.1em;
                    border: 1px solid rgba(255,255,255,0.1);
                }
                .badge-cdm { color: #7c3aed; border-color: rgba(124, 58, 237, 0.3); }
                .badge-cm { color: #a855f7; border-color: rgba(168, 85, 247, 0.3); }
                .badge-cam { color: #d8b4fe; border-color: rgba(216, 180, 254, 0.3); }

                .mf-skill-badges { position: absolute; top: 3.2rem; left: 1rem; z-index: 10; display: flex; flex-direction: column; gap: 0.3rem; }
                .mf-skill-badge { display: flex; align-items: center; gap: 0.3rem; background: rgba(0,0,0,0.4); backdrop-filter: blur(5px); border: 1px solid rgba(255,255,255,0.08); padding: 0.2rem 0.5rem; border-radius: 4px; color: rgba(255,255,255,0.8); font-size: 0.45rem; font-weight: 900; letter-spacing: 0.05em; animation: mfSkillSlide .4s ease-out; }
                @keyframes mfSkillSlide { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
                
                /* Icon colors inside skill badges */
                .badge-cdm-wrap .mf-skill-badge :global(svg) { color: #7c3aed; }
                .badge-cm-wrap .mf-skill-badge :global(svg) { color: #a855f7; }
                .badge-cam-wrap .mf-skill-badge :global(svg) { color: #d8b4fe; }

                .mf-legend-badge { position:absolute; top:.8rem; right:4.5rem; z-index:15; display:flex; align-items:center; gap:.3rem; background:linear-gradient(135deg,rgba(245,158,11,.2),rgba(245,158,11,.08)); border:1px solid rgba(245,158,11,.35); padding:.2rem .5rem; border-radius:8px; color:#f59e0b; font-size:.45rem; font-weight:900; letter-spacing:.15em; backdrop-filter:blur(10px); }
                .mf-selected-badge { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); z-index:30; width:50px; height:50px; border-radius:50%; background:linear-gradient(135deg,#10b981,#34d399); color:black; display:flex; align-items:center; justify-content:center; box-shadow:0 0 40px rgba(16,185,129,.5); animation:badgePop .4s cubic-bezier(.175,.885,.32,1.275); }
                @keyframes badgePop { from{transform:translate(-50%,-50%) scale(0)} to{transform:translate(-50%,-50%) scale(1)} }

                .mf-card-rating { position:absolute; bottom:8rem; right:1rem; z-index:10; background:rgba(0,0,0,0.85); backdrop-filter:blur(10px); padding:.5rem .8rem; border-radius:12px; border:1px solid rgba(255,255,255,.08); text-align:center; }
                .mf-ovr-label { display:block; font-size:.4rem; font-weight:900; color:rgba(255,255,255,.3); letter-spacing:.1em; }
                .mf-ovr-value { font-size:1.3rem; font-weight:900; color:white; line-height:1; }

                .mf-photo-frame { position:relative; height:300px; overflow:hidden; background:#080810; }
                .mf-photo { width:100%; height:100%; object-fit:cover; object-position:center top; transition:.6s; filter:saturate(1.15) contrast(1.1); }
                .mf-card:hover .mf-photo { transform:scale(1.1); filter:saturate(1.3) contrast(1.15); }
                .mf-photo-vignette { position:absolute; bottom:0; left:0; right:0; height:8rem; background:linear-gradient(to top,rgba(10,10,15,1),transparent); }

                .mf-card-info { padding:1.5rem 1.5rem 1.75rem; margin-top:-3rem; position:relative; z-index:5; }
                .mf-card-club { font-size:.55rem; font-weight:900; color:#a855f7; letter-spacing:.25em; opacity:.7; display:block; margin-bottom:.4rem; }
                .legend-card .mf-card-club { color:#f59e0b; }
                .mf-card-name { font-size:1.35rem; font-weight:900; color:white; line-height:1.1; text-transform:uppercase; font-style:italic; margin-bottom:.6rem; }
                .mf-card-meta { display:flex; align-items:center; gap:.4rem; font-size:.7rem; color:rgba(255,255,255,0.3); font-weight:700; }
                .mf-meta-dot { opacity:.3; }
                .mf-card-pos { background:rgba(168,85,247,.1); color:#a855f7; padding:.15rem 0.5rem; border-radius:4px; font-size:.6rem; font-weight:900; letter-spacing:.1em; }
                .legend-card .mf-card-pos { background:rgba(245,158,11,.1); color:#f59e0b; }

                .mf-confirm-bar { position:fixed; bottom:2rem; left:50%; transform:translateX(-50%) translateY(150%); width:calc(100% - 4rem); max-width:950px; padding:1.4rem 2.5rem; border-radius:24px; border:1px solid rgba(168,85,247,.3); border-top: 1px solid rgba(168,85,247,.6); z-index:3000; box-shadow:0 30px 70px -15px rgba(0,0,0,.9), 0 0 30px rgba(168,85,247,.1); transition:all .6s cubic-bezier(.16,1,.3,1); background:rgba(10,10,18,.85); backdrop-filter:blur(40px); }
                .mf-confirm-bar.visible { transform:translateX(-50%) translateY(0); }
                .mf-bar-content { display:flex; justify-content:space-between; align-items:center; gap: 2rem; }
                .mf-bar-info { display:flex; flex-direction:column; gap:.2rem; flex: 1; }
                .mf-bar-tag { font-size:.6rem; font-weight:950; color:#a855f7; letter-spacing:.2em; text-transform: uppercase; }
                .mf-bar-status { font-size: 1.25rem; font-weight: 950; color: white; letter-spacing: -0.01em; margin: 0.1rem 0; }
                
                .mf-bar-list { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.3rem; }
                .mf-bar-player-name { font-size: 0.85rem; color: rgba(255,255,255,0.7); font-weight: 500; }
                
                .mf-proceed-btn { display: flex; align-items: center; gap: 0.8rem; background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.3); padding: 1.1rem 2.8rem; border-radius: 18px; font-weight: 950; font-size: 1.1rem; border: 1px solid rgba(255,255,255,0.1); cursor: not-allowed; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); white-space:nowrap; overflow: hidden; }
                .mf-proceed-btn.active { background: linear-gradient(135deg, #a855f7, #7c3aed); color: white; cursor: pointer; border: none; box-shadow: 0 15px 35px rgba(124, 58, 237, 0.3); }
                .mf-proceed-btn:not(:disabled) { animation: mfBtnPulse 2s infinite; }
                @keyframes mfBtnPulse { 0% { box-shadow: 0 0 0 0 rgba(168, 85, 247, 0.6); } 70% { box-shadow: 0 0 0 15px rgba(168, 85, 247, 0); } 100% { box-shadow: 0 0 0 0 rgba(168, 85, 247, 0); } }
                
                .mf-proceed-btn:hover { transform:scale(1.04) translateY(-3px); box-shadow:0 15px 40px rgba(168, 85, 247, 0.4); }
                .mf-btn-icon { transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                .mf-proceed-btn:hover .mf-btn-icon { transform: rotate(15deg) scale(1.2); }
                .mf-proceed-btn:disabled { opacity:.4; cursor:not-allowed; transform:none; filter: grayscale(1); }

                .mf-progress-footer { position:fixed; bottom:0; left:0; right:0; display:flex; justify-content:center; padding:1rem 2rem; background:linear-gradient(to top,rgba(2,4,10,.95),transparent); pointer-events:none; z-index:50; }
                .mf-progress-steps { display:flex; align-items:center; }
                .mf-step { display:flex; flex-direction:column; align-items:center; gap:.25rem; font-size:.5rem; font-weight:900; color:rgba(255,255,255,.2); letter-spacing:.1em; }
                .mf-step.active { color:#a855f7; }
                .mf-step-circle { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:.7rem; font-weight:900; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); color:rgba(255,255,255,.25); }
                .mf-step-circle.active { background:rgba(168,85,247,.15); border-color:#a855f7; color:#a855f7; box-shadow:0 0 15px rgba(168,85,247,.3); }
                .mf-step-circle.done { background:#10b981; border-color:#10b981; color:black; }
                .mf-step-line { width:30px; height:1px; background:rgba(255,255,255,.06); margin-bottom:1rem; }

                .mf-stadium-bg { filter: brightness(0.25) saturate(1.1) contrast(1.1); }
                @media(max-width:1200px) {
                    .mf-grid { grid-template-columns:repeat(3, 1fr); }
                }
                @media(max-width:768px) {
                    .mf-ctx-bar { flex-wrap:wrap; gap:.75rem; padding:.75rem 1rem; }
                    .mf-ctx-center { gap:.75rem; order: 1; }
                    .mf-ctx-left { order: 2; width: auto; }
                    .mf-ctx-right { display: none; }
                    .mf-mega-title { font-size:2.2rem; }
                    .mf-grid { grid-template-columns:1fr 1fr; gap:.75rem; }
                    .mf-photo-frame { height:160px; }
                    .mf-card-name { font-size:1rem; }
                    .mf-card-rating { top: 0.5rem; right: 0.5rem; padding: 0.25rem 0.5rem; }
                    .mf-ovr-value { font-size: 1rem; }
                    .mf-filter-section { gap:1rem; }
                    .mf-search-wrapper { max-width:100%; }
                    .mf-confirm-bar { width:95%; padding:1rem; }
                    .mf-bar-content { flex-wrap:wrap; gap:.75rem; justify-content:center; }
                    .mf-bar-names { display:none; }
                    .mf-proceed-btn { width:100%; justify-content:center; padding:.85rem; font-size:.8rem; }
                }
                @media(max-width:480px) {
                    .mf-grid { grid-template-columns:1fr 1fr; gap:0.5rem; }
                    .mf-photo-frame { height: 180px; }
                    .mf-card-info { padding: 1rem 0.75rem; margin-top: -2.3rem; }
                    .mf-card-name { font-size: 0.8rem; }
                    .mf-card-club { font-size: 0.45rem; }
                    .mf-card-meta { font-size: 0.55rem; }
                    .mf-role-badge { top: 0.4rem; left: 0.4rem; padding: 0.15rem 0.35rem; font-size: 0.4rem; }
                    .mf-skill-badges { top: 0.4rem; left: 0.4rem; gap: 0.15rem; }
                    .mf-skill-badge { padding: 0.12rem 0.3rem; font-size: 0.35rem; gap: 0.15rem; }
                    .mf-skill-badge :global(svg) { width: 6px; height: 6px; }
                }
            `}</style>
        </div>
    );
}

export default function MidfielderSelectPage() {
    return (
        <Suspense fallback={<div style={{ minHeight: '100vh', background: '#02040a' }} />}>
            <MidfielderSelectPageInner />
        </Suspense>
    );
}
