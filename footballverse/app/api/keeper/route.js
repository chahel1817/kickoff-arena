import { NextResponse } from 'next/server';

const OR_URL = 'https://openrouter.ai/api/v1/chat/completions';

const ZONE_LABELS = {
    tl: 'top-left corner', tc: 'top-centre', tr: 'top-right corner',
    ml: 'mid-left', mc: 'middle-centre', mr: 'mid-right',
    bl: 'low-left', bc: 'low-centre', br: 'low-right',
};

// Rich commentary banks — varied per result type
const SAVE_COMMENTS = [
    'The keeper reads it like a book!',
    'Instinct and class — no chance!',
    'Dives full stretch — what a stopper!',
    'The wall holds firm!',
    'Saw it all the way — denied!',
    'Textbook positioning, perfect save!',
    'Flying to the corner — spectacular!',
    'Nerve of steel — that was brilliant!',
    'He knew exactly where it was going.',
    'Lightning reflexes — nothing gets past!',
];

const GOAL_MISS_COMMENTS = [
    'Goes the wrong way entirely!',
    'Wrong corner — the net bulges!',
    'Committed too early — beaten!',
    'Dives but it\'s the other side!',
    'No chance — hit the top corner!',
    'Keeper guesses wrong — it\'s a goal!',
    'Completely wrong direction — red-faced!',
    'Dives left, ball goes right — unlucky!',
    'Caught out cold — wrong read!',
    'He had no chance with that one!',
];

const TOP_CORNER_SAVE = [
    'Somehow gets a hand to it at the top!',
    'Unbelievable — fingertips at full stretch!',
    'That looked in — superb save!',
    'Athletic save — defied gravity!',
];

const LOW_SAVE = [
    'Down low — sharp stop!',
    'Gets body behind it — strong hands!',
    'Brilliant dive at the near post!',
    'Smothers it — composed and calm!',
];

function pickComment(savedIt, keeperZone, shotZone) {
    const isTopCorner = ['tl', 'tr'].includes(shotZone);
    const isLow = ['bl', 'bc', 'br'].includes(shotZone);

    if (savedIt) {
        if (isTopCorner) return TOP_CORNER_SAVE[Math.floor(Math.random() * TOP_CORNER_SAVE.length)];
        if (isLow) return LOW_SAVE[Math.floor(Math.random() * LOW_SAVE.length)];
        return SAVE_COMMENTS[Math.floor(Math.random() * SAVE_COMMENTS.length)];
    }
    return GOAL_MISS_COMMENTS[Math.floor(Math.random() * GOAL_MISS_COMMENTS.length)];
}

// Smart weighted keeper zone selection
function weightedKeeperZone(shotHistory, shooterRating, keeperType) {
    const zones = Object.keys(ZONE_LABELS);
    const freq = {};
    zones.forEach(z => (freq[z] = 0));
    (shotHistory || []).forEach(h => { if (freq[h] !== undefined) freq[h]++; });

    let weights = zones.map(z => 1 + freq[z] * 1.8);

    if (keeperType === 'WALL') {
        ['bl', 'bc', 'br', 'ml', 'mr'].forEach(z => { weights[zones.indexOf(z)] *= 2.2; });
    } else if (keeperType === 'REFLEXES') {
        ['tl', 'tr', 'bl', 'br'].forEach(z => { weights[zones.indexOf(z)] *= 2.0; });
    } else if (keeperType === 'READER') {
        zones.forEach((z, i) => { weights[i] = 1 + freq[z] * 3.2; });
    }

    const ratingPenalty = Math.max(0, (shooterRating - 75) / 100);
    const totalWeight = weights.reduce((a, b) => a + b, 0);

    // Random override — keeper sometimes just guesses
    if (Math.random() < 0.28 + ratingPenalty) {
        return zones[Math.floor(Math.random() * zones.length)];
    }

    let rng = Math.random() * totalWeight;
    for (let i = 0; i < zones.length; i++) {
        rng -= weights[i];
        if (rng <= 0) return zones[i];
    }
    return zones[Math.floor(Math.random() * zones.length)];
}

export async function POST(req) {
    let body = {};
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ keeperZone: 'mc', comment: 'Dives to the centre!', source: 'error' });
    }

    const {
        shooterName, shooterRating = 75, shooterPosition,
        shotZone, shotHistory = [], keeperType = 'READER',
        shotNumber = 1,
    } = body;

    const apiKey = process.env.OPENROUTER_API_KEY;

    // ── No API key: use smart local logic ──
    if (!apiKey) {
        const keeperZone = weightedKeeperZone(shotHistory, shooterRating, keeperType);
        const savedIt = keeperZone === shotZone;
        return NextResponse.json({
            keeperZone,
            comment: pickComment(savedIt, keeperZone, shotZone),
            source: 'local',
        });
    }

    // ── Try OpenRouter ──
    try {
        const systemPrompt = `You are an AI goalkeeper in a penalty shootout game.
Respond ONLY with valid JSON: {"zone":"<zone_id>","comment":"<dramatic 1-line, max 10 words>"}
Zone IDs: tl(top-left), tc(top-centre), tr(top-right), ml(mid-left), mc(centre), mr(mid-right), bl(low-left), bc(low-centre), br(low-right).
Keeper type: ${keeperType}. Do NOT always dive correctly. Rating 85+ shooter scores ~75%. Average ~55%.`;

        const userPrompt = `Shot ${shotNumber}/5. 
Shooter: ${shooterName} (${shooterPosition}, OVR ${shooterRating}).
Previous zones: [${shotHistory.map(z => ZONE_LABELS[z] || z).join(', ') || 'none'}].
Current shot aimed: ${ZONE_LABELS[shotZone] || shotZone}.
Pick a dive zone and write a dramatic commentary line.`;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 3500);

        const orRes = await fetch(OR_URL, {
            method: 'POST',
            signal: controller.signal,
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://kickoff-arena.vercel.app',
                'X-Title': 'Kickoff Arena',
            },
            body: JSON.stringify({
                model: 'meta-llama/llama-3.1-8b-instruct:free',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                ],
                max_tokens: 80,
                temperature: 0.95,
            }),
        });

        clearTimeout(timeout);
        if (!orRes.ok) throw new Error(`OR ${orRes.status}`);

        const orData = await orRes.json();
        const raw = orData?.choices?.[0]?.message?.content?.trim() || '';
        const match = raw.match(/\{[\s\S]*\}/);
        if (!match) throw new Error('no JSON');

        const parsed = JSON.parse(match[0]);
        const keeperZone = parsed.zone && ZONE_LABELS[parsed.zone] !== undefined
            ? parsed.zone
            : weightedKeeperZone(shotHistory, shooterRating, keeperType);
        const savedIt = keeperZone === shotZone;

        return NextResponse.json({
            keeperZone,
            comment: parsed.comment || pickComment(savedIt, keeperZone, shotZone),
            source: 'ai',
        });

    } catch (err) {
        // Graceful fallback — never hardcode one comment
        console.error('[keeper/api]', err.message);
        const keeperZone = weightedKeeperZone(shotHistory, shooterRating, keeperType);
        const savedIt = keeperZone === shotZone;
        return NextResponse.json({
            keeperZone,
            comment: pickComment(savedIt, keeperZone, shotZone),
            source: 'fallback',
        });
    }
}
