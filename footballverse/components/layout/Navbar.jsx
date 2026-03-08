'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trophy, Users, LayoutDashboard, Search, LogOut } from 'lucide-react';
import './navbar.css';

export default function Navbar() {
    const [username, setUsername] = useState('Manager');

    useEffect(() => {
        const name = localStorage.getItem('userName');
        if (name) setUsername(name);
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    return (
        <nav className="navbar">
            <Link href="/dashboard" className="navbar-brand">
                <div className="navbar-logo">
                    <Trophy className="navbar-logo-icon" />
                </div>
                <span className="navbar-title">KICKOFF ARENA</span>
            </Link>

            <div className="navbar-links">
                <Link href="/dashboard" className="navbar-link">
                    <LayoutDashboard className="navbar-icon" /> Dashboard
                </Link>
                <Link href="/league" className="navbar-link">
                    <Search className="navbar-icon" /> Discover
                </Link>
                <Link href="/squad/review" className="navbar-link">
                    <Users className="navbar-icon" /> My Squad
                </Link>
            </div>

            <div className="navbar-right">
                <div className="navbar-user">
                    <div className="navbar-avatar"></div>
                    <span className="navbar-username">{username}</span>
                </div>
                <button onClick={handleLogout} className="navbar-logout-btn" title="Logout">
                    <LogOut size={16} />
                </button>
            </div>
        </nav>
    );
}
