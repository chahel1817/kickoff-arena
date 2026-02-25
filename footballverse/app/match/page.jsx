'use client';
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Zap, Target, Check, X, Trophy, RotateCcw, ChevronLeft, Crown, Play, Star } from 'lucide-react';
import './match.css';

const ZONES = [
    { id: 'tl', x: -1, y: -1 }, { id: 'tc', x: 0, y: -1 }, { id: 'tr', x: 1, y: -1 },
    { id: 'ml', x: -1, y: 0 }, { id: 'mc', x: 0, y: 0 }, { id: 'mr', x: 1, y: 0 },
    { id: 'bl', x: -1, y: 1 }, { id: 'bc', x: 0, y: 1 }, { id: 'br', x: 1, y: 1 },
];
const ZONE_LABELS = { tl: 'Top L', tc: 'Top C', tr: 'Top R', ml: 'Mid L', mc: 'Centre', mr: 'Mid R', bl: 'Low L', bc: 'Low C', br: 'Low R' };

// Power quality thresholds — GOOD/PERFECT tiny, RISKY huge
const PWR_WEAK = 22;   // 0-22   WEAK      (22%)
const PWR_GOOD_LO = 28;   // 22-28  GOOD       (6%)
const PWR_PERFECT_LO = 31;   // 28-31  PERFECT    (3%! - top tier)
const PWR_PERFECT_HI = 37;   // 31-37  PERFECT    (6% total)
const PWR_GOOD_HI = 43;   // 37-43  GOOD       (6%)
const PWR_OVER = 75;   // 43-75  RISKY      (32%)
// 75-100             TOO HARD (25%)

const FALLBACK_PLAYERS = [
    { id: 'p1', name: 'Captain Prime', rating: 87, position: 'FW', image: null },
    { id: 'p2', name: 'Velocity Nine', rating: 84, position: 'FW', image: null },
    { id: 'p3', name: 'Iron Eight', rating: 82, position: 'MF', image: null },
    { id: 'p4', name: 'Orbit Ten', rating: 83, position: 'MF', image: null },
    { id: 'p5', name: 'Anchor Six', rating: 80, position: 'DF', image: null },
];

function posColor(p = '') {
    const u = p.toUpperCase();
    if (['FW', 'ST', 'LW', 'RW', 'CF'].some(x => u.includes(x))) return '#ef4444';
    if (['MF', 'CM', 'CAM', 'CDM', 'AM'].some(x => u.includes(x))) return '#a855f7';
    if (['DF', 'CB', 'LB', 'RB'].some(x => u.includes(x))) return '#3b82f6';
    return '#f59e0b';
}

function getPowerLabel(p) {
    if (p <= PWR_WEAK) return { label: 'WEAK', cls: 'pwr-weak' };
    if (p <= PWR_GOOD_LO) return { label: 'GOOD', cls: 'pwr-good' };
    if (p <= PWR_PERFECT_HI) return { label: 'PERFECT', cls: 'pwr-perfect' };
    if (p <= PWR_GOOD_HI) return { label: 'GOOD', cls: 'pwr-good' };
    if (p <= PWR_OVER) return { label: 'RISKY', cls: 'pwr-risky' };
    return { label: 'TOO HARD', cls: 'pwr-over' };
}

const CROWD_CHEERS = ['⚽ GOAL!!!', '🔥 UNSTOPPABLE!', '🎯 TOP CORNER!', '💎 WORLD CLASS!', '🚀 ROCKET SHOT!'];
const CROWD_SAVES = ['🧤 NO WAY!', '👏 WHAT A SAVE!', '🛑 THE KEEPER!!!', '😱 DENIED!', '🦅 FLYING SAVE!'];

