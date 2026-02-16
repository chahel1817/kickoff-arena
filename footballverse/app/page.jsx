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
                <div className="main-action">
                    <h2 className="headline text-700">Create Your Manager Profile</h2>

                    <form onSubmit={handleStart} className="entry-form">
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Your Manager Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="name-input text-600"
                            />
                            <p className="input-helper text-400">This name will be used throughout your career.</p>
                        </div>

                        <div className="divider"></div>

                        <div className="button-group">
                            <button
                                type="submit"
                                className={`continue-btn text-700 ${!name.trim() ? 'btn-disabled' : ''}`}
                                disabled={!name.trim()}
                            >
                                START YOUR LEGACY →
                            </button>
                            <p className="enter-hint text-600">Press Enter to continue</p>
                        </div>

                        <div className="progress-indicator">
                            <span className="progress-step text-600">Step 1 of 5</span>
                            <span className="progress-separator">•</span>
                            <span className="progress-label text-500">Create Manager</span>
                        </div>
                    </form>
                </div>
            </section>

            {/* Footer System Text */}
            <div className="footer-text">
                <p className="text-300">System v1.0 • Authorized Access • FootballVerse 2026</p>
            </div>

            {/* Ambient Glows */}
            <div className="glow-left"></div>
            <div className="glow-right"></div>
        </div>
    );
}
