'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Zap, User, Lock, Eye, EyeOff, CheckCircle, XCircle, Shield, UserCircle, Check, PlayCircle, Trophy, AlertTriangle } from 'lucide-react';

export default function AuthPage() {
    const router = useRouter();
    const { login, register, isLoggedIn, isLoading } = useAuth();
    const [mode, setMode] = useState('login'); // 'login' | 'register'
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Password validation
    const passwordValidation = useMemo(() => {
        const hasMinLength = password.length >= 6;
        const numberCount = (password.match(/\d/g) || []).length;
        const specialCharCount = (password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || []).length;
        const hasNumber = numberCount > 0;
        const hasSpecialChar = specialCharCount > 0;
        const isValid = hasMinLength && hasNumber && hasSpecialChar;

        return {
            passwordLength: password.length,
            hasMinLength,
            numberCount,
            hasNumber,
            specialCharCount,
            hasSpecialChar,
            isValid,
            strength: password.length === 0 ? 0 : (hasMinLength ? 1 : 0) + (hasNumber ? 1 : 0) + (hasSpecialChar ? 1 : 0)
        };
    }, [password]);

    // Redirect to dashboard if already logged in
    useEffect(() => {
        if (!isLoading && isLoggedIn) {
            router.push('/dashboard');
        }
    }, [isLoggedIn, isLoading, router]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError('');

        // Validate password on register
        if (mode === 'register' && !passwordValidation.isValid) {
            setError('Password must contain at least 6 characters, a number, and a special character');
            return;
        }

        setLoading(true);
        try {
            if (mode === 'login') {
                await login(username.trim(), password);
                router.push('/dashboard');
            } else {
                await register(username.trim(), password);
                router.push('/welcome');
            }
        } catch (err) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    if (isLoading) {
        return null;
    }

    return (
        <div className="auth-root">
            {/* Stadium Background with Atmospheric Effects */}
            <div className="auth-stadium-bg"></div>
            <div className="auth-bg" />
            <div className="auth-bg-grid" />
            <div className="auth-lights-effect"></div>
            <div className="auth-overlay-darken"></div>

            <div className="auth-card">
                <div className="auth-brand">
                    <div className="auth-logo"><Shield size={28} /></div>
                    <h1 className="auth-brand-name">KICKOFF <span>ARENA</span></h1>
                    <p className="auth-brand-sub">{mode === 'login' ? 'Your legacy continues.' : 'Ready for matchday decisions?'}</p>
                </div>

                {/* Mode switcher */}
                <div className="auth-tabs">
                    <button className={`auth-tab ${mode === 'login' ? 'active' : ''}`} onClick={() => { setMode('login'); setError(''); }}>
                        SIGN IN
                    </button>
                    <button className={`auth-tab ${mode === 'register' ? 'active' : ''}`} onClick={() => { setMode('register'); setError(''); }}>
                        CREATE ACCOUNT
                    </button>
                    <div className="auth-tab-indicator" style={{ transform: `translateX(${mode === 'login' ? '0%' : '100%'})` }} />
                </div>

                {/* Manager Avatar Preview */}
                {username.length > 0 && (
                    <div className="auth-avatar-preview">
                        <UserCircle size={36} className="avatar-icon" />
                        <div className="avatar-text">
                            <span className="avatar-title">Manager Profile</span>
                            <strong className="avatar-username">{username}</strong>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="auth-form">
                    {/* Username */}
                    <div className="auth-field">
                        <label className="auth-label">USERNAME</label>
                        <div className="auth-input-wrap">
                            <User size={18} className="auth-input-icon" />
                            <input
                                type="text"
                                className="auth-input"
                                placeholder="Enter your username"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                                autoFocus
                                minLength={3}
                                maxLength={24}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="auth-field">
                        <label className="auth-label">PASSWORD</label>
                        <div className="auth-input-wrap">
                            <Lock size={18} className="auth-input-icon" />
                            <input
                                type={showPwd ? 'text' : 'password'}
                                className="auth-input"
                                placeholder={mode === 'register' ? 'At least 6 characters' : 'Enter your password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                            <button type="button" className="auth-toggle-pwd" onClick={() => setShowPwd(p => !p)}>
                                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>

                        {/* Password Requirements - Only show in register mode */}
                        {mode === 'register' && password.length > 0 && !passwordValidation.isValid && (
                            <div className="auth-password-warning">
                                <AlertTriangle size={15} />
                                <span><strong>Weak password:</strong> Must contain at least 6 characters, 1 number, and 1 special character.</span>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="auth-error">
                            <Zap size={14} /> {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className={`auth-submit ${mode === 'login' ? 'submit-login' : 'submit-register'}`}
                        disabled={loading || (mode === 'register' && password.length > 0 && !passwordValidation.isValid)}
                    >
                        {loading ? (
                            <span className="auth-spinner" />
                        ) : (
                            <>
                                {mode === 'login' ? <PlayCircle size={18} /> : <Trophy size={18} />}
                                {mode === 'login' ? 'START MANAGER MODE' : 'BEGIN YOUR CAREER'}
                            </>
                        )}
                    </button>
                </form>

                <button type="button" className="auth-guest-btn" onClick={() => router.push('/')}>
                    Continue as Guest
                </button>
            </div>

            <style>{`
                .auth-root {
                    min-height: 100vh; display: flex; align-items: center; justify-content: center;
                    background: #051015; position: relative; overflow: hidden; padding: 2rem;
                }
                
                /* Stadium Background - Image with Animation */
                .auth-stadium-bg {
                    position: fixed; inset: 0; z-index: 0;
                    background: 
                        radial-gradient(circle at 50% 50%, rgba(5,16,21,0.1) 0%, rgba(5,16,21,0.65) 100%),
                        url('/login-bg.png') no-repeat center center;
                    background-size: cover;
                    background-attachment: fixed;
                    filter: contrast(1.1) brightness(1.15) saturate(1.1);
                    transform: scale(1.05); /* Slight zoom for a dynamic feel */
                    animation: subtlePan 35s ease-in-out infinite alternate;
                }

                @keyframes subtlePan {
                    0% { transform: scale(1.05) translate(0, 0); }
                    100% { transform: scale(1.1) translate(-20px, 15px); }
                }
                
                /* Enhanced Gradient Overlay */
                .auth-bg {
                    position: fixed; inset: 0; z-index: 1;
                    background: 
                        /* Main stadium atmosphere */
                        linear-gradient(to right,
                            rgba(5,20,30,0.5) 0%,
                            rgba(10,25,35,0.3) 30%,
                            rgba(15,30,40,0.2) 50%,
                            rgba(10,25,35,0.3) 70%,
                            rgba(5,20,30,0.5) 100%
                        ),
                        /* Center darken for card */
                        radial-gradient(circle at 50% 50%, rgba(3,9,14,0.4) 0%, transparent 50%),
                        /* Subtle top glow */
                        radial-gradient(ellipse 100% 80% at 50% -10%, rgba(0,255,136,0.15) 0%, transparent 60%),
                        /* Bottom stadium effect */
                        radial-gradient(ellipse 100% 100% at 50% 100%, rgba(34,197,94,0.1) 0%, transparent 50%);
                }
                
                /* Grid Pattern */
                .auth-bg-grid {
                    position: fixed; inset: 0; z-index: 2; opacity: 0.08;
                    background-image: linear-gradient(rgba(0,255,136,.3) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(0,255,136,.3) 1px, transparent 1px);
                    background-size: 80px 80px;
                    pointer-events: none;
                }
                
                /* Stadium Lights Effect */
                .auth-lights-effect {
                    position: fixed; inset: 0; z-index: 3; pointer-events: none;
                    background: 
                        /* Top left light */
                        radial-gradient(circle at 8% 5%, rgba(245,158,11,0.25) 0%, transparent 25%),
                        /* Top right light */
                        radial-gradient(circle at 92% 5%, rgba(0,255,136,0.25) 0%, transparent 25%),
                        /* Bottom left light */
                        radial-gradient(circle at 8% 95%, rgba(59,130,246,0.2) 0%, transparent 25%),
                        /* Bottom right light */
                        radial-gradient(circle at 92% 95%, rgba(236,72,153,0.2) 0%, transparent 25%);
                    animation: stadiumLights 6s ease-in-out infinite;
                }
                
                /* Dark Overlay */
                .auth-overlay-darken {
                    position: fixed; inset: 0; z-index: 4; pointer-events: none;
                    background: rgba(5,15,25,0.25);
                }
                
                @keyframes stadiumLights {
                    0%, 100% { opacity: 0.8; }
                    50% { opacity: 1; }
                }

                /* Floating badges - Enhanced */
                .auth-float-badge {
                    position: fixed; display: flex; align-items: center; gap: .5rem;
                    padding: .75rem 1.5rem; border-radius: 100px; font-size: .7rem; font-weight: 950;
                    letter-spacing: .12em; backdrop-filter: blur(30px); pointer-events: auto;
                    border: 2px solid rgba(0,255,136,.5); color: rgba(255,255,255,.95);
                    background: rgba(0,255,136,.12); 
                    animation: fbFloat 6s ease-in-out infinite;
                    box-shadow: 
                        0 0 40px rgba(0,255,136,.3), 
                        inset 0 1px 2px rgba(255,255,255,.2),
                        0 0 20px rgba(0,255,136,.15);
                    z-index: 25;
                    cursor: default;
                    transition: all .3s ease;
                    text-shadow: 0 0 20px rgba(0,255,136,.3);
                }
                
                .auth-float-badge:hover {
                    background: rgba(0,255,136,.18);
                    border-color: rgba(0,255,136,.8);
                    box-shadow: 
                        0 0 60px rgba(0,255,136,.5), 
                        inset 0 1px 2px rgba(255,255,255,.3),
                        0 0 30px rgba(0,255,136,.25);
                    transform: translateY(-4px);
                }
                
                .auth-fb-1 { top: 5%; left: 3%; animation-delay: 0s; }
                .auth-fb-2 { top: 10%; right: 5%; animation-delay: 2s; }
                .auth-fb-3 { bottom: 10%; left: 5%; animation-delay: 4s; }
                
                @keyframes fbFloat {
                    0%,100% { transform: translateY(0px); opacity: .8; }
                    50% { transform: translateY(-20px); opacity: 1; }
                }

                /* Card - With stadiums light effect */
                .auth-card {
                    position: relative; width: 100%; max-width: 440px; z-index: 30;
                    background: rgba(5,12,22,0.35); backdrop-filter: blur(16px);
                    border: 1px solid rgba(0,255,136,.2); border-radius: 32px;
                    padding: 2rem 2.5rem; 
                    box-shadow: 
                        0 40px 100px -20px rgba(0,0,0,.6), 
                        0 0 60px rgba(0,255,136,.08),
                        inset 0 1px 2px rgba(255,255,255,.08),
                        0 0 40px rgba(0,255,136,.04);
                    animation: cardIn .8s cubic-bezier(0.23, 1, 0.32, 1) backwards;
                }
                
                @keyframes cardIn {
                    from { opacity: 0; transform: translateY(50px) scale(.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }

                /* Brand */
                .auth-brand { text-align: center; margin-bottom: 1.5rem; }
                .auth-logo {
                    width: 60px; height: 60px; border-radius: 20px; margin: 0 auto .75rem;
                    background: linear-gradient(135deg, rgba(0,255,136,.25), rgba(0,255,136,.1));
                    border: 1.5px solid rgba(0,255,136,.5); display: flex; align-items: center; justify-content: center;
                    color: #00ff88; 
                    box-shadow: 
                        0 0 40px rgba(0,255,136,.3), 
                        inset 0 1px 2px rgba(255,255,255,.2),
                        0 0 20px rgba(0,255,136,.2);
                }
                .auth-brand-name {
                    font-size: 1.7rem; font-weight: 950; color: white; letter-spacing: .05em;
                    margin-bottom: .35rem;
                    text-shadow: 0 0 30px rgba(0,255,136,.2);
                }
                .auth-brand-name span { color: #00ff88; }
                .auth-brand-sub { font-size: .8rem; color: rgba(255,255,255,.4); font-weight: 600; }

                /* Tabs */
                .auth-tabs {
                    position: relative; display: grid; grid-template-columns: 1fr 1fr;
                    background: rgba(0,255,136,.02); border-radius: 14px;
                    border: 1px solid rgba(0,255,136,.15); padding: 3px; margin-bottom: 1.5rem; overflow: hidden;
                    backdrop-filter: blur(8px);
                }
                .auth-tab {
                    position: relative; z-index: 2; padding: .7rem; border-radius: 11px;
                    font-size: .65rem; font-weight: 900; letter-spacing: .1em; cursor: pointer;
                    color: rgba(255,255,255,.4); transition: color .3s; border: none; background: transparent;
                }
                .auth-tab.active { color: #00ff88; }
                .auth-tab-indicator {
                    position: absolute; top: 3px; left: 3px; z-index: 1;
                    width: calc(50% - 3px); height: calc(100% - 6px); border-radius: 11px;
                    background: rgba(0,255,136,.2); border: 1px solid rgba(0,255,136,.4);
                    box-shadow: 0 0 20px rgba(0,255,136,.15);
                    transition: transform .35s cubic-bezier(0.23, 1, 0.32, 1);
                }

                /* Form */
                .auth-form { display: flex; flex-direction: column; gap: 1rem; }
                .auth-field { display: flex; flex-direction: column; gap: .4rem; }
                .auth-label { font-size: .55rem; font-weight: 900; letter-spacing: .18em; color: rgba(255,255,255,.4); }
                .auth-input-wrap { position: relative; display: flex; align-items: center; }
                .auth-input-icon { position: absolute; left: 1rem; color: rgba(0,255,136,.5); pointer-events: none; }
                .auth-input {
                    width: 100%; padding: .85rem 1rem .85rem 2.8rem; border-radius: 14px;
                    background: rgba(0,255,136,.03); border: 1px solid rgba(0,255,136,.15);
                    color: white; font-size: .95rem; font-weight: 500; outline: none;
                    backdrop-filter: blur(8px);
                    transition: border-color .3s, box-shadow .3s, background .3s;
                }
                .auth-input:focus {
                    border-color: rgba(0,255,136,.8);
                    background: rgba(0,255,136,.08);
                    box-shadow: 0 0 15px rgba(0,255,136,.4), inset 0 0 10px rgba(0,255,136,.15);
                    transform: translateY(-2px);
                }
                .auth-input::placeholder { color: rgba(255,255,255,.25); transition: color .3s ease; }
                .auth-input:focus::placeholder { color: transparent; }
                .auth-toggle-pwd {
                    position: absolute; right: 1rem; background: none; border: none;
                    color: rgba(0,255,136,.5); cursor: pointer; padding: .25rem;
                    display: flex; align-items: center;
                    transition: color .2s;
                }
                .auth-toggle-pwd:hover { color: rgba(0,255,136,.9); }
                .auth-error {
                    display: flex; align-items: center; gap: .5rem;
                    padding: .75rem 1rem; border-radius: 12px;
                    background: rgba(239,68,68,.15); border: 1.5px solid rgba(239,68,68,.4);
                    color: #fecaca; font-size: .8rem; font-weight: 700;
                }

                /* Password Warning Box */
                .auth-password-warning {
                    display: flex; align-items: flex-start; gap: .5rem;
                    padding: .85rem 1rem; border-radius: 12px; margin-top: .5rem;
                    background: rgba(251,191,36,.1); border: 1px solid rgba(251,191,36,.4);
                    color: rgba(251,191,36,.9); font-size: .75rem; font-weight: 500; line-height: 1.4;
                    animation: slideIn .3s ease-out;
                    box-shadow: 0 0 15px rgba(251,191,36,.05);
                }
                .auth-password-warning strong { color: #fcd34d; font-weight: 800; display: block; margin-bottom: .2rem; }
                .auth-password-warning svg { flex-shrink: 0; margin-top: .15rem; color: #fbbf24; }
                
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* Submits */
                .auth-submit {
                    display: flex; align-items: center; justify-content: center; gap: .75rem;
                    padding: 1.2rem; border-radius: 16px; border: none; cursor: pointer;
                    font-weight: 950; font-size: 1rem; letter-spacing: .05em;
                    margin-top: .5rem; transition: all .3s cubic-bezier(0.23, 1, 0.32, 1); 
                }
                
                /* Login Button Style (Green) */
                .submit-login {
                    background: linear-gradient(135deg, #00ff88, #059669);
                    color: #01160d;
                    animation: pulseGlowBtnLogin 3s infinite alternate;
                }
                @keyframes pulseGlowBtnLogin {
                    0% { box-shadow: 0 10px 30px rgba(0,255,136,.25), 0 0 20px rgba(0,255,136,.1), inset 0 1px 2px rgba(255,255,255,.1); }
                    100% { box-shadow: 0 15px 45px rgba(0,255,136,.4), 0 0 40px rgba(0,255,136,.25), inset 0 1px 2px rgba(255,255,255,.3); }
                }
                .submit-login:hover:not(:disabled) { 
                    transform: translateY(-4px); 
                    box-shadow: 0 20px 50px rgba(0,255,136,.6), 0 0 50px rgba(0,255,136,.4), inset 0 1px 2px rgba(255,255,255,.4);
                    animation: none;
                }

                /* Register Button Style (Gold) */
                .submit-register {
                    background: linear-gradient(135deg, #fbbf24, #d97706);
                    color: #451a03;
                    animation: pulseGlowBtnReg 3s infinite alternate;
                }
                @keyframes pulseGlowBtnReg {
                    0% { box-shadow: 0 10px 30px rgba(251,191,36,.25), 0 0 20px rgba(251,191,36,.1), inset 0 1px 2px rgba(255,255,255,.1); }
                    100% { box-shadow: 0 15px 45px rgba(251,191,36,.4), 0 0 40px rgba(251,191,36,.25), inset 0 1px 2px rgba(255,255,255,.3); }
                }
                .submit-register:hover:not(:disabled) { 
                    transform: translateY(-4px); 
                    box-shadow: 0 20px 50px rgba(251,191,36,.6), 0 0 50px rgba(251,191,36,.4), inset 0 1px 2px rgba(255,255,255,.4);
                    animation: none;
                }

                .auth-submit:disabled { opacity: .6; cursor: not-allowed; animation: none; box-shadow: none; filter: grayscale(0.5); transform: none !important; }

                /* Avatar Preview */
                .auth-avatar-preview {
                    display: flex; align-items: center; gap: 1rem;
                    background: rgba(0,255,136,.05); border: 1px solid rgba(0,255,136,.2);
                    padding: .85rem 1.25rem; border-radius: 16px; margin-bottom: 1.5rem;
                    animation: slideDown .4s cubic-bezier(0.23, 1, 0.32, 1);
                    backdrop-filter: blur(8px);
                }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .avatar-icon { color: #00ff88; filter: drop-shadow(0 0 10px rgba(0,255,136,.4)); }
                .avatar-text { display: flex; flex-direction: column; }
                .avatar-title { font-size: .65rem; color: rgba(255,255,255,.4); font-weight: 700; text-transform: uppercase; letter-spacing: .1em; }
                .avatar-username { color: white; font-size: 1rem; font-weight: 800; letter-spacing: .02em; }

                /* Guest Option */
                .auth-guest-btn {
                    width: 100%; margin-top: 1.25rem; padding: 1rem; border-radius: 14px;
                    background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.1);
                    color: rgba(255,255,255,.6); font-weight: 600; font-size: .85rem;
                    cursor: pointer; transition: all .3s; backdrop-filter: blur(8px);
                }
                .auth-guest-btn:hover {
                    background: rgba(255,255,255,.08); color: white; border-color: rgba(255,255,255,.2);
                    transform: translateY(-2px);
                }
            `}</style>
        </div>
    );
}
