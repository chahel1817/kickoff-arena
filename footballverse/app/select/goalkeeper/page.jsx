'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Search, ChevronRight, ChevronLeft, Star, Check, Crosshair } from 'lucide-react';
import '../../entry.css';

import { GOALKEEPERS } from './data';

export default function GoalkeeperSelectPage() {
    const router = useRouter();
    const [selectedGK, setSelectedGK] = useState(null);
    const [formation, setFormation] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const storedFormation = localStorage.getItem('formation');
        if (storedFormation) setFormation(JSON.parse(storedFormation));
        const storedTeam = localStorage.getItem('selectedTeam');
        if (storedTeam) setSelectedTeam(JSON.parse(storedTeam));
        const storedGK = localStorage.getItem('goalkeeper');
        if (storedGK) setSelectedGK(JSON.parse(storedGK));
    }, []);

    const filtered = useMemo(() => {
        if (!search) return GOALKEEPERS;
        return GOALKEEPERS.filter(gk =>
            gk.name.toLowerCase().includes(search.toLowerCase()) ||
            gk.club.toLowerCase().includes(search.toLowerCase())
        );
    }, [search]);

    const handleSelect = (gk) => {
        if (selectedGK?.id === gk.id) {
            setSelectedGK(null);
            localStorage.removeItem('goalkeeper');
        } else {
            setSelectedGK(gk);
            localStorage.setItem('goalkeeper', JSON.stringify(gk));
        }
    };

    const handleConfirm = () => {
        if (selectedGK) {
            router.push('/select/defenders');
        }
    };

    return (
        <div className="entry-page no-snap">
            <div className="stadium-bg" style={{ filter: 'brightness(0.06) grayscale(0.8)' }}></div>
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
                        {filtered.map((gk) => {
                            const isSelected = selectedGK?.id === gk.id;
                            const isOtherSelected = selectedGK && selectedGK.id !== gk.id;
                            return (
                                <button
                                    key={gk.id}
                                    onClick={() => handleSelect(gk)}
                                    className={`gk-card glass ${isSelected ? 'selected' : ''} ${isOtherSelected ? 'dimmed' : ''} ${gk.tier === 'legend' ? 'legend-card' : ''}`}
                                >
                                    {/* Legend Badge */}
                                    {gk.tier === 'legend' && (
                                        <div className="gk-legend-badge">
                                            <Star size={12} />
                                            <span>LEGEND</span>
                                        </div>
                                    )}

                                    {/* Selected Badge */}
                                    {isSelected && (
                                        <div className="gk-selected-badge">
                                            <Check size={20} />
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
                                        <h3 className="gk-card-name">{gk.name}</h3>
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
                            </div>
                            <div className="gk-bar-meta-row">
                                <span>{selectedGK?.club}</span>
                                <span className="gk-bar-sep">•</span>
                                <span>{selectedGK?.country}</span>
                                <span className="gk-bar-sep">•</span>
                                <span>OVR {selectedGK?.rating}</span>
                            </div>
                            <button onClick={handleConfirm} className="gk-proceed-btn">
                                <span>CONFIRM GOALKEEPER</span>
                                <ChevronRight size={22} />
                            </button>
                        </div>
                    </div>

                    {/* Step Progress */}
                    <div className="gk-progress-footer">
                        <div className="gk-progress-steps">
                            <div className="gk-step active">
                                <div className="gk-step-circle active">1</div>
                                <span>GK</span>
                            </div>
                            <div className="gk-step-line"></div>
                            <div className="gk-step">
                                <div className="gk-step-circle">2</div>
                                <span>DEF</span>
                            </div>
                            <div className="gk-step-line"></div>
                            <div className="gk-step">
                                <div className="gk-step-circle">3</div>
                                <span>MID</span>
                            </div>
                            <div className="gk-step-line"></div>
                            <div className="gk-step">
                                <div className="gk-step-circle">4</div>
                                <span>FWD</span>
                            </div>
                            <div className="gk-step-line"></div>
                            <div className="gk-step">
                                <div className="gk-step-circle">5</div>
                                <span>REVIEW</span>
                            </div>
                        </div>
                    </div>

                </main>
            </section>

            <style jsx>{`
                .gk-page {
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    padding: 3rem 1rem;
                    animation: gkFadeIn 0.6s ease-out;
                }
                @keyframes gkFadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .gk-main {
                    max-width: 1400px; width: 96%;
                }

                /* Context Bar */
                .gk-context-bar {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 1rem 2rem;
                    background: rgba(10, 10, 15, 0.6);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 20px;
                    margin-bottom: 3rem;
                    position: sticky; top: 0; z-index: 100;
                }
                .gk-back-btn {
                    display: flex; align-items: center; gap: 0.5rem;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.1);
                    padding: 0.6rem 1.2rem; border-radius: 12px;
                    color: rgba(255,255,255,0.6); font-weight: 900;
                    font-size: 0.6rem; letter-spacing: 0.12em;
                    cursor: pointer; transition: 0.3s;
                }
                .gk-back-btn:hover {
                    background: var(--primary); color: black;
                    border-color: var(--primary);
                }
                .gk-ctx-center {
                    display: flex; align-items: center; gap: 1.5rem;
                }
                .gk-ctx-item { text-align: center; }
                .gk-ctx-label {
                    display: block; font-size: 0.45rem; font-weight: 900;
                    color: rgba(255,255,255,0.25); letter-spacing: 0.2em;
                    margin-bottom: 0.15rem;
                }
                .gk-ctx-value {
                    font-size: 0.85rem; font-weight: 900;
                    color: var(--primary); letter-spacing: 0.05em;
                }
                .gk-ctx-divider {
                    width: 1px; height: 30px;
                    background: rgba(255,255,255,0.08);
                }
                .gk-step-badge {
                    display: flex; flex-direction: column; align-items: center;
                    background: rgba(245, 158, 11, 0.08);
                    border: 1px solid rgba(245, 158, 11, 0.2);
                    padding: 0.5rem 1rem; border-radius: 12px;
                }
                .gk-step-label {
                    font-size: 0.4rem; font-weight: 900;
                    color: rgba(245, 158, 11, 0.5);
                    letter-spacing: 0.2em;
                }
                .gk-step-num {
                    font-size: 1.2rem; font-weight: 900; color: #f59e0b;
                }
                .gk-step-of { font-size: 0.7rem; color: rgba(245, 158, 11, 0.4); }

                /* Title */
                .gk-title-section { text-align: center; margin-bottom: 3.5rem; }
                .gk-ornament {
                    display: flex; align-items: center; justify-content: center;
                    gap: 1rem; margin-bottom: 1.25rem;
                }
                .gk-orn-line { width: 50px; height: 1px; background: rgba(245, 158, 11, 0.3); }
                .gk-orn-icon { color: #f59e0b; filter: drop-shadow(0 0 10px rgba(245, 158, 11, 0.5)); }
                .gk-mega-title {
                    font-size: clamp(2.5rem, 7vw, 4.5rem);
                    font-weight: 900; color: white;
                    letter-spacing: -0.03em; margin-bottom: 1rem;
                }
                .text-gradient-gold {
                    background: linear-gradient(135deg, #f59e0b, #fbbf24, #f59e0b);
                    -webkit-background-clip: text; background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .gk-subtitle {
                    font-size: 1.1rem; color: rgba(255,255,255,0.35);
                    line-height: 1.7; max-width: 520px; margin: 0 auto;
                }

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
                    background: rgba(25,20,10,0.9);
                    border-color: #f59e0b;
                    box-shadow: 0 20px 50px rgba(245,158,11,0.25), inset 0 0 15px rgba(245,158,11,0.1);
                    transform: translateY(-3px) scale(1.01);
                }
                .gk-search-icon-wrapper {
                    position: absolute; right: 1.5rem; top: 50%; transform: translateY(-50%);
                    width: 50px; height: 50px; display: flex; align-items: center; justify-content: center;
                    pointer-events: none;
                }
                .gk-search-icon { 
                    color: #f59e0b;
                    filter: drop-shadow(0 0 10px rgba(245,158,11,0.5));
                }
                .gk-search-wrapper:focus-within .gk-search-icon { 
                    color: #fbbf24; transform: scale(1.2) rotate(-5deg); transition: .4s;
                }
                .gk-search::placeholder { color: rgba(255,255,255,0.25); }

                /* Grid */
                .gk-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 12rem;
                }

                /* Card */
                .gk-card {
                    position: relative; text-align: left;
                    border-radius: 24px; overflow: hidden;
                    border: 1px solid rgba(255,255,255,0.06);
                    background: rgba(10, 10, 15, 0.7);
                    cursor: pointer;
                    transition: all 0.45s cubic-bezier(0.23, 1, 0.32, 1);
                }
                .gk-card.legend-card {
                    border-color: rgba(245, 158, 11, 0.25);
                    background: linear-gradient(165deg, rgba(30, 25, 10, 0.9), rgba(10, 10, 15, 0.85));
                    box-shadow: 0 0 25px rgba(245, 158, 11, 0.06);
                }
                .gk-card.legend-card:hover {
                    border-color: rgba(245, 158, 11, 0.5);
                    box-shadow: 0 25px 60px -15px rgba(0,0,0,0.7),
                                0 0 40px rgba(245, 158, 11, 0.12);
                }
                .gk-legend-badge {
                    position: absolute; top: 1rem; left: 1rem; z-index: 10;
                    display: flex; align-items: center; gap: 0.3rem;
                    background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.08));
                    border: 1px solid rgba(245, 158, 11, 0.35);
                    padding: 0.25rem 0.6rem; border-radius: 8px;
                    color: #f59e0b; font-size: 0.5rem; font-weight: 900;
                    letter-spacing: 0.15em;
                    backdrop-filter: blur(10px);
                }
                .gk-card:hover {
                    transform: translateY(-10px);
                    border-color: rgba(245, 158, 11, 0.3);
                    box-shadow: 0 25px 60px -15px rgba(0,0,0,0.7),
                                0 0 25px rgba(245, 158, 11, 0.08);
                }
                .gk-card.selected {
                    border-color: #f59e0b; border-width: 2px;
                    box-shadow: 0 0 50px rgba(245, 158, 11, 0.15),
                                0 25px 60px -15px rgba(0,0,0,0.7);
                    transform: translateY(-10px) scale(1.02);
                }
                .gk-card.dimmed {
                    opacity: 0.3; filter: grayscale(0.6);
                    pointer-events: none;
                }

                /* Selected Badge */
                .gk-selected-badge {
                    position: absolute; top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 30;
                    width: 56px; height: 56px; border-radius: 50%;
                    background: linear-gradient(135deg, #f59e0b, #fbbf24);
                    color: black;
                    display: flex; align-items: center; justify-content: center;
                    box-shadow: 0 0 50px rgba(245, 158, 11, 0.5);
                    animation: badgePop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                @keyframes badgePop {
                    from { transform: translate(-50%, -50%) scale(0); }
                    to { transform: translate(-50%, -50%) scale(1); }
                }

                /* Rating */
                .gk-card-rating {
                    position: absolute; top: 1rem; right: 1rem; z-index: 10;
                    background: rgba(0,0,0,0.85);
                    backdrop-filter: blur(10px);
                    padding: 0.4rem 0.8rem; border-radius: 10px;
                    border: 1px solid rgba(255,255,255,0.08);
                    text-align: center;
                }
                .gk-ovr-label {
                    display: block; font-size: 0.4rem; font-weight: 900;
                    color: rgba(255,255,255,0.3); letter-spacing: 0.1em;
                }
                .gk-ovr-value {
                    font-size: 1.3rem; font-weight: 900; color: white;
                    line-height: 1;
                }

                /* Photo */
                .gk-photo-frame {
                    position: relative; height: 300px;
                    overflow: hidden; background: #080810;
                }
                .gk-photo {
                    width: 100%; height: 100%;
                    object-fit: cover; object-position: center top;
                    transition: 0.6s; filter: saturate(1.15) contrast(1.1);
                }
                .gk-card:hover .gk-photo {
                    transform: scale(1.1); filter: saturate(1.3) contrast(1.15);
                }
                .gk-photo-vignette {
                    position: absolute; bottom: 0; left: 0; right: 0;
                    height: 8rem;
                    background: linear-gradient(to top, rgba(10,10,15,1), transparent);
                }
                .gk-card-glow {
                    position: absolute; bottom: 0; left: 0; right: 0;
                    height: 3px; background: transparent;
                    transition: 0.4s;
                }
                .gk-card:hover .gk-card-glow {
                    background: linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.4), transparent);
                    box-shadow: 0 0 20px rgba(245, 158, 11, 0.2);
                }
                .gk-card.selected .gk-card-glow {
                    background: linear-gradient(90deg, transparent, #f59e0b, transparent);
                    box-shadow: 0 0 30px rgba(245, 158, 11, 0.3);
                }

                /* Card Info */
                .gk-card-info {
                    padding: 1.5rem 1.5rem 1.75rem;
                    margin-top: -3rem;
                    position: relative; z-index: 5;
                }
                .gk-card-club {
                    font-size: 0.55rem; font-weight: 900;
                    color: #f59e0b; letter-spacing: 0.25em;
                    opacity: 0.7; display: block; margin-bottom: 0.4rem;
                }
                .gk-card-name {
                    font-size: 1.35rem; font-weight: 900;
                    color: white; line-height: 1.1;
                    text-transform: uppercase; font-style: italic;
                    margin-bottom: 0.6rem;
                }
                .gk-card-meta {
                    display: flex; align-items: center; gap: 0.4rem;
                    font-size: 0.7rem; color: rgba(255,255,255,0.3);
                    font-weight: 700;
                }
                .gk-meta-dot { opacity: 0.3; }
                .gk-card-pos {
                    background: rgba(245, 158, 11, 0.1);
                    color: #f59e0b; padding: 0.15rem 0.5rem;
                    border-radius: 4px; font-size: 0.6rem; font-weight: 900;
                    letter-spacing: 0.1em;
                }

                /* Confirm Bar */
                .gk-confirm-bar {
                    position: fixed; bottom: 2rem; left: 50%;
                    transform: translateX(-50%) translateY(150%);
                    width: calc(100% - 4rem); max-width: 900px;
                    padding: 1.25rem 2.5rem; border-radius: 24px;
                    border: 1px solid rgba(245, 158, 11, 0.3);
                    z-index: 3000;
                    box-shadow: 0 25px 60px -12px rgba(0,0,0,0.8);
                    transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    background: rgba(10, 10, 15, 0.9);
                    backdrop-filter: blur(30px);
                }
                .gk-confirm-bar.visible {
                    transform: translateX(-50%) translateY(0);
                }
                .gk-bar-content {
                    display: flex; justify-content: space-between;
                    align-items: center;
                }
                .gk-bar-info {
                    display: flex; flex-direction: column; gap: 0.15rem;
                }
                .gk-bar-tag {
                    font-size: 0.55rem; font-weight: 900;
                    color: #f59e0b; letter-spacing: 0.15em;
                }
                .gk-bar-name {
                    font-size: 1.4rem; color: white; font-weight: 900; margin: 0;
                }
                .gk-bar-meta-row {
                    display: flex; align-items: center; gap: 0.5rem;
                    font-size: 0.75rem; font-weight: 700;
                    color: rgba(255,255,255,0.35);
                }
                .gk-bar-sep { opacity: 0.3; }
                .gk-proceed-btn {
                    display: flex; align-items: center; gap: 0.8rem;
                    background: linear-gradient(135deg, #f59e0b, #fbbf24);
                    color: black;
                    padding: 1rem 2.5rem; border-radius: 14px;
                    font-weight: 900; font-size: 0.9rem; letter-spacing: 0.05em;
                    border: none; cursor: pointer; transition: 0.3s;
                    box-shadow: 0 0 30px rgba(245, 158, 11, 0.25);
                    white-space: nowrap;
                }
                .gk-proceed-btn:hover {
                    transform: scale(1.05);
                    box-shadow: 0 0 50px rgba(245, 158, 11, 0.4);
                }

                /* Progress Footer */
                .gk-progress-footer {
                    position: fixed; bottom: 0; left: 0; right: 0;
                    display: flex; justify-content: center;
                    padding: 1rem 2rem;
                    background: linear-gradient(to top, rgba(2,4,10,0.95), transparent);
                    pointer-events: none; z-index: 50;
                }
                .gk-progress-steps {
                    display: flex; align-items: center; gap: 0.5rem;
                }
                .gk-step {
                    display: flex; flex-direction: column;
                    align-items: center; gap: 0.25rem;
                    font-size: 0.5rem; font-weight: 900;
                    color: rgba(255,255,255,0.2); letter-spacing: 0.1em;
                }
                .gk-step.active { color: #f59e0b; }
                .gk-step-circle {
                    width: 28px; height: 28px; border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    font-size: 0.7rem; font-weight: 900;
                    background: rgba(255,255,255,0.04);
                    border: 1px solid rgba(255,255,255,0.08);
                    color: rgba(255,255,255,0.25);
                }
                .gk-step-circle.active {
                    background: rgba(245, 158, 11, 0.15);
                    border-color: #f59e0b;
                    color: #f59e0b;
                    box-shadow: 0 0 15px rgba(245, 158, 11, 0.3);
                }
                .gk-step-line {
                    width: 30px; height: 1px;
                    background: rgba(255,255,255,0.06);
                    margin-bottom: 1rem;
                }

                /* Responsive */
                @media (max-width: 768px) {
                    .gk-context-bar { flex-wrap: wrap; gap: 0.75rem; padding: 0.75rem 1rem; }
                    .gk-ctx-center { gap: 0.75rem; }
                    .gk-ctx-label { font-size: 0.4rem; }
                    .gk-ctx-value { font-size: 0.7rem; }
                    .gk-mega-title { font-size: 2.3rem; }
                    .gk-subtitle { font-size: 0.95rem; }
                    .gk-grid { grid-template-columns: 1fr 1fr; gap: 0.75rem; }
                    .gk-photo-frame { height: 200px; }
                    .gk-card-name { font-size: 1rem; }
                    .gk-card-info { padding: 1rem; }
                    .gk-confirm-bar { width: 95%; padding: 1rem; }
                    .gk-bar-content { flex-wrap: wrap; gap: 0.75rem; justify-content: center; }
                    .gk-bar-meta-row { display: none; }
                    .gk-proceed-btn { width: 100%; justify-content: center; padding: 0.85rem; font-size: 0.8rem; }
                }

                @media (max-width: 480px) {
                    .gk-grid { grid-template-columns: 1fr; }
                    .gk-ctx-right { display: none; }
                }
            `}</style>
        </div>
    );
}
