'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Users, Target, Zap, Shield, TrendingUp, Globe, Star, BarChart3, ChevronDown } from 'lucide-react';
import './entry.css';

export default function EntryPage() {
    const [name, setName] = useState('');
    const router = useRouter();

    const handleStart = (e) => {
        e.preventDefault();
        if (name.trim()) {
            localStorage.setItem('userName', name.trim());
            router.push('/welcome');
        }
    };

    const scrollToJoin = () => {
        const element = document.getElementById('join-section');
        element?.scrollIntoView({ behavior: 'smooth' });
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
                </div>

                <div className="hero-content">
                    <p className="hero-tagline text-300">The Most Advanced Football Career Simulation</p>
                    <div className="scroll-indicator bounce-animation" onClick={scrollToJoin}>
                        <span>Explore the Arena</span>
                        <ChevronDown className="bounce-icon" />
                    </div>
                </div>
            </section>

            {/* FEATURES GRID SECTION */}
            <section className="info-section">
                <div className="features-container">
                    <div className="section-header">
                        <span className="section-label text-600">Core Systems</span>
                        <h2 className="section-title text-700">Built for the Modern Manager</h2>
                    </div>

                    <div className="features-grid">
                        <div className="feature-item">
                            <Trophy className="feature-icon" />
                            <h3 className="text-600">Elite Leagues</h3>
                            <p className="text-400">Dominate the Premier League, La Liga, and more with authentic team structures.</p>
                        </div>
                        <div className="feature-item">
                            <Users className="feature-icon" />
                            <h3 className="text-600">Squad Builder</h3>
                            <p className="text-400">Deep selection system. Scout over 5,000 players to build your dream starting XI.</p>
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
                            <Globe className="card-icon" />
                            <h2 className="text-600">Global Integration</h2>
                        </div>
                        <div className="panel-content">
                            <p className="text-400">
                                Join a massive multiplayer ecosystem where your decisions echo across the globe.
                                Compete in synchronized seasonal tournaments, manage multi-club ownerships,
                                and climb the real-time global leaderboard against thousands of managers.
                            </p>
                            <ul className="feature-bullets">
                                <li className="text-500">• Cross-Continental Leagues</li>
                                <li className="text-500">• Real-time Market Economy</li>
                                <li className="text-500">• Global Manager Rankings</li>
                            </ul>
                        </div>
                    </div>

                    <div className="info-panel-premium glow-green">
                        <div className="panel-header">
                            <Star className="card-icon" />
                            <h2 className="text-600">Pro Scouting Network</h2>
                        </div>
                        <div className="panel-content">
                            <p className="text-400">
                                Our proprietary scouting engine updates weekly with real-world performance metrics.
                                Deploy a network of scouts to every corner of the world to discover the next generation
                                of wonderkids before they hit the mainstream headlines.
                            </p>
                            <ul className="feature-bullets">
                                <li className="text-500">• Real 2026/27 Player Data</li>
                                <li className="text-500">• AI Performance Predictions</li>
                                <li className="text-500">• Dynamic Talent Potential</li>
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
                        <p className="init-desc">Enter your managerial identity to begin your journey across the world's most elite leagues.</p>
                    </div>

                    <form onSubmit={handleStart} className="init-form">
                        <div className="init-input-wrapper">
                            <div className="input-glow-ring"></div>
                            <input
                                type="text"
                                placeholder="Enter Your Manager Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="init-input text-600"
                            />
                        </div>
                        <p className="init-hint">This identity will be used to track your legacy across all competitions.</p>

                        <button
                            type="submit"
                            className={`init-submit text-700 ${!name.trim() ? 'btn-disabled' : ''}`}
                            disabled={!name.trim()}
                        >
                            <span>START YOUR LEGACY</span>
                            <ChevronDown size={18} style={{ transform: 'rotate(-90deg)' }} />
                        </button>

                        <p className="init-enter-hint text-600">Press Enter to continue</p>
                    </form>

                    {/* Trust Stats */}
                    <div className="init-trust-row">
                        <div className="trust-item">
                            <Globe size={14} className="text-primary" />
                            <span>6 Leagues</span>
                        </div>
                        <div className="trust-sep"></div>
                        <div className="trust-item">
                            <Users size={14} className="text-primary" />
                            <span>5,000+ Players</span>
                        </div>
                        <div className="trust-sep"></div>
                        <div className="trust-item">
                            <Shield size={14} className="text-primary" />
                            <span>200+ Clubs</span>
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
            <div className="footer-text">
                <p className="text-300">System v1.0 • Authorized Access • FootballVerse 2026</p>
            </div>

            <style jsx>{`
                .init-card {
                    position: relative;
                    z-index: 10;
                    width: 100%;
                    max-width: 520px;
                    background: rgba(5, 7, 12, 0.85);
                    backdrop-filter: blur(30px);
                    border: 1px solid rgba(0, 255, 136, 0.12);
                    border-radius: 2rem;
                    padding: 3.5rem 3rem;
                    text-align: center;
                    box-shadow: 
                        0 40px 80px rgba(0, 0, 0, 0.6),
                        0 0 60px rgba(0, 255, 136, 0.06),
                        inset 0 1px 0 rgba(255,255,255,0.04);
                }

                .card-top-glow {
                    position: absolute;
                    top: -1px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 60%;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, var(--primary), transparent);
                    border-radius: 10px;
                }

                .init-badge {
                    width: 72px;
                    height: 72px;
                    background: rgba(0, 255, 136, 0.06);
                    border: 1px solid rgba(0, 255, 136, 0.15);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 2rem;
                    position: relative;
                }

                .init-badge-icon {
                    color: var(--primary);
                    filter: drop-shadow(0 0 12px rgba(0, 255, 136, 0.5));
                    z-index: 2;
                }

                .init-badge-ring {
                    position: absolute;
                    inset: -6px;
                    border: 1px solid rgba(0, 255, 136, 0.1);
                    border-radius: 50%;
                    animation: initPulse 2.5s ease-out infinite;
                }

                @keyframes initPulse {
                    0% { transform: scale(1); opacity: 0.4; }
                    100% { transform: scale(1.6); opacity: 0; }
                }

                .init-header {
                    margin-bottom: 2.5rem;
                }

                .init-label {
                    font-size: 0.6rem;
                    font-weight: 900;
                    letter-spacing: 0.3em;
                    color: var(--primary);
                    opacity: 0.6;
                    display: block;
                    margin-bottom: 1rem;
                }

                .init-title {
                    font-size: 2rem;
                    color: white;
                    margin-bottom: 0.75rem;
                    letter-spacing: -0.02em;
                }

                .init-desc {
                    font-size: 0.9rem;
                    color: rgba(255,255,255,0.4);
                    line-height: 1.6;
                    max-width: 380px;
                    margin: 0 auto;
                }

                .init-form {
                    display: flex;
                    flex-direction: column;
                    margin-bottom: 2.5rem;
                }

                .init-input-wrapper {
                    position: relative;
                    margin-bottom: 0.75rem;
                }

                .input-glow-ring {
                    position: absolute;
                    inset: -2px;
                    border-radius: 1rem;
                    opacity: 0;
                    transition: opacity 0.4s;
                    pointer-events: none;
                    background: linear-gradient(135deg, rgba(0,255,136,0.15), transparent, rgba(59,130,246,0.1));
                }

                .init-input-wrapper:focus-within .input-glow-ring {
                    opacity: 1;
                }

                .init-input {
                    width: 100%;
                    padding: 1.1rem 1.5rem;
                    font-size: 1.05rem;
                    text-align: center;
                    text-transform: uppercase;
                    color: white;
                    background: rgba(0, 0, 0, 0.6);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 1rem;
                    outline: none;
                    transition: all 0.4s;
                    font-family: 'Outfit', sans-serif;
                    font-weight: 600;
                    letter-spacing: 0.12em;
                    position: relative;
                    z-index: 1;
                }

                .init-input:focus {
                    border-color: rgba(0, 255, 136, 0.4);
                    background: rgba(0, 0, 0, 0.8);
                    box-shadow: 0 0 30px rgba(0, 255, 136, 0.08);
                }

                .init-input::placeholder {
                    text-transform: none;
                    color: rgba(255, 255, 255, 0.35);
                    opacity: 1;
                    font-weight: 400;
                    letter-spacing: 0.03em;
                }

                .init-hint {
                    font-size: 0.7rem;
                    color: rgba(255,255,255,0.25);
                    font-style: italic;
                    margin-bottom: 1.75rem;
                }

                .init-submit {
                    width: 100%;
                    height: 58px;
                    font-size: 1rem;
                    color: #000;
                    background: linear-gradient(135deg, #00ff88, #22c55e);
                    border-radius: 1rem;
                    border: none;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    text-transform: uppercase;
                    letter-spacing: 0.1em;
                    font-weight: 800;
                    font-family: 'Outfit', sans-serif;
                    box-shadow: 0 10px 30px rgba(0, 255, 136, 0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.75rem;
                }

                .init-submit:hover:not(:disabled) {
                    transform: translateY(-3px) scale(1.02);
                    box-shadow: 0 15px 50px rgba(0, 255, 136, 0.35);
                }

                .init-enter-hint {
                    font-size: 0.6rem;
                    color: rgba(255,255,255,0.2);
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    margin-top: 0.75rem;
                    animation: blink 2.5s infinite;
                }

                .init-trust-row {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 1.25rem;
                    padding: 1.25rem;
                    background: rgba(255,255,255,0.015);
                    border-radius: 16px;
                    border: 1px solid rgba(255,255,255,0.03);
                    margin-bottom: 2rem;
                }

                .trust-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.75rem;
                    font-weight: 700;
                    color: rgba(255,255,255,0.5);
                }

                .trust-sep {
                    width: 1px;
                    height: 16px;
                    background: rgba(255,255,255,0.08);
                }

                .init-progress {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.75rem;
                }

                .progress-dots-row {
                    display: flex;
                    gap: 0.5rem;
                }

                .prog-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.08);
                    transition: 0.3s;
                }

                .prog-dot.active {
                    background: var(--primary);
                    box-shadow: 0 0 12px var(--primary);
                    transform: scale(1.2);
                }

                .progress-text {
                    font-size: 0.65rem;
                    font-weight: 700;
                    color: rgba(255,255,255,0.3);
                    letter-spacing: 0.1em;
                }

                @media (max-width: 768px) {
                    .init-card {
                        padding: 2.5rem 1.75rem;
                        border-radius: 1.5rem;
                        max-width: 95%;
                    }
                    .init-title { font-size: 1.6rem; }
                    .init-trust-row { gap: 0.75rem; padding: 1rem; flex-wrap: wrap; justify-content: center; }
                    .trust-item { font-size: 0.65rem; }
                }
            `}</style>
        </div>
    );
}