export default function ShootoutPage() {
    const router = useRouter();

    // Squad
    const [squad, setSquad] = useState([]);
    const [shooters, setShooters] = useState([null, null, null, null, null]);
    const [activeSlot, setActiveSlot] = useState(0);

    // Match state
    const [shotIndex, setShotIndex] = useState(0);
    const [results, setResults] = useState([]); // {outcome:'goal'|'save'|'miss', power, zone}
    const [phase, setPhase] = useState('setup'); // setup|aim|power|shooting|between|done

    // Aim
    const [aimZone, setAimZone] = useState(null);
    const [countdown, setCountdown] = useState(5);

    // Power bar
    const [power, setPower] = useState(0);
    const [pwrDir, setPwrDir] = useState(1);
    const [lockedPower, setLockedPower] = useState(null);

    // Keeper
    const [keeperLean, setKeeperLean] = useState(null); // 'left'|'right'|'center'
    const [keeperDiveZone, setKeeperDiveZone] = useState(null);
    const [keeperCommitted, setKeeperCommitted] = useState(false);

    // Feedback
    const [banner, setBanner] = useState(null);
    const [shakeClass, setShakeClass] = useState('');
    const [ballPos, setBallPos] = useState(null); // {x,y} percent of goal
    const [ballVisible, setBallVisible] = useState(false);
    const [aiComment, setAiComment] = useState('');
    const [crowdEnergy, setCrowdEnergy] = useState(40);
    const [pressure, setPressure] = useState(0);
    const [streak, setStreak] = useState(0); // positive=goals, negative=saves

    const cdRef = useRef(null);
    const pwrRef = useRef(null);
    const pwrVal = useRef(0);
    const pwrDirR = useRef(1);
    const history = useRef([]);
    const aimZoneRef = useRef(null); // always holds latest aimZone for callbacks

    useEffect(() => {
        const fwds = JSON.parse(localStorage.getItem('forwards') || '[]');
        const mids = JSON.parse(localStorage.getItem('midfielders') || '[]');
        const defs = JSON.parse(localStorage.getItem('defenders') || '[]');
        const gk = JSON.parse(localStorage.getItem('goalkeeper') || 'null');
        const list = [...fwds, ...mids, ...defs];
        if (gk) list.push(gk);
        setSquad(list.length ? list : FALLBACK_PLAYERS);
        window.scrollTo(0, 0);
    }, []);

    const players = useMemo(() => squad.map((p, i) => ({
        id: p.id || `p${i}`, name: p.name || 'Player',
        rating: p.rating || 75, position: p.position || 'MF', image: p.image || null,
    })), [squad]);

    const isReady = shooters.every(Boolean);
    const isDone = shotIndex >= 5;
    const totalGoals = results.filter(r => r.outcome === 'goal').length;
    const currentShooter = shooters[shotIndex] || null;
    const shooterRating = currentShooter?.rating || 75;

    // Speed of power bar — fast by default, even faster under pressure
    const pwrSpeed = useMemo(() => {
        const base = 1.8;                                   // was 0.8 — much faster
        const pressBump = pressure * 0.006;                // pressure ramps it higher
        const ratingEase = (shooterRating - 70) * 0.003;   // elite players: tiny benefit
        return Math.max(1.2, Math.min(3.2, base + pressBump - ratingEase));
    }, [pressure, shooterRating]);

    // Keep pwrSpeed in a ref so interval always reads latest value
    const pwrSpeedRef = useRef(1.8);
    useEffect(() => { pwrSpeedRef.current = pwrSpeed; }, [pwrSpeed]);

    // ─── POWER BAR (no deps — reads live speed via ref) ───
    const startPowerBar = useCallback(() => {
        pwrVal.current = 0; pwrDirR.current = 1;
        setPower(0);
        clearInterval(pwrRef.current);
        pwrRef.current = setInterval(() => {
            pwrVal.current += pwrDirR.current * 2.2 * pwrSpeedRef.current;
            if (pwrVal.current >= 100) { pwrVal.current = 100; pwrDirR.current = -1; }
            if (pwrVal.current <= 0) { pwrVal.current = 0; pwrDirR.current = 1; }
            setPower(Math.round(pwrVal.current));
        }, 16);
    }, []); // stable — no deps needed

    // ─── COUNTDOWN ───
    const startCountdown = useCallback(() => {
        setCountdown(5);
        clearInterval(cdRef.current);
        cdRef.current = setInterval(() => {
            setCountdown(c => {
                if (c <= 1) {
                    clearInterval(cdRef.current);
                    // Set phase then start bar (phase update async, but bar guard removed)
                    setPhase('power');
                    startPowerBar();
                    return 0;
                }
                return c - 1;
            });
        }, 1000);
    }, [startPowerBar]);

    // ─── PICK ZONE ───
    const handleAimZone = (z) => {
        if (phase !== 'aim') return;
        setAimZone(z);
        aimZoneRef.current = z; // keep ref in sync for handleShoot
        const leanOptions = ['left', 'right', 'center'];
        setKeeperLean(leanOptions[Math.floor(Math.random() * 3)]);
        clearInterval(cdRef.current);
        setPhase('power');
        startPowerBar();
    };

    // ─── SHOOT ─── (guard uses ref so it works even right after setPhase)
    const phaseRef = useRef(phase);
    useEffect(() => { phaseRef.current = phase; }, [phase]);

    const handleShoot = useCallback(async () => {
        if (phaseRef.current !== 'power' || !aimZoneRef.current) return;
        clearInterval(pwrRef.current);
        const p = pwrVal.current;
        setLockedPower(Math.round(p));
        setPhase('shooting');
        setKeeperCommitted(true);

        // Determine miss before save: over-hit = miss over bar
        const isOverHit = p > PWR_OVER;
        const isUnderHit = p <= PWR_WEAK;

        // Ball position in goal (visual)
        const bx = aimZone.x === -1 ? 18 : aimZone.x === 0 ? 50 : 82;
        const by = aimZone.y === -1 ? 15 : aimZone.y === 0 ? 50 : 80;
        setBallPos({ x: bx, y: isOverHit ? -20 : by });
        setBallVisible(true);

        // Fetch AI keeper decision
        let keeperZone = ZONES[Math.floor(Math.random() * 9)].id;
        let comment = '';
        try {
            const res = await fetch('/api/keeper', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    shooterName: currentShooter?.name,
                    shooterRating, shooterPosition: currentShooter?.position,
                    shotZone: aimZone.id, shotHistory: history.current,
                    keeperType: 'READER', shotNumber: shotIndex + 1, difficulty: 'NORMAL',
                }),
                signal: AbortSignal.timeout(3500),
            });
            if (res.ok) { const d = await res.json(); keeperZone = d.keeperZone || keeperZone; comment = d.comment || ''; }
        } catch { }

        setKeeperDiveZone(keeperZone);
        setAiComment(comment);

        // Determine outcome
        let outcome = 'goal';
        if (isOverHit || isUnderHit) {
            outcome = 'miss';
        } else {
            const saved = keeperZone === aimZone.id;
            if (saved) {
                // Elite shooters can still score even if keeper guessed right
                const genius = Math.random() < (shooterRating - 70) * 0.018;
                outcome = genius ? 'goal' : 'save';
            }
            // Weak-ish shot: keeper can get to adjacent zones
            if (outcome === 'goal' && p < PWR_GOOD_LO) {
                const adjacent = Math.random() < 0.25;
                if (adjacent) outcome = 'save';
            }
        }

        const newRes = { outcome, power: Math.round(p), zone: aimZone.id };
        history.current = [...history.current, aimZone.id];

        setTimeout(() => {
            setResults(prev => [...prev, newRes]);
            const msg = outcome === 'goal'
                ? CROWD_CHEERS[Math.floor(Math.random() * CROWD_CHEERS.length)]
                : outcome === 'save'
                    ? CROWD_SAVES[Math.floor(Math.random() * CROWD_SAVES.length)]
                    : '😬 OVER THE BAR!';
            setBanner({ text: msg, type: outcome });
            setShakeClass(outcome === 'goal' ? 'shake-goal' : 'shake-save');
            // Crowd energy
            setCrowdEnergy(e => Math.min(100, outcome === 'goal' ? e + 18 : Math.max(10, e - 8)));
            // Streak
            setStreak(s => outcome === 'goal' ? Math.max(0, s) + 1 : Math.min(0, s) - 1);
            // Pressure increases each shot
            setPressure(p => Math.min(100, p + 15));

            setTimeout(() => {
                setShakeClass('');
                setBanner(null);
                setBallVisible(false);
                setBallPos(null);
                setKeeperDiveZone(null);
                setKeeperLean(null);
                setKeeperCommitted(false);
                setAimZone(null);
                setLockedPower(null);
                const next = shotIndex + 1;
                setShotIndex(next);
                if (next >= 5) setPhase('done');
                else { setPhase('aim'); startCountdown(); }
            }, 2200);
        }, 700);
    }, [phase, aimZone, shooterRating, currentShooter, shotIndex, startCountdown]);

    // Space bar = shoot
    useEffect(() => {
        const h = (e) => { if (e.code === 'Space' && phase === 'power') { e.preventDefault(); handleShoot(); } };
        window.addEventListener('keydown', h);
        return () => window.removeEventListener('keydown', h);
    }, [phase, handleShoot]);

    // Start countdown when phase becomes aim (after setup)
    useEffect(() => {
        if (phase === 'aim' && shotIndex < 5) startCountdown();
        return () => clearInterval(cdRef.current);
    }, [phase, shotIndex]);

    // Auto-start when lineup ready
    useEffect(() => {
        if (isReady && phase === 'setup') { setPhase('aim'); }
    }, [isReady, phase]);

    // Cleanup on unmount
    useEffect(() => () => { clearInterval(cdRef.current); clearInterval(pwrRef.current); }, []);

    const pwrInfo = getPowerLabel(power);
    const shooterColor = currentShooter ? posColor(currentShooter.position) : '#00ff88';

    const handlePick = (p) => {
        if (shooters.some(s => s?.id === p.id)) return;
        const n = [...shooters]; n[activeSlot] = p; setShooters(n);
        if (activeSlot < 4) setActiveSlot(activeSlot + 1);
    };
    const remove = (i) => { const n = [...shooters]; n[i] = null; setShooters(n); setActiveSlot(i); };

    const restart = () => {
        clearInterval(cdRef.current); clearInterval(pwrRef.current);
        setShooters([null, null, null, null, null]); setActiveSlot(0);
        setShotIndex(0); setResults([]); setPhase('setup');
        setAimZone(null); setPower(0); setLockedPower(null);
        setKeeperLean(null); setKeeperDiveZone(null); setKeeperCommitted(false);
        setBanner(null); setShakeClass(''); setBallPos(null); setBallVisible(false);
        setAiComment(''); setCrowdEnergy(40); setPressure(0); setStreak(0);
        history.current = [];
    };

    return (
        <div className={`sp-root ${shakeClass}`}>
            <div className="sp-bg"><div className="sp-bg-img" /><div className="sp-bg-ov" /></div>

            <button className="sp-back" onClick={() => router.back()}><ChevronLeft size={16} />BACK</button>

            {/* TOP BAR */}
            <div className="sp-topbar">
                <div className="sp-tb-left">
                    <div className="sp-title">PENALTY SHOOTOUT</div>
                    {phase !== 'setup' && phase !== 'done' && (
                        <div className="sp-pressure">
                            <span className="sp-pressure-lbl">PRESSURE</span>
                            <div className="sp-pbar"><div className="sp-pbar-fill" style={{ width: `${pressure}%`, background: pressure > 70 ? '#ef4444' : pressure > 40 ? '#f59e0b' : '#00ff88' }} /></div>
                        </div>
                    )}
                </div>
                <div className="sp-score-pill">
                    <span className="sp-score-big">{totalGoals}</span>
                    <span className="sp-score-div">/</span>
                    <span className="sp-score-tot">{Math.min(shotIndex, 5)}</span>
                </div>
                <div className="sp-tb-right">
                    <div className="sp-crowd-lbl">CROWD</div>
                    <div className="sp-pbar"><div className="sp-pbar-fill crowd" style={{ width: `${crowdEnergy}%` }} /></div>
                    {streak >= 2 && <div className="sp-streak">🔥 {streak} IN A ROW</div>}
                </div>
            </div>

            <div className="sp-layout">

                {/* ─── LEFT: LINEUP ─── */}
                <aside className="sp-lineup glass">
                    <div className="sp-panel-hdr"><Target size={14} /><span>SHOOTERS</span></div>
                    {shooters.map((s, i) => {
                        const cur = phase !== 'setup' && i === shotIndex && !isDone;
                        const done = i < shotIndex; const res = results[i];
                        return (
                            <div key={i} className={`sp-slot ${activeSlot === i && phase === 'setup' ? 'sp-slot-active' : ''} ${cur ? 'sp-slot-current' : ''} ${done ? 'sp-slot-done' : ''}`}
                                onClick={() => phase === 'setup' && setActiveSlot(i)}>
                                <div className="sp-slot-num">{i + 1}</div>
                                <div className="sp-slot-av" style={{ '--c': s ? posColor(s.position) : '#444' }}>
                                    {s?.image ? <img src={s.image} alt="" /> : <span>{s ? s.name[0] : '?'}</span>}
                                </div>
                                <div className="sp-slot-info">
                                    <span className="sp-slot-name">{s ? s.name : 'Empty slot'}</span>
                                    {s && <span className="sp-slot-pos" style={{ color: posColor(s.position) }}>{s.position}·{s.rating}</span>}
                                </div>
                                {cur && <Play size={11} className="sp-slot-play" />}
                                {done && res?.outcome === 'goal' && <div className="sp-res-dot goal"><Check size={10} /></div>}
                                {done && res?.outcome !== 'goal' && <div className="sp-res-dot miss"><X size={10} /></div>}
                                {!done && s && phase === 'setup' && <button className="sp-slot-rm" onClick={e => { e.stopPropagation(); remove(i); }}><X size={10} /></button>}
                            </div>
                        );
                    })}
                    {/* Pip row */}
                    <div className="sp-pips">
                        {[0, 1, 2, 3, 4].map(i => (
                            <div key={i} className={`sp-pip ${results[i]?.outcome === 'goal' ? 'pip-g' : results[i]?.outcome ? 'pip-m' : i === shotIndex && !isDone ? 'pip-cur' : ''}`}>
                                {results[i]?.outcome === 'goal' ? <Check size={9} /> : results[i]?.outcome ? <X size={9} /> : i + 1}
                            </div>
                        ))}
                    </div>
                </aside>

                {/* ─── CENTRE: PITCH ─── */}
                <div className="sp-pitch-wrap">

                    {/* Shooter info bar */}
                    {!isDone && currentShooter && (
                        <div className="sp-shooter-bar">
                            <div className="sp-sh-av" style={{ borderColor: shooterColor }}>
                                {currentShooter.image ? <img src={currentShooter.image} alt="" /> : <span>{currentShooter.name[0]}</span>}
                            </div>
                            <div className="sp-sh-info">
                                <span className="sp-sh-name">{currentShooter.name}</span>
                                <span className="sp-sh-pos" style={{ color: shooterColor }}>{currentShooter.position} · {currentShooter.rating} OVR · KICK {shotIndex + 1}/5</span>
                            </div>
                            {phase === 'aim' && <div className={`sp-cd ${countdown <= 2 ? 'sp-cd-red' : ''}`}>{countdown}s</div>}
                        </div>
                    )}

                    {/* GOAL */}
                    <div className="sp-goal-wrap">
                        {/* Keeper lean hint */}
                        {keeperLean && !keeperCommitted && (
                            <div className={`sp-lean sp-lean-${keeperLean}`}>
                                <Shield size={12} /> Keeper leaning {keeperLean}
                            </div>
                        )}

                        <div className="sp-goal">
                            <div className="sp-net" />
                            {/* Posts */}
                            <div className="sp-post sp-post-l" /><div className="sp-post sp-post-r" />
                            <div className="sp-crossbar" />

                            {/* Zone grid */}
                            <div className="sp-zones">
                                {ZONES.map(z => (
                                    <button key={z.id}
                                        className={`sp-zone ${aimZone?.id === z.id ? 'sp-zone-sel' : ''} ${phase !== 'aim' ? 'sp-zone-dis' : ''}`}
                                        onClick={() => handleAimZone(z)}
                                        disabled={phase !== 'aim'}
                                        title={ZONE_LABELS[z.id]}>
                                        {aimZone?.id === z.id && <span className="sp-cross"><span /><span /></span>}
                                    </button>
                                ))}
                            </div>

                            {/* Keeper body */}
                            <div className={`sp-keeper ${keeperCommitted && keeperDiveZone ? `sp-kp-dive-${keeperDiveZone}` : ''}`}>
                                <div className="sp-kp-glow" />
                                <Shield size={18} />
                                <span>GK</span>
                            </div>

                            {/* Ball */}
                            {ballVisible && ballPos && (
                                <div className="sp-ball" style={{ left: `${ballPos.x}%`, top: `${ballPos.y}%` }}>
                                    <div className="sp-ball-inner" />
                                </div>
                            )}

                            {/* Result banner inside goal */}
                            {banner && (
                                <div className={`sp-banner sp-banner-${banner.type}`}>
                                    <span>{banner.text}</span>
                                    {aiComment && <small>{aiComment}</small>}
                                </div>
                            )}
                        </div>

                        {/* Pitch strip below goal */}
                        <div className="sp-pitch-strip">
                            <div className="sp-pbox" /><div className="sp-parc" /><div className="sp-pspot" />
                            <div className={`sp-kicker ${phase === 'shooting' ? 'sp-kicker-shoot' : ''}`}>
                                <div className="sp-kicker-body" /><div className="sp-kicker-legs" />
                            </div>
                        </div>
                    </div>

                    {/* ─── POWER BAR ─── */}
                    {phase === 'power' && (
                        <div className="sp-power-wrap">
                            <div className="sp-power-lbl">
                                <span>AIM: <strong>{ZONE_LABELS[aimZone?.id] || '—'}</strong></span>
                                <span className={`sp-pwr-tag ${pwrInfo.cls}`}>{pwrInfo.label}</span>
                                <span className="sp-power-hint">SPACE or tap to shoot</span>
                            </div>
                            <div className="sp-power-track">
                                <div className="sp-pwr-zone weak" style={{ left: '0%', width: `${PWR_WEAK}%` }} />
                                <div className="sp-pwr-zone good" style={{ left: `${PWR_WEAK}%`, width: `${PWR_GOOD_LO - PWR_WEAK}%` }} />
                                <div className="sp-pwr-zone perfect" style={{ left: `${PWR_GOOD_LO}%`, width: `${PWR_PERFECT_HI - PWR_GOOD_LO}%` }} />
                                <div className="sp-pwr-zone good" style={{ left: `${PWR_PERFECT_HI}%`, width: `${PWR_GOOD_HI - PWR_PERFECT_HI}%` }} />
                                <div className="sp-pwr-zone risky" style={{ left: `${PWR_GOOD_HI}%`, width: `${PWR_OVER - PWR_GOOD_HI}%` }} />
                                <div className="sp-pwr-zone over" style={{ left: `${PWR_OVER}%`, width: `${100 - PWR_OVER}%` }} />
                                <div className="sp-pwr-needle" style={{ left: `${power}%` }} />
                            </div>
                            <button className="sp-shoot-btn" onClick={handleShoot}>
                                <Zap size={20} /> SHOOT!
                            </button>
                        </div>
                    )}

                    {/* Setup hint */}
                    {phase === 'setup' && !isReady && (
                        <div className="sp-hint"><Shield size={13} /> Pick all 5 shooters from your squad to begin</div>
                    )}
                    {phase === 'aim' && (
                        <div className="sp-hint aim"><Target size={13} /> Click a zone in the goal above — power bar appears after</div>
                    )}

                    {/* DONE */}
                    {isDone && (
                        <div className="sp-done glass">
                            <Trophy size={44} className="sp-done-trophy" />
                            <div className="sp-done-score">{totalGoals} / 5</div>
                            <div className="sp-done-msg">
                                {totalGoals >= 5 ? '🏆 PERFECT! LEGENDARY SHOOTOUT!'
                                    : totalGoals >= 4 ? '⭐ EXCELLENT — NEARLY PERFECT!'
                                        : totalGoals >= 3 ? '✅ SOLID — TAKES NERVES OF STEEL'
                                            : totalGoals >= 2 ? '😤 DISAPPOINTING — KEEPER DOMINATED'
                                                : '💥 EMBARRASSING — BACK TO TRAINING'}
                            </div>
                            <div className="sp-done-breakdown">
                                {results.map((r, i) => (
                                    <div key={i} className={`sp-done-row ${r.outcome === 'goal' ? 'dr-goal' : 'dr-miss'}`}>
                                        <span>#{i + 1} {shooters[i]?.name}</span>
                                        <span>{ZONE_LABELS[r.zone]}</span>
                                        <span>PWR {r.power}%</span>
                                        <span className="dr-badge">{r.outcome === 'goal' ? 'GOAL' : r.outcome === 'save' ? 'SAVED' : 'MISSED'}</span>
                                    </div>
                                ))}
                            </div>
                            <button className="sp-restart" onClick={restart}><RotateCcw size={15} /> SHOOT AGAIN</button>
                        </div>
                    )}
                </div>

                {/* ─── RIGHT: SQUAD ─── */}
                <aside className="sp-squad glass">
                    <div className="sp-panel-hdr"><Crown size={14} /><span>SQUAD</span><span className="sp-cnt">{players.length}</span></div>
                    <div className="sp-squad-list">
                        {players.map(p => {
                            const chosen = shooters.some(s => s?.id === p.id);
                            return (
                                <button key={p.id} className={`sp-sq-row ${chosen ? 'sq-chosen' : ''}`}
                                    onClick={() => !chosen && phase === 'setup' && handlePick(p)}
                                    disabled={chosen || phase !== 'setup'}>
                                    <div className="sp-sq-av" style={{ '--c': posColor(p.position) }}>
                                        {p.image ? <img src={p.image} alt="" /> : <span>{p.name[0]}</span>}
                                    </div>
                                    <div className="sp-sq-meta">
                                        <span className="sp-sq-name">{p.name}</span>
                                        <span className="sp-sq-pos" style={{ color: posColor(p.position) }}>{p.position}</span>
                                    </div>
                                    <span className="sp-sq-rtg">{p.rating}</span>
                                    {chosen && <Check size={13} className="sp-sq-chk" />}
                                </button>
                            );
                        })}
                    </div>
                </aside>
            </div>
        </div>
    );
}
