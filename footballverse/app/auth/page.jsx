'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Shield, Zap, User, Lock, Eye, EyeOff, Trophy, Star, CheckCircle, XCircle } from 'lucide-react';

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

            {/* Floating badges */}
            <div className="auth-float-badge auth-fb-1"><Trophy size={16} />LEGEND MODE</div>
            <div className="auth-float-badge auth-fb-2"><Star size={14} />CLOUD SAVE</div>
            <div className="auth-float-badge auth-fb-3"><Shield size={14} />SECURE</div>

            <div className="auth-card">
                <div className="auth-brand">
                    <div className="auth-logo"><Shield size={28} /></div>
                    <h1 className="auth-brand-name">KICKOFF <span>ARENA</span></h1>
                    <p className="auth-brand-sub">{mode === 'login' ? 'Welcome back, Manager' : 'Start your managerial career'}</p>
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
                        {mode === 'register' && password.length > 0 && (
                            <div className="auth-password-requirements">
                                <div className={`req-item ${passwordValidation.hasMinLength ? 'met' : 'unmet'}`}>
                                    {passwordValidation.hasMinLength ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                    <span>Characters: <strong>{passwordValidation.passwordLength}/6</strong></span>
                                </div>
                                <div className={`req-item ${passwordValidation.hasNumber ? 'met' : 'unmet'}`}>
                                    {passwordValidation.hasNumber ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                    <span>Numbers: <strong>{passwordValidation.numberCount}</strong> {passwordValidation.hasNumber ? '✓' : 'needed'}</span>
                                </div>
                                <div className={`req-item ${passwordValidation.hasSpecialChar ? 'met' : 'unmet'}`}>
                                    {passwordValidation.hasSpecialChar ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                    <span>Special chars: <strong>{passwordValidation.specialCharCount}</strong> {passwordValidation.hasSpecialChar ? '✓' : 'needed'}</span>
                                </div>

                                {/* Strength Indicator */}
                                <div className="req-strength-bar">
                                    <div className="strength-bar-fill" style={{
                                        width: `${(passwordValidation.strength / 3) * 100}%`,
                                        backgroundColor: passwordValidation.strength === 3 ? '#86efac' : (passwordValidation.strength === 2 ? '#fbbf24' : '#f87171')
                                    }}></div>
                                </div>
                                <div className="req-strength-text">
                                    Strength: <span className={passwordValidation.strength === 3 ? 'strong' : (passwordValidation.strength === 2 ? 'medium' : 'weak')}>
                                        {passwordValidation.strength === 3 ? 'Strong' : (passwordValidation.strength === 2 ? 'Medium' : 'Weak')}
                                    </span>
                                </div>
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
                        className="auth-submit"
                        disabled={loading || (mode === 'register' && password.length > 0 && !passwordValidation.isValid)}
                    >
                        {loading ? (
                            <span className="auth-spinner" />
                        ) : (
                            <>
                                <Zap size={18} />
                                {mode === 'login' ? 'ENTER THE ARENA' : 'BEGIN CAREER'}
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-features">
                    <div className="auth-feat"><Shield size={13} />Cloud Save</div>
                    <div className="auth-feat"><Trophy size={13} />Match History</div>
                    <div className="auth-feat"><Star size={13} />Transfer Market</div>
                </div>

                <p className="auth-skip" onClick={() => router.push('/')}>
                    Continue as guest — progress won&apos;t be saved
                </p>
            </div>

            <style>{`
                .auth-root {
                    min-height: 100vh; display: flex; align-items: center; justify-content: center;
                    background: #051015; position: relative; overflow: hidden; padding: 2rem;
                }
                
                /* Stadium Background - Football Field Pattern */
                .auth-stadium-bg {
                    position: fixed; inset: 0; z-index: 0;
                    background: 
                        /* Field lines pattern */
                        repeating-linear-gradient(
                            90deg,
                            rgba(34,197,94,0.08) 0px,
                            rgba(34,197,94,0.08) 60px,
                            transparent 60px,
                            transparent 120px
                        ),
                        /* Horizontal lines */
                        repeating-linear-gradient(
                            0deg,
                            rgba(34,197,94,0.06) 0px,
                            rgba(34,197,94,0.06) 40px,
                            transparent 40px,
                            transparent 80px
                        ),
                        /* Base stadium gradient */
                        linear-gradient(to bottom,
                            rgba(10,35,50,0.4) 0%,
                            rgba(15,42,60,0.35) 20%,
                            rgba(5,30,45,0.3) 50%,
                            rgba(15,42,60,0.35) 80%,
                            rgba(10,35,50,0.4) 100%
                        ),
                        /* Green field overlay */
                        linear-gradient(135deg,
                            rgba(34,197,94,0.15) 0%,
                            rgba(34,197,94,0.08) 50%,
                            rgba(34,197,94,0.12) 100%
                        ),
                        /* Radial light effect */
                        radial-gradient(ellipse 150% 100% at 50% 30%, rgba(0,255,136,0.12) 0%, transparent 60%),
                        /* Corner stadium lights */
                        radial-gradient(circle at 5% 10%, rgba(245,158,11,0.1) 0%, transparent 20%),
                        radial-gradient(circle at 95% 10%, rgba(59,130,246,0.1) 0%, transparent 20%),
                        radial-gradient(circle at 5% 90%, rgba(59,130,246,0.1) 0%, transparent 20%),
                        radial-gradient(circle at 95% 90%, rgba(236,72,153,0.1) 0%, transparent 20%),
                        /* Center circle highlight */
                        radial-gradient(circle at 50% 50%, rgba(34,197,94,0.08) 0%, transparent 40%);
                    background-size: 120px 100%, 100% 80px, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%;
                    background-position: 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0, 0 0;
                    background-attachment: fixed;
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
                    background: rgba(5,12,22,0.95); backdrop-filter: blur(50px);
                    border: 1.5px solid rgba(0,255,136,.25); border-radius: 32px;
                    padding: 3rem 2.5rem; 
                    box-shadow: 
                        0 50px 150px -30px rgba(0,0,0,.95), 
                        0 0 80px rgba(0,255,136,.15),
                        inset 0 1px 2px rgba(255,255,255,.08),
                        0 0 40px rgba(0,255,136,.08);
                    animation: cardIn .8s cubic-bezier(0.23, 1, 0.32, 1) backwards;
                }
                
                @keyframes cardIn {
                    from { opacity: 0; transform: translateY(50px) scale(.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }

                /* Brand */
                .auth-brand { text-align: center; margin-bottom: 2rem; }
                .auth-logo {
                    width: 70px; height: 70px; border-radius: 20px; margin: 0 auto 1rem;
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
                    background: rgba(0,255,136,.05); border-radius: 14px;
                    border: 1px solid rgba(0,255,136,.2); padding: 3px; margin-bottom: 2rem; overflow: hidden;
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
                .auth-form { display: flex; flex-direction: column; gap: 1.25rem; }
                .auth-field { display: flex; flex-direction: column; gap: .5rem; }
                .auth-label { font-size: .55rem; font-weight: 900; letter-spacing: .18em; color: rgba(255,255,255,.4); }
                .auth-input-wrap { position: relative; display: flex; align-items: center; }
                .auth-input-icon { position: absolute; left: 1rem; color: rgba(0,255,136,.5); pointer-events: none; }
                .auth-input {
                    width: 100%; padding: 1rem 1rem 1rem 3rem; border-radius: 14px;
                    background: rgba(0,255,136,.06); border: 1.5px solid rgba(0,255,136,.2);
                    color: white; font-size: .95rem; font-weight: 500; outline: none;
                    transition: border-color .3s, box-shadow .3s, background .3s;
                }
                .auth-input:focus {
                    border-color: rgba(0,255,136,.6);
                    background: rgba(0,255,136,.1);
                    box-shadow: 0 0 0 4px rgba(0,255,136,.1), 0 0 20px rgba(0,255,136,.15);
                }
                .auth-input::placeholder { color: rgba(255,255,255,.25); }
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

                /* Password Requirements */
                .auth-password-requirements {
                    display: flex; flex-direction: column; gap: .65rem;
                    padding: 1rem; border-radius: 12px;
                    background: rgba(0,255,136,.08); border: 1px solid rgba(0,255,136,.2);
                    margin-top: .5rem;
                    animation: slideIn .3s ease-out;
                }
                
                @keyframes slideIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                .req-item {
                    display: flex; align-items: center; gap: .6rem;
                    font-size: .75rem; font-weight: 600; transition: all .2s;
                    padding: .4rem .5rem; border-radius: 8px;
                }
                .req-item.met {
                    color: #86efac;
                    background: rgba(134,239,172,.08);
                }
                .req-item.unmet {
                    color: rgba(255,255,255,.5);
                    background: rgba(239,68,68,.05);
                }
                .req-item strong {
                    color: inherit;
                    font-weight: 700;
                }
                .req-item svg {
                    flex-shrink: 0;
                    min-width: 14px;
                    animation: fadeIn .3s ease;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                /* Strength Bar */
                .req-strength-bar {
                    width: 100%; height: 4px; border-radius: 4px;
                    background: rgba(255,255,255,.1); overflow: hidden;
                    margin-top: .25rem;
                }
                .strength-bar-fill {
                    height: 100%; border-radius: 4px;
                    transition: width .3s ease, background-color .3s ease;
                    box-shadow: 0 0 10px currentColor;
                }
                
                .req-strength-text {
                    font-size: .65rem; font-weight: 700;
                    color: rgba(255,255,255,.5); text-align: center;
                    margin-top: .25rem;
                }
                .req-strength-text span.strong {
                    color: #86efac;
                }
                .req-strength-text span.medium {
                    color: #fbbf24;
                }
                .req-strength-text span.weak {
                    color: #f87171;
                }

                .auth-submit {
                    display: flex; align-items: center; justify-content: center; gap: .75rem;
                    padding: 1.2rem; border-radius: 16px; border: none; cursor: pointer;
                    background: linear-gradient(135deg, #00ff88, #059669);
                    color: #01160d; font-weight: 950; font-size: 1rem; letter-spacing: .05em;
                    margin-top: .5rem; transition: all .3s; 
                    box-shadow: 
                        0 15px 40px rgba(0,255,136,.35), 
                        0 0 30px rgba(0,255,136,.15),
                        inset 0 1px 2px rgba(255,255,255,.2);
                }
                .auth-submit:hover:not(:disabled) { 
                    transform: translateY(-4px); 
                    box-shadow: 
                        0 20px 50px rgba(0,255,136,.5), 
                        0 0 40px rgba(0,255,136,.25),
                        inset 0 1px 2px rgba(255,255,255,.3);
                }
                .auth-submit:disabled { opacity: .6; cursor: not-allowed; }
                .auth-spinner {
                    width: 20px; height: 20px; border-radius: 50%;
                    border: 2px solid rgba(0,0,0,.3); border-top-color: #01160d;
                    animation: spin .6s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                /* Features row */
                .auth-features {
                    display: flex; justify-content: center; gap: 1.5rem;
                    margin-top: 1.5rem; padding-top: 1.5rem;
                    border-top: 1px solid rgba(0,255,136,.15);
                }
                .auth-feat {
                    display: flex; align-items: center; gap: .4rem;
                    font-size: .6rem; font-weight: 700; color: rgba(255,255,255,.35);
                }
                .auth-skip {
                    text-align: center; margin-top: 1.25rem; font-size: .7rem;
                    color: rgba(255,255,255,.3); cursor: pointer; transition: color .2s;
                    font-weight: 600;
                }
                .auth-skip:hover { color: rgba(255,255,255,.7); }
            `}</style>
        </div>
    );
}
