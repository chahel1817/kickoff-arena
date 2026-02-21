'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Search, ChevronRight, ChevronLeft, Star, Check, Crosshair, ShieldCheck, Zap } from 'lucide-react';
import '../../entry.css';

import { GOALKEEPERS } from './data';

export default function GoalkeeperSelectPage() {
    const router = useRouter();
    const [selectedGK, setSelectedGK] = useState(null);
    const [formation, setFormation] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [search, setSearch] = useState('');
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const storedFormation = localStorage.getItem('formation');
        if (storedFormation) setFormation(JSON.parse(storedFormation));
        const storedTeam = localStorage.getItem('selectedTeam');
        if (storedTeam) setSelectedTeam(JSON.parse(storedTeam));
        const storedGK = localStorage.getItem('goalkeeper');
        if (storedGK) setSelectedGK(JSON.parse(storedGK));
    }, []);

    const sortedGKs = useMemo(() => {
        return [...GOALKEEPERS].sort((a, b) => b.rating - a.rating);
    }, []);

    const filtered = useMemo(() => {
        if (!search) return GOALKEEPERS;
        return GOALKEEPERS.filter(gk =>
            gk.name.toLowerCase().includes(search.toLowerCase()) ||
            gk.club.toLowerCase().includes(search.toLowerCase())
        );
    }, [search]);

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

    // Keyboard Support
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (search !== '') return;

            if (e.key === 'ArrowRight') {
                setFocusedIndex(prev => Math.min(prev + 1, filtered.length - 1));
            } else if (e.key === 'ArrowLeft') {
                setFocusedIndex(prev => Math.max(prev - 1, 0));
            } else if (e.key === 'Enter' && focusedIndex !== -1) {
                handleSelect(filtered[focusedIndex]);
            } else if (e.key === 'Backspace' && selectedGK) {
                setSelectedGK(null);
                localStorage.removeItem('goalkeeper');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [filtered, focusedIndex, handleSelect, search, selectedGK]);

    const handleConfirm = () => {
        if (selectedGK) {
            setIsExiting(true);
            setTimeout(() => {
                router.push('/select/defenders');
            }, 600);
        }
    };

    return (
        <div className={`entry-page no-snap ${isExiting ? 'page-exit' : ''}`}>
            <div className="stadium-bg gk-stadium-bg"></div>
            <div className="overlay-gradient"></div>

            <section className="gk-page">
                <main className="gk-main">

                    {/* Top Context Bar */}
                    <div className="gk-context-bar glass">
                        <div className="gk-ctx-left">
                            <button onClick={() => router.push('/formation-select')} className="gk-back-btn">
                                <ChevronLeft size={18} />
                                <span>FORMATION</span>
                            </button>
                        </div>

                        <div className="gk-ctx-center">
                            <div className="gk-ctx-item">
                                <span className="gk-ctx-label">FORMATION</span>
                                <span className="gk-ctx-value">{formation?.name || '4-4-2'}</span>
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
                            const hlName = search !== '' ? (
                                gk.name.split(new RegExp(`(${search.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&")})`, 'gi')).map((part, i) =>
                                    part.toLowerCase() === search.toLowerCase()
                                        ? <span key={i} className="gk-highlight">{part}</span>
                                        : part
                                )
                            ) : gk.name;
                            const rank = sortedGKs.findIndex(p => p.id === gk.id) + 1;
                            const isKeyboardFocused = focusedIndex === index;

                            return (
                                <button
                                    key={gk.id}
                                    onClick={() => handleSelect(gk)}
                                    onMouseEnter={() => setFocusedIndex(index)}
                                    className={`gk-card glass ${isSelected ? 'selected' : ''} ${!isMatch ? 'faint' : ''} ${gk.tier === 'legend' ? 'legend-card' : ''} ${isKeyboardFocused ? 'kb-focus' : ''}`}
                                >
                                    {/* Rank Badge */}
                                    <div className="gk-rank-badge">
                                        RANK #{rank}
                                    </div>

                                    {/* Skill Badges (Qualities) */}
                                    <div className="gk-skill-badges">
                                        {gk.tags?.slice(0, 2).map(skill => (
                                            <div key={skill} className="gk-skill-badge">
                                                <Zap size={8} />
                                                <span>{skill.toUpperCase()}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Legend Badge */}
                                    {gk.tier === 'legend' && (
                                        <div className="gk-legend-badge">
                                            <Star size={12} />
                                            <span>LEGEND</span>
                                        </div>
                                    )}

                                    {/* Rating */}
                                    <div className="gk-card-rating">
                                        <span className="gk-ovr-label">OVR</span>
                                        <span className="gk-ovr-value">{gk.rating}</span>
                                    </div>

                                    {/* Player Photo */}
                                    <div className="gk-photo-frame">
                                        <img src={gk.image} alt={gk.name} className="gk-photo" loading="lazy" />
                                        <div className="gk-photo-vignette"></div>
                                        <div className="gk-card-glow"></div>
                                    </div>

                                    {/* Player Info */}
                                    <div className="gk-card-info">
                                        <span className="gk-card-club">{gk.club.toUpperCase()}</span>
                                        <h3 className="gk-card-name">{hlName}</h3>
                                        <div className="gk-card-meta">
                                            <span className="gk-card-country">{gk.country}</span>
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
                                <span className="gk-bar-tag">GOALKEEPER LOCKED</span>
                                <h3 className="gk-bar-name">{selectedGK?.name}</h3>
                                {selectedGK?.tags && (
                                    <div className="gk-bar-tags">
                                        {selectedGK.tags.map(tag => (
                                            <span key={tag} className="gk-bar-tag-pill">{tag}</span>
                                        ))}
                                    </div>
                                )}
                                <div className="gk-bar-meta-row">
                                    <span>{selectedGK?.club}</span>
                                    <span className="gk-bar-sep">•</span>
                                    <span>{selectedGK?.country}</span>
                                    <span className="gk-bar-sep">•</span>
                                    <span className="gk-bar-ovr-lock">OVR {selectedGK?.rating}</span>
                                </div>
                            </div>
                            <button onClick={handleConfirm} className="gk-proceed-btn">
                                <span>CONFIRM SQUAD #1</span>
                                <ShieldCheck size={22} className="gk-btn-icon" />
                            </button>
                        </div>
                    </div>

                    {/* Step Progress */}
                    <div className="gk-progress-footer">
                        <div className="gk-progress-steps">
                            {['GK', 'DEF', 'MID', 'FWD', 'REVIEW'].map((s, i) => (
                                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div className={`gk-step ${i === 0 ? 'active' : ''}`}>
                                        <div className={`gk-step-circle ${i === 0 ? 'active' : ''}`}>{i + 1}</div>
                                        <span>{s}</span>
                                    </div>
                                    {i < 4 && <div className="gk-step-line"></div>}
                                </div>
                            ))}
                        </div>
                    </div>

                </main>
            </section>

            <style jsx>{`
                .gk-page { min-height: 100vh; display: flex; justify-content: center; padding: 3rem 1rem; animation: gkFadeIn 0.6s ease-out; }
                .page-exit { animation: gkPageExit 0.6s forwards ease-in; pointer-events: none; }
                
                @keyframes gkFadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes gkPageExit { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-20px); } }
                
                .gk-main { max-width: 1400px; width: 96%; }

                .gk-stadium-bg {
                    position: fixed; inset: 0;
                    background: url('/stadium-bg.jpg') center/cover;
                    filter: brightness(0.08) sepia(1) hue-rotate(-15deg) saturate(3);
                    z-index: -1;
                }

                /* Context Bar */
                .gk-context-bar {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 1rem 2rem; background: rgba(10, 10, 15, 0.6);
                    backdrop-filter: blur(20px); border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 20px; margin-bottom: 3rem; position: sticky; top: 0; z-index: 100;
                }
                .gk-back-btn {
                    display: flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.1); padding: 0.6rem 1.2rem; border-radius: 12px;
                    color: rgba(255,255,255,0.6); font-weight: 900; font-size: 0.6rem; letter-spacing: 0.12em;
                    cursor: pointer; transition: 0.3s;
                }
                .gk-back-btn:hover { background: #f59e0b; color: black; border-color: #f59e0b; }
                .gk-ctx-center { display: flex; align-items: center; gap: 1.5rem; }
                .gk-ctx-item { text-align: center; }
                .gk-ctx-label { display: block; font-size: 0.45rem; font-weight: 900; color: rgba(255,255,255,0.25); letter-spacing: 0.2em; margin-bottom: 0.15rem; }
                .gk-ctx-value { font-size: 0.85rem; font-weight: 900; color: #f59e0b; letter-spacing: 0.05em; }
                .gk-ctx-divider { width: 1px; height: 30px; background: rgba(255,255,255,0.08); }
                .gk-step-badge { display: flex; flex-direction: column; align-items: center; background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.2); padding: 0.5rem 1rem; border-radius: 12px; }
                .gk-step-label { font-size: 0.4rem; font-weight: 900; color: rgba(245, 158, 11, 0.5); letter-spacing: 0.2em; }
                .gk-step-num { font-size: 1.2rem; font-weight: 900; color: #f59e0b; }
                .gk-step-of { font-size: 0.7rem; color: rgba(245, 158, 11, 0.4); }

                /* Title */
                .gk-title-section { text-align: center; margin-bottom: 3.5rem; }
                .gk-ornament { display: flex; align-items: center; justify-content: center; gap: 1rem; margin-bottom: 1.25rem; }
                .gk-orn-line { width: 50px; height: 1px; background: rgba(245, 158, 11, 0.3); }
                .gk-orn-icon { color: #f59e0b; filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.5)); }
                .gk-mega-title { font-size: clamp(2.5rem, 7vw, 4.5rem); font-weight: 900; color: white; letter-spacing: -0.03em; margin-bottom: 1rem; }
                .text-gradient-gold { background: linear-gradient(135deg, #f59e0b, #fbbf24, #f59e0b); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
                .gk-subtitle { font-size: 1.1rem; color: rgba(255,255,255,0.35); line-height: 1.7; max-width: 520px; margin: 0 auto; }

                /* Filter Section */
                .gk-filter-section { margin-bottom: 3rem; }
                .gk-search-row { display: flex; justify-content: center; width: 100%; }
                .gk-search-wrapper { position: relative; width: 100%; max-width: 750px; display: flex; align-items: center; }
                .gk-search { 
                    width: 100%; padding: 1.4rem 5rem 1.4rem 2.5rem; border-radius: 100px; 
                    border: 1px solid rgba(245,158,11,0.3); background: rgba(15,12,5,0.7); 
                    color: white; font-size: 1.2rem; font-weight: 500; 
                    outline: none; transition: all .4s cubic-bezier(0.23, 1, 0.32, 1); 
                    box-shadow: 0 10px 40px rgba(0,0,0,0.4), inset 0 0 20px rgba(245,158,11,0.05);
                    backdrop-filter: blur(20px);
                }
                .gk-search:focus { 
                    background: rgba(25,20,10,0.9); border-color: #f59e0b;
                    box-shadow: 0 20px 50px rgba(245,158,11,0.25), inset 0 0 15px rgba(245,158,11,0.1);
                    transform: translateY(-3px) scale(1.01);
                }
                .gk-search-icon-wrapper { position: absolute; right: 1.5rem; top: 50%; transform: translateY(-50%); width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; pointer-events: none; }
                .gk-search-icon { color: #f59e0b; filter: drop-shadow(0 0 10px rgba(245,158,11,0.5)); }
                .gk-search-wrapper:focus-within .gk-search-icon { color: #fbbf24; transform: scale(1.2) rotate(-5deg); transition: .4s; }

                /* Grid */
                .gk-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.5rem; margin-bottom: 12rem; }

                /* Card */
                .gk-card { position: relative; text-align: left; border-radius: 24px; overflow: hidden; border: 1px solid rgba(255,255,255,0.06); background: rgba(10, 10, 15, 0.7); cursor: pointer; transition: all .4s cubic-bezier(0.23, 1, 0.32, 1); }
                .gk-card:hover, .gk-card.kb-focus { transform: translateY(-10px); border-color: rgba(245, 158, 11, 0.4); box-shadow: 0 25px 60px -15px rgba(0,0,0,0.7), 0 0 25px rgba(245, 158, 11, 0.08); }
                .gk-card.selected { border-color:#f59e0b; border-width: 2px; background:rgba(245,158,11,0.05); transform:scale(1.03); box-shadow:0 0 40px rgba(245,158,11,0.2); animation: gkPulse 2s infinite ease-in-out; }
                .gk-card.faint { opacity: 0.15; filter: grayscale(0.8); pointer-events: none; }
                
                @keyframes gkPulse { 0% { box-shadow: 0 0 0 0 rgba(245,158,11,0.4); } 70% { box-shadow: 0 0 0 15px rgba(245,158,11,0); } 100% { box-shadow: 0 0 0 0 rgba(245,158,11,0); } }

                .gk-rank-badge { position: absolute; top: 1rem; right: 1rem; background: rgba(0,0,0,0.85); color: rgba(255,255,255,0.4); padding: 0.3rem 0.6rem; border-radius: 6px; font-size: 0.5rem; font-weight: 900; letter-spacing: 0.05em; z-index: 10; border: 1px solid rgba(255,255,255,0.08); }
                
                .gk-skill-badges { position: absolute; top: 1rem; left: 1rem; z-index: 10; display: flex; flex-direction: column; gap: 0.3rem; }
                .gk-skill-badge { display: flex; align-items: center; gap: 0.3rem; background: rgba(245,158,11,0.15); border: 1px solid rgba(245,158,11,0.3); padding: 0.25rem 0.5rem; border-radius: 4px; color: #fbbf24; font-size: 0.45rem; font-weight: 900; letter-spacing: 0.05em; backdrop-filter: blur(8px); animation: gkSkillSlide .4s ease-out; }
                @keyframes gkSkillSlide { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }

                .gk-legend-badge { position: absolute; top: 1rem; left: 1rem; z-index: 15; display: flex; align-items: center; gap: 0.3rem; background: linear-gradient(135deg, rgba(245, 158, 11, 0.4), rgba(245, 158, 11, 0.1)); border: 1px solid rgba(245, 158, 11, 0.5); padding: 0.25rem 0.6rem; border-radius: 8px; color: #f59e0b; font-size: 0.5rem; font-weight: 900; letter-spacing: 0.15em; backdrop-filter: blur(10px); }
                .gk-highlight { color: #f59e0b; background: rgba(245,158,11,0.15); border-radius: 2px; padding: 0 2px; }

                .gk-card-rating { position: absolute; top: 50%; right: 1rem; transform: translateY(-50%); z-index: 10; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); padding: 0.5rem 0.8rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); text-align: center; }
                /* Moving rating to bottom right instead for cleaner look with skill badges */
                .gk-card-rating { top: auto; bottom: 8rem; right: 1rem; transform: none; }

                .gk-ovr-label { display: block; font-size: 0.4rem; font-weight: 900; color: rgba(255,255,255,0.3); letter-spacing: 0.1em; }
                .gk-ovr-value { font-size: 1.3rem; font-weight: 900; color: white; line-height: 1; }

                /* Photo */
                .gk-photo-frame { position: relative; height: 300px; overflow: hidden; background: #080810; }
                .gk-photo { width: 100%; height: 100%; object-fit: cover; object-position: center top; transition: 0.6s; filter: saturate(1.15) contrast(1.1); }
                .gk-card:hover .gk-photo, .gk-card.kb-focus .gk-photo { transform: scale(1.1); filter: saturate(1.3) contrast(1.15); }
                .gk-photo-vignette { position: absolute; bottom: 0; left: 0; right: 0; height: 8rem; background: linear-gradient(to top, rgba(10,10,15,1), transparent); }
                .gk-card-glow { position: absolute; bottom: 0; left: 0; right: 0; height: 3px; background: transparent; transition: 0.4s; }
                .gk-card:hover .gk-card-glow, .gk-card.kb-focus .gk-card-glow { background: linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.4), transparent); box-shadow: 0 0 20px rgba(245, 158, 11, 0.2); }

                /* Card Info */
                .gk-card-info { padding: 1.5rem 1.5rem 1.75rem; margin-top: -3rem; position: relative; z-index: 5; }
                .gk-card-club { font-size: 0.55rem; font-weight: 900; color: #f59e0b; letter-spacing: 0.25em; opacity: 0.7; display: block; margin-bottom: 0.4rem; }
                .gk-card-name { font-size: 1.35rem; font-weight: 900; color: white; line-height: 1.1; text-transform: uppercase; font-style: italic; margin-bottom: 0.6rem; }
                .gk-card-meta { display: flex; align-items: center; gap: 0.4rem; font-size: 0.7rem; color: rgba(255,255,255,0.3); font-weight: 700; }
                .gk-meta-dot { opacity: 0.3; }
                .gk-card-pos { background: rgba(245, 158, 11, 0.1); color: #f59e0b; padding: 0.15rem 0.5rem; border-radius: 4px; font-size: 0.6rem; font-weight: 900; letter-spacing: 0.1em; }

                /* Confirm Bar */
                .gk-confirm-bar { position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%) translateY(150%); width: calc(100% - 4rem); max-width: 900px; padding: 1.25rem 2.5rem; border-radius: 24px; border: 1px solid rgba(245, 158, 11, 0.3); z-index: 3000; box-shadow: 0 25px 60px -12px rgba(0,0,0,0.8); transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); background: rgba(10, 10, 15, 0.9); backdrop-filter: blur(30px); }
                .gk-confirm-bar.visible { transform: translateX(-50%) translateY(0); }
                .gk-bar-content { display: flex; justify-content: space-between; align-items: center; }
                .gk-bar-info { flex:1; }
                .gk-bar-tag { display:block; font-size:.55rem; font-weight:900; color:#f59e0b; letter-spacing:.15em; margin-bottom:.25rem; }
                .gk-bar-name { font-size:1.5rem; font-weight:900; color:white; letter-spacing:-.02em; line-height:1; margin-bottom: 0.5rem; }
                .gk-bar-tags { display: flex; gap: 0.6rem; margin-bottom: 0.6rem; }
                .gk-bar-tag-pill { font-size: 0.65rem; font-weight: 600; color: rgba(255,255,255,0.7); background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 0.2rem 0.6rem; border-radius: 4px; }
                .gk-bar-meta-row { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; font-weight: 700; color: rgba(255,255,255,0.35); }
                .gk-bar-ovr-lock { color: #f59e0b; }
                .gk-proceed-btn { display: flex; align-items: center; gap: 0.8rem; background: linear-gradient(135deg, #f59e0b, #fbbf24); color: black; padding: 1rem 2.5rem; border-radius: 14px; font-weight: 950; font-size: 0.95rem; letter-spacing: 0.05em; border: none; cursor: pointer; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: 0 10px 30px rgba(245, 158, 11, 0.25); white-space: nowrap; }
                .gk-proceed-btn:hover { transform: scale(1.05) translateY(-2px); box-shadow: 0 15px 40px rgba(245, 158, 11, 0.4); background: linear-gradient(135deg, #fbbf24, #f59e0b); }
                .gk-btn-icon { transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
                .gk-proceed-btn:hover .gk-btn-icon { transform: rotate(15deg) scale(1.2); }

                /* Progress Footer */
                .gk-progress-footer { position: fixed; bottom: 0; left: 0; right: 0; display: flex; justify-content: center; padding: 1rem 2rem; background: linear-gradient(to top, rgba(2,4,10,0.95), transparent); pointer-events: none; z-index: 50; }
                .gk-progress-steps { display: flex; align-items: center; gap: 0.5rem; }
                .gk-step { display: flex; flex-direction: column; align-items: center; gap: 0.25rem; font-size: 0.5rem; font-weight: 900; color: rgba(255,255,255,0.2); letter-spacing: 0.1em; }
                .gk-step.active { color: #f59e0b; }
                .gk-step-circle { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: 900; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.25); }
                .gk-step-circle.active { background: rgba(245, 158, 11, 0.15); border-color: #f59e0b; color: #f59e0b; box-shadow: 0 0 15px rgba(245, 158, 11, 0.3); }
                .gk-step-line { width: 30px; height: 1px; background: rgba(255,255,255,0.06); margin-bottom: 1rem; }

                /* Responsive */
                @media (max-width: 768px) {
                    .gk-context-bar { flex-wrap: wrap; gap: 0.75rem; padding: 0.75rem 1rem; }
                    .gk-ctx-center { gap: 0.75rem; }
                    .gk-mega-title { font-size: 2.3rem; }
                    .gk-confirm-bar { width: 95%; padding: 1rem; }
                    .gk-bar-name { font-size: 1.1rem; }
                    .gk-proceed-btn { padding: 0.8rem 1.5rem; font-size: 0.8rem; }
                }
            `}</style>
        </div>
    );
}
