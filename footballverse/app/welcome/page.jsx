'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, ChevronRight, Shield, Zap, Star, Activity, Rocket } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import '../entry.css';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
};

export default function WelcomeScreen() {
    const router = useRouter();
    const { user, isLoggedIn, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !isLoggedIn) {
            router.push('/');
        }
    }, [isLoggedIn, isLoading, router]);

    const handleContinue = () => {
        router.push('/league');
    };

    if (isLoading || !user) return null;

    const name = user?.displayName || user?.userName || user?.username || 'Manager';

    return (
        <div className="entry-page welcome-root">
            {/* Cinematic Background Elements */}
            <div className="stadium-bg" />
            <div className="stadium-overlay" />
            <div className="light-beam lb-1" />
            <div className="light-beam lb-2" />
            <div className="grid-pattern" />

            <motion.section
                className="welcome-box glass"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                <motion.div variants={itemVariants} className="welcome-header">
                    <div className="welcome-badge-v2">
                        <Trophy size={40} className="trophy-icon" />
                        <div className="badge-glow" />
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="welcome-titles">
                    <h2 className="welcome-main-title">
                        Welcome, <span className="text-gradient">{name}</span>
                    </h2>
                    <h3 className="welcome-sub-title">YOUR LEGACY BEGINS AT KICKOFF ARENA</h3>
                </motion.div>

                <motion.p variants={itemVariants} className="welcome-description-v2">
                    The board has authorized your credentials. You are now the Architect of Destiny.
                    Navigate the leagues, sign world-class talent, and etch your name into football history.
                </motion.p>

                <motion.div variants={itemVariants} className="welcome-analytics-row">
                    <div className="welcome-analytic">
                        <Shield className="analytic-icon" />
                        <div className="analytic-info">
                            <span className="val">150+</span>
                            <span className="lab">CLUBS</span>
                        </div>
                    </div>
                    <div className="analytic-divider" />
                    <div className="welcome-analytic">
                        <Activity className="analytic-icon" />
                        <div className="analytic-info">
                            <span className="val">LIVE</span>
                            <span className="lab">MATCHES</span>
                        </div>
                    </div>
                    <div className="analytic-divider" />
                    <div className="welcome-analytic">
                        <Rocket className="analytic-icon" />
                        <div className="analytic-info">
                            <span className="val">0.0</span>
                            <span className="lab">BUDGET</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div variants={itemVariants} className="welcome-actions">
                    <button onClick={handleContinue} className="embark-btn">
                        <span>INITIATE CAREER PROTOCOL</span>
                        <ChevronRight size={24} />
                        <div className="btn-glow" />
                    </button>
                </motion.div>

                <motion.div variants={itemVariants} className="induction-footer">
                    <div className="footer-step">
                        <span className="step-num">PHASE 02</span>
                        <span className="step-label">INDUCTION COMPLETE</span>
                    </div>
                    <div className="footer-progress">
                        <div className="p-bar"><div className="p-fill" /></div>
                    </div>
                </motion.div>
            </motion.section>

            <style jsx>{`
                .welcome-root {
                    position: relative;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: #050b10;
                    overflow: hidden;
                    padding: 2rem;
                }

                .stadium-bg {
                    position: fixed;
                    inset: 0;
                    background-image: url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2070&auto=format&fit=crop');
                    background-size: cover;
                    background-position: center;
                    filter: brightness(0.1) saturate(1.5) blur(4px);
                    z-index: 0;
                }

                .stadium-overlay {
                    position: fixed;
                    inset: 0;
                    background: radial-gradient(circle at center, transparent 0%, #050b10 80%),
                                linear-gradient(to bottom, rgba(0, 255, 136, 0.05) 0%, transparent 100%);
                    z-index: 1;
                }

                .light-beam {
                    position: fixed;
                    width: 40vw;
                    height: 100vh;
                    background: linear-gradient(to bottom, rgba(0, 255, 136, 0.08), transparent);
                    top: -20vh;
                    z-index: 2;
                    filter: blur(100px);
                    transform: rotate(-15deg);
                }

                .lb-1 { left: -10vw; }
                .lb-2 { right: -10vw; scale: -1 1; }

                .grid-pattern {
                    position: fixed;
                    inset: 0;
                    background-image: linear-gradient(rgba(0, 255, 136, 0.03) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(0, 255, 136, 0.03) 1px, transparent 1px);
                    background-size: 80px 80px;
                    z-index: 3;
                    mask-image: radial-gradient(circle at center, black 0%, transparent 80%);
                }

                .welcome-box {
                    position: relative;
                    z-index: 10;
                    width: 100%;
                    max-width: 680px;
                    padding: 4rem;
                    border-radius: 48px;
                    text-align: center;
                    background: rgba(10, 15, 25, 0.7);
                    backdrop-filter: blur(40px);
                    border: 1.5px solid rgba(0, 255, 136, 0.2);
                    box-shadow: 0 40px 100px -20px rgba(0, 0, 0, 0.8),
                                0 0 40px rgba(0, 255, 136, 0.1);
                }

                .welcome-badge-v2 {
                    position: relative;
                    width: 100px;
                    height: 100px;
                    margin: 0 auto 3rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(0, 255, 136, 0.1);
                    border-radius: 30px;
                    border: 1.5px solid rgba(0, 255, 136, 0.4);
                    box-shadow: 0 0 30px rgba(0, 255, 136, 0.2);
                }

                .trophy-icon {
                    color: var(--primary);
                    filter: drop-shadow(0 0 15px rgba(0, 255, 136, 0.6));
                }

                .badge-glow {
                    position: absolute;
                    inset: -10px;
                    background: var(--primary);
                    opacity: 0.1;
                    filter: blur(20px);
                    border-radius: 50%;
                    animation: pulse 3s infinite;
                }

                @keyframes pulse {
                    0% { scale: 0.8; opacity: 0.1; }
                    50% { scale: 1.2; opacity: 0.2; }
                    100% { scale: 0.8; opacity: 0.1; }
                }

                .welcome-main-title {
                    font-size: 4rem;
                    font-weight: 1000;
                    letter-spacing: -0.05em;
                    color: white;
                    margin-bottom: 0.5rem;
                    line-height: 1;
                }

                .text-gradient {
                    background: linear-gradient(135deg, #00ff88 0%, #059669 100%);
                    -webkit-background-clip: text;
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .welcome-sub-title {
                    font-size: 1rem;
                    font-weight: 900;
                    letter-spacing: 0.3em;
                    color: rgba(255, 255, 255, 0.4);
                    margin-bottom: 2.5rem;
                }

                .welcome-description-v2 {
                    font-size: 1.25rem;
                    color: rgba(255, 255, 255, 0.5);
                    line-height: 1.7;
                    margin-bottom: 3.5rem;
                    font-weight: 500;
                }

                .welcome-analytics-row {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 2rem;
                    background: rgba(255, 255, 255, 0.03);
                    padding: 1.5rem 2.5rem;
                    border-radius: 24px;
                    border: 1px solid rgba(255, 255, 255, 0.06);
                    margin-bottom: 4rem;
                }

                .welcome-analytic {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .analytic-icon {
                    color: var(--primary);
                    width: 20px;
                    height: 20px;
                }

                .analytic-info {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start;
                }

                .val {
                    font-size: 1.1rem;
                    font-weight: 1000;
                    color: white;
                    line-height: 1;
                }

                .lab {
                    font-size: 0.6rem;
                    font-weight: 900;
                    color: rgba(255, 255, 255, 0.3);
                    letter-spacing: 0.1em;
                    margin-top: 0.2rem;
                }

                .analytic-divider {
                    width: 1.5px;
                    height: 30px;
                    background: rgba(255, 255, 255, 0.08);
                }

                .embark-btn {
                    width: 100%;
                    padding: 1.75rem 3rem;
                    background: linear-gradient(135deg, #00ff88, #059669);
                    border: none;
                    border-radius: 24px;
                    color: #01160d;
                    font-weight: 1000;
                    font-size: 1.2rem;
                    letter-spacing: 0.1em;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 1rem;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                    box-shadow: 0 20px 50px rgba(0, 255, 136, 0.3);
                }

                .embark-btn:hover {
                    transform: translateY(-8px) scale(1.02);
                    box-shadow: 0 30px 70px rgba(0, 255, 136, 0.5);
                }

                .btn-glow {
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(circle at center, white 0%, transparent 70%);
                    opacity: 0;
                    transition: 0.5s;
                }

                .embark-btn:hover .btn-glow { opacity: 0.2; }

                .induction-footer {
                    margin-top: 3.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .footer-step {
                    display: flex;
                    justify-content: space-between;
                    font-size: 0.7rem;
                    font-weight: 1000;
                    letter-spacing: 0.2em;
                }

                .step-num { color: var(--primary); }
                .step-label { color: rgba(255, 255, 255, 0.2); }

                .footer-progress {
                    height: 6px;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 100px;
                    overflow: hidden;
                }

                .p-fill {
                    width: 40%;
                    height: 100%;
                    background: var(--primary);
                    border-radius: 100px;
                    box-shadow: 0 0 10px var(--primary);
                }

                @media (max-width: 768px) {
                    .welcome-box { padding: 3rem 2rem; border-radius: 32px; }
                    .welcome-main-title { font-size: 3rem; }
                    .welcome-analytics-row { flex-direction: column; gap: 1.5rem; padding: 2rem; }
                    .analytic-divider { display: none; }
                    .embark-btn { font-size: 1rem; padding: 1.5rem; }
                }
            `}</style>
        </div>
    );
}
