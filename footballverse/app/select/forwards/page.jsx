'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Zap, Target, ChevronRight, ChevronLeft, Star, Check, X } from 'lucide-react';
import { FORWARDS } from './data';
import '../../entry.css';

export default function ForwardSelectPage() {
    const router = useRouter();
    const [selectedFwds, setSelectedFwds] = useState([]);
    const [formation, setFormation] = useState(null);
    const [filterPos, setFilterPos] = useState('ALL');
    const [search, setSearch] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
        const f = localStorage.getItem('formation');
        if (f) setFormation(JSON.parse(f));
        const saved = localStorage.getItem('forwards');
        if (saved) setSelectedFwds(JSON.parse(saved));
    }, []);

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

    const handleSelect = (player) => {
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
    };

    const handleConfirm = () => {
        if (selectedFwds.length === maxFwd) router.push('/squad/review');
    };

    const positions = ['ALL', 'ST', 'RW', 'LW'];

    return (
        <div className="entry-page no-snap">
            <div className="stadium-bg" style={{ filter: 'brightness(0.06) grayscale(0.8)' }}></div>
            <div className="overlay-gradient"></div>

            <section className="fw-page">
                <main className="fw-main">

                    {/* Context Bar */}
                    <div className="fw-ctx-bar glass">
                        <div className="fw-ctx-left">
                            <button onClick={() => router.push('/select/midfielders')} className="fw-back-btn">
                                <ChevronLeft size={18} /><span>MIDFIELDERS</span>
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
                                <span className="fw-ctx-value" style={{ color: selectedFwds.length === maxFwd ? '#10b981' : '#f97316' }}>
                                    {selectedFwds.length} / {maxFwd}
                                </span>
                            </div>
                            <div className="fw-ctx-divider"></div>
                            <div className="fw-ctx-item">
                                <span className="fw-ctx-label">STEP</span>
                                <span className="fw-ctx-value" style={{ color: '#f97316' }}>4 / 5</span>
                            </div>
                        </div>
                        <div className="fw-ctx-right">
                            <div className="fw-step-badge">
                                <Zap size={16} />
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
                            SELECT YOUR <span className="text-gradient-orange">FORWARDS</span>
                        </h1>
                        <p className="fw-subtitle">
                            Unleash devastation. Choose exactly {maxFwd} forwards to terrorise defences worldwide.
                        </p>
                    </div>

                    {/* Filters Section */}
                    <div className="fw-filter-section">
                        <div className="fw-tabs-row">
                            <div className="fw-tabs">
                                {positions.map(pos => (
                                    <button key={pos} onClick={() => setFilterPos(pos)}
                                        className={`fw-tab ${filterPos === pos ? 'active' : ''}`}>
                                        {pos}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="fw-search-row">
                            <div className="fw-search-wrapper">
                                <input
                                    type="text"
                                    placeholder="Search forwards..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="fw-search"
                                />
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
                                        <span>{p.name}</span>
                                        <X size={14} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Player Count */}
                    <div className="fw-count-badge">
                        <span>{filtered.length} PLAYERS</span>
                    </div>

                    {/* Grid */}
                    <div className="fw-grid">
                        {filtered.map(player => {
                            const isSelected = selectedFwds.some(p => p.id === player.id);
                            const isFull = selectedFwds.length >= maxFwd && !isSelected;
                            return (
                                <button
                                    key={player.id}
                                    onClick={() => handleSelect(player)}
                                    className={`fw-card glass ${isSelected ? 'selected' : ''} ${isFull ? 'dimmed' : ''} ${player.tier === 'legend' ? 'legend-card' : ''} ${player.rating >= 95 ? 'goat-card' : ''}`}
                                >
                                    {player.tier === 'legend' && (
                                        <div className="fw-legend-badge">
                                            <Star size={12} />
                                            <span>{player.rating >= 97 ? 'G.O.A.T' : 'LEGEND'}</span>
                                        </div>
                                    )}
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
                                        {player.rating >= 97 && (
                                            <div className="fw-goat-glow"></div>
                                        )}
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
                                <span className="fw-bar-tag">ATTACK LINE SET — {selectedFwds.length}/{maxFwd}</span>
                                <div className="fw-bar-names">{selectedFwds.map(p => p.name).join(' • ')}</div>
                            </div>
                            <button
                                onClick={handleConfirm}
                                className="fw-proceed-btn"
                                disabled={selectedFwds.length !== maxFwd}
                            >
                                <span>CONFIRM FORWARDS</span>
                                <ChevronRight size={22} />
                            </button>
                        </div>
                    </div>

                    {/* Progress Footer */}
                    <div className="fw-progress-footer">
                        <div className="fw-progress-steps">
                            {['GK', 'DEF', 'MID', 'FWD', 'REVIEW'].map((s, i) => (
                                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div className={`fw-step ${i <= 3 ? 'active' : ''}`}>
                                        <div className={`fw-step-circle ${i <= 3 ? 'active' : ''} ${i <= 2 ? 'done' : ''}`}>{i + 1}</div>
                                        <span>{s}</span>
                                    </div>
                                    {i < 4 && <div className="fw-step-line"></div>}
                                </div>
                            ))}
                        </div>
                    </div>

                </main>
            </section>

            <style jsx>{`
                .fw-page { min-height:100vh; display:flex; justify-content:center; padding:3rem 1rem; animation:fwFadeIn .6s ease-out; }
                @keyframes fwFadeIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
                .fw-main { max-width:1400px; width:96%; }

                /* Context Bar */
                .fw-ctx-bar { display:flex; justify-content:space-between; align-items:center; padding:1rem 2rem; background:rgba(10,10,15,.6); backdrop-filter:blur(20px); border:1px solid rgba(255,255,255,.08); border-radius:20px; margin-bottom:2.5rem; position:sticky; top:0; z-index:100; }
                .fw-back-btn { display:flex; align-items:center; gap:.5rem; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.1); padding:.6rem 1.2rem; border-radius:12px; color:rgba(255,255,255,.6); font-weight:900; font-size:.6rem; letter-spacing:.12em; cursor:pointer; transition:.3s; }
                .fw-back-btn:hover { background:#f97316; color:white; border-color:#f97316; }
                .fw-ctx-center { display:flex; align-items:center; gap:1.5rem; }
                .fw-ctx-item { text-align:center; }
                .fw-ctx-label { display:block; font-size:.45rem; font-weight:900; color:rgba(255,255,255,.25); letter-spacing:.2em; margin-bottom:.15rem; }
                .fw-ctx-value { font-size:.85rem; font-weight:900; color:#f97316; letter-spacing:.05em; }
                .fw-ctx-divider { width:1px; height:30px; background:rgba(255,255,255,.08); }
                .fw-step-badge { display:flex; align-items:center; gap:.4rem; background:rgba(249,115,22,.08); border:1px solid rgba(249,115,22,.2); padding:.5rem 1rem; border-radius:12px; color:#f97316; font-size:.6rem; font-weight:900; letter-spacing:.12em; }

                /* Title */
                .fw-title-section { text-align:center; margin-bottom:2rem; }
                .fw-ornament { display:flex; align-items:center; justify-content:center; gap:1rem; margin-bottom:1.25rem; }
                .fw-orn-line { width:50px; height:1px; background:rgba(249,115,22,.3); }
                .fw-orn-icon { color:#f97316; filter:drop-shadow(0 0 10px rgba(249,115,22,.5)); animation:iconPulse 2s ease-in-out infinite; }
                @keyframes iconPulse { 0%,100%{filter:drop-shadow(0 0 10px rgba(249,115,22,.5))} 50%{filter:drop-shadow(0 0 20px rgba(249,115,22,.9))} }
                .fw-mega-title { font-size:clamp(2.5rem,7vw,4.5rem); font-weight:900; color:white; letter-spacing:-.03em; margin-bottom:1rem; }
                .text-gradient-orange { background:linear-gradient(135deg,#f97316,#fb923c,#fdba74,#f97316); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; animation:gradientShift 4s ease-in-out infinite; background-size:200% 200%; }
                @keyframes gradientShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
                .fw-subtitle { font-size:1.1rem; color:rgba(255,255,255,.35); line-height:1.7; max-width:520px; margin:0 auto; }

                /* Filter Section */
                .fw-filter-section { display:flex; flex-direction:column; gap:2rem; margin-bottom:3rem; }
                .fw-tabs-row { display:flex; justify-content:center; }
                .fw-tabs { display:flex; gap:.5rem; background:rgba(255,255,255,.03); padding:.4rem; border-radius:16px; border:1px solid rgba(255,255,255,.05); }
                .fw-tab { padding:.7rem 1.8rem; border-radius:12px; border:1px solid transparent; background:transparent; color:rgba(255,255,255,.4); font-weight:900; font-size:.7rem; letter-spacing:.1em; cursor:pointer; transition:.3s; }
                .fw-tab.active { background:rgba(249,115,22,.1); border-color:rgba(249,115,22,.3); color:#f97316; box-shadow:0 0 20px rgba(249,115,22,.1); }
                .fw-tab:hover:not(.active) { color:white; background:rgba(255,255,255,.05); }

                .fw-search-row { display:flex; justify-content:center; width: 100%; }
                .fw-search-wrapper { position:relative; width:100%; max-width:750px; display: flex; align-items: center; }
                .fw-search { 
                    width:100%; padding:1.4rem 5rem 1.4rem 2.5rem; border-radius:100px; 
                    border:1px solid rgba(249,115,22,0.3); background:rgba(20,10,5,0.7); 
                    color:white; font-size:1.2rem; font-weight:500; 
                    outline:none; transition:all .4s cubic-bezier(0.23, 1, 0.32, 1); 
                    box-shadow:0 10px 40px rgba(0,0,0,0.4), inset 0 0 20px rgba(249,115,22,0.05);
                    backdrop-filter: blur(20px);
                }
                .fw-search:focus { 
                    background: rgba(35,15,5,0.9);
                    border-color: #f97316;
                    box-shadow:0 20px 50px rgba(249,115,22,0.25), inset 0 0 15px rgba(249,115,22,0.1);
                    transform: translateY(-3px) scale(1.01);
                }
                .fw-search-icon-wrapper {
                    position: absolute; right: 1.5rem; top: 50%; transform: translateY(-50%);
                    width: 50px; height: 50px; display: flex; align-items: center; justify-content: center;
                    pointer-events: none;
                }
                .fw-search-icon { 
                    color: #f97316;
                    filter: drop-shadow(0 0 10px rgba(249,115,22,0.5));
                }
                .fw-search-wrapper:focus-within .fw-search-icon { 
                    color: #fb923c; transform: scale(1.2) rotate(-5deg); transition: .4s;
                }
                .fw-search::placeholder { color:rgba(255,255,255,0.25); }

                /* Count */
                .fw-count-badge { display:inline-flex; align-items:center; margin-bottom:1.5rem; padding:.25rem .75rem; border-radius:8px; background:rgba(249,115,22,.06); border:1px solid rgba(249,115,22,.12); color:#f97316; font-size:.5rem; font-weight:900; letter-spacing:.2em; }

                /* Selection Summary */
                .fw-selection-summary { padding:.75rem 1.5rem; border-radius:16px; margin-bottom:1rem; display:flex; align-items:center; gap:1rem; flex-wrap:wrap; background:rgba(10,10,15,.6); border:1px solid rgba(249,115,22,.15); }
                .fw-sum-label { font-size:.55rem; font-weight:900; color:#f97316; letter-spacing:.15em; white-space:nowrap; }
                .fw-sum-chips { display:flex; gap:.4rem; flex-wrap:wrap; }
                .fw-chip { display:flex; align-items:center; gap:.4rem; padding:.35rem .8rem; border-radius:8px; background:rgba(249,115,22,.1); border:1px solid rgba(249,115,22,.25); color:white; font-size:.65rem; font-weight:700; cursor:pointer; transition:.3s; }
                .fw-chip:hover { background:rgba(239,68,68,.15); border-color:rgba(239,68,68,.3); }
                .fw-chip-pos { color:#f97316; font-weight:900; font-size:.55rem; }

                /* Grid */
                .fw-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:1.25rem; margin-bottom:12rem; }

                /* Card */
                .fw-card { position:relative; text-align:left; border-radius:20px; overflow:hidden; border:1px solid rgba(255,255,255,.06); background:rgba(10,10,15,.7); cursor:pointer; transition:all .45s cubic-bezier(.23,1,.32,1); }
                .fw-card:hover { transform:translateY(-8px); border-color:rgba(249,115,22,.35); box-shadow:0 20px 50px -15px rgba(0,0,0,.7),0 0 20px rgba(249,115,22,.1); }
                .fw-card.selected { border-color:#10b981; border-width:2px; box-shadow:0 0 40px rgba(16,185,129,.15); transform:translateY(-8px) scale(1.02); }
                .fw-card.dimmed { opacity:.25; filter:grayscale(.6); pointer-events:none; }
                .fw-card.legend-card { border-color:rgba(245,158,11,.25); background:linear-gradient(165deg,rgba(30,25,10,.9),rgba(10,10,15,.85)); }
                .fw-card.legend-card:hover { border-color:rgba(245,158,11,.5); box-shadow:0 20px 50px -15px rgba(0,0,0,.8),0 0 30px rgba(245,158,11,.15); }
                .fw-card.goat-card { border-color:rgba(250,204,21,.4); background:linear-gradient(165deg,rgba(40,30,5,.95),rgba(10,10,15,.9)); }
                .fw-card.goat-card:hover { border-color:rgba(250,204,21,.7); box-shadow:0 20px 50px -15px rgba(0,0,0,.9),0 0 40px rgba(250,204,21,.2); }

                /* Legend Badge */
                .fw-legend-badge { position:absolute; top:.8rem; left:.8rem; z-index:10; display:flex; align-items:center; gap:.3rem; background:linear-gradient(135deg,rgba(245,158,11,.2),rgba(245,158,11,.08)); border:1px solid rgba(245,158,11,.35); padding:.2rem .5rem; border-radius:8px; color:#f59e0b; font-size:.45rem; font-weight:900; letter-spacing:.15em; backdrop-filter:blur(10px); }
                .goat-card .fw-legend-badge { background:linear-gradient(135deg,rgba(250,204,21,.25),rgba(245,158,11,.1)); border-color:rgba(250,204,21,.5); color:#fcd34d; letter-spacing:.2em; }

                /* Selected Badge */
                .fw-selected-badge { position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); z-index:30; width:50px; height:50px; border-radius:50%; background:linear-gradient(135deg,#10b981,#34d399); color:black; display:flex; align-items:center; justify-content:center; box-shadow:0 0 40px rgba(16,185,129,.5); animation:badgePop .4s cubic-bezier(.175,.885,.32,1.275); }
                @keyframes badgePop { from{transform:translate(-50%,-50%) scale(0)} to{transform:translate(-50%,-50%) scale(1)} }

                /* Rating */
                .fw-card-rating { position:absolute; top:.8rem; right:.8rem; z-index:10; background:rgba(0,0,0,.85); backdrop-filter:blur(10px); padding:.3rem .7rem; border-radius:10px; border:1px solid rgba(255,255,255,.08); text-align:center; }
                .fw-ovr-label { display:block; font-size:.35rem; font-weight:900; color:rgba(255,255,255,.3); letter-spacing:.1em; }
                .fw-ovr-value { font-size:1.2rem; font-weight:900; color:white; line-height:1; }
                .goat-card .fw-ovr-value { color:#fcd34d; text-shadow:0 0 10px rgba(252,211,77,.4); }

                /* Photo */
                .fw-photo-frame { position:relative; height:260px; overflow:hidden; background:#080810; }
                .fw-photo { width:100%; height:100%; object-fit:cover; object-position:center top; transition:.6s; filter:saturate(1.15) contrast(1.1); }
                .fw-card:hover .fw-photo { transform:scale(1.1); filter:saturate(1.3) contrast(1.15); }
                .fw-photo-vignette { position:absolute; bottom:0; left:0; right:0; height:7rem; background:linear-gradient(to top,rgba(10,10,15,1),transparent); }
                .fw-goat-glow { position:absolute; inset:0; background:radial-gradient(ellipse at center 60%,rgba(250,204,21,.08),transparent 70%); pointer-events:none; }

                /* Card Info */
                .fw-card-info { padding:1.2rem 1.2rem 1.4rem; margin-top:-2.5rem; position:relative; z-index:5; }
                .fw-card-club { font-size:.5rem; font-weight:900; color:#f97316; letter-spacing:.25em; opacity:.7; display:block; margin-bottom:.3rem; }
                .legend-card .fw-card-club { color:#f59e0b; }
                .goat-card .fw-card-club { color:#fcd34d; }
                .fw-card-name { font-size:1.15rem; font-weight:900; color:white; line-height:1.1; text-transform:uppercase; font-style:italic; margin-bottom:.5rem; }
                .fw-card-meta { display:flex; align-items:center; gap:.4rem; font-size:.65rem; color:rgba(255,255,255,.3); font-weight:700; }
                .fw-meta-dot { opacity:.3; }
                .fw-card-pos { background:rgba(249,115,22,.1); color:#f97316; padding:.15rem .5rem; border-radius:4px; font-size:.55rem; font-weight:900; letter-spacing:.1em; }
                .legend-card .fw-card-pos { background:rgba(245,158,11,.1); color:#f59e0b; }
                .goat-card .fw-card-pos { background:rgba(250,204,21,.12); color:#fcd34d; }

                /* Confirm Bar */
                .fw-confirm-bar { position:fixed; bottom:2rem; left:50%; transform:translateX(-50%) translateY(150%); width:calc(100% - 4rem); max-width:900px; padding:1.25rem 2.5rem; border-radius:24px; border:1px solid rgba(249,115,22,.3); z-index:3000; box-shadow:0 25px 60px -12px rgba(0,0,0,.8),0 0 40px rgba(249,115,22,.08); transition:all .5s cubic-bezier(.175,.885,.32,1.275); background:rgba(10,10,15,.9); backdrop-filter:blur(30px); }
                .fw-confirm-bar.visible { transform:translateX(-50%) translateY(0); }
                .fw-bar-content { display:flex; justify-content:space-between; align-items:center; }
                .fw-bar-info { display:flex; flex-direction:column; gap:.15rem; }
                .fw-bar-tag { font-size:.55rem; font-weight:900; color:#f97316; letter-spacing:.15em; }
                .fw-bar-names { font-size:.75rem; color:rgba(255,255,255,.4); font-weight:700; max-width:450px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
                .fw-proceed-btn { display:flex; align-items:center; gap:.8rem; background:linear-gradient(135deg,#f97316,#fb923c); color:white; padding:1rem 2.5rem; border-radius:14px; font-weight:900; font-size:.9rem; letter-spacing:.05em; border:none; cursor:pointer; transition:.3s; box-shadow:0 0 30px rgba(249,115,22,.3); white-space:nowrap; }
                .fw-proceed-btn:hover { transform:scale(1.05); box-shadow:0 0 50px rgba(249,115,22,.5); }
                .fw-proceed-btn:disabled { opacity:.5; cursor:not-allowed; transform:none; }

                /* Progress Footer */
                .fw-progress-footer { position:fixed; bottom:0; left:0; right:0; display:flex; justify-content:center; padding:1rem 2rem; background:linear-gradient(to top,rgba(2,4,10,.95),transparent); pointer-events:none; z-index:50; }
                .fw-progress-steps { display:flex; align-items:center; }
                .fw-step { display:flex; flex-direction:column; align-items:center; gap:.25rem; font-size:.5rem; font-weight:900; color:rgba(255,255,255,.2); letter-spacing:.1em; }
                .fw-step.active { color:#f97316; }
                .fw-step-circle { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:.7rem; font-weight:900; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.08); color:rgba(255,255,255,.25); }
                .fw-step-circle.active { background:rgba(249,115,22,.15); border-color:#f97316; color:#f97316; box-shadow:0 0 15px rgba(249,115,22,.3); }
                .fw-step-circle.done { background:#10b981; border-color:#10b981; color:black; }
                .fw-step-line { width:30px; height:1px; background:rgba(255,255,255,.06); margin-bottom:1rem; }

                /* Responsive */
                @media(max-width:768px) {
                    .fw-ctx-bar { flex-wrap:wrap; gap:.75rem; padding:.75rem 1rem; }
                    .fw-ctx-center { gap:.75rem; }
                    .fw-mega-title { font-size:2.3rem; }
                    .fw-grid { grid-template-columns:1fr 1fr; gap:.75rem; }
                    .fw-photo-frame { height:180px; }
                    .fw-card-name { font-size:.9rem; }
                    .fw-filter-section { gap:1rem; }
                    .fw-search-wrapper { max-width:100%; }
                    .fw-confirm-bar { width:95%; padding:1rem; }
                    .fw-bar-content { flex-wrap:wrap; gap:.75rem; justify-content:center; }
                    .fw-bar-names { display:none; }
                    .fw-proceed-btn { width:100%; justify-content:center; padding:.85rem; font-size:.8rem; }
                }
                @media(max-width:480px) {
                    .fw-grid { grid-template-columns:1fr; }
                    .fw-ctx-right { display:none; }
                }
            `}</style>
        </div>
    );
}
