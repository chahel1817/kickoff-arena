'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Trophy, Users, LayoutDashboard, Search, LogOut, ArrowLeftRight, User, Home, Crosshair } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import './navbar.css';

function fmt(n) {
    if (n >= 1_000_000) return `£${(n / 1_000_000).toFixed(0)}M`;
    if (n >= 1_000) return `£${(n / 1_000).toFixed(0)}K`;
    return `£${n}`;
}

export default function Navbar() {
    const { user, budget, logout, isLoggedIn } = useAuth();
    const pathname = usePathname();
    const username = user?.userName || user?.username || 'Manager';

    return (
        <nav className="navbar">
            <Link href="/dashboard" className="navbar-brand">
                <div className="navbar-logo">
                    <Trophy className="navbar-logo-icon" />
                </div>
                <span className="navbar-title">KICKOFF ARENA</span>
            </Link>

            <div className="navbar-links">
                <Link href="/dashboard" className={`navbar-link ${pathname === '/dashboard' ? 'active' : ''}`}>
                    <Home className="navbar-icon" /> Dashboard
                </Link>
                <Link href="/league" className={`navbar-link ${pathname === '/league' ? 'active' : ''}`}>
                    <Search className="navbar-icon" /> Discover
                </Link>
                <Link href="/squad/review" className={`navbar-link ${pathname === '/squad/review' ? 'active' : ''}`}>
                    <Users className="navbar-icon" /> My Squad
                </Link>
                <Link href="/transfer" className={`navbar-link ${pathname === '/transfer' ? 'active' : ''}`}>
                    <ArrowLeftRight className="navbar-icon" /> Transfers
                </Link>
                <Link href="/tactics" className={`navbar-link ${pathname === '/tactics' ? 'active' : ''}`}>
                    <Crosshair className="navbar-icon" /> Tactics
                </Link>
            </div>

            <div className="navbar-right">
                {isLoggedIn && (
                    <div className="navbar-budget-pill" title="Transfer Budget">
                        {fmt(budget)} budget
                    </div>
                )}
                <div className="navbar-user">
                    <div className="navbar-avatar">
                        <User size={14} />
                    </div>
                    <span className="navbar-username">{username}</span>
                </div>
                {isLoggedIn ? (
                    <button onClick={logout} className="navbar-logout-btn" title="Logout">
                        <LogOut size={16} />
                    </button>
                ) : (
                    <Link href="/auth" className="navbar-login-btn">
                        Sign In
                    </Link>
                )}
            </div>
        </nav>
    );
}

