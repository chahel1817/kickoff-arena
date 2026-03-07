import { NextResponse } from 'next/server';

const TSDB_SEARCH_URL = 'https://www.thesportsdb.com/api/v1/json/3/searchplayers.php';
const FALLBACK_IMAGE = '/player-fallback.svg';

const normalize = (value = '') => value.toLowerCase().replace(/[^a-z0-9]/g, '');

const MANUAL_IMAGE_OVERRIDES = {
    pedri: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Pedri.jpg',
    gavi: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Gavi_%28footballer%29.jpg',
};

const QUERY_OVERRIDES = {
    pedri: 'Pedro Gonzalez',
    gavi: 'Pablo Paez Gavira',
};

const viaWeserv = (remoteUrl) => {
    if (!remoteUrl) return null;
    const stripped = remoteUrl.replace(/^https?:\/\//, '');
    return `https://images.weserv.nl/?url=${stripped}&w=400&h=500&fit=cover&a=top`;
};

const pickBestPlayer = (players, club) => {
    if (!Array.isArray(players) || players.length === 0) return null;
    if (!club) return players[0];

    const clubKey = normalize(club);
    const match = players.find((player) => normalize(player?.strTeam || '').includes(clubKey));
    return match || players[0];
};

const pickImage = (player) => {
    const direct = player?.strCutout || player?.strRender || player?.strThumb || player?.strFanart1;
    return direct ? viaWeserv(direct) : null;
};

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name') || '';
    const club = searchParams.get('club') || '';
    const fallback = searchParams.get('fallback') || '';
    const normalizedName = normalize(name);

    if (MANUAL_IMAGE_OVERRIDES[normalizedName]) {
        return NextResponse.json(
            { image: MANUAL_IMAGE_OVERRIDES[normalizedName], source: 'manual' },
            { headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' } }
        );
    }

    if (!name.trim()) {
        return NextResponse.json({ image: fallback || FALLBACK_IMAGE, source: 'fallback' }, {
            headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' },
        });
    }

    try {
        const searchName = QUERY_OVERRIDES[normalizedName] || name;
        const url = `${TSDB_SEARCH_URL}?p=${encodeURIComponent(searchName)}`;
        const res = await fetch(url, {
            method: 'GET',
            next: { revalidate: 60 * 60 * 24 * 7 },
        });
        if (!res.ok) throw new Error(`tsdb ${res.status}`);

        const data = await res.json();
        const best = pickBestPlayer(data?.player, club);
        const resolved = pickImage(best);

        return NextResponse.json(
            {
                image: resolved || fallback || FALLBACK_IMAGE,
                source: resolved ? 'api' : 'fallback',
            },
            {
                headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800' },
            }
        );
    } catch {
        return NextResponse.json(
            { image: fallback || FALLBACK_IMAGE, source: 'fallback' },
            { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } }
        );
    }
}
