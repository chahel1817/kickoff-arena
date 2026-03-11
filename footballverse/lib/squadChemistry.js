const clamp = (value, min = 0, max = 100) => Math.max(min, Math.min(max, Math.round(value)));

const avg = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

const stdDev = (arr) => {
    if (arr.length <= 1) return 0;
    const mean = avg(arr);
    const variance = avg(arr.map((v) => (v - mean) ** 2));
    return Math.sqrt(variance);
};

export const computeSquadChemistry = ({
    formation,
    gk,
    defenders = [],
    midfielders = [],
    forwards = [],
} = {}) => {
    const players = [gk, ...defenders, ...midfielders, ...forwards].filter(Boolean);
    if (players.length === 0) {
        return {
            score: 0,
            nationLinks: 0,
            clubLinks: 0,
            leagueLinks: 0,
            breakdown: { completeness: 0, links: 0, balance: 0, formationFit: 0 },
        };
    }

    const defNeed = formation?.defenders || 4;
    const midNeed = formation?.midfielders || 3;
    const fwdNeed = formation?.forwards || 3;
    const totalNeed = 1 + defNeed + midNeed + fwdNeed;

    const totalHave = players.length;
    const completeness = Math.min(35, (totalHave / totalNeed) * 35);

    const needVsHaveScore = (
        (gk ? 1 : 0) * 4 +
        Math.min(1, defenders.length / Math.max(defNeed, 1)) * 4 +
        Math.min(1, midfielders.length / Math.max(midNeed, 1)) * 4 +
        Math.min(1, forwards.length / Math.max(fwdNeed, 1)) * 3
    );
    const formationFit = Math.min(15, needVsHaveScore);

    let rawLinks = 0;
    let nationLinks = 0;
    let clubLinks = 0;
    let leagueLinks = 0;
    for (let i = 0; i < players.length; i++) {
        for (let j = i + 1; j < players.length; j++) {
            const a = players[i];
            const b = players[j];
            if (a.club && b.club && a.club === b.club) {
                rawLinks += 2.5;
                clubLinks += 1;
            }
            if (a.country && b.country && a.country === b.country) {
                rawLinks += 1.5;
                nationLinks += 1;
            }
            if (a.league && b.league && a.league === b.league) {
                rawLinks += 1;
                leagueLinks += 1;
            }
        }
    }
    const maxPairs = (players.length * (players.length - 1)) / 2;
    const maxRawLinks = Math.max(1, maxPairs * 3.2);
    const links = Math.min(30, (rawLinks / maxRawLinks) * 30);

    const lineMeans = [
        gk?.rating ? Number(gk.rating) : null,
        defenders.length ? avg(defenders.map((p) => Number(p.rating) || 70)) : null,
        midfielders.length ? avg(midfielders.map((p) => Number(p.rating) || 70)) : null,
        forwards.length ? avg(forwards.map((p) => Number(p.rating) || 70)) : null,
    ].filter((v) => v !== null);

    const allRatings = players.map((p) => Number(p.rating) || 70);
    const squadStd = stdDev(allRatings);
    const linesStd = stdDev(lineMeans);
    const stdPenalty = Math.min(16, squadStd * 1.1 + linesStd * 1.3);
    const balance = Math.max(0, 20 - stdPenalty);

    const score = clamp(completeness + formationFit + links + balance);

    return {
        score,
        nationLinks,
        clubLinks,
        leagueLinks,
        breakdown: {
            completeness: Math.round(completeness),
            formationFit: Math.round(formationFit),
            links: Math.round(links),
            balance: Math.round(balance),
        },
    };
};

