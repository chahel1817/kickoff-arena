'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Trophy, Users, Shield, Layers, Play, ChevronRight, Activity, Star, Rocket } from 'lucide-react';
import leagues from '../../data/leagues.json';
import './dashboard.css';

export default function DashboardPage() {
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
        const totalNeed = formation ? 1 + defNeed + midNeed + fwdNeed : 11;
        const totalHave = (gk ? 1 : 0) + defs.length + mids.length + fwds.length;
        return { defNeed, midNeed, fwdNeed, totalNeed, totalHave };
    }, [formation, gk, defs, mids, fwds]);

    const nextStep = useMemo(() => {
        if (!leagueId) return { href: '/league', label: 'Choose League' };
        if (!team) return { href: '/team-select', label: 'Select Club' };
        if (!manager) return { href: '/manager-select', label: 'Assign Manager' };
        if (!formation) return { href: '/formation-select', label: 'Pick Formation' };
        if (!gk) return { href: '/select/goalkeeper', label: 'Select Goalkeeper' };
        if (defs.length < needs.defNeed) return { href: '/select/defenders', label: 'Select Defenders' };
        if (mids.length < needs.midNeed) return { href: '/select/midfielders', label: 'Select Midfielders' };
        if (fwds.length < needs.fwdNeed) return { href: '/select/forwards', label: 'Select Forwards' };
        return { href: '/summary', label: 'Review Summary' };
    }, [leagueId, team, manager, formation, gk, defs, mids, fwds, needs]);

    const readiness = Math.min(100, Math.round((needs.totalHave / needs.totalNeed) * 100));

    return (
        <div className="dashboard-container">
            <div className="dash-hero">
                <div className="hero-badge">
                    <Activity size={14} className="text-primary" />
                    <span>COMMAND CENTER ACTIVE</span>
                </div>
                <h1 className="dash-title">
                    Welcome back, <span className="text-gradient">{name}</span>
                </h1>
                <p className="dash-subtitle">
                    Orchestrate your campaign from here. Track squad readiness, tactical identity, and execute next critical maneuvers.
                </p>
            </div>

            <div className="dashboard-layout">
                {/* Main Control Panel */}
                <div className="dash-main-section">
                    <div className="section-header">
                        <Trophy size={18} className="text-primary" />
                        <h2>SQUAD CONFIGURATION</h2>
                    </div>
                    <div className="dash-grid-v2">
                        <div className="dash-card-v2 glass">
                            <div className="card-v2-icon"><Trophy size={20} /></div>
                            <div className="card-v2-content">
                                <h3>{league ? league.name : 'Choose League'}</h3>
                                <p>{league ? league.country : 'Federation selection required.'}</p>
                            </div>
                        </div>
                        <div className="dash-card-v2 glass">
                            <div className="card-v2-icon"><Shield size={20} /></div>
                            <div className="card-v2-content">
                                <h3>{team?.name || 'Select Club'}</h3>
                                <p>{team?.rating ? `Rating ${team.rating}` : 'Pick your crest.'}</p>
                            </div>
                        </div>
                        <div className="dash-card-v2 glass">
                            <div className="card-v2-icon"><Users size={20} /></div>
                            <div className="card-v2-content">
                                <h3>{manager?.name || 'Assign Manager'}</h3>
                                <p>{manager?.style || 'Set philosophy.'}</p>
                            </div>
                        </div>
                        <div className="dash-card-v2 glass">
                            <div className="card-v2-icon"><Layers size={20} /></div>
                            <div className="card-v2-content">
                                <h3>{formation?.name || 'Pick Formation'}</h3>
                                <p>{formation ? `${formation.name} System` : 'Pick tactical base.'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="section-header mt-12">
                        <Zap size={18} className="text-primary" />
                        <h2>OPERATIONS</h2>
                    </div>
                    <div className="dash-cta-grid">
                        <Link href={nextStep.href} className="cta-action-card glass">
                            <div className="cta-icon-box"><Rocket size={24} /></div>
                            <div className="cta-info">
                                <span className="cta-label">PRIORITY ACTION</span>
                                <h3>{nextStep.label}</h3>
                            </div>
                            <ChevronRight className="cta-arrow" />
                        </Link>
                        <Link href="/summary" className="cta-action-card glass">
                            <div className="cta-icon-box"><Layers size={24} /></div>
                            <div className="cta-info">
                                <span className="cta-label">FULL REVIEW</span>
                                <h3>Season Briefing</h3>
                            </div>
                            <ChevronRight className="cta-arrow" />
                        </Link>
                        <Link href="/match" className="cta-action-card glass highlight">
                            <div className="cta-icon-box"><Play size={24} /></div>
                            <div className="cta-info">
                                <span className="cta-label">MATCH HUB</span>
                                <h3>The Match Arena</h3>
                            </div>
                            <ChevronRight className="cta-arrow" />
                        </Link>
                    </div>
                </div>

                {/* Status Sidebar */}
                <div className="dash-sidebar">
                    <div className="section-header">
                        <Activity size={18} className="text-primary" />
                        <h2>STATUS</h2>
                    </div>

                    <div className="status-deck">
                        <div className="progress-widget glass">
                            <div className="widget-header">
                                <span>SQUAD READINESS</span>
                                <span className="highlight-text">{readiness}%</span>
                            </div>
                            <div className="widget-bar">
                                <div className="bar-fill" style={{ width: `${readiness}%` }}></div>
                            </div>
                            <p className="widget-desc">{needs.totalHave} / {needs.totalNeed} Slots Filled</p>
                        </div>

                        <div className="info-widget glass">
                            <div className="widget-header">
                                <span>TACTICAL IDENTITY</span>
                            </div>
                            <h3 className="widget-val">{formation ? formation.name : 'PENDING'}</h3>
                            <p className="widget-desc">System definitions active.</p>
                        </div>

                        <div className="info-widget glass">
                            <div className="widget-header">
                                <span>MOMENTUM</span>
                            </div>
                            <h3 className="widget-val text-primary">RISING</h3>
                            <p className="widget-desc">Pre-season hype building.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
