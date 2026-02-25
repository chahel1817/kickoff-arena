'use client';

import { useEffect, useMemo, useState } from 'react';
import { ChevronRight, Sparkles, Shield, Zap } from 'lucide-react';
import './match.css';

const TARGETS = [
    { id: 'tl', label: 'Top Left', row: 0, col: 0, x: -230, y: -185 },
    { id: 'tc', label: 'Top Center', row: 0, col: 1, x: 0, y: -195 },
    { id: 'tr', label: 'Top Right', row: 0, col: 2, x: 230, y: -185 },
    { id: 'ml', label: 'Mid Left', row: 1, col: 0, x: -220, y: -135 },
    { id: 'mc', label: 'Mid Center', row: 1, col: 1, x: 0, y: -140 },
    { id: 'mr', label: 'Mid Right', row: 1, col: 2, x: 220, y: -135 },
    { id: 'bl', label: 'Low Left', row: 2, col: 0, x: -200, y: -95 },
    { id: 'bc', label: 'Low Center', row: 2, col: 1, x: 0, y: -110 },
    { id: 'br', label: 'Low Right', row: 2, col: 2, x: 200, y: -95 },
];

const FALLBACK_PLAYERS = [
    { id: 'p1', name: 'Captain Prime', rating: 86, position: 'FW' },
    { id: 'p2', name: 'Velocity Nine', rating: 84, position: 'FW' },
    { id: 'p3', name: 'Iron Eight', rating: 82, position: 'MF' },
    { id: 'p4', name: 'Orbit Ten', rating: 83, position: 'MF' },
    { id: 'p5', name: 'Anchor Six', rating: 80, position: 'DF' },
    { id: 'p6', name: 'Falcon Seven', rating: 79, position: 'DF' },
];

