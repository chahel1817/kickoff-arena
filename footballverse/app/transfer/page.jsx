'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeftRight, Search, Check, X, AlertTriangle, Trophy, Zap, RefreshCw } from 'lucide-react';
import { GOALKEEPERS } from '../select/goalkeeper/data';
import { DEFENDERS } from '../select/defenders/data';
import { MIDFIELDERS } from '../select/midfielders/data';
import { FORWARDS } from '../select/forwards/data';

// Lazy-import mid and fwd data pools
const ALL_POOLS = {
    goalkeeper: GOALKEEPERS,
    defenders: DEFENDERS,
    midfielders: MIDFIELDERS,
    forwards: FORWARDS,
};

import { calculatePlayerValue, formatCurrency, getPlayerTier } from '@/lib/valuation';

function fmt(n) {
    return formatCurrency(n);
}


function posColor(pos = '') {
    const u = pos.toUpperCase();
    if (['GK'].some(x => u.includes(x))) return '#f59e0b';
    if (['FW', 'ST', 'LW', 'RW', 'CF'].some(x => u.includes(x))) return '#ef4444';
    if (['MF', 'CM', 'CAM', 'CDM'].some(x => u.includes(x))) return '#a855f7';
    return '#3b82f6';
}

export default function TransferMarketPage() {
    const { user, budget, executeTransfer, isLoggedIn } = useAuth();
    const [tab, setTab] = useState('goalkeeper'); // goalkeeper | defenders | midfielders | forwards
    const [search, setSearch] = useState('');
    const [playerOut, setPlayerOut] = useState(null);
    const [playerIn, setPlayerIn] = useState(null);
    const [confirming, setConfirming] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); // {type, text}
    const [transfers, setTransfers] = useState([]);

    // Squad slots from user context
    const squadSlots = useMemo(() => {
        if (!user) return [];
        if (tab === 'goalkeeper') return user.goalkeeper ? [user.goalkeeper] : [];
        return user[tab] || [];
    }, [user, tab]);

    // Market pool — all players for this position minus already-in-squad
    const squadIds = useMemo(() => new Set(squadSlots.map(p => p?.id)), [squadSlots]);
    const pool = useMemo(() => {
        const base = ALL_POOLS[tab] || [];
        // Filter for players with images to keep UI premium
        return base.filter(p => p.image && !squadIds.has(p.id));
    }, [tab, squadIds]);

    const filtered = useMemo(() => {
        if (!search) return pool;
        const q = search.toLowerCase();
        return pool.filter(p => p.name.toLowerCase().includes(q) || p.club.toLowerCase().includes(q) || p.country?.toLowerCase().includes(q));
    }, [pool, search]);

    useEffect(() => {
        if (user?.transfers) setTransfers(user.transfers);
    }, [user]);

    async function handleConfirmTransfer() {
        if (!playerOut || !playerIn) return;
        setLoading(true);
        setMessage(null);
        try {
            const result = await executeTransfer(tab, playerOut, playerIn);
            setMessage({ type: 'success', text: `✅ ${playerIn.name} signed! Budget: ${fmt(result.budget)}` });
            setTransfers(result.transfers);
            setPlayerOut(null);
            setPlayerIn(null);
            setConfirming(false);
        } catch (err) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setLoading(false);
        }
    }

    const signingFee = useMemo(() => playerIn ? calculatePlayerValue(playerIn.rating) : 0, [playerIn]);
    const canTransfer = budget >= signingFee;
    const tabs = [
        { id: 'goalkeeper', label: 'GK' },
        { id: 'defenders', label: 'DEF' },
        { id: 'midfielders', label: 'MID' },
        { id: 'forwards', label: 'FWD' },
    ];

    return (
        <div className="tm-root">
            <div className="tm-bg" />

            <div className="tm-header">
                <div className="tm-header-left">
                    <div className="tm-header-icon"><ArrowLeftRight size={22} /></div>
                    <div>
                        <h1 className="tm-title">TRANSFER MARKET</h1>
                        <p className="tm-sub">Exchange performance for elite talent</p>
                    </div>
                </div>
                <div className="tm-budget-card">
                    <span className="tm-budget-label">TRANSFER FUNDS</span>
                    <span className={`tm-budget-val ${budget < 1000000 ? 'danger' : ''}`}>{fmt(budget)}</span>
                </div>
            </div>

            {!isLoggedIn && (
                <div className="tm-warn">
                    <AlertTriangle size={18} />
                    <span>Sign in to unlock cloud transfers. Guest transfers are lost on reload.</span>
                </div>
            )}

            {message && (
                <div className={`tm-msg ${message.type}`}>
                    {message.type === 'success' ? <Check size={16} /> : <X size={16} />}
                    {message.text}
                    <button className="tm-msg-close" onClick={() => setMessage(null)}><X size={12} /></button>
                </div>
            )}

            <div className="tm-layout">
                {/* LEFT — Squad */}
                <div className="tm-panel glass">
                    <div className="tm-panel-header">
                        <Trophy size={16} />
                        <span>YOUR SQUAD</span>
                    </div>

                    {/* Position tabs */}
                    <div className="tm-pos-tabs">
                        {tabs.map(t => (
                            <button key={t.id} className={`tm-pos-tab ${tab === t.id ? 'active' : ''}`} onClick={() => { setTab(t.id); setPlayerOut(null); setPlayerIn(null); setSearch(''); }}>
                                {t.label}
                            </button>
                        ))}
                    </div>

                    <div className="tm-squad-list">
                        {squadSlots.length === 0 && (
                            <div className="tm-empty">No players in this slot</div>
                        )}
                        {squadSlots.map(p => p && (
                            <button
                                key={p.id}
                                className={`tm-squad-row ${playerOut?.id === p.id ? 'selected-out' : ''}`}
                                onClick={() => setPlayerOut(prev => prev?.id === p.id ? null : p)}
                            >
                                <div className="tm-sq-av" style={{ borderColor: posColor(p.position) }}>
                                    {p.image ? <img src={p.image} alt="" /> : <span>{p.name[0]}</span>}
                                </div>
                                <div className="tm-sq-info">
                                    <span className="tm-sq-name">{p.name}</span>
                                    <span className="tm-sq-meta" style={{ color: posColor(p.position) }}>{p.position} · {p.club}</span>
                                </div>
                                <span className="tm-sq-ovr">{p.rating}</span>
                                {playerOut?.id === p.id && <div className="tm-out-badge">OUT</div>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* CENTRE arrow */}
                <div className="tm-arrow-col">
                    <div className="tm-swap-icon"><RefreshCw size={24} /></div>
                    {playerOut && playerIn && (
                        <button
                            className="tm-confirm-btn"
                            onClick={() => setConfirming(true)}
                            disabled={!canTransfer}
                        >
                            <Zap size={16} />
                            CONFIRM
                        </button>
                    )}
                    {!canTransfer && <span className="tm-no-budget">Insufficient budget</span>}
                </div>

                {/* RIGHT — Market */}
                <div className="tm-panel glass">
                    <div className="tm-panel-header">
                        <Search size={16} />
                        <span>AVAILABLE PLAYERS</span>
                    </div>
                    <div className="tm-search-wrap">
                        <Search size={16} className="tm-s-icon" />
                        <input className="tm-search" placeholder="Search name, club, country…" value={search} onChange={e => setSearch(e.target.value)} />
                        {search && <button className="tm-s-clear" onClick={() => setSearch('')}><X size={14} /></button>}
                    </div>
                    <div className="tm-market-list">
                        {filtered.length === 0 && <div className="tm-empty">No players found</div>}
                        {filtered.slice(0, 40).map(p => (
                            <button
                                key={p.id}
                                className={`tm-squad-row ${playerIn?.id === p.id ? 'selected-in' : ''}`}
                                onClick={() => setPlayerIn(prev => prev?.id === p.id ? null : p)}
                                disabled={!playerOut}
                            >
                                <div className="tm-sq-av" style={{ borderColor: posColor(p.position) }}>
                                    {p.image ? <img src={p.image} alt="" /> : <span>{p.name[0]}</span>}
                                </div>
                                <div className="tm-sq-info">
                                    <span className="tm-sq-name">{p.name}</span>
                                    <span className="tm-sq-meta" style={{ color: posColor(p.position) }}>{p.position} · {p.club} · {getPlayerTier(p.rating)}</span>
                                </div>
                                <div className="tm-sq-valuation">
                                    <span className="tm-sq-ovr">{p.rating}</span>
                                    <span className="tm-market-price">{fmt(calculatePlayerValue(p.rating))}</span>
                                </div>
                                {playerIn?.id === p.id && <div className="tm-in-badge">IN</div>}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Transfer History */}
            {transfers.length > 0 && (
                <div className="tm-history glass">
                    <h3 className="tm-hist-title"><ArrowLeftRight size={16} /> TRANSFER LOG</h3>
                    <div className="tm-hist-list">
                        {[...transfers].reverse().slice(0, 10).map((t, i) => (
                            <div key={i} className="tm-hist-row">
                                <div className="tm-hist-out">
                                    <span className="tm-hist-dir out">OUT</span>
                                    <span>{t.playerOut?.name}</span>
                                    <span className="tm-hist-ovr">{t.playerOut?.rating}</span>
                                </div>
                                <ArrowLeftRight size={14} className="tm-hist-arrow" />
                                <div className="tm-hist-in">
                                    <span className="tm-hist-dir in">IN</span>
                                    <span>{t.playerIn?.name}</span>
                                    <span className="tm-hist-ovr">{t.playerIn?.rating}</span>
                                </div>
                                <span className="tm-hist-fee">{fmt(t.playerIn?.fee || TRANSFER_FEE)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Confirm Modal */}
            {confirming && playerOut && playerIn && (
                <div className="tm-modal-overlay">
                    <div className="tm-modal glass">
                        <h3 className="tm-modal-title">Confirm Transfer</h3>
                        <div className="tm-modal-deal">
                            <div className="tm-modal-player out">
                                <div className="tm-modal-av">
                                    {playerOut.image ? <img src={playerOut.image} alt="" /> : <span>{playerOut.name[0]}</span>}
                                </div>
                                <span className="tm-modal-name">{playerOut.name}</span>
                                <span className="tm-modal-badge out">SOLD</span>
                            </div>
                            <div className="tm-modal-fee">{fmt(signingFee)}</div>
                            <div className="tm-modal-player in">
                                <div className="tm-modal-av">
                                    {playerIn.image ? <img src={playerIn.image} alt="" /> : <span>{playerIn.name[0]}</span>}
                                </div>
                                <span className="tm-modal-name">{playerIn.name}</span>
                                <span className="tm-modal-badge in">SIGNED</span>
                            </div>
                        </div>
                        <p className="tm-modal-sub">Budget after: <strong>{fmt(budget - signingFee)}</strong></p>
                        <div className="tm-modal-btns">
                            <button className="tm-modal-cancel" onClick={() => setConfirming(false)}>Cancel</button>
                            <button className="tm-modal-go" onClick={handleConfirmTransfer} disabled={loading}>
                                {loading ? 'Processing…' : '✅ Confirm Deal'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .tm-root { min-height:100vh; background:#02040a; padding:2rem; }
                .tm-bg { position:fixed; inset:0; background:radial-gradient(ellipse 80% 50% at 50% 0%, rgba(245,158,11,0.05) 0%, transparent 70%); pointer-events:none; }
                .tm-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem; flex-wrap:wrap; gap:1rem; }
                .tm-header-left { display:flex; align-items:center; gap:1rem; }
                .tm-header-icon { width:52px; height:52px; border-radius:16px; background:rgba(245,158,11,0.1); border:1px solid rgba(245,158,11,0.25); display:flex; align-items:center; justify-content:center; color:#f59e0b; }
                .tm-title { font-size:1.8rem; font-weight:950; color:white; letter-spacing:-.02em; }
                .tm-sub { font-size:.75rem; color:rgba(255,255,255,.3); font-weight:600; }
                .tm-budget-card { padding:.75rem 2rem; border-radius:20px; background:rgba(245,158,11,0.06); border:1px solid rgba(245,158,11,0.2); text-align:right; }
                .tm-budget-label { display:block; font-size:.5rem; font-weight:900; color:rgba(245,158,11,.5); letter-spacing:.2em; margin-bottom:.25rem; }
                .tm-budget-val { font-size:1.6rem; font-weight:950; color:#f59e0b; }
                .tm-budget-val.danger { color:#ef4444; }
                .tm-warn { display:flex; align-items:center; gap:.75rem; padding:1rem 1.5rem; border-radius:16px; background:rgba(245,158,11,0.06); border:1px solid rgba(245,158,11,0.2); color:rgba(245,158,11,.8); font-size:.8rem; font-weight:700; margin-bottom:1.5rem; }
                .tm-msg { display:flex; align-items:center; gap:.75rem; padding:.9rem 1.5rem; border-radius:16px; font-size:.85rem; font-weight:700; margin-bottom:1.5rem; position:relative; }
                .tm-msg.success { background:rgba(0,255,136,.07); border:1px solid rgba(0,255,136,.2); color:#00ff88; }
                .tm-msg.error { background:rgba(239,68,68,.07); border:1px solid rgba(239,68,68,.2); color:#f87171; }
                .tm-msg-close { position:absolute; right:1rem; background:none; border:none; cursor:pointer; opacity:.5; color:inherit; }
                .tm-layout { display:grid; grid-template-columns:1fr 80px 1fr; gap:1.5rem; align-items:start; }
                .tm-panel { border-radius:24px; border:1px solid rgba(255,255,255,.07); background:rgba(8,10,20,.7); padding:1.5rem; overflow:hidden; }
                .tm-panel-header { display:flex; align-items:center; gap:.5rem; font-size:.6rem; font-weight:900; color:rgba(255,255,255,.35); letter-spacing:.15em; margin-bottom:1rem; }
                .tm-pos-tabs { display:flex; gap:.5rem; margin-bottom:1.25rem; }
                .tm-pos-tab { flex:1; padding:.5rem; border-radius:10px; font-size:.65rem; font-weight:900; cursor:pointer; border:1px solid rgba(255,255,255,.06); background:rgba(255,255,255,.03); color:rgba(255,255,255,.35); transition:.2s; }
                .tm-pos-tab.active { background:rgba(245,158,11,.1); border-color:rgba(245,158,11,.3); color:#f59e0b; }
                .tm-squad-list, .tm-market-list { display:flex; flex-direction:column; gap:.5rem; max-height:520px; overflow-y:auto; }
                .tm-squad-row { display:flex; align-items:center; gap:.75rem; padding:.65rem .75rem; border-radius:14px; background:rgba(255,255,255,.02); border:1px solid rgba(255,255,255,.04); cursor:pointer; transition:.25s; text-align:left; position:relative; }
                .tm-squad-row:hover { background:rgba(255,255,255,.05); border-color:rgba(255,255,255,.1); }
                .tm-squad-row.selected-out { background:rgba(239,68,68,.08); border-color:rgba(239,68,68,.35); }
                .tm-squad-row.selected-in { background:rgba(0,255,136,.07); border-color:rgba(0,255,136,.35); }
                .tm-squad-row:disabled { opacity:.4; cursor:not-allowed; }
                .tm-sq-av { width:38px; height:38px; border-radius:10px; overflow:hidden; border:2px solid; flex-shrink:0; display:flex; align-items:center; justify-content:center; background:rgba(255,255,255,.05); color:rgba(255,255,255,.5); font-weight:900; font-size:.8rem; }
                .tm-sq-av img { width:100%; height:100%; object-fit:cover; }
                .tm-sq-info { flex:1; display:flex; flex-direction:column; }
                .tm-sq-name { font-size:.85rem; font-weight:800; color:white; }
                .tm-sq-meta { font-size:.6rem; font-weight:700; }
                .tm-sq-valuation { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
                .tm-sq-ovr { font-size:1rem; font-weight:950; color:rgba(255,255,255,.6); font-style:italic; }
                .tm-market-price { font-size: 0.65rem; font-weight: 900; color: #f59e0b; }
                .tm-out-badge,.tm-in-badge { position:absolute; top:.4rem; right:.4rem; font-size:.5rem; font-weight:900; padding:.15rem .4rem; border-radius:4px; }
                .tm-out-badge { background:rgba(239,68,68,.15); color:#ef4444; border:1px solid rgba(239,68,68,.3); }
                .tm-in-badge { background:rgba(0,255,136,.1); color:#00ff88; border:1px solid rgba(0,255,136,.3); }
                .tm-arrow-col { display:flex; flex-direction:column; align-items:center; gap:1rem; padding-top:4rem; }
                .tm-swap-icon { width:52px; height:52px; border-radius:50%; background:rgba(245,158,11,.08); border:1px solid rgba(245,158,11,.2); display:flex; align-items:center; justify-content:center; color:#f59e0b; }
                .tm-confirm-btn { display:flex; align-items:center; gap:.5rem; padding:.65rem 1rem; border-radius:14px; background:linear-gradient(135deg,#f59e0b,#fbbf24); color:#000; font-size:.65rem; font-weight:950; border:none; cursor:pointer; transition:.25s; letter-spacing:.05em; }
                .tm-confirm-btn:hover { transform:scale(1.05); box-shadow:0 8px 25px rgba(245,158,11,.4); }
                .tm-confirm-btn:disabled { opacity:.5; cursor:not-allowed; }
                .tm-no-budget { font-size:.55rem; font-weight:800; color:#ef4444; text-align:center; }
                .tm-search-wrap { position:relative; margin-bottom:1rem; }
                .tm-s-icon { position:absolute; left:.9rem; top:50%; transform:translateY(-50%); color:rgba(255,255,255,.25); }
                .tm-search { width:100%; padding:.75rem .75rem .75rem 2.5rem; border-radius:12px; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,.07); color:white; font-size:.85rem; outline:none; }
                .tm-search::placeholder { color:rgba(255,255,255,.2); }
                .tm-s-clear { position:absolute; right:.75rem; top:50%; transform:translateY(-50%); background:none; border:none; color:rgba(255,255,255,.3); cursor:pointer; }
                .tm-empty { padding:2rem; text-align:center; color:rgba(255,255,255,.2); font-size:.75rem; font-weight:700; }
                /* History */
                .tm-history { border-radius:24px; margin-top:2rem; padding:1.5rem; border:1px solid rgba(255,255,255,.07); background:rgba(8,10,20,.7); }
                .tm-hist-title { display:flex; align-items:center; gap:.5rem; font-size:.65rem; font-weight:900; color:rgba(255,255,255,.3); letter-spacing:.15em; margin-bottom:1rem; }
                .tm-hist-list { display:flex; flex-direction:column; gap:.5rem; }
                .tm-hist-row { display:flex; align-items:center; gap:1rem; padding:.6rem 1rem; border-radius:12px; background:rgba(255,255,255,.02); border:1px solid rgba(255,255,255,.04); font-size:.8rem; }
                .tm-hist-out,.tm-hist-in { display:flex; align-items:center; gap:.5rem; flex:1; }
                .tm-hist-dir { font-size:.55rem; font-weight:900; padding:.15rem .4rem; border-radius:4px; }
                .tm-hist-dir.out { background:rgba(239,68,68,.1); color:#ef4444; }
                .tm-hist-dir.in { background:rgba(0,255,136,.08); color:#00ff88; }
                .tm-hist-arrow { color:rgba(255,255,255,.2); }
                .tm-hist-ovr { font-size:.7rem; font-weight:900; color:rgba(255,255,255,.4); font-style:italic; margin-left:auto; }
                .tm-hist-fee { font-size:.7rem; font-weight:900; color:#f59e0b; }
                /* Modal */
                .tm-modal-overlay { position:fixed; inset:0; z-index:9999; background:rgba(0,0,0,.7); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; }
                .tm-modal { border-radius:28px; padding:2.5rem; max-width:500px; width:90%; border:1px solid rgba(255,255,255,.12); background:rgba(10,12,24,.95); }
                .tm-modal-title { font-size:1.4rem; font-weight:950; color:white; text-align:center; margin-bottom:1.5rem; }
                .tm-modal-deal { display:flex; align-items:center; justify-content:space-between; gap:.5rem; margin-bottom:1.25rem; }
                .tm-modal-player { display:flex; flex-direction:column; align-items:center; gap:.5rem; flex:1; }
                .tm-modal-av { width:60px; height:60px; border-radius:14px; overflow:hidden; border:2px solid rgba(255,255,255,.15); }
                .tm-modal-av img { width:100%; height:100%; object-fit:cover; }
                .tm-modal-name { font-size:.8rem; font-weight:800; color:white; text-align:center; }
                .tm-modal-badge { font-size:.55rem; font-weight:900; padding:.2rem .6rem; border-radius:6px; }
                .tm-modal-badge.out { background:rgba(239,68,68,.1); color:#ef4444; border:1px solid rgba(239,68,68,.3); }
                .tm-modal-badge.in { background:rgba(0,255,136,.08); color:#00ff88; border:1px solid rgba(0,255,136,.3); }
                .tm-modal-fee { font-size:1.2rem; font-weight:950; color:#f59e0b; }
                .tm-modal-sub { text-align:center; font-size:.8rem; color:rgba(255,255,255,.4); margin-bottom:1.5rem; }
                .tm-modal-sub strong { color:white; }
                .tm-modal-btns { display:flex; gap:1rem; }
                .tm-modal-cancel { flex:1; padding:.85rem; border-radius:14px; background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1); color:rgba(255,255,255,.6); font-weight:800; font-size:.85rem; cursor:pointer; transition:.2s; }
                .tm-modal-cancel:hover { background:rgba(255,255,255,.1); }
                .tm-modal-go { flex:2; padding:.85rem; border-radius:14px; background:linear-gradient(135deg,#00ff88,#059669); color:#01160d; font-weight:950; font-size:.9rem; border:none; cursor:pointer; transition:.2s; }
                .tm-modal-go:hover { box-shadow:0 8px 25px rgba(0,255,136,.3); transform:translateY(-1px); }
                .tm-modal-go:disabled { opacity:.6; cursor:not-allowed; }
                @media(max-width:768px) { .tm-layout { grid-template-columns:1fr; } .tm-arrow-col { flex-direction:row; padding-top:0; } }
            `}</style>
        </div>
    );
}
