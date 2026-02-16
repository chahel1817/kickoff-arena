export const saveToLocal = (key, data) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(data));
    }
};

export const getFromLocal = (key) => {
    if (typeof window !== 'undefined') {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
    return null;
};

export const removeFromLocal = (key) => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(key);
    }
};
