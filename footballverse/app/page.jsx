'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Users, Target, Zap, Shield, TrendingUp, Globe, Star, ChevronDown, ArrowRight, LogIn } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import './entry.css';

export default function EntryPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // If user is logged in, redirect to dashboard
        if (user !== undefined) {
            setLoading(false);
            if (user) {
                router.push('/dashboard');
            }
        }
    }, [user, router]);

    if (loading || user !== undefined && user !== null) {
        return null; // Show nothing while redirecting
    }

    const scrollToJoin = () => {
        const element = document.getElementById('join-section');
        element?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleAuthClick = () => {
        router.push('/auth');
    };

    return (
        <div className="entry-page">
            {/* Stadium Background */}
            <div className="stadium-bg"></div>
            <div className="overlay-gradient"></div>
            <div className="hud-border"></div>

            {/* HERO SECTION - FIRST FOLD */}
            <section className="hero-fold">
                <div className="logo-section">
                    <h1 className="logo-kickoff text-700">KICKOFF</h1>
                    <h1 className="logo-arena text-700">ARENA</h1>
                    <p className="hero-tagline text-300">The Most Advanced Football Career Simulation</p>
                </div>

                {/* Hero Stats — centered middle */}
                <div className="hero-stats-row">
                    <div className="hero-stat-item">
                        <span className="hero-stat-value">10</span>
                        <span className="hero-stat-label">Elite Leagues</span>
                    </div>
                    <div className="hero-stat-sep"></div>
                    <div className="hero-stat-item">
                        <span className="hero-stat-value">350+</span>
                        <span className="hero-stat-label">Players</span>
                    </div>
                    <div className="hero-stat-sep"></div>
                    <div className="hero-stat-item">
                        <span className="hero-stat-value">150+</span>
                        <span className="hero-stat-label">Clubs</span>
                    </div>
                    <div className="hero-stat-sep"></div>
                    <div className="hero-stat-item">
                        <span className="hero-stat-value">6</span>
                        <span className="hero-stat-label">Formations</span>
                    </div>
                </div>

                {/* Explore button always at bottom of hero */}
                <div className="hero-content">
                    <div className="explore-cta-wrapper">
                        <div className="explore-line"></div>
                        <button
                            type="button"
                            className="explore-btn-premium"
                            onClick={scrollToJoin}
                            aria-label="Initialize your management career"
                        >
                            <span className="explore-btn-orbital"></span>
                            <span className="explore-btn-glow"></span>
                            <span className="explore-btn-label">LAUNCH CAREER</span>
                            <span className="explore-btn-arrow">
                                <ArrowRight size={18} className="pulse-icon" />
                            </span>
                        </button>
                        <div className="explore-line"></div>

                    </div>
                    <p className="explore-hint">Scroll to begin your managerial journey</p>
                </div>
            </section>

            {/* FEATURES GRID SECTION */}
            <section id="features-section" className="info-section">
                <div className="features-container">
                    <div className="section-header">
                        <span className="section-label text-600">Core Systems</span>
                        <h2 className="section-title text-700">Built for the Modern Manager</h2>
                    </div>

                    <div className="features-grid">
                        <div className="feature-item">
                            <Trophy className="feature-icon" />
                            <h3 className="text-600">Elite Leagues</h3>
                            <p className="text-400">Dominate the Premier League, La Liga, and 8 other elite leagues.</p>
                        </div>
                        <div className="feature-item">
                            <Users className="feature-icon" />
                            <h3 className="text-600">Squad Builder</h3>
                            <p className="text-400">Deep selection system. Scout over 350+ elite players to build your dream starting XI.</p>
                        </div>
                        <div className="feature-item">
                            <Target className="feature-icon" />
                            <h3 className="text-600">Tactical Setup</h3>
                            <p className="text-400">Control every movement. Define formations, set pieces, and team mentalities.</p>
                        </div>
                        <div className="feature-item">
                            <Zap className="feature-icon" />
                            <h3 className="text-600">Live Matches</h3>
                            <p className="text-400">Experience real-time match simulation with advanced AI-driven decision making.</p>
                        </div>
                        <div className="feature-item">
                            <Shield className="feature-icon" />
                            <h3 className="text-600">Manager Mode</h3>
                            <p className="text-400">Step into the shoes of legendary coaches or forge your own unique managerial path.</p>
                        </div>
                        <div className="feature-item">
                            <TrendingUp className="feature-icon" />
                            <h3 className="text-600">Progress Track</h3>
                            <p className="text-400">Comprehensive analytics dashboard to monitor player stats and club finances.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* DEEP DIVE SECTION - PREMIUM FEATURES */}
            <section className="deep-dive">
                <div className="section-header mb-12" style={{ textAlign: 'center' }}>
                    <span className="section-label text-600">Pro Management</span>
                    <h2 className="section-title text-700">Experience Global Football</h2>
                </div>

                <div className="info-panel-grid">
                    <div className="info-panel-premium glow-blue">
                        <div className="panel-header">
                            <Star className="card-icon" style={{ color: '#f59e0b', filter: 'drop-shadow(0 0 12px rgba(245,158,11,0.4))' }} />
                            <h2 className="text-600">Legendary Icons</h2>
                        </div>
                        <div className="panel-content">
                            <p className="text-400">
                                Forge your legacy with a mix of modern superstars and legendary icons of the game.
                                From Pelé and Maradona to Messi and Ronaldo, the entire history of football is
                                integrated into your team selection process.
                            </p>
                            <ul className="feature-bullets">
                                <li className="text-500">• All-Time Greats</li>
                                <li className="text-500">• Historic Peak Ratings</li>
                                <li className="text-500">• Iconic Specialist Skills</li>
                            </ul>
                        </div>
                    </div>

                    <div className="info-panel-premium glow-green">
                        <div className="panel-header">
                            <Zap className="card-icon" style={{ color: '#00ff88', filter: 'drop-shadow(0 0 12px rgba(0,255,136,0.4))' }} />
                            <h2 className="text-600">Match Day Arena</h2>
                        </div>
                        <div className="panel-content">
                            <p className="text-400">
                                Take your dream squad into the arena and test your skill in high-pressure
                                environments. From clinical penalty shootouts to tactical simulations,
                                your squad&apos;s chemistry and individual talent are put to the ultimate test.
                            </p>
                            <ul className="feature-bullets">
                                <li className="text-500">• Interactive Mini-Games</li>
                                <li className="text-500">• Skill-Based Performance</li>
                                <li className="text-500">• Clinical Finish Training</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* ENTRY ACTION SECTION - THE FINAL FOLD */}
            <section id="join-section" className="join-fold">
                <div className="join-bg"></div>

                <div className="init-card">
                    {/* Decorative top glow line */}
                    <div className="card-top-glow"></div>

                    {/* Badge */}
                    <div className="init-badge">
                        <Trophy size={28} className="init-badge-icon" />
                        <div className="init-badge-ring"></div>
                    </div>

                    <div className="init-header">
                        <span className="init-label">SYSTEM AUTHORIZATION</span>
                        <h2 className="init-title text-700">Initialize Your <span className="text-gradient">Account</span></h2>
                        <p className="init-desc">Enter your managerial identity to begin your journey across the world&apos;s most elite leagues.</p>
                    </div>

                    <form className="init-form">
                        <div className="auth-cta-content">
                            <h3 className="text-600" style={{ marginBottom: '1rem' }}>Ready to Manage?</h3>
                            <p className="init-hint" style={{ marginBottom: '2rem' }}>
                                Create your account to build your dream squad and compete across elite leagues worldwide.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleAuthClick}
                            className="init-submit text-700"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                        >
                            <LogIn size={18} />
                            <span>Sign In / Register</span>
                        </button>

                        <p className="init-enter-hint">Join thousands of managers competing worldwide</p>
                    </form>

                    {/* Trust Stats */}
                    <div className="init-trust-row">
                        <div className="trust-item">
                            <Globe size={14} className="text-primary" />
                            <span>10 Leagues</span>
                        </div>
                        <div className="trust-sep"></div>
                        <div className="trust-item">
                            <Users size={14} className="text-primary" />
                            <span>350+ Players</span>
                        </div>
                        <div className="trust-sep"></div>
                        <div className="trust-item">
                            <Shield size={14} className="text-primary" />
                            <span>150+ Clubs</span>
                        </div>
                    </div>

                    <div className="init-progress">
                        <div className="progress-dots-row">
                            <div className="prog-dot active"></div>
                            <div className="prog-dot"></div>
                            <div className="prog-dot"></div>
                            <div className="prog-dot"></div>
                            <div className="prog-dot"></div>
                        </div>
                        <span className="progress-text">Step 1 of 5 • Account Setup</span>
                    </div>
                </div>
            </section>

            {/* Footer System Text */}
            <div className="footer-exploration">
                <div className="exploration-divider"></div>
                <button
                    type="button"
                    className="explore-btn-pillar"
                    onClick={() => {
                        const el = document.getElementById('features-section');
                        el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                >
                    <span className="pillar-halo"></span>
                    <Trophy size={20} className="pillar-icon" />
                    <span>EXPLORE THE ARENA</span>
                    <ChevronDown size={20} />
                </button>
                <div className="footer-info">
                    <p className="text-300">System v1.0 • Authorized Access • Kickoff Arena 2026</p>
                </div>
            </div>
        </div>
    );
}

