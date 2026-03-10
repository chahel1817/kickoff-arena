'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { calculatePlayerValue } from '@/lib/valuation';

const AuthCtx = createContext(null);

// Central accessor for squad data — tries server first, falls back to localStorage
function lsGet(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}
function lsSet(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch { }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(undefined); // undefined = loading
    const [budget, setBudget] = useState(() => lsGet('budget') ?? 0);
    const [transfers, setTransfers] = useState(() => lsGet('transfers') ?? []);
    const [matchHistory, setMatchHistory] = useState(() => lsGet('matchHistory') ?? []);
    const [teams, setTeams] = useState(() => lsGet('teams') ?? []);
    const [activeTeam, setActiveTeam] = useState(() => lsGet('activeTeam') ?? null);


    // Migration: Reset 50M legacy budget to 0
    useEffect(() => {
        if (budget === 50000000) {
            setBudget(0);
            lsSet('budget', 0);
        }
    }, [budget]);

    const fetchMe = useCallback(async () => {
        try {
            const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
                credentials: 'include'
            });

            if (r.status === 401) {
                setUser(null);
                return;
            }

            const contentType = r.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error('Not JSON');
            }

            const d = await r.json();
            if (d && !d.error) {
                setUser(d);
                setBudget(d.budget ?? 0);
                setTransfers(d.transfers ?? []);
                setMatchHistory(d.matchHistory ?? []);
                setTeams(d.teams ?? []);
                setActiveTeam(d.activeTeamId ?? null);
                syncToLocalStorage(d);
            } else {
                setUser(null);
            }
        } catch (e) {
            console.warn('[Auth] No session found or server error', e);
            setUser(null);
        }
    }, []);



    useEffect(() => { fetchMe(); }, [fetchMe]);

    function syncToLocalStorage(u) {
        if (!u) return;
        if (u.userName) localStorage.setItem('userName', u.userName);
        if (u.displayName) localStorage.setItem('displayName', u.displayName);
        if (u.email) localStorage.setItem('email', u.email);
        if (u.profilePicture) localStorage.setItem('profilePicture', u.profilePicture);
        if (u.selectedLeague) localStorage.setItem('selectedLeague', u.selectedLeague);
        if (u.selectedTeam) lsSet('selectedTeam', u.selectedTeam);
        if (u.selectedManager) lsSet('selectedManager', u.selectedManager);
        if (u.formation) lsSet('formation', u.formation);
        if (u.goalkeeper) lsSet('goalkeeper', u.goalkeeper);
        if (u.defenders) lsSet('defenders', u.defenders);
        if (u.midfielders) lsSet('midfielders', u.midfielders);
        if (u.forwards) lsSet('forwards', u.forwards);
        if (u.selectedCaptain) localStorage.setItem('selectedCaptain', u.selectedCaptain);
        if (u.teams) lsSet('teams', u.teams);
        if (u.activeTeamId) localStorage.setItem('activeTeam', u.activeTeamId);
    }

    // Persist a squad field to the backend
    const saveSquad = useCallback(async (patch) => {
        // Optimistically update localStorage
        for (const [k, v] of Object.entries(patch)) {
            if (typeof v === 'string') localStorage.setItem(k, v);
            else lsSet(k, v);
        }

        if (!user) return; // Stop here if anonymous

        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/squad`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(patch),
                credentials: 'include'
            });
        } catch (e) {
            console.warn('[saveSquad] sync failed', e);
        }
    }, [user]);


    const saveMatchResult = useCallback(async (result) => {
        const reward = (result.score || 0) * 3_500_000;

        setMatchHistory(prev => {
            const next = [{ ...result, reward }, ...prev].slice(0, 50);
            lsSet('matchHistory', next);
            return next;
        });

        setBudget(prev => {
            const next = prev + reward;
            lsSet('budget', next);
            return next;
        });

        if (!user) return;

        try {
            const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/matches`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(result),
                credentials: 'include'
            });
            const d = await r.json();
            if (d && d.budget !== undefined) setBudget(d.budget);
        } catch { }
    }, [user]);

    const executeTransfer = useCallback(async (position, playerOut, playerIn) => {
        const fee = calculatePlayerValue(playerIn.rating);

        // Guest Mode
        if (!user) {
            if (budget < fee) throw new Error('Insufficient budget');
            const newBudget = budget - fee;
            const transferRecord = { position, playerOut, playerIn, date: new Date().toISOString(), fee };
            const newTransfers = [transferRecord, ...transfers];

            if (position === 'goalkeeper') {
                lsSet('goalkeeper', playerIn);
            } else {
                const currentList = lsGet(position) || [];
                const newList = currentList.map(p => p.id === playerOut.id ? playerIn : p);
                lsSet(position, newList);
            }

            lsSet('budget', newBudget);
            lsSet('transfers', newTransfers);
            setBudget(newBudget);
            setTransfers(newTransfers);
            return { budget: newBudget, transfers: newTransfers };
        }

        // Authenticated Mode
        const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/transfer`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ position, playerOut, playerIn }),
            credentials: 'include'
        });
        const d = await r.json();
        if (!r.ok) throw new Error(d.error || 'Transfer failed');
        setBudget(d.budget);
        setTransfers(d.transfers);
        await fetchMe();
        return d;
    }, [user, budget, transfers, fetchMe]);


    const login = useCallback(async (username, password) => {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const apiUrl = `${baseUrl}/auth/login`;
        console.log('[Auth] Attempting login at:', apiUrl);

        if (baseUrl && !baseUrl.endsWith('/api')) {
            console.warn('[Auth] WARNING: NEXT_PUBLIC_API_URL does not end with "/api". This often causes 404 errors.');
        }


        const r = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
            credentials: 'include'
        });


        const contentType = r.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await r.text();
            console.error('Non-JSON response:', text);
            throw new Error('Server returned an invalid response. The API might be starting up or under maintenance.');
        }

        const d = await r.json();
        if (!r.ok) throw new Error(d.error || 'Login failed');
        await fetchMe();
        return d;

    }, [fetchMe]);

    const register = useCallback(async (username, password) => {
        const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
            credentials: 'include'
        });

        const contentType = r.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await r.text();
            console.error('Non-JSON response:', text);
            throw new Error('Server returned an invalid response. The API might be starting up or under maintenance.');
        }

        const d = await r.json();
        if (!r.ok) throw new Error(d.error || 'Registration failed');
        await fetchMe();
        return d;

    }, [fetchMe]);

    const logout = useCallback(async () => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        localStorage.clear();
        setUser(null);
        setBudget(0);
        setTransfers([]);
        setMatchHistory([]);
        setTeams([]);
        setActiveTeam(null);
        window.location.href = '/';
    }, []);

    const setActiveTeamId = useCallback(async (teamId) => {
        if (!user) return;

        // Update local state
        setActiveTeam(teamId);
        localStorage.setItem('activeTeam', teamId);

        // Sync to backend
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ activeTeamId: teamId }),
                credentials: 'include'
            });
        } catch (e) {
            console.warn('[setActiveTeamId] sync failed', e);
        }
    }, [user]);

    const fetchTeams = useCallback(async () => {
        if (!user) return;

        try {
            const r = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/teams`, {
                credentials: 'include'
            });
            const d = await r.json();
            if (d && d.teams) {
                setTeams(d.teams);
                lsSet('teams', d.teams);
            }
        } catch (e) {
            console.warn('[fetchTeams] failed', e);
        }
    }, [user]);


    return (
        <AuthCtx.Provider value={{
            user, budget, transfers, matchHistory, teams, activeTeam,
            saveSquad, saveMatchResult, executeTransfer,
            login, register, logout, setActiveTeamId, fetchTeams,
            isLoading: user === undefined,
            isLoggedIn: !!user,
        }}>
            {children}
        </AuthCtx.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthCtx);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}
