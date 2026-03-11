const FALLBACK_IMAGE = '/player-fallback.svg';
const WESERV_HOST = 'images.weserv.nl';

const KNOWN_IMAGE_HOSTS = [
    'upload.wikimedia.org',
    'wikipedia.org',
    'r2.thesportsdb.com',
    'www.thesportsdb.com',
    'images.weserv.nl',
];

const hasImageExtension = (url = '') => /\.(avif|webp|png|jpe?g|gif|svg)(\?|$)/i.test(url);

const isLikelySearchUrl = (url = '') => {
    const value = url.toLowerCase();
    return value.includes('/search?') || value.includes('tbm=isch') || value.includes('/url?');
};

const isHttpUrl = (value = '') => /^https?:\/\//i.test(value);

const isLikelyImageUrl = (value = '') => {
    if (!value || typeof value !== 'string') return false;
    const url = value.trim();
    if (!url) return false;
    if (!isHttpUrl(url) && !url.startsWith('/')) return false;
    if (isLikelySearchUrl(url)) return false;
    if (url.startsWith('/')) return true;

    try {
        const parsed = new URL(url);
        if (hasImageExtension(parsed.pathname)) return true;
        return KNOWN_IMAGE_HOSTS.some((host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`));
    } catch {
        return false;
    }
};

const toWeservUrl = (remoteUrl = '', width = 400, height = 500) => {
    if (!isHttpUrl(remoteUrl)) return remoteUrl;

    try {
        const parsed = new URL(remoteUrl);
        if (parsed.hostname === WESERV_HOST) return remoteUrl;
        const stripped = remoteUrl.replace(/^https?:\/\//i, '');
        return `https://${WESERV_HOST}/?url=${encodeURIComponent(stripped)}&w=${width}&h=${height}&fit=cover&a=top`;
    } catch {
        return remoteUrl;
    }
};

const normalizePlayerImageUrl = (value = '', options = {}) => {
    const { proxify = true, width = 400, height = 500 } = options;
    if (!value || typeof value !== 'string') return '';
    const trimmed = value.trim();
    if (!isLikelyImageUrl(trimmed)) return '';
    if (trimmed.startsWith('/')) return trimmed;
    return proxify ? toWeservUrl(trimmed, width, height) : trimmed;
};

const getResolvedPlayerImage = (player, imageMap = {}, options = {}) => {
    const key = `${player?.id}::${player?.name}`;
    const mapped = imageMap[key] || '';
    const mappedUrl = normalizePlayerImageUrl(mapped, options);
    if (mappedUrl) return mappedUrl;

    const playerUrl = normalizePlayerImageUrl(player?.image || '', options);
    if (playerUrl) return playerUrl;

    return FALLBACK_IMAGE;
};

const getSafePlayerImage = (player, options = {}) => {
    const playerUrl = normalizePlayerImageUrl(player?.image || '', options);
    return playerUrl || FALLBACK_IMAGE;
};

export {
    FALLBACK_IMAGE,
    getResolvedPlayerImage,
    getSafePlayerImage,
    isLikelyImageUrl,
    normalizePlayerImageUrl,
    toWeservUrl,
};
