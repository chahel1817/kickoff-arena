'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const CACHE_KEY = 'player-image-cache-v2';
const FALLBACK_IMAGE = '/player-fallback.svg';

const getSafeSessionStorage = () => {
    if (typeof window === 'undefined') return null;
    try {
        return window.sessionStorage;
    } catch {
        return null;
    }
};

const buildPlayerKey = (player) => `${player.id}::${player.name}`;

export const usePlayerImageResolver = (players) => {
    const [imageMap, setImageMap] = useState({});
    const resolvingRef = useRef(new Set());

    const allPlayers = useMemo(() => players || [], [players]);

    useEffect(() => {
        const storage = getSafeSessionStorage();
        if (!storage) return;
        const raw = storage.getItem(CACHE_KEY);
        if (!raw) return;
        try {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object') {
                setImageMap(parsed);
            }
        } catch {
            storage.removeItem(CACHE_KEY);
        }
    }, []);

    const saveToCache = useCallback((nextMap) => {
        const storage = getSafeSessionStorage();
        if (!storage) return;
        storage.setItem(CACHE_KEY, JSON.stringify(nextMap));
    }, []);

    const applyResolvedImage = useCallback((player, url) => {
        const key = buildPlayerKey(player);
        setImageMap((prev) => {
            const next = { ...prev, [key]: url };
            saveToCache(next);
            return next;
        });
    }, [saveToCache]);

    const resolveImageFromApi = useCallback(async (player) => {
        const key = buildPlayerKey(player);
        if (resolvingRef.current.has(key)) return;
        resolvingRef.current.add(key);

        try {
            const params = new URLSearchParams({
                name: player.name || '',
                club: player.club || '',
                fallback: player.image || '',
            });
            const res = await fetch(`/api/player-image?${params.toString()}`, { method: 'GET' });
            if (!res.ok) throw new Error(`resolver ${res.status}`);
            const data = await res.json();
            const nextUrl = data?.image || FALLBACK_IMAGE;
            applyResolvedImage(player, nextUrl);
        } catch {
            applyResolvedImage(player, FALLBACK_IMAGE);
        } finally {
            resolvingRef.current.delete(key);
        }
    }, [applyResolvedImage]);

    useEffect(() => {
        allPlayers.forEach((player) => {
            const key = buildPlayerKey(player);
            if (imageMap[key]) return;
            if (!player.image) {
                resolveImageFromApi(player);
            }
        });
    }, [allPlayers, imageMap, resolveImageFromApi]);

    const getImageSrc = useCallback((player) => {
        const key = buildPlayerKey(player);
        return imageMap[key] || player.image || FALLBACK_IMAGE;
    }, [imageMap]);

    const handleImageError = useCallback((player) => {
        resolveImageFromApi(player);
    }, [resolveImageFromApi]);

    return { getImageSrc, handleImageError };
};
