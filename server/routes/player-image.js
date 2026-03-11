import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

const TSDB_SEARCH_URL = 'https://www.thesportsdb.com/api/v1/json/3/searchplayers.php';
const FALLBACK_IMAGE = 'https://via.placeholder.com/400x600?text=No+Player+Image';

const normalize = (value = '') => value.toLowerCase().replace(/[^a-z0-9]/g, '');

const MANUAL_IMAGE_OVERRIDES = {
    pedri: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Pedri.jpg',
    gavi: 'https://upload.wikimedia.org/wikipedia/commons/2/2d/Gavi_%28footballer%29.jpg',
    deligt: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Matthijs_de_Ligt_2024.jpg',
    matthijsdeligt: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Matthijs_de_Ligt_2024.jpg',
    matthijsdelight: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Matthijs_de_Ligt_2024.jpg',
    mendes: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Nuno_Mendes_PSG.jpg/640px-Nuno_Mendes_PSG.jpg',
    nunomendes: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Nuno_Mendes_PSG.jpg/640px-Nuno_Mendes_PSG.jpg',
    nuno_mendes: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Nuno_Mendes_PSG.jpg/640px-Nuno_Mendes_PSG.jpg',
    vitinha: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Vitinha_PSG.jpg/640px-Vitinha_PSG.jpg',
};

const QUERY_OVERRIDES = {
    pedri: 'Pedro Gonzalez',
    gavi: 'Pablo Paez Gavira',
    deligt: 'Matthijs de Ligt',
    matthijsdeligt: 'Matthijs de Ligt',
    mendes: 'Nuno Mendes PSG',
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

router.get('/', async (req, res) => {
    const { name = '', club = '', fallback = '' } = req.query;
    const normalizedName = normalize(name);

    if (MANUAL_IMAGE_OVERRIDES[normalizedName]) {
        return res.json({ image: MANUAL_IMAGE_OVERRIDES[normalizedName], source: 'manual' });
    }

    if (!name.trim()) {
        return res.json({ image: fallback || FALLBACK_IMAGE, source: 'fallback' });
    }

    try {
        const searchName = QUERY_OVERRIDES[normalizedName] || name;
        const url = `${TSDB_SEARCH_URL}?p=${encodeURIComponent(searchName)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`tsdb ${response.status}`);

        const data = await response.json();
        const best = pickBestPlayer(data?.player, club);
        const resolved = pickImage(best);

        res.json({
            image: resolved || fallback || FALLBACK_IMAGE,
            source: resolved ? 'api' : 'fallback',
        });
    } catch (err) {
        res.json({ image: fallback || FALLBACK_IMAGE, source: 'error' });
    }
});

export default router;
