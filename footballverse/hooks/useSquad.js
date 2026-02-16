'use client';

import { useState, useEffect } from 'react';
import { getFromLocal, saveToLocal } from '@/lib/storage';

export const useSquad = () => {
    const [squad, setSquad] = useState({
        defenders: [],
        midfielders: [],
        forwards: [],
        goalkeeper: null,
    });

    useEffect(() => {
        const savedSquad = getFromLocal('userSquad');
        if (savedSquad) setSquad(savedSquad);
    }, []);

    const addPlayer = (position, player) => {
        const newSquad = { ...squad, [position]: [...squad[position], player] };
        setSquad(newSquad);
        saveToLocal('userSquad', newSquad);
    };

    const removePlayer = (position, playerId) => {
        const newSquad = {
            ...squad,
            [position]: squad[position].filter(p => p.id !== playerId)
        };
        setSquad(newSquad);
        saveToLocal('userSquad', newSquad);
    };

    return { squad, addPlayer, removePlayer };
};
