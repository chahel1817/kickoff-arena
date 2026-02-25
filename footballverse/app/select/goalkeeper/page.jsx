'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, Search, ChevronRight, ChevronLeft, Star, Check, Crosshair, ShieldCheck, Zap } from 'lucide-react';
import '../../entry.css';

import { GOALKEEPERS } from './data';

export default function GoalkeeperSelectPage() {
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

    useEffect(() => {
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
        if (storedGK) setSelectedGK(JSON.parse(storedGK));
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
            gk.club.toLowerCase().includes(search.toLowerCase())
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

    const handleSelect = useCallback((gk) => {
        setSelectedGK(prev => {
            if (prev?.id === gk.id) {
                localStorage.removeItem('goalkeeper');
                return null;
            } else {
                localStorage.setItem('goalkeeper', JSON.stringify(gk));
                return gk;
            }
        });
    }, []);

    const handleConfirm = useCallback(() => {
        if (selectedGK) {
            setIsExiting(true);
            setTimeout(() => {
                if (isEditMode) {
                    router.push('/squad/review');
                } else {
                    router.push('/select/defenders');
                }
            }, 600);
        }
    }, [isEditMode, selectedGK, router]);

    return (
        <div className={`entry-page no-snap ${isExiting ? 'page-exit' : ''}`}>
            <div className="stadium-bg gk-stadium-bg"></div>
            <div className="overlay-gradient"></div>

            <section className="gk-page">
                <main className="gk-main">

                    {/* Top Context Bar */}
                    <div className="gk-context-bar glass">
                        <div className="gk-ctx-left">
                            <button onClick={() => isEditMode ? router.push('/squad/review') : router.push('/formation-select')} className="gk-back-btn">
                                <ChevronLeft size={18} />
                                <span>{isEditMode ? 'BACK TO REVIEW' : 'FORMATION'}</span>
                            </button>
                        </div>

                        <div className="gk-ctx-center">
                            <div className="gk-ctx-item">
                                <span className="gk-ctx-label">FORMATION</span>
                                <span className="gk-ctx-value">{formation?.name || '---'}</span>
                            </div>
                            <div className="gk-ctx-divider"></div>
                            <div className="gk-ctx-item">
                                <span className="gk-ctx-label">POSITION</span>
                                <span className="gk-ctx-value" style={{ color: '#f59e0b' }}>GOALKEEPER</span>
                            </div>
                            <div className="gk-ctx-divider"></div>
                            <div className="gk-ctx-item">
                                <span className="gk-ctx-label">SELECTED</span>
                                <span className="gk-ctx-value">{selectedGK ? '1' : '0'} / 1</span>
                            </div>
                        </div>

                        <div className="gk-ctx-right">
                            <div className="gk-step-badge">
                                <span className="gk-step-label">STEP</span>
                                <span className="gk-step-num">1<span className="gk-step-of"> / 5</span></span>
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

                    {/* Filters Section */}
                    <div className="gk-filter-section">
                        <div className="gk-search-row">
                            <div className="gk-search-wrapper">
                                <input type="text" placeholder="Search goalkeepers..."
                                    value={search} onChange={e => setSearch(e.target.value)}
                                    className="gk-search" />
                                <div className="gk-search-icon-wrapper">
                                    <Search className="gk-search-icon" size={22} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Goalkeeper Grid */}
                    <div className="gk-grid">
                        {filtered.map((gk, index) => {
                            const isSelected = selectedGK?.id === gk.id;
                            const isMatch = search === '' || gk.name.toLowerCase().includes(search.toLowerCase());
                            const rank = sortedGKs.findIndex(p => p.id === gk.id) + 1;

                            return (
                                <button
                                    key={gk.id}
                                    onClick={() => handleSelect(gk)}
                                    className={`gk-card glass ${isSelected ? 'selected' : ''} ${!isMatch ? 'faint' : ''} ${gk.tier === 'legend' ? 'legend-card' : ''} ${focusedIndex === index ? 'kb-focus' : ''}`}
                                >
                                    <div className="gk-rank-badge">RANK #{rank}</div>
                                    <div className="gk-skill-badges">
                                        {gk.tags?.slice(0, 2).map(skill => (
                                            <div key={skill} className="gk-skill-badge">
                                                <Zap size={8} />
                                                <span>{skill.toUpperCase()}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="gk-card-rating">
                                        <span className="gk-ovr-label">OVR</span>
                                        <span className="gk-ovr-value">{gk.rating}</span>
                                    </div>
                                    <div className="gk-photo-frame">
                                        <img src={gk.image} alt={gk.name} className="gk-photo" loading="lazy" onError={() => handleImageError(gk)} />
                                        <div className="gk-photo-vignette"></div>
                                        <div className="gk-card-glow"></div>
                                    </div>
                                    <div className="gk-card-info">
                                        <span className="gk-card-club">{gk.club.toUpperCase()}</span>
                                        <h3 className="gk-card-name" dangerouslySetInnerHTML={{ __html: search ? gk.name.replace(new RegExp(`(${search})`, 'gi'), '<span class="gk-highlight">$1</span>') : gk.name }}></h3>
                                        <div className="gk-card-meta">
                                            <span>{gk.country}</span>
                                            <span className="gk-meta-dot">•</span>
                                            <span className="gk-card-pos">GK</span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

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
                .gk-page { min-height:100vh; padding:2rem; position:relative; z-index:10; }
                .gk-main { max-width:1400px; margin:0 auto; padding-top:5rem; }
                
                .gk-context-bar { position:fixed; top:2rem; left:50%; transform:translateX(-50%); width:calc(100% - 4rem); max-width:1200px; padding:0.75rem 2rem; border-radius:20px; display:flex; justify-content:space-between; align-items:center; z-index:100; border:1px solid rgba(255,255,255,0.08); background:rgba(10,10,15,0.8); backdrop-filter:blur(20px); }
                .gk-back-btn { display:flex; align-items:center; gap:0.5rem; background:none; border:none; color:rgba(255,255,255,0.4); font-weight:700; font-size:0.75rem; cursor:pointer; transition:0.3s; }
                .gk-back-btn:hover { color:white; }
                
                .gk-ctx-center { display:flex; align-items:center; gap:2rem; }
                .gk-ctx-item { display:flex; flex-direction:column; align-items:center; }
                .gk-ctx-label { font-size:0.55rem; font-weight:900; color:rgba(255,255,255,0.3); letter-spacing:0.15em; margin-bottom:0.1rem; }
                .gk-ctx-value { font-size:0.85rem; font-weight:900; color:white; letter-spacing:0.02em; }
                .gk-ctx-divider { width:1px; height:24px; background:rgba(255,255,255,0.08); }
                
                .gk-step-badge { display:flex; flex-direction:column; align-items:flex-end; }
                .gk-step-label { font-size:0.55rem; font-weight:900; color:rgba(255,255,255,0.3); letter-spacing:0.15em; }
                .gk-step-num { font-size:1.2rem; font-weight:950; color:white; line-height:1; }
                .gk-step-of { opacity:0.3; font-size:0.8rem; }
                
                .gk-title-section { text-align:center; margin-bottom:4rem; }
                .gk-mega-title { font-size:clamp(2.5rem, 6vw, 4.5rem); font-weight:950; letter-spacing:-0.03em; line-height:1; margin:1.5rem 0; color:white; }
                .gk-subtitle { font-size:1.1rem; color:rgba(255,255,255,0.4); max-width:600px; margin:0 auto; line-height:1.6; }
                
                .gk-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(260px, 1fr)); gap:1.5rem; margin-bottom:12rem; }
                .gk-card { position:relative; text-align:left; border-radius:24px; overflow:hidden; border:1px solid rgba(255,255,255,0.06); background:rgba(10,10,15,0.7); cursor:pointer; transition:all 0.45s cubic-bezier(0.23, 1, 0.32, 1); }
                .gk-card:hover { transform:translateY(-10px); border-color:rgba(245,158,11,0.3); box-shadow:0 25px 60px -15px rgba(0,0,0,0.7); }
                .gk-card.selected { border-color:#10b981 !important; border-width:2px; transform:translateY(-10px) scale(1.03); }
                
                .gk-rank-badge { position:absolute; top:1rem; right:1rem; z-index:20; background:rgba(0,0,0,0.6); padding:0.25rem 0.6rem; border-radius:6px; font-size:0.55rem; font-weight:900; color:rgba(255,255,255,0.5); border:1px solid rgba(255,255,255,0.1); }
                .gk-skill-badges { position:absolute; top:1rem; left:1rem; z-index:20; display:flex; flex-direction:column; gap:0.4rem; }
                .gk-skill-badge { display:flex; align-items:center; gap:0.3rem; background:rgba(0,0,0,0.65); padding:0.25rem 0.6rem; border-radius:6px; font-size:0.5rem; font-weight:900; color:#f59e0b; border:1px solid rgba(245,158,11,0.2); }
                
                .gk-card-rating { position:absolute; bottom:8rem; right:1rem; z-index:20; background:rgba(0,0,0,0.8); backdrop-filter:blur(10px); padding:0.5rem 0.8rem; border-radius:12px; border:1px solid rgba(255,255,255,0.1); text-align:center; }
                .gk-ovr-label { display:block; font-size:0.4rem; font-weight:900; color:rgba(255,255,255,0.4); }
                .gk-ovr-value { font-size:1.3rem; font-weight:900; color:white; }
                
                .gk-photo-frame { height:300px; overflow:hidden; background:#080810; position:relative; }
                .gk-photo { width:100%; height:100%; object-fit:cover; transition:0.6s; }
                .gk-card:hover .gk-photo { transform:scale(1.1); }
                .gk-photo-vignette { position:absolute; bottom:0; left:0; right:0; height:8rem; background:linear-gradient(to top, rgba(10,10,15,1), transparent); }
                
                .gk-card-info { padding:1.5rem 1.5rem 1.75rem; margin-top:-3rem; position:relative; z-index:5; }
                .gk-card-club { font-size:0.55rem; font-weight:900; color:#f59e0b; letter-spacing:0.2em; display:block; margin-bottom:0.4rem; }
                .gk-card-name { font-size:1.35rem; font-weight:900; color:white; line-height:1.1; text-transform:uppercase; font-style:italic; }
                .gk-card-meta { display:flex; align-items:center; gap:0.5rem; font-size:0.7rem; color:rgba(255,255,255,0.4); font-weight:700; margin-top:0.4rem; }
                .gk-card-pos { background:rgba(245,158,11,0.1); color:#f59e0b; padding:0.1rem 0.4rem; border-radius:4px; font-size:0.6rem; }
                
                .gk-confirm-bar { position:fixed; bottom:2rem; left:50%; transform:translateX(-50%) translateY(150%); width:calc(100% - 4rem); max-width:950px; padding:1.5rem 2.5rem; border-radius:24px; background:rgba(10,10,18,0.9); backdrop-filter:blur(30px); border:1px solid rgba(245,158,11,0.2); z-index:1000; transition:0.6s cubic-bezier(0.16,1,0.3,1); }
                .gk-confirm-bar.visible { transform:translateX(-50%) translateY(0); }
                .gk-bar-content { display:flex; justify-content:space-between; align-items:center; }
                .gk-bar-info { flex:1; }
                .gk-bar-tag { font-size:0.6rem; font-weight:900; color:#f59e0b; letter-spacing:0.2em; text-transform:uppercase; }
                .gk-bar-name { font-size:1.8rem; font-weight:950; color:white; margin:0.2rem 0; }
                .gk-bar-meta-row { display:flex; align-items:center; gap:0.6rem; font-size:0.8rem; color:rgba(255,255,255,0.4); font-weight:700; }
                .gk-bar-sep { opacity:0.3; }
                .gk-bar-ovr-lock { color:#f59e0b; }
                
                .gk-proceed-btn { display:flex; align-items:center; gap:0.8rem; background:linear-gradient(135deg, #f59e0b, #fbbf24); color:black; padding:1.2rem 2.5rem; border-radius:18px; font-weight:950; font-size:1rem; border:none; cursor:pointer; transition:0.3s; transform-origin:center; }
                .gk-proceed-btn:hover { transform:scale(1.05); }
                
                .gk-progress-footer { position:fixed; bottom:1rem; left:0; right:0; display:flex; justify-content:center; pointer-events:none; }
                .gk-progress-steps { display:flex; align-items:center; gap:0.5rem; background:rgba(0,0,0,0.4); padding:0.5rem 1.5rem; border-radius:30px; backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,0.05); }
                .gk-step { display:flex; align-items:center; gap:0.5rem; color:rgba(255,255,255,0.2); font-size:0.7rem; font-weight:900; }
                .gk-step.active { color:#f59e0b; }
                .gk-step-circle { width:24px; height:24px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); font-size:0.7rem; }
                .gk-step-circle.active { background:#f59e0b; color:black; border-color:#f59e0b; }
                .gk-step-line { width:20px; height:1px; background:rgba(255,255,255,0.1); }
                
                .gk-highlight { color:#f59e0b; background:rgba(245,158,11,0.1); border-radius:2px; }
            `}</style>
        </div>
    );
}
