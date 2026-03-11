'use client';

import { motion } from 'framer-motion';
import { useMemo, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Zap, Trophy, Users, Shield, Layers, Play, ChevronRight, Activity, Star, Rocket, Wallet, ArrowLeftRight } from 'lucide-react';
import leagues from '../../data/leagues.json';
import { useAuth } from '@/context/AuthContext';
import { getSafePlayerImage } from '@/lib/playerImage';
import { computeSquadChemistry } from '@/lib/squadChemistry';
import './dashboard.css';

function fmt(n) {
    if (n >= 1_000_000) return `\u00A3${(n / 1_000_000).toFixed(0)}M`;
    return `\u00A3${n}`;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: { type: 'spring', stiffness: 100 }
    }
};

export default function DashboardPage() {
    const router = useRouter();
    const { user, budget, matchHistory, isLoggedIn, isLoading } = useAuth();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [localSnapshot, setLocalSnapshot] = useState({});

    useEffect(() => {
        if (typeof window === 'undefined') return undefined;

        const parse = (key, fallback = null) => {
            try {
                const value = localStorage.getItem(key);
                return value ? JSON.parse(value) : fallback;
            } catch {
                return fallback;
            }
        };

        const syncSnapshot = () => {
            setLocalSnapshot({
                selectedLeague: localStorage.getItem('selectedLeague'),
                selectedTeam: parse('selectedTeam'),
                selectedManager: parse('selectedManager'),
                formation: parse('formation'),
                goalkeeper: parse('goalkeeper'),
                defenders: parse('defenders', []),
                midfielders: parse('midfielders', []),
                forwards: parse('forwards', []),
            });
        };

        syncSnapshot();
        window.addEventListener('storage', syncSnapshot);
        window.addEventListener('squad:updated', syncSnapshot);

        return () => {
            window.removeEventListener('storage', syncSnapshot);
            window.removeEventListener('squad:updated', syncSnapshot);
        };
    }, []);

    useEffect(() => {
        if (!isLoading && !isLoggedIn) {
            router.push('/');
        }
    }, [isLoggedIn, isLoading, router]);

    const leagueId = user?.selectedLeague || localSnapshot?.selectedLeague;
    const team = user?.selectedTeam || localSnapshot?.selectedTeam;
    const manager = user?.selectedManager || localSnapshot?.selectedManager;
    const formation = user?.formation || localSnapshot?.formation;
    const gk = user?.goalkeeper || localSnapshot?.goalkeeper;
    const defs = user?.defenders?.length ? user.defenders : (localSnapshot?.defenders || []);
    const mids = user?.midfielders?.length ? user.midfielders : (localSnapshot?.midfielders || []);
    const fwds = user?.forwards?.length ? user.forwards : (localSnapshot?.forwards || []);

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
        if (!leagueId) return { href: '/league', label: 'Choose League', icon: <Trophy /> };
        if (!team) return { href: '/team-select', label: 'Select Club', icon: <Shield /> };
        if (!manager) return { href: '/manager-select', label: 'Assign Manager', icon: <Users /> };
        if (!formation) return { href: '/formation-select', label: 'Pick Formation', icon: <Layers /> };
        if (!gk) return { href: '/select/goalkeeper', label: 'Select Goalkeeper', icon: <Activity /> };
        if (defs.length < needs.defNeed) return { href: '/select/defenders', label: 'Select Defenders', icon: <Shield /> };
        if (mids.length < needs.midNeed) return { href: '/select/midfielders', label: 'Select Midfielders', icon: <Zap /> };
        if (fwds.length < needs.fwdNeed) return { href: '/select/forwards', label: 'Select Forwards', icon: <Rocket /> };
        return { href: '/summary', label: 'Review Summary', icon: <Star /> };
    }, [leagueId, team, manager, formation, gk, defs, mids, fwds, needs]);

    const chemistry = useMemo(() => {
        return computeSquadChemistry({
            formation,
            gk,
            defenders: defs,
            midfielders: mids,
            forwards: fwds,
        }).score;
    }, [formation, gk, defs, mids, fwds]);

    if (isLoading || !user) return null;

    const name = user?.displayName || user?.userName || user?.username || 'Manager';
    const readiness = Math.min(100, Math.round((needs.totalHave / needs.totalNeed) * 100));
    const ovr = user?.squadOvr || 0;
    const attOvr = ovr ? Math.min(99, ovr + 2) : 0;
    const midOvr = ovr ? Math.max(0, ovr - 1) : 0;
    const defOvr = ovr ? Math.min(99, ovr + 1) : 0;
    const winRate = matchHistory?.length ? Math.round((matchHistory.filter(m => m.score >= 3).length / matchHistory.length) * 100) : 0;

    const handleMouseMove = (e) => {
        if (typeof window !== 'undefined') {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            setMousePos({ x, y });
        }
    };

    return (
        <div className="dashboard-root" onMouseMove={handleMouseMove}>
            <div
                className="dash-stadium-bg parallax-bg"
                style={{ transform: `scale(1.06) translate(${mousePos.x}px, ${mousePos.y}px)` }}
            />
            <div className="dash-grid-overlay" />

            <motion.div
                className="dashboard-container"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <div className="dash-hero">
                    <motion.div variants={itemVariants} className="hero-badge">
                        <Activity size={14} className="text-primary" />
                        <span>COMMAND CENTER ACTIVE • SEASON 24/25</span>
                    </motion.div>
                    <motion.h1 variants={itemVariants} className="dash-title">
                        Welcome back, <span className="text-gradient">{name}</span>
                    </motion.h1>
                    <motion.p variants={itemVariants} className="dash-subtitle">
                        Orchestrate your campaign from the technical area. Track readiness, manage assets, and execute match-day strategies.
                    </motion.p>
                </div>

                <div className="dashboard-layout">
                    {/* Main Control Panel */}
                    <div className="dash-main-section">
                        <motion.div variants={itemVariants} className="section-header">
                            <Trophy size={18} className="text-primary" />
                            <h2>SQUAD IDENTITY</h2>
                        </motion.div>

                        <motion.div variants={itemVariants} className="dash-grid-v2">
                            <div className="dash-card-v2 glass">
                                <div className="card-v2-icon">
                                    {league?.code ? (
                                        <img
                                            src={`https://flagcdn.com/w160/${league.code.toLowerCase().split('-')[0]}.png`}
                                            alt={league.country}
                                            className="ctx-flag shadow-sm"
                                        />
                                    ) : <Trophy size={24} />}
                                </div>
                                <div className="card-v2-content">
                                    <h3>{league ? league.name : 'Choose League'}</h3>
                                    <p>{league ? league.country : 'Federation required'}</p>
                                </div>
                            </div>
                            <div className="dash-card-v2 glass">
                                <div className="card-v2-icon">
                                    {team?.logo ? (
                                        <img src={team.logo} alt={team.name} className="ctx-logo" />
                                    ) : <Shield size={24} />}
                                </div>
                                <div className="card-v2-content">
                                    <h3>{team?.name || 'Select Club'}</h3>
                                    <p>{team?.rating ? `Rating: ${team.rating}` : 'Identity required'}</p>
                                </div>
                            </div>
                            <div className="dash-card-v2 glass">
                                <div className="card-v2-icon">
                                    {manager?.image ? (
                                        <img src={getSafePlayerImage(manager, { proxify: true })} alt={manager.name} className="ctx-manager" />
                                    ) : <Users size={24} />}
                                </div>
                                <div className="card-v2-content">
                                    <h3>{manager?.name || 'Assign Manager'}</h3>
                                    <p>{manager?.style || 'Philosophy needed'}</p>
                                </div>
                            </div>
                            <div className="dash-card-v2 glass">
                                <div className="card-v2-icon"><Layers size={24} /></div>
                                <div className="card-v2-content">
                                    <h3>{formation?.name || 'Set Formation'}</h3>
                                    <p>{formation ? `${formation.name} System` : 'Tactics required'}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div variants={itemVariants} className="section-header mt-12">
                            <Zap size={18} className="text-primary" />
                            <h2>OPERATIONS CENTER</h2>
                        </motion.div>

                        <motion.div variants={itemVariants} className="dash-cta-grid">
                            <Link href={nextStep.href} className="cta-action-card highlight">
                                <div className="cta-icon-box">{nextStep.icon}</div>
                                <div className="cta-info">
                                    <span className="cta-label">NEXT MANDATE</span>
                                    <h3>{nextStep.label}</h3>
                                </div>
                                <ChevronRight className="cta-arrow" />
                            </Link>
                            <div
                                onClick={() => {
                                    if (readiness < 100) {
                                        alert("Make the team first and complete all necessary alignments before entering the Match Arena.");
                                    } else {
                                        router.push('/match');
                                    }
                                }}
                                className="cta-action-card highlight"
                                style={{ cursor: 'pointer' }}
                            >
                                <div className="cta-icon-box" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
                                    <Play size={24} fill="currentColor" />
                                </div>
                                <div className="cta-info">
                                    <span className="cta-label">LIVE ACTION</span>
                                    <h3>Enter Match Arena</h3>
                                </div>
                                <ChevronRight className="cta-arrow" />
                            </div>
                            <Link href="/transfer" className="cta-action-card">
                                <div className="cta-icon-box" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                                    <ArrowLeftRight size={24} />
                                </div>
                                <div className="cta-info">
                                    <span className="cta-label">RECRUITMENT</span>
                                    <h3>Transfer Market</h3>
                                </div>
                                <ChevronRight className="cta-arrow" />
                            </Link>
                            <Link href="/matches" className="cta-action-card">
                                <div className="cta-icon-box" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
                                    <Activity size={24} />
                                </div>
                                <div className="cta-info">
                                    <span className="cta-label">ANALYTICS</span>
                                    <h3>Match History</h3>
                                </div>
                                <ChevronRight className="cta-arrow" />
                            </Link>
                        </motion.div>
                    </div>

                    {/* Status Sidebar */}
                    <motion.div variants={itemVariants} className="dash-sidebar">
                        <div className="section-header">
                            <Activity size={18} className="text-primary" />
                            <h2>VITALS</h2>
                        </div>

                        <div className="status-deck">
                            <div className="progress-widget highlight fifa-rating-card">
                                <div className="widget-header">
                                    <span>SQUAD RATING</span>
                                </div>

                                <div className="fifa-rating-layout">
                                    <div className="fifa-ovr text-gradient">{ovr || '--'}</div>
                                    <div className="fifa-label">Overall</div>

                                    <div className="fifa-sub-stats">
                                        <div className="sub-stat"><span>Attack</span> <strong>{attOvr || '--'}</strong></div>
                                        <div className="sub-stat"><span>Midfield</span> <strong>{midOvr || '--'}</strong></div>
                                        <div className="sub-stat"><span>Defense</span> <strong>{defOvr || '--'}</strong></div>
                                    </div>
                                </div>
                            </div>

                            <div className="info-widget glass">
                                <div className="widget-header">
                                    <span>FINANCES</span>
                                    <Wallet size={14} className={budget < 5000000 ? 'text-red-500' : 'text-primary'} />
                                </div>
                                <h3 className={`widget-val ${budget < 5000000 ? 'text-red-500' : 'text-primary'}`}>
                                    {fmt(budget)}
                                </h3>
                                <p className="widget-desc">Available for sign-on fees</p>
                            </div>

                            <div className="progress-widget glass">
                                <div className="widget-header">
                                    <span>READINESS</span>
                                    <span style={{ color: readiness === 100 ? '#00ff88' : 'white' }}>{readiness}%</span>
                                </div>
                                <div className="widget-bar">
                                    <motion.div
                                        className="bar-fill"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${readiness}%` }}
                                        transition={{ duration: 1, delay: 0.7 }}
                                    ></motion.div>
                                </div>
                                <p className="widget-desc">{needs.totalHave} / {needs.totalNeed} SQUAD FILLED</p>
                            </div>

                            <div className="progress-widget glass">
                                <div className="widget-header">
                                    <span>CHEMISTRY</span>
                                    <span style={{ color: chemistry > 80 ? '#00ff88' : 'white' }}>{chemistry}%</span>
                                </div>
                                <div className="widget-bar">
                                    <motion.div
                                        className="bar-fill"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${chemistry}%` }}
                                        transition={{ duration: 1, delay: 0.9 }}
                                        style={{ background: 'linear-gradient(90deg, #a855f7, #ec4899)' }}
                                    ></motion.div>
                                </div>
                                <p className="widget-desc">Tactical Cohesion</p>
                            </div>

                            <div className="info-widget glass">
                                <div className="widget-header">
                                    <span>PERFORMANCE</span>
                                </div>
                                <div className="dash-momentum-row">
                                    <div className="momentum-stat">
                                        <span className="mom-val">{matchHistory?.length || 0}</span>
                                        <span className="mom-lab">PLD</span>
                                    </div>
                                    <div className="momentum-stat">
                                        <span className="mom-val">{winRate}%</span>
                                        <span className="mom-lab">WIN %</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Explore Arena Footer */}
                <motion.div variants={itemVariants} className="dash-explore-footer">
                    <Link href="/league" className="dash-explore-btn">
                        <div className="explore-glow" />
                        <Rocket size={32} />
                        <span>ENTERING THE ARENA</span>
                        <ChevronRight size={32} />
                    </Link>
                </motion.div>
            </motion.div>

            {!isLoggedIn && (
                <div className="dash-auth-prompt glass">
                    <Shield size={16} />
                    <span>Using Guest Mode. <Link href="/auth">Sign in</Link> to sync your career to the cloud.</span>
                </div>
            )}
        </div>
    );
}




