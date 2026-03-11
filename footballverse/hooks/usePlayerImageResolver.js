'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FALLBACK_IMAGE, getResolvedPlayerImage, isLikelyImageUrl, normalizePlayerImageUrl } from '@/lib/playerImage';

const CACHE_KEY = 'player-image-cache-v2';

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
    const hydratedRef = useRef(false);

    const allPlayers = useMemo(() => players || [], [players]);

    useEffect(() => {
        const storage = getSafeSessionStorage();
        if (!storage) return;
        const raw = storage.getItem(CACHE_KEY);
        if (!raw) {
            hydratedRef.current = true;
            return;
        }
        try {
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object') {
                setImageMap(parsed);
            }
        } catch {
            storage.removeItem(CACHE_KEY);
        } finally {
            hydratedRef.current = true;
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
            if (!process.env.NEXT_PUBLIC_API_URL) {
                applyResolvedImage(player, FALLBACK_IMAGE);
                return;
            }
            const params = new URLSearchParams({
                name: player.name || '',
                club: player.club || '',
                fallback: normalizePlayerImageUrl(player.image || '') || '',
            });
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/player-image?${params.toString()}`, { method: 'GET' });
            if (!res.ok) throw new Error(`resolver ${res.status}`);
            const data = await res.json();
            const nextUrl = normalizePlayerImageUrl(data?.image || '', { proxify: true }) || FALLBACK_IMAGE;
            applyResolvedImage(player, nextUrl);
        } catch {
            applyResolvedImage(player, FALLBACK_IMAGE);
        } finally {
            resolvingRef.current.delete(key);
        }
    }, [applyResolvedImage]);

    useEffect(() => {
        if (!hydratedRef.current || allPlayers.length === 0) return;

        const nextEntries = {};
        let hasUpdates = false;

        for (const player of allPlayers) {
            const key = buildPlayerKey(player);
            const cached = imageMap[key];
            if (cached && isLikelyImageUrl(cached)) continue;

            const normalized = normalizePlayerImageUrl(player.image || '', { proxify: true });
            if (normalized) {
                nextEntries[key] = normalized;
                hasUpdates = true;
            }
        }

        if (!hasUpdates) return;

        setImageMap((prev) => {
            const next = { ...prev, ...nextEntries };
            saveToCache(next);
            return next;
        });
    }, [allPlayers, imageMap, saveToCache]);

    const getImageSrc = useCallback((player) => {
        return getResolvedPlayerImage(player, imageMap, { proxify: true });
    }, [imageMap]);

    const handleImageError = useCallback((player) => {
        applyResolvedImage(player, FALLBACK_IMAGE);
        resolveImageFromApi(player);
    }, [resolveImageFromApi, applyResolvedImage]);

    return { getImageSrc, handleImageError };
};
