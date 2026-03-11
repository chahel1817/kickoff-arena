const STAT_KEYS = ['pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical'];

const clamp = (value, min = 20, max = 99) => Math.max(min, Math.min(max, Math.round(value)));
const normalizePosition = (pos = '') => String(pos || '').toUpperCase().trim();

const hashString = (value = '') => {
    let hash = 2166136261;
    for (let i = 0; i < value.length; i++) {
        hash ^= value.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return Math.abs(hash >>> 0);
};

const seededOffset = (player, statKey, spread = 2) => {
    const seed = `${player?.id || ''}|${player?.name || ''}|${statKey}`;
    const hash = hashString(seed);
    const range = spread * 2 + 1;
    return (hash % range) - spread;
};

const mapLegacyStats = (stats) => {
    if (!stats || typeof stats !== 'object') return null;
    const mapped = {
        pace: stats.pace ?? stats.pac,
        shooting: stats.shooting ?? stats.sho,
        passing: stats.passing ?? stats.pas,
        dribbling: stats.dribbling ?? stats.dri,
        defending: stats.defending ?? stats.def,
        physical: stats.physical ?? stats.phy,
    };
    const hasAll = STAT_KEYS.every((k) => Number.isFinite(Number(mapped[k])));
    if (!hasAll) return null;
    return {
        pace: clamp(mapped.pace),
        shooting: clamp(mapped.shooting),
        passing: clamp(mapped.passing),
        dribbling: clamp(mapped.dribbling),
        defending: clamp(mapped.defending),
        physical: clamp(mapped.physical),
    };
};

const ROLE_RANGES = {
    GK: { pace: [28, 55], shooting: [10, 30], passing: [45, 82], dribbling: [18, 48], defending: [12, 35], physical: [62, 90] },
    CB: { pace: [54, 83], shooting: [28, 58], passing: [52, 85], dribbling: [45, 74], defending: [74, 95], physical: [74, 95] },
    LB: { pace: [68, 93], shooting: [45, 75], passing: [62, 88], dribbling: [60, 90], defending: [66, 89], physical: [66, 90] },
    RB: { pace: [68, 93], shooting: [45, 75], passing: [62, 88], dribbling: [60, 90], defending: [66, 89], physical: [66, 90] },
    LWB: { pace: [72, 95], shooting: [48, 78], passing: [65, 90], dribbling: [64, 92], defending: [62, 86], physical: [64, 88] },
    RWB: { pace: [72, 95], shooting: [48, 78], passing: [65, 90], dribbling: [64, 92], defending: [62, 86], physical: [64, 88] },
    CDM: { pace: [58, 82], shooting: [38, 68], passing: [62, 90], dribbling: [56, 82], defending: [72, 93], physical: [72, 92] },
    CM: { pace: [62, 88], shooting: [56, 84], passing: [70, 95], dribbling: [70, 94], defending: [48, 78], physical: [62, 88] },
    CAM: { pace: [66, 92], shooting: [64, 90], passing: [74, 97], dribbling: [74, 97], defending: [36, 68], physical: [56, 84] },
    LM: { pace: [76, 96], shooting: [58, 86], passing: [68, 92], dribbling: [76, 97], defending: [36, 66], physical: [58, 84] },
    RM: { pace: [76, 96], shooting: [58, 86], passing: [68, 92], dribbling: [76, 97], defending: [36, 66], physical: [58, 84] },
    ST: { pace: [70, 95], shooting: [72, 98], passing: [54, 84], dribbling: [58, 89], defending: [24, 56], physical: [66, 94] },
    CF: { pace: [72, 95], shooting: [68, 95], passing: [64, 92], dribbling: [74, 97], defending: [26, 58], physical: [62, 88] },
    LW: { pace: [78, 98], shooting: [64, 92], passing: [62, 90], dribbling: [78, 98], defending: [24, 52], physical: [56, 82] },
    RW: { pace: [78, 98], shooting: [64, 92], passing: [62, 90], dribbling: [78, 98], defending: [24, 52], physical: [56, 82] },
};

const DEFAULT_RANGE = { pace: [55, 85], shooting: [55, 85], passing: [55, 85], dribbling: [55, 85], defending: [55, 85], physical: [55, 85] };

const ROLE_BIASES = {
    GK: { pace: -2, shooting: -6, passing: 1, dribbling: -3, defending: -4, physical: 3 },
    CB: { pace: -1, shooting: -3, passing: 0, dribbling: -1, defending: 4, physical: 3 },
    LB: { pace: 2, shooting: 0, passing: 1, dribbling: 1, defending: 2, physical: 1 },
    RB: { pace: 2, shooting: 0, passing: 1, dribbling: 1, defending: 2, physical: 1 },
    LWB: { pace: 2, shooting: 1, passing: 1, dribbling: 2, defending: 1, physical: 1 },
    RWB: { pace: 2, shooting: 1, passing: 1, dribbling: 2, defending: 1, physical: 1 },
    CDM: { pace: 0, shooting: -1, passing: 2, dribbling: 0, defending: 3, physical: 2 },
    CM: { pace: 0, shooting: 1, passing: 3, dribbling: 2, defending: 0, physical: 0 },
    CAM: { pace: 1, shooting: 2, passing: 3, dribbling: 3, defending: -3, physical: -1 },
    LM: { pace: 2, shooting: 2, passing: 1, dribbling: 3, defending: -3, physical: -1 },
    RM: { pace: 2, shooting: 2, passing: 1, dribbling: 3, defending: -3, physical: -1 },
    ST: { pace: 2, shooting: 4, passing: -1, dribbling: 2, defending: -4, physical: 1 },
    CF: { pace: 2, shooting: 3, passing: 2, dribbling: 3, defending: -3, physical: 0 },
    LW: { pace: 3, shooting: 2, passing: 1, dribbling: 4, defending: -4, physical: -1 },
    RW: { pace: 3, shooting: 2, passing: 1, dribbling: 4, defending: -4, physical: -1 },
};

const EMPTY_ADJUST = { pace: 0, shooting: 0, passing: 0, dribbling: 0, defending: 0, physical: 0 };

const getArchetypeAdjustments = (player) => {
    const skillsText = Array.isArray(player?.skills) ? player.skills.join(' ').toLowerCase() : '';
    const adj = { ...EMPTY_ADJUST };
    if (!skillsText) return adj;

    const hasAny = (tokens) => tokens.some((t) => skillsText.includes(t));

    if (hasAny(['tackle', 'destroyer', 'anchor', 'intercept', 'rock', 'wall', 'warrior', 'ball winner', 'tactical'])) {
        adj.defending += 3;
        adj.physical += 2;
        adj.passing -= 2;
        adj.dribbling -= 3;
        adj.shooting -= 2;
    }
    if (hasAny(['maestro', 'playmaker', 'vision', 'distributor', 'metronome', 'pass', 'controller'])) {
        adj.passing += 3;
        adj.dribbling += 1;
        adj.defending -= 1;
    }
    if (hasAny(['dribbler', 'agile', 'silky', 'tricky', 'flair', 'tight spaces', 'quick feet'])) {
        adj.dribbling += 3;
        adj.pace += 1;
        adj.physical -= 1;
    }
    if (hasAny(['finisher', 'poacher', 'clinical', 'sniper', 'striker'])) {
        adj.shooting += 3;
        adj.passing -= 1;
    }
    if (hasAny(['aerial', 'power', 'strong', 'target man'])) {
        adj.physical += 2;
        adj.pace -= 1;
    }

    return adj;
};

const statFromRange = (rating, min, max) => {
    const t = clamp((rating - 70) / 28, 0, 1); // 70 -> 0, 98 -> 1
    return min + (max - min) * t;
};

const resolveRole = (position) => {
    const pos = normalizePosition(position);
    if (ROLE_RANGES[pos]) return pos;
    if (pos.includes('GK')) return 'GK';
    if (pos.includes('CB')) return 'CB';
    if (pos.includes('LB')) return 'LB';
    if (pos.includes('RB')) return 'RB';
    if (pos.includes('WB')) return 'LWB';
    if (pos.includes('CDM')) return 'CDM';
    if (pos.includes('CAM')) return 'CAM';
    if (pos.includes('CM')) return 'CM';
    if (pos.includes('LM')) return 'LM';
    if (pos.includes('RM')) return 'RM';
    if (pos.includes('CF')) return 'CF';
    if (pos.includes('ST')) return 'ST';
    if (pos.includes('LW')) return 'LW';
    if (pos.includes('RW')) return 'RW';
    return 'CM';
};

export const getPlayerDisplayStats = (player) => {
    const explicit = mapLegacyStats(player?.stats);
    if (explicit) return explicit;

    const rating = Number.isFinite(Number(player?.rating)) ? Number(player.rating) : 75;
    const role = resolveRole(player?.position);
    const ranges = ROLE_RANGES[role] || DEFAULT_RANGE;
    const biases = ROLE_BIASES[role] || {};
    const archetype = getArchetypeAdjustments(player);

    const output = {};
    for (const key of STAT_KEYS) {
        const [min, max] = ranges[key] || DEFAULT_RANGE[key];
        const base = statFromRange(rating, min, max);
        const value = base + (biases[key] || 0) + (archetype[key] || 0) + seededOffset(player, key, 2);
        output[key] = clamp(value, min, max);
    }
    return output;
};
