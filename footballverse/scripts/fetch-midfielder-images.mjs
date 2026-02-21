// Run: node scripts/fetch-midfielder-images.mjs
const midfielders = [
    // CDMs
    
    { id: 'casemiro', query: 'Casemiro' },
    { id: 'rice', query: 'Declan Rice' },
    { id: 'tchouameni', query: 'Aurelien Tchouameni' },
    { id: 'kante', query: 'N Golo Kante' },
    { id: 'caicedo', query: 'Moises Caicedo' },
    { id: 'bissouma', query: 'Yves Bissouma' },
    { id: 'ndidi', query: 'Wilfred Ndidi' },
    { id: 'amrabat', query: 'Sofyan Amrabat' },
    { id: 'wijnaldum', query: 'Georginio Wijnaldum' },
    { id: 'mcallister', query: 'Alexis Mac Allister' },
    { id: 'palinha', query: 'Joao Palhinha' },
    { id: 'guimaraes', query: 'Bruno Guimaraes' },
    { id: 'camavinga', query: 'Eduardo Camavinga' },
    { id: 'zakaria', query: 'Denis Zakaria' },
    { id: 'bennacer', query: 'Ismael Bennacer' },
    { id: 'neves', query: 'Ruben Neves' },
    { id: 'goretzka', query: 'Leon Goretzka' },
    { id: 'kimmich', query: 'Joshua Kimmich' },
    // CMs
    { id: 'pedri', query: 'Pedri' },
    { id: 'bellingham', query: 'Jude Bellingham' },
    { id: 'valverde', query: 'Federico Valverde' },
    { id: 'debruyne', query: 'Kevin De Bruyne' },
    { id: 'modric', query: 'Luka Modric' },
    { id: 'kroos', query: 'Toni Kroos' },
    { id: 'barella', query: 'Nicolo Barella' },
    { id: 'gavi', query: 'Gavi' },
    { id: 'foden', query: 'Phil Foden' },
    { id: 'saka', query: 'Bukayo Saka' },
    { id: 'bernardo', query: 'Bernardo Silva' },
    { id: 'enzo', query: 'Enzo Fernandez' },
    { id: 'szoboszlai', query: 'Dominik Szoboszlai' },
    { id: 'gravenberch', query: 'Ryan Gravenberch' },
    { id: 'tonali', query: 'Sandro Tonali' },
    { id: 'kovacic', query: 'Mateo Kovacic' },
    { id: 'lavia', query: 'Romeo Lavia' },
    { id: 'nkunku', query: 'Christopher Nkunku' },
    { id: 'thiago', query: 'Thiago Alcantara' },
    { id: 'mount', query: 'Mason Mount' },
    { id: 'mainoo', query: 'Kobbie Mainoo' },
    { id: 'jorginho', query: 'Jorginho' },
    { id: 'calhanoglu', query: 'Hakan Calhanoglu' },
    { id: 'gallagher', query: 'Conor Gallagher' },
    // CAMs / Attacking Mids
    { id: 'odegaard', query: 'Martin Odegaard' },
    { id: 'maddison', query: 'James Maddison' },
    { id: 'brunoF', query: 'Bruno Fernandes' },
    { id: 'dybala', query: 'Paulo Dybala' },
    { id: 'muller', query: 'Thomas Muller' },
    { id: 'havertz', query: 'Kai Havertz' },
    { id: 'wirtz', query: 'Florian Wirtz' },
    { id: 'musiala', query: 'Jamal Musiala' },
    { id: 'olmo', query: 'Dani Olmo' },
    { id: 'lmartinez', query: 'Lautaro Martinez' },
    // Wingers (LW/RW as midfield options)
    { id: 'vinicius', query: 'Vinicius Junior' },
    { id: 'salah', query: 'Mohamed Salah' },
    { id: 'mbappe', query: 'Kylian Mbappe' },
    // Legends
    { id: 'zidane', query: 'Zinedine Zidane' },
    { id: 'xavi', query: 'Xavi Hernandez' },
    { id: 'iniesta', query: 'Andres Iniesta' },
    { id: 'pirlo', query: 'Andrea Pirlo' },
    { id: 'scholes', query: 'Paul Scholes' },
    { id: 'gerrard', query: 'Steven Gerrard' },
    { id: 'lampard', query: 'Frank Lampard' },
    { id: 'seedorf', query: 'Clarence Seedorf' },
    { id: 'vieira', query: 'Patrick Vieira' },
    { id: 'matthaus', query: 'Lothar Matthaus' },
    { id: 'makelele', query: 'Claude Makelele' },
    { id: 'platini', query: 'Michel Platini' },
    { id: 'rijkaard', query: 'Frank Rijkaard' },
    { id: 'gullit', query: 'Ruud Gullit' },
    { id: 'bergkamp', query: 'Dennis Bergkamp' },
    { id: 'ronaldinho', query: 'Ronaldinho' },
    { id: 'kaka', query: 'Kaka' },
    { id: 'davids', query: 'Edgar Davids' },
    { id: 'nedved', query: 'Pavel Nedved' },
    { id: 'beckham', query: 'David Beckham' },
];

const delay = (ms) => new Promise(r => setTimeout(r, ms));

async function fetchPlayer(d) {
    const url = `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(d.query)}`;
    try {
        const res = await fetch(url);
        if (!res.ok) return { id: d.id, thumb: null, status: res.status };
        const data = await res.json();
        if (!data.player) return { id: d.id, thumb: null, status: 'no_player' };
        const soccer = data.player.filter(p => p.strSport === 'Soccer');
        const match = soccer[0] || data.player[0];
        return { id: d.id, thumb: match.strThumb, status: 'ok', apiName: match.strPlayer };
    } catch (e) {
        return { id: d.id, thumb: null, status: e.message };
    }
}

async function main() {
    const results = [];
    for (let i = 0; i < midfielders.length; i++) {
        const result = await fetchPlayer(midfielders[i]);
        results.push(result);
        const symbol = result.thumb ? '✓' : '✗';
        console.log(`[${i + 1}/${midfielders.length}] ${symbol} ${midfielders[i].query} → ${result.thumb || result.status}`);
        if (i < midfielders.length - 1) await delay(2500);
    }
    console.log('\n\nconst IMAGE_MAP = ' + JSON.stringify(
        Object.fromEntries(results.filter(r => r.thumb).map(r => {
            const m = r.thumb.match(/images\/media\/player\/thumb\/(.+)/);
            return [r.id, m ? m[1] : r.thumb];
        })), null, 2) + ';');
    const missing = results.filter(r => !r.thumb);
    if (missing.length) {
        console.log(`\n// MISSING (${missing.length}):`);
        missing.forEach(r => console.log(`// - ${r.id} (${r.status})`));
    }
}
main();