export default function MatchPage() {
    const [squad, setSquad] = useState([]);
    const [shooters, setShooters] = useState([null, null, null, null, null]);
    const [activeSlot, setActiveSlot] = useState(0);
    const [target, setTarget] = useState(null);
    const [shotIndex, setShotIndex] = useState(0);
    const [results, setResults] = useState([]);
    const [isShooting, setIsShooting] = useState(false);
    const [keeperMove, setKeeperMove] = useState('');
    const [ballMove, setBallMove] = useState('');
    const [ballStyle, setBallStyle] = useState({});
    const [resultBanner, setResultBanner] = useState('');

    useEffect(() => {
        const storedDefs = JSON.parse(localStorage.getItem('defenders') || '[]');
        const storedMids = JSON.parse(localStorage.getItem('midfielders') || '[]');
        const storedFwds = JSON.parse(localStorage.getItem('forwards') || '[]');
        const storedGK = JSON.parse(localStorage.getItem('goalkeeper') || 'null');
        const list = [...storedFwds, ...storedMids, ...storedDefs];
        if (storedGK) list.push(storedGK);
        setSquad(list.length ? list : FALLBACK_PLAYERS);
    }, []);

    const availablePlayers = useMemo(() => {
        return squad.map((p, idx) => ({
            id: p.id || `${p.name}-${idx}`,
            name: p.name || p.fullName || 'Player',
            rating: p.rating || p.ovr || 75,
            position: p.position || p.role || 'MF',
        }));
    }, [squad]);

    const isLineupReady = shooters.every(Boolean);
    const totalScore = results.filter((r) => r === 'goal').length;
    const currentShooter = shooters[shotIndex] || null;

    const handlePick = (player) => {
        if (shooters.find((s) => s?.id === player.id)) return;
        const next = [...shooters];
        next[activeSlot] = player;
        setShooters(next);
        if (activeSlot < 4) setActiveSlot(activeSlot + 1);
    };

    const resetShootout = () => {
        setTarget(null);
        setShotIndex(0);
        setResults([]);
        setIsShooting(false);
        setKeeperMove('');
        setBallMove('');
        setResultBanner('');
    };

    const takeShot = () => {
        if (!isLineupReady || !target || isShooting || shotIndex >= 5) return;
        setIsShooting(true);
        const keeperOptions = ['tl', 'tc', 'tr', 'ml', 'mc', 'mr', 'bl', 'bc', 'br'];
        const keeperChoice = keeperOptions[Math.floor(Math.random() * keeperOptions.length)];
        setKeeperMove(keeperChoice);
        setBallMove('shooting');
        setBallStyle({
            '--shot-x': `${target.x}px`,
            '--shot-y': `${target.y}px`,
        });

        const hit = keeperChoice !== target.id;
        const newResults = [...results, hit ? 'goal' : 'save'];
        setResults(newResults);
        setResultBanner(hit ? 'GOAL — Ice cold finish.' : 'SAVED — The robot keeper reacted.');

        setTimeout(() => {
            setIsShooting(false);
            setBallMove('fade');
            setKeeperMove('');
            setTarget(null);
            setShotIndex(shotIndex + 1);
            setResultBanner('');
            setTimeout(() => {
                setBallMove('');
                setBallStyle({});
            }, 200);
        }, 1200);
    };

    return (
        <div className="shootout-page">
            <div className="shootout-hero">
                <div className="text-primary text-sm font-bold tracking-[0.3em] uppercase">Penalty Shootout</div>
                <h1>Command the final five.</h1>
                <p className="text-muted text-lg max-w-2xl">
                    Select five shooters from your squad, then choose a target to strike. The goalkeeper robot will
                    react in real time.
                </p>
            </div>

            <div className="shootout-grid">
                <div className="shootout-card glass">
                    <div className="text-primary text-xs font-bold tracking-[0.3em] uppercase">Shooters</div>
                    <div className="slot-list mt-4">
                        {shooters.map((s, idx) => (
                            <button
                                key={`slot-${idx}`}
                                className={`slot ${activeSlot === idx ? 'active' : ''}`}
                                onClick={() => setActiveSlot(idx)}
                                type="button"
                            >
                                <span className="slot-name">{s ? s.name : `Slot ${idx + 1}`}</span>
                                <span className="text-muted text-sm">{s ? `${s.position} • ${s.rating}` : 'Tap to assign'}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="shootout-card glass">
                    <div className="text-primary text-xs font-bold tracking-[0.3em] uppercase">Pick From Squad</div>
                    <div className="player-picker">
                        {availablePlayers.map((p) => {
                            const chosen = shooters.some((s) => s?.id === p.id);
                            return (
                                <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => !chosen && handlePick(p)}
                                    className={`player-chip ${chosen ? 'disabled' : ''}`}
                                >
                                    <span>{p.name}</span>
                                    <span className="text-muted text-sm">{p.position} • {p.rating}</span>
                                </button>
                            );
                        })}
                    </div>
                    <div className="text-muted text-sm mt-3">
                        Selected {shooters.filter(Boolean).length} / 5 shooters.
                    </div>
                </div>
            </div>

            <div className="shootout-field glass">
                <div className="mb-4 text-sm text-muted">
                    Shooter {Math.min(shotIndex + 1, 5)}: <span className="text-primary font-bold">{currentShooter?.name || 'Awaiting selection'}</span>
                    {currentShooter && <span className="ml-2 text-muted">({currentShooter.position} • {currentShooter.rating})</span>}
                </div>
                <div className="goal">
                    <div className="goal-net"></div>
                    <div className={`keeper ${keeperMove}`}></div>
                    <div className={`ball ${ballMove}`} style={ballStyle}></div>
                    <div className="goal-target-layer">
                        {TARGETS.map((t) => (
                            <button
                                key={t.id}
                                type="button"
                                className={`goal-target ${target?.id === t.id ? 'selected' : ''}`}
                                onClick={() => setTarget(t)}
                                disabled={!isLineupReady || isShooting || shotIndex >= 5}
                                aria-label={t.label}
                            />
                        ))}
                    </div>
                </div>
                <div className={`kicker ${isShooting ? 'shoot' : ''}`}></div>
                <div className="penalty-spot"></div>

                <div className="score-row">
                    <div className="text-sm text-muted">Attempt {Math.min(shotIndex + 1, 5)} / 5</div>
                    <div className="attempts">
                        {[0, 1, 2, 3, 4].map((i) => (
                            <div
                                key={`dot-${i}`}
                                className={`dot ${results[i] === 'goal' ? 'hit' : results[i] === 'save' ? 'miss' : ''}`}
                            ></div>
                        ))}
                    </div>
                    <div className="text-sm text-muted">Goals {totalScore}</div>
                </div>

                <div className="shot-targets">
                    {TARGETS.map((t) => (
                        <button
                            key={`${t.id}-btn`}
                            type="button"
                            className={`target-btn ${target?.id === t.id ? 'selected' : ''}`}
                            onClick={() => setTarget(t)}
                            disabled={!isLineupReady || isShooting || shotIndex >= 5}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                <button
                    type="button"
                    className="btn-primary shoot-btn"
                    onClick={takeShot}
                    disabled={!isLineupReady || !target || isShooting || shotIndex >= 5}
                >
                    Take Shot <ChevronRight size={16} />
                </button>

                {resultBanner && (
                    <div className="result-banner">{resultBanner}</div>
                )}

                {shotIndex >= 5 && (
                    <div className="result-banner">
                        Shootout complete — {totalScore} goals scored.
                        <button
                            type="button"
                            className="btn-primary mt-4"
                            onClick={resetShootout}
                            style={{ background: 'transparent', color: 'var(--primary)', border: '1px solid rgba(0,255,136,0.4)' }}
                        >
                            Restart Shootout
                        </button>
                    </div>
                )}
            </div>

            <div className="shootout-card glass mt-8">
                <div className="flex items-center gap-2 text-sm text-muted">
                    <Shield size={14} className="text-primary" />
                    Tip: Fill all 5 shooter slots to unlock the target controls.
                </div>
                <div className="flex items-center gap-2 text-sm text-muted mt-2">
                    <Zap size={14} className="text-primary" />
                    Aim by clicking the goal zones. Higher shots are riskier but harder to save.
                </div>
                <div className="flex items-center gap-2 text-sm text-muted mt-2">
                    <Sparkles size={14} className="text-primary" />
                    The robot keeper reacts randomly. Read the movement and adjust your aim.
                </div>
            </div>
        </div>
    );
}
