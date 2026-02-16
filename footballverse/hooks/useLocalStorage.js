'use client';

import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue) => {
    const [value, setValue] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : initialValue;
        }
        return initialValue;
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
};
