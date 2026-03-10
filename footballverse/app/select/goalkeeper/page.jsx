'use client';

import { useState, useEffect, useMemo, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, Search, ChevronLeft, Check, Crosshair, ShieldCheck, Zap, X } from 'lucide-react';
import '../../entry.css';

import { GOALKEEPERS } from './data';
import PlayerStatsModal from '@/components/modals/PlayerStatsModal';
import { Info } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';



const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const highlightName = (name, query) => {
    const normalizedQuery = query.trim();
    if (!normalizedQuery) return name;
    const safe = escapeRegExp(normalizedQuery);
    if (!safe) return name;

    const regex = new RegExp(`(${safe})`, 'ig');
    return name.split(regex).map((part, idx) => (
        idx % 2 === 1 ? <span key={`${name}-${idx}`} className="gk-highlight">{part}</span> : part
    ));
};

function GoalkeeperSelectPageInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isEditMode = searchParams.get('edit') === 'true';

    const [selectedGK, setSelectedGK] = useState(null);
    const [formation, setFormation] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [search, setSearch] = useState('');
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [isExiting, setIsExiting] = useState(false);
    const [brokenIds, setBrokenIds] = useState(new Set());
    const [viewingStats, setViewingStats] = useState(null);

    // Always-fresh ref so handleConfirm never reads a stale closure
    const selectedGKRef = useRef(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        const storedFormation = localStorage.getItem('formation');
        if (storedFormation) {
            setFormation(JSON.parse(storedFormation));
        } else if (!isEditMode) {
            router.push('/formation-select');
            return;
        }

        const storedTeam = localStorage.getItem('selectedTeam');
        if (storedTeam) setSelectedTeam(JSON.parse(storedTeam));

        const storedGK = localStorage.getItem('goalkeeper');
        if (storedGK) {
            const parsed = JSON.parse(storedGK);
            setSelectedGK(parsed);
            selectedGKRef.current = parsed;
        }
    }, [router, isEditMode]);

    const sortedGKs = useMemo(() => {
        return [...GOALKEEPERS]
            .filter(gk => !brokenIds.has(gk.id))
            .sort((a, b) => b.rating - a.rating);
    }, [brokenIds]);

    const filtered = useMemo(() => {
        const list = GOALKEEPERS.filter(gk => !brokenIds.has(gk.id));
        if (!search) return list;
        return list.filter(gk =>
            gk.name.toLowerCase().includes(search.toLowerCase()) ||
            gk.club.toLowerCase().includes(search.toLowerCase()) ||
            gk.country?.toLowerCase().includes(search.toLowerCase())
        );
    }, [search, brokenIds]);

    const handleImageError = (gk) => {
        setBrokenIds(prev => {
            const next = new Set(prev);
            next.add(gk.id);
            return next;
        });
        if (selectedGK?.id === gk.id) {
            setSelectedGK(null);
            localStorage.removeItem('goalkeeper');
        }
    };

    const { saveSquad } = useAuth();

    const handleSelect = useCallback((gk) => {
        setSelectedGK(prev => {
            if (prev?.id === gk.id) {
                localStorage.removeItem('goalkeeper');
                saveSquad({ goalkeeper: null });
                selectedGKRef.current = null;
                return null;
            } else {
                localStorage.setItem('goalkeeper', JSON.stringify(gk));
                saveSquad({ goalkeeper: gk });
                selectedGKRef.current = gk;
                return gk;
            }
        });
    }, [saveSquad]);


    const handleConfirm = useCallback(() => {
        // Use the ref so we always have the latest value, not a stale closure
        const current = selectedGKRef.current;
        if (!current) return;
        setIsExiting(true);
        setTimeout(() => {
            if (isEditMode) {
                router.push('/squad/review');
            } else {
                router.push('/select/defenders');
            }
        }, 600);
    }, [isEditMode, router]);

    return (
        <div className={`entry-page no-snap ${isExiting ? 'page-exit' : ''}`}>
            <div className="stadium-bg gk-stadium-bg"></div>
            <div className="overlay-gradient"></div>

            <section className="gk-page">
                <main className="gk-main">

                    {/* Context Bar */}
                    <div className="gk-ctx-bar glass">
                        <div className="gk-ctx-left">
                            <button onClick={() => isEditMode ? router.push('/squad/review') : router.push('/formation-select')} className="gk-back-btn">
                                <ChevronLeft size={18} /><span>{isEditMode ? 'BACK TO REVIEW' : 'FORMATION'}</span>
                            </button>
                        </div>
                        <div className="gk-ctx-center">
                            <div className="gk-ctx-item">
                                <span className="gk-ctx-label">FORMATION</span>
                                <span className="gk-ctx-value">{formation?.name || '---'}</span>
                            </div>
                            <div className="gk-ctx-divider"></div>
                            <div className="gk-ctx-item">
                                <span className="gk-ctx-label">GOALKEEPER</span>
                                <span className="gk-ctx-value" style={{ color: selectedGK ? '#10b981' : '#f59e0b' }}>
                                    {selectedGK ? '1' : '0'} / 1
                                </span>
                            </div>
                            <div className="gk-ctx-divider"></div>
                            <div className="gk-ctx-item">
                                <span className="gk-ctx-label">STEP</span>
                                <span className="gk-ctx-value" style={{ color: '#f59e0b' }}>1 / 5</span>
                            </div>
                        </div>
                        <div className="gk-ctx-right">
                            <div className="gk-step-badge">
                                <Shield size={16} />
                                <span>KEEPER</span>
                            </div>
                        </div>
                    </div>

                    {/* Title Section */}
                    <div className="gk-title-section">
                        <div className="gk-ornament">
                            <div className="gk-orn-line"></div>
                            <Crosshair className="gk-orn-icon" size={28} />
                            <div className="gk-orn-line"></div>
                        </div>
                        <h1 className="gk-mega-title">
                            SELECT YOUR <span className="text-gradient-gold">GOALKEEPER</span>
                        </h1>
                        <p className="gk-subtitle">
                            Your goalkeeper is the last line of defense. Choose wisely — only one can guard your net.
                        </p>
                    </div>

                    {/* Search Section */}
                    <div className="gk-filter-section">
                        <div className="gk-search-row">
                            <div className="gk-search-wrapper">
                                <input type="text" placeholder="Search by name, club or country..."
                                    value={search} onChange={e => setSearch(e.target.value)}
                                    className="gk-search" />
                                {search && (
                                    <button className="gk-search-clear" onClick={() => setSearch('')}>
                                        <X size={16} />
                                    </button>
                                )}
                                <div className="gk-search-icon-wrapper">
                                    <Search className="gk-search-icon" size={22} />
                                </div>
                            </div>
                        </div>
                        {search && (
                            <div className="gk-result-count">
                                <span className="gk-result-num">{filtered.length}</span>
                                <span className="gk-result-label">goalkeeper{filtered.length !== 1 ? 's' : ''} found</span>
                                {filtered.length === 0 && <span className="gk-no-results">— Try a different search</span>}
                            </div>
                        )}
                    </div>

                    {/* Selected Summary */}
                    {selectedGK && (
                        <div className="gk-selection-summary glass">
                            <span className="gk-sum-label">SELECTED (1/1)</span>
                            <div className="gk-sum-chips">
                                <button className="gk-chip" onClick={() => handleSelect(selectedGK)}>
                                    <span className="gk-chip-pos">GK</span>
                                    <span className="gk-chip-name">{selectedGK.name}</span>
                                    <div className="gk-chip-remove"><X size={12} /></div>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Goalkeeper Grid */}
                    <div className="gk-grid">
                        {filtered.map((gk, index) => {
                            const isSelected = selectedGK?.id === gk.id;
                            const isFull = selectedGK && !isSelected;
                            const rank = sortedGKs.findIndex(p => p.id === gk.id) + 1;

                            return (
                                <div
                                    key={gk.id}
                                    onMouseEnter={() => setFocusedIndex(index)}
                                    className={`gk-card glass ${isSelected ? 'selected' : ''} ${isFull ? 'dimmed' : ''} ${gk.tier === 'legend' ? 'legend-card' : ''} ${focusedIndex === index ? 'kb-focus' : ''}`}
                                >
                                    <div className="gk-card-click-area" onClick={() => handleSelect(gk)}></div>

                                    {/* Stats Trigger */}
                                    <div className="gk-stats-trigger" onClick={(e) => { e.stopPropagation(); setViewingStats(gk); }}>
                                        <Info size={14} />
                                    </div>

                                    <div className="gk-rank-badge">RANK #{rank}</div>
                                    <div className="gk-skill-badges">
                                        {gk.tags?.slice(0, 2).map(skill => (
                                            <div key={skill} className="gk-skill-badge">
                                                <Zap size={8} />
                                                <span>{skill.toUpperCase()}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {isSelected && (
                                        <div className="gk-selected-badge"><Check size={20} /></div>
                                    )}
                                    <div className="gk-card-rating">
                                        <span className="gk-ovr-label">OVR</span>
                                        <span className="gk-ovr-value">{gk.rating}</span>
                                    </div>
                                    <div className="gk-photo-frame">
                                        {gk.image ? (
                                            <img
                                                src={gk.image || null}
                                                alt={gk.name}
                                                className="gk-photo"
                                                loading="lazy"
                                                onError={() => handleImageError(gk)}
                                            />
                                        ) : (
                                            <div className="gk-photo-fallback">
                                                <span className="gk-fallback-initials">
                                                    {gk.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                </span>
                                            </div>
                                        )}
                                        <div className="gk-photo-vignette"></div>
                                        <div className="gk-card-glow"></div>
                                    </div>
                                    <div className="gk-card-info">
                                        <span className="gk-card-club">{gk.club.toUpperCase()}</span>
                                        <h3 className="gk-card-name">{highlightName(gk.name, search)}</h3>
                                        <div className="gk-card-meta">
                                            <span>{gk.country}</span>
                                            <span className="gk-meta-dot">•</span>
                                            <span className="gk-card-pos">GK</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {viewingStats && (
                        <PlayerStatsModal player={viewingStats} onClose={() => setViewingStats(null)} />
                    )}


                    {/* Bottom CTA */}
                    <div className={`gk-confirm-bar glass ${selectedGK ? 'visible' : ''}`}>
                        <div className="gk-bar-content">
                            <div className="gk-bar-info">
                                <span className="gk-bar-tag">{isEditMode ? 'CHANGES PENDING' : 'GOALKEEPER LOCKED'}</span>
                                <h3 className="gk-bar-name">{selectedGK?.name}</h3>
                                <div className="gk-bar-meta-row">
                                    <span>{selectedGK?.club}</span>
                                    <span className="gk-bar-sep">•</span>
                                    <span>{selectedGK?.country}</span>
                                    <span className="gk-bar-sep">•</span>
                                    <span className="gk-bar-ovr-lock">OVR {selectedGK?.rating}</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button onClick={handleConfirm} className="gk-proceed-btn">
                                    <span>{isEditMode ? 'CONFIRM CHANGES' : 'LOCK IN GOALKEEPER'}</span>
                                    <ShieldCheck size={22} className="gk-btn-icon" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {!isEditMode && (
                        <div className="gk-progress-footer">
                            <div className="gk-progress-steps">
                                {['GK', 'DEF', 'MID', 'FWD', 'DONE'].map((s, i) => (
                                    <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
                                        <div className={`gk-step ${i === 0 ? 'active' : ''}`}>
                                            <div className={`gk-step-circle ${i === 0 ? 'active' : ''}`}>{i + 1}</div>
                                            <span>{s}</span>
                                        </div>
                                        {i < 4 && <div className="gk-step-line"></div>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </section>

            <style jsx>{`
                .gk-page { min-height:100vh; display:flex; justify-content:center; padding:3rem 1rem; animation:gkFadeIn .6s ease-out; }
                @keyframes gkFadeIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
                .page-exit { animation: gkPageExit 0.6s forwards ease-in; pointer-events: none; }
                @keyframes gkPageExit { from{opacity:1;transform:translateY(0)} to{opacity:0;transform:translateY(-20px)} }
                .gk-main { max-width:1400px; width:96%; }

                /* Context Bar */
                .gk-ctx-bar { display:flex; justify-content:space-between; align-items:center; padding:1rem 2rem; background:rgba(10,10,15,.6); backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,.08); border-radius:20px; margin-bottom:2.5rem; position:sticky; top:0; z-index:100; }
                .gk-back-btn { display:flex; align-items:center; gap:.5rem; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1); padding:.6rem 1.2rem; border-radius:12px; color:rgba(255,255,255,.6); font-weight:900; font-size:.6rem; letter-spacing:.12em; cursor:pointer; transition:.3s; }
                .gk-back-btn:hover { background:#f59e0b; color:black; border-color:#f59e0b; }
                .gk-ctx-center { display:flex; align-items:center; gap:1.5rem; }
                .gk-ctx-item { text-align:center; }
                .gk-ctx-label { display:block; font-size:.45rem; font-weight:900; color:rgba(255,255,255,.25); letter-spacing:.2em; margin-bottom:.15rem; }
                .gk-ctx-value { font-size:.85rem; font-weight:900; color:#f59e0b; letter-spacing:.05em; }
                .gk-ctx-divider { width:1px; height:30px; background:rgba(255,255,255,.08); }
                .gk-step-badge { display:flex; align-items:center; gap:.4rem; background:rgba(245,158,11,.08); border:1px solid rgba(245,158,11,.2); padding:.5rem 1rem; border-radius:12px; color:#f59e0b; font-size:.6rem; font-weight:900; letter-spacing:.12em; }

                /* Title */
                .gk-title-section { text-align:center; margin-bottom:2rem; }
                .gk-ornament { display:flex; align-items:center; justify-content:center; gap:1rem; margin-bottom:1.25rem; }
                .gk-orn-line { width:50px; height:1px; background:rgba(245,158,11,.3); }
                .gk-orn-icon { color:#f59e0b; filter:drop-shadow(0 0 10px rgba(245,158,11,.5)); }
                .gk-mega-title { font-size:clamp(2.5rem,7vw,4.5rem); font-weight:900; color:white; letter-spacing:-.03em; margin-bottom:1rem; }
                .text-gradient-gold { background:linear-gradient(135deg,#f59e0b,#fbbf24,#f59e0b); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
                .gk-subtitle { font-size:1.1rem; color:rgba(255,255,255,.35); line-height:1.7; max-width:520px; margin:0 auto; }

                /* Filter / Search */
                .gk-filter-section { display:flex; flex-direction:column; gap:1rem; margin-bottom:1.5rem; }
                .gk-search-row { display:flex; justify-content:center; width: 100%; }
                .gk-search-wrapper { position:relative; width:100%; max-width:750px; display: flex; align-items: center; }
                .gk-search { 
                    width:100%; padding:1.4rem 5rem 1.4rem 2.5rem; border-radius:100px; 
                    border:1px solid rgba(245,158,11,0.3); background:rgba(15,10,5,0.7); 
                    color:white; font-size:1.2rem; font-weight:500; 
                    outline:none; transition:all .4s cubic-bezier(0.23, 1, 0.32, 1); 
                    box-shadow:0 10px 40px rgba(0,0,0,0.4), inset 0 0 20px rgba(245,158,11,0.05);
                    backdrop-filter: blur(20px);
                }
                .gk-search:focus { 
                    background: rgba(25,15,5,0.9); border-color: #f59e0b;
                    box-shadow:0 20px 50px rgba(245,158,11,0.2), inset 0 0 15px rgba(245,158,11,0.08);
                    transform: translateY(-3px) scale(1.01);
                }
                .gk-search::placeholder { color:rgba(255,255,255,0.25); }
                .gk-search-icon-wrapper { position: absolute; right: 1.5rem; top: 50%; transform: translateY(-50%); width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; pointer-events: none; }
                .gk-search-icon { color: #f59e0b; filter: drop-shadow(0 0 10px rgba(245,158,11,0.5)); }
                .gk-search-wrapper:focus-within .gk-search-icon { color: #fbbf24; transform: scale(1.2) rotate(-5deg); transition: .4s; }
                .gk-search-clear { position: absolute; right: 4.5rem; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.1); border: none; color: rgba(255,255,255,0.5); cursor: pointer; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: .2s; }
                .gk-search-clear:hover { background: rgba(245,158,11,0.2); color: #f59e0b; }

                /* Result count */
                .gk-result-count { display:flex; align-items:center; justify-content:center; gap:.5rem; animation: gkCountIn .3s ease-out; }
                @keyframes gkCountIn { from{opacity:0;transform:translateY(-5px)} to{opacity:1;transform:translateY(0)} }
                .gk-result-num { font-size:1.1rem; font-weight:950; color:#f59e0b; }
                .gk-result-label { font-size:.75rem; font-weight:700; color:rgba(255,255,255,.4); }
                .gk-no-results { font-size:.7rem; color:rgba(255,255,255,.25); font-style:italic; }

                /* Selection Summary */
                .gk-selection-summary { padding:.75rem 1.5rem; border-radius:16px; margin-bottom:1.5rem; display:flex; align-items:center; gap:1rem; flex-wrap:wrap; background:rgba(10,10,15,.6); border:1px solid rgba(245,158,11,.15); }
                .gk-sum-label { font-size:.55rem; font-weight:900; color:#f59e0b; letter-spacing:.15em; white-space:nowrap; }
                .gk-sum-chips { display:flex; gap:.4rem; flex-wrap:wrap; }
                .gk-chip { position: relative; display:flex; align-items:center; gap:.5rem; padding:.35rem .8rem; border-radius:8px; background:rgba(245,158,11,.1); border:1px solid rgba(245,158,11,.25); color:white; font-size:.65rem; font-weight:800; cursor:pointer; transition:.3s; }
                .gk-chip:hover { background:rgba(239,68,68,.1); border-color:rgba(239,68,68,.3); transform: translateY(-2px); }
                .gk-chip-pos { color:#f59e0b; font-weight:900; font-size:.6rem; }
                .gk-chip-remove { display:flex; align-items:center; color:rgba(255,255,255,.4); }

                /* Grid */
                .gk-grid { display:grid; grid-template-columns:repeat(4, 1fr); gap:1.5rem; margin-bottom:12rem; }

                /* Card */
                .gk-card { position:relative; text-align:left; border-radius:24px; overflow:hidden; border:1px solid rgba(255,255,255,.06); background:rgba(10,10,15,.7); cursor:pointer; transition:all .45s cubic-bezier(0.23, 1, 0.32, 1); }
                .gk-card:hover, .gk-card.kb-focus { transform:translateY(-10px); border-color:rgba(245,158,11,.3); box-shadow:0 25px 60px -15px rgba(0,0,0,.7), 0 0 25px rgba(245,158,11,.1); }
                .gk-card.selected { border-color:#10b981 !important; border-width:2px; box-shadow:0 0 40px rgba(16,185,129,.15); transform:translateY(-10px) scale(1.03); }
                .gk-card.dimmed { opacity:.25; filter:grayscale(.6); pointer-events:none; }
                .gk-card.legend-card { border-color:rgba(245,158,11,.25); background:linear-gradient(165deg,rgba(30,25,10,.9),rgba(10,10,15,.85)); }
                .gk-card.legend-card:hover { border-color:rgba(245,158,11,.5); }

                .gk-rank-badge { position:absolute; top:1rem; right:1rem; z-index:20; background:rgba(0,0,0,0.6); padding:0.25rem 0.6rem; border-radius:6px; font-size:0.55rem; font-weight:900; color:rgba(255,255,255,0.5); border:1px solid rgba(255,255,255,0.1); }
                .gk-skill-badges { position:absolute; top:1rem; left:1rem; z-index:20; display:flex; flex-direction:column; gap:0.4rem; }
                .gk-skill-badge { display:flex; align-items:center; gap:0.3rem; background:rgba(0,0,0,0.65); padding:0.25rem 0.6rem; border-radius:6px; font-size:0.5rem; font-weight:900; color:#f59e0b; border:1px solid rgba(245,158,11,0.25); }
                .legend-card .gk-skill-badge { background: rgba(245,158,11,0.1); }

                .gk-selected-badge { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); z-index:30; width:50px; height:50px; border-radius:50%; background:linear-gradient(135deg,#10b981,#34d399); color:black; display:flex; align-items:center; justify-content:center; box-shadow:0 0 40px rgba(16,185,129,.5); animation:badgePop .4s cubic-bezier(.175,.885,.32,1.275); }
                @keyframes badgePop { from{transform:translate(-50%,-50%) scale(0)} to{transform:translate(-50%,-50%) scale(1)} }

                .gk-card-rating { position:absolute; bottom:8rem; right:1rem; z-index:20; background:rgba(0,0,0,0.8); backdrop-filter:blur(10px); padding:0.5rem 0.8rem; border-radius:12px; border:1px solid rgba(255,255,255,0.1); text-align:center; }
                .gk-ovr-label { display:block; font-size:0.4rem; font-weight:900; color:rgba(255,255,255,0.4); }
                .gk-ovr-value { font-size:1.3rem; font-weight:900; color:white; }

                .gk-photo-frame { height:300px; overflow:hidden; background:#080810; position:relative; }
                .gk-photo { width:100%; height:100%; object-fit:cover; object-position:center top; transition:0.6s; filter:saturate(1.15) contrast(1.1); }
                .gk-card:hover .gk-photo, .gk-card.kb-focus .gk-photo { transform:scale(1.1); filter:saturate(1.3) contrast(1.15); }
                /* Fallback avatar for goalkeepers with no image */
                .gk-photo-fallback { width:100%; height:100%; background:linear-gradient(160deg,rgba(30,22,5,1),rgba(10,8,2,1)); display:flex; align-items:center; justify-content:center; }
                .gk-fallback-initials { font-size:5rem; font-weight:900; font-style:italic; letter-spacing:-0.05em; color:rgba(245,158,11,0.18); user-select:none; text-transform:uppercase; }
                .gk-photo-vignette { position:absolute; bottom:0; left:0; right:0; height:8rem; background:linear-gradient(to top, rgba(10,10,15,1), transparent); }
                .gk-card-glow { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: transparent; transition: 0.4s; }
                .gk-card:hover .gk-card-glow, .gk-card.kb-focus .gk-card-glow { background: linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.4), transparent); box-shadow: 0 0 20px rgba(245, 158, 11, 0.2); }

                .gk-card-info { padding:1.5rem 1.5rem 1.75rem; margin-top:-3rem; position:relative; z-index:5; }
                .gk-card-club { font-size:.55rem; font-weight:900; color:#f59e0b; letter-spacing:.25em; opacity:.7; display:block; margin-bottom:.4rem; }
                .legend-card .gk-card-club { opacity: 1; }
                .gk-card-name { font-size:1.35rem; font-weight:900; color:white; line-height:1.1; text-transform:uppercase; font-style:italic; margin-bottom:.6rem; }
                .gk-card-meta { display:flex; align-items:center; gap:.5rem; font-size:.7rem; color:rgba(255,255,255,0.4); font-weight:700; margin-top:0.4rem; }
                .gk-meta-dot { opacity:.3; }
                .gk-card-pos { background:rgba(245,158,11,.1); color:#f59e0b; padding:.15rem 0.5rem; border-radius:4px; font-size:.6rem; font-weight:900; letter-spacing:.1em; }

                .gk-highlight { color:#f59e0b; background:rgba(245,158,11,0.1); border-radius:2px; }

                /* Confirm Bar */
                .gk-confirm-bar { position:fixed; bottom:2rem; left:50%; transform:translateX(-50%) translateY(150%); width:calc(100% - 4rem); max-width:950px; padding:1.4rem 2.5rem; border-radius:24px; border:1px solid rgba(245,158,11,.3); border-top: 1px solid rgba(245,158,11,.6); z-index:3000; box-shadow:0 30px 70px -15px rgba(0,0,0,.9), 0 0 30px rgba(245,158,11,.1); transition:all .6s cubic-bezier(.16,1,.3,1); background:rgba(18, 12, 3, 0.9); backdrop-filter:blur(40px); }
                .gk-confirm-bar.visible { transform:translateX(-50%) translateY(0); }
                .gk-bar-content { display:flex; justify-content:space-between; align-items:center; gap: 2rem; }
                .gk-bar-info { display:flex; flex-direction:column; gap:.2rem; flex: 1; }
                .gk-bar-tag { font-size:.6rem; font-weight:950; color:#f59e0b; letter-spacing:.2em; text-transform:uppercase; }
                .gk-bar-name { font-size:1.8rem; font-weight:950; color:white; margin:0.2rem 0; }
                .gk-bar-meta-row { display:flex; align-items:center; gap:0.6rem; font-size:0.8rem; color:rgba(255,255,255,0.4); font-weight:700; }
                .gk-bar-sep { opacity:0.3; }
                .gk-bar-ovr-lock { color:#f59e0b; }

                .gk-proceed-btn { display:flex; align-items:center; gap:0.8rem; background:linear-gradient(135deg, #f59e0b, #fbbf24); color:black; padding:1.2rem 2.5rem; border-radius:18px; font-weight:950; font-size:1rem; border:none; cursor:pointer; transition:.3s; }
                .gk-proceed-btn:hover { transform:scale(1.04) translateY(-3px); box-shadow:0 15px 40px rgba(245,158,11,0.4); }
                .gk-btn-icon { transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                .gk-proceed-btn:hover .gk-btn-icon { transform: rotate(15deg) scale(1.2); }

                /* Progress Footer */
                .gk-progress-footer { position:fixed; bottom:0; left:0; right:0; display:flex; justify-content:center; padding:1rem 2rem; background:linear-gradient(to top,rgba(2,4,10,.95),transparent); pointer-events:none; z-index:50; }
                .gk-progress-steps { display:flex; align-items:center; }
                .gk-step { display:flex; flex-direction:column; align-items:center; gap:.25rem; font-size:.5rem; font-weight:900; color:rgba(255,255,255,.2); letter-spacing:.1em; }
                .gk-step.active { color:#f59e0b; }
                .gk-step-circle { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:.7rem; font-weight:900; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); color:rgba(255,255,255,.25); }
                .gk-step-circle.active { background:rgba(245,158,11,.15); border-color:#f59e0b; color:#f59e0b; box-shadow:0 0 15px rgba(245,158,11,.3); }
                .gk-step-line { width:30px; height:1px; background:rgba(255,255,255,.06); margin-bottom:1rem; }

                /* Responsive */
                @media(max-width:1200px) {
                    .gk-grid { grid-template-columns:repeat(3, 1fr); }
                }
                @media(max-width:768px) {
                    .gk-ctx-bar { flex-wrap:wrap; gap:.75rem; padding:.75rem 1rem; }
                    .gk-ctx-center { gap:.75rem; order: 1; }
                    .gk-ctx-left { order: 2; width: auto; }
                    .gk-ctx-right { display: none; }
                    .gk-mega-title { font-size:2.2rem; }
                    .gk-grid { grid-template-columns:1fr 1fr; gap:.75rem; }
                    .gk-photo-frame { height:160px; }
                    .gk-card-name { font-size:.95rem; }
                    .gk-card-rating { bottom: auto; top: 0.5rem; right: 0.5rem; padding: 0.25rem 0.5rem; }
                    .gk-ovr-value { font-size: 1rem; }
                    .gk-search-wrapper { max-width:100%; }
                    .gk-confirm-bar { width:95%; padding:1rem; }
                    .gk-bar-content { flex-wrap:wrap; gap:.75rem; justify-content:center; }
                    .gk-proceed-btn { width:100%; justify-content:center; padding:.85rem; font-size:.8rem; }
                }
                @media(max-width:480px) {
                    .gk-grid { grid-template-columns:1fr 1fr; gap:0.5rem; }
                    .gk-photo-frame { height: 180px; }
                    .gk-card-info { padding: 1rem 0.75rem; margin-top: -2.3rem; }
                    .gk-card-name { font-size: 0.8rem; }
                    .gk-card-club { font-size: 0.4rem; }
                    .gk-card-meta { font-size: 0.55rem; }
                    .gk-rank-badge { top: 0.4rem; right: 0.4rem; padding: 0.15rem 0.35rem; font-size: 0.4rem; }
                    .gk-skill-badges { top: 0.4rem; left: 0.4rem; gap: 0.2rem; }
                    .gk-skill-badge { padding: 0.15rem 0.35rem; font-size: 0.35rem; gap: 0.2rem; border-radius: 3px; }
                }
            `}</style>
        </div >
    );
}

export default function GoalkeeperSelectPage() {
    return (
        <Suspense fallback={<div style={{ minHeight: '100vh', background: '#02040a' }} />}>
            <GoalkeeperSelectPageInner />
        </Suspense>
    );
}
