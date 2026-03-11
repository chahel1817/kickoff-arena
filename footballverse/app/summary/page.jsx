'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trophy, Shield, Users, Layers, ChevronRight, Sparkles, Activity, LayoutDashboard, Check } from 'lucide-react';
import leagues from '../../data/leagues.json';
import { getSafePlayerImage } from '@/lib/playerImage';
import './summary.css';

export default function SummaryPage() {
    const router = useRouter();
    const [name, setName] = useState('Manager');
    const [leagueId, setLeagueId] = useState(null);
    const [team, setTeam] = useState(null);
    const [manager, setManager] = useState(null);
    const [formation, setFormation] = useState(null);
    const [gk, setGk] = useState(null);
    const [defs, setDefs] = useState([]);
    const [mids, setMids] = useState([]);
    const [fwds, setFwds] = useState([]);

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        if (storedName) setName(storedName);
        const storedLeague = localStorage.getItem('selectedLeague');
        if (storedLeague) setLeagueId(storedLeague);
        const storedTeam = localStorage.getItem('selectedTeam');
        if (storedTeam) setTeam(JSON.parse(storedTeam));
        const storedManager = localStorage.getItem('selectedManager');
        if (storedManager) setManager(JSON.parse(storedManager));
        const storedFormation = localStorage.getItem('formation');
        if (storedFormation) setFormation(JSON.parse(storedFormation));
        const storedGK = localStorage.getItem('goalkeeper');
        if (storedGK) setGk(JSON.parse(storedGK));
        const storedDefs = localStorage.getItem('defenders');
        if (storedDefs) setDefs(JSON.parse(storedDefs));
        const storedMids = localStorage.getItem('midfielders');
        if (storedMids) setMids(JSON.parse(storedMids));
        const storedFwds = localStorage.getItem('forwards');
        if (storedFwds) setFwds(JSON.parse(storedFwds));
    }, []);

    const league = useMemo(() => {
        if (!leagueId) return null;
        return leagues.find((l) => l.id === leagueId);
    }, [leagueId]);

    const needs = useMemo(() => {
        const defNeed = formation?.defenders || 0;
        const midNeed = formation?.midfielders || 0;
        const fwdNeed = formation?.forwards || 0;
        return {
            gk: gk ? 1 : 0,
            def: defs.length,
            mid: mids.length,
            fwd: fwds.length,
            defNeed,
            midNeed,
            fwdNeed,
            totalNeed: 1 + defNeed + midNeed + fwdNeed,
            totalHave: (gk ? 1 : 0) + defs.length + mids.length + fwds.length,
        };
    }, [formation, gk, defs, mids, fwds]);

    const handleLaunch = () => {
        router.push('/dashboard');
    };

    return (
        <div className="summary-container">
            <div className="summary-hero">
                <div className="hero-badge">
                    <Sparkles size={14} className="text-primary" />
                    <span>SYSTEM INITIALIZED</span>
                </div>
                <h1 className="summary-title">
                    Season Briefing: <span className="text-gradient">{name}</span>
                </h1>
                <p className="summary-subtitle">
                    Review your tactical architecture and club alignment. These parameters define your legacy in the Kickoff Arena.
                </p>
            </div>

            <div className="summary-main-grid">
                {/* Core Identity Section */}
                <div className="summary-left-col">
                    <div className="section-header">
                        <h2>FRONT OFFICE DETAILS</h2>
                    </div>
                    <div className="identity-grid">
                        <div className="identity-card glass shadow-primary">
                            <div className="card-accent" style={{ background: 'var(--primary)' }}></div>
                            <div className="card-icon">
                                {league?.code ? (
                                    <img
                                        src={`https://flagcdn.com/w160/${league.code.toLowerCase().split('-')[0]}.png`}
                                        alt={league.country}
                                        className="sum-flag"
                                    />
                                ) : <Trophy size={20} />}
                            </div>
                            <div className="card-body">
                                <span className="card-label">FEDERATION</span>
                                <h3>{league ? league.name : 'PENDING'}</h3>
                                <p>{league ? league.country : 'Select your region.'}</p>
                            </div>
                            <Link href="/league" className="edit-link">CHANGE</Link>
                        </div>

                        <div className="identity-card glass shadow-blue">
                            <div className="card-accent" style={{ background: '#3b82f6' }}></div>
                            <div className="card-icon">
                                {team?.logo ? (
                                    <img src={team.logo} alt={team.name} className="sum-logo" />
                                ) : <Shield size={20} />}
                            </div>
                            <div className="card-body">
                                <span className="card-label">CLUB CREST</span>
                                <h3>{team?.name || 'PENDING'}</h3>
                                <p>{team?.rating ? `Tier ${team.rating} Alignment` : 'Enlist with a club.'}</p>
                            </div>
                            <Link href="/team-select" className="edit-link">CHANGE</Link>
                        </div>

                        <div className="identity-card glass shadow-purple">
                            <div className="card-accent" style={{ background: '#a855f7' }}></div>
                                <div className="card-icon">
                                {manager?.image ? (
                                    <img src={getSafePlayerImage(manager, { proxify: true })} alt={manager.name} className="sum-manager" />
                                ) : <Users size={20} />}
                            </div>
                            <div className="card-body">
                                <span className="card-label">TECHNICAL LEAD</span>
                                <h3>{manager?.name || 'PENDING'}</h3>
                                <p>{manager?.style || 'Define leadership.'}</p>
                            </div>
                            <Link href="/manager-select" className="edit-link">CHANGE</Link>
                        </div>

                        <div className="identity-card glass shadow-orange">
                            <div className="card-accent" style={{ background: '#f97316' }}></div>
                            <div className="card-icon"><Layers size={20} /></div>
                            <div className="card-body">
                                <span className="card-label">TACTICAL SHIP</span>
                                <h3>{formation?.name || 'PENDING'}</h3>
                                <p>{formation ? `${formation.name} Matrix` : 'Set the shape.'}</p>
                            </div>
                            <Link href="/formation-select" className="edit-link">CHANGE</Link>
                        </div>
                    </div>
                </div>

                {/* Squad Readiness Sidebar */}
                <div className="summary-right-col">
                    <div className="section-header">
                        <h2>SQUAD READINESS</h2>
                    </div>
                    <div className="readiness-panel glass">
                        <div className="readiness-score">
                            <span className="score-val">{needs.totalHave}</span>
                            <span className="score-sep">/</span>
                            <span className="score-total">{needs.totalNeed || 11}</span>
                        </div>
                        <p className="readiness-label">OPERATIONAL ATHLETES</p>

                        <div className="position-breakdown">
                            <div className="pos-step">
                                <span>GK</span>
                                <div className="pos-dots">
                                    <div className={`pos-dot ${needs.gk > 0 ? 'filled' : ''}`}></div>
                                </div>
                            </div>
                            <div className="pos-step">
                                <span>DEF</span>
                                <div className="pos-dots">
                                    {[...Array(needs.defNeed || 4)].map((_, i) => (
                                        <div key={i} className={`pos-dot ${i < needs.def ? 'filled' : ''}`}></div>
                                    ))}
                                </div>
                            </div>
                            <div className="pos-step">
                                <span>MID</span>
                                <div className="pos-dots">
                                    {[...Array(needs.midNeed || 3)].map((_, i) => (
                                        <div key={i} className={`pos-dot ${i < needs.mid ? 'filled' : ''}`}></div>
                                    ))}
                                </div>
                            </div>
                            <div className="pos-step">
                                <span>FWD</span>
                                <div className="pos-dots">
                                    {[...Array(needs.fwdNeed || 3)].map((_, i) => (
                                        <div key={i} className={`pos-dot ${i < needs.fwd ? 'filled' : ''}`}></div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="readiness-cta mt-8">
                            {needs.totalHave < needs.totalNeed ? (
                                <Link href="/select/goalkeeper" className="complete-btn">
                                    <Activity size={16} />
                                    <span>COMPLETE SELECTION</span>
                                </Link>
                            ) : (
                                <div className="status-badge-v3">
                                    <Check size={14} />
                                    SQUAD FULLY OPERATIONAL
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="summary-final-actions mt-8">
                        <button onClick={handleLaunch} className="launch-btn-v2">
                            <span>LAUNCH SEASON</span>
                            <ChevronRight size={20} />
                        </button>
                        <Link href="/dashboard" className="dash-return-link">
                            <LayoutDashboard size={16} />
                            <span>RETURN TO DASHBOARD</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
