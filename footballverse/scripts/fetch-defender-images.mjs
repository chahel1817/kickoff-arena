// Run: node scripts/fetch-defender-images.mjs
// This script fetches the correct strThumb URL for each defender from TheSportsDB API

const defenders = [
    { id: 'vvd', name: 'Virgil van Dijk', query: 'Virgil van Dijk' },
    { id: 'saliba', name: 'William Saliba', query: 'William Saliba' },
    { id: 'dias', name: 'Rúben Dias', query: 'Ruben Dias' },
    { id: 'gabriel', name: 'Gabriel Magalhães', query: 'Gabriel Magalhaes' },
    { id: 'bastoni', name: 'Alessandro Bastoni', query: 'Alessandro Bastoni' },
    { id: 'rudiger', name: 'Antonio Rüdiger', query: 'Antonio Rudiger' },
    { id: 'araujo', name: 'Ronald Araújo', query: 'Ronald Araujo' },
    { id: 'romero', name: 'Cristian Romero', query: 'Cristian Romero' },
    { id: 'stones', name: 'John Stones', query: 'John Stones' },
    { id: 'militao', name: 'Éder Militão', query: 'Eder Militao' },
    { id: 'alaba', name: 'David Alaba', query: 'David Alaba' },
    { id: 'minjae', name: 'Kim Min-jae', query: 'Kim Min-jae' },
    { id: 'skriniar', name: 'Milan Škriniar', query: 'Milan Skriniar' },
    { id: 'tah', name: 'Jonathan Tah', query: 'Jonathan Tah' },
    { id: 'gvardiol', name: 'Joško Gvardiol', query: 'Josko Gvardiol' },
    { id: 'deligt', name: 'Matthijs de Ligt', query: 'de Ligt' },
    { id: 'marquinhos', name: 'Marquinhos', query: 'Marquinhos' },
    { id: 'konate', name: 'Ibrahima Konaté', query: 'Ibrahima Konate' },
    { id: 'martinez', name: 'Lisandro Martínez', query: 'Lisandro Martinez' },
    { id: 'gimenez', name: 'José Giménez', query: 'Jose Gimenez' },
    { id: 'laporte', name: 'Aymeric Laporte', query: 'Aymeric Laporte' },
    { id: 'pau-torres', name: 'Pau Torres', query: 'Pau Torres' },
    { id: 'vandeven', name: 'Micky van de Ven', query: 'Micky van de Ven' },
    { id: 'schlotterbeck', name: 'Nico Schlotterbeck', query: 'Nico Schlotterbeck' },
    { id: 'akanji', name: 'Manuel Akanji', query: 'Manuel Akanji' },
    { id: 'ake', name: 'Nathan Aké', query: 'Nathan Ake' },
    { id: 'upamecano', name: 'Dayot Upamecano', query: 'Dayot Upamecano' },
    { id: 'le-normand', name: 'Robin Le Normand', query: 'Robin Le Normand' },
    { id: 'inigo', name: 'Iñigo Martínez', query: 'Inigo Martinez' },
    { id: 'hummels', name: 'Mats Hummels', query: 'Mats Hummels' },
    { id: 'tomori', name: 'Fikayo Tomori', query: 'Fikayo Tomori' },
    { id: 'tapsoba', name: 'Edmond Tapsoba', query: 'Edmond Tapsoba' },
    { id: 'guehi', name: 'Marc Guéhi', query: 'Marc Guehi' },
    { id: 'bremer', name: 'Gleison Bremer', query: 'Gleison Bremer' },
    { id: 'pavard', name: 'Benjamin Pavard', query: 'Benjamin Pavard' },
    { id: 'botman', name: 'Sven Botman', query: 'Sven Botman' },
    { id: 'dunk', name: 'Lewis Dunk', query: 'Lewis Dunk' },
    { id: 'konsa', name: 'Ezri Konsa', query: 'Ezri Konsa' },
    { id: 'maguire', name: 'Harry Maguire', query: 'Harry Maguire' },
    { id: 'colwill', name: 'Levi Colwill', query: 'Levi Colwill' },
    { id: 'fofana', name: 'Wesley Fofana', query: 'Wesley Fofana' },
    { id: 'disasi', name: 'Axel Disasi', query: 'Axel Disasi' },
    { id: 'branthwaite', name: 'Jarrad Branthwaite', query: 'Jarrad Branthwaite' },
    { id: 'hincapie', name: 'Piero Hincapié', query: 'Piero Hincapie' },
    // RBs
    { id: 'trent', name: 'Trent Alexander-Arnold', query: 'Trent Alexander-Arnold' },
    { id: 'kounde', name: 'Jules Koundé', query: 'Jules Kounde' },
    { id: 'hakimi', name: 'Achraf Hakimi', query: 'Achraf Hakimi' },
    { id: 'carvajal', name: 'Dani Carvajal', query: 'Dani Carvajal' },
    { id: 'walker', name: 'Kyle Walker', query: 'Kyle Walker' },
    { id: 'frimpong', name: 'Jeremie Frimpong', query: 'Jeremie Frimpong' },
    { id: 'cancelo', name: 'João Cancelo', query: 'Joao Cancelo' },
    { id: 'james', name: 'Reece James', query: 'Reece James' },
    { id: 'porro', name: 'Pedro Porro', query: 'Pedro Porro' },
    { id: 'dalot', name: 'Diogo Dalot', query: 'Diogo Dalot' },
    { id: 'white', name: 'Ben White', query: 'Ben White' },
    { id: 'trippier', name: 'Kieran Trippier', query: 'Kieran Trippier' },
    { id: 'mazraoui', name: 'Noussair Mazraoui', query: 'Noussair Mazraoui' },
    { id: 'dumfries', name: 'Denzel Dumfries', query: 'Denzel Dumfries' },
    { id: 'gusto', name: 'Malo Gusto', query: 'Malo Gusto' },
    { id: 'walker-peters', name: 'Kyle Walker-Peters', query: 'Kyle Walker-Peters' },
    { id: 'livramento', name: 'Tino Livramento', query: 'Tino Livramento' },
    // LBs
    { id: 'davies', name: 'Alphonso Davies', query: 'Alphonso Davies' },
    { id: 'robertson', name: 'Andy Robertson', query: 'Andrew Robertson' },
    { id: 'theo', name: 'Theo Hernández', query: 'Theo Hernandez' },
    { id: 'grimaldo', name: 'Alejandro Grimaldo', query: 'Alejandro Grimaldo' },
    { id: 'dimarco', name: 'Federico Dimarco', query: 'Federico Dimarco' },
    { id: 'mendes', name: 'Nuno Mendes', query: 'Nuno Mendes' },
    { id: 'ferland-mendy', name: 'Ferland Mendy', query: 'Ferland Mendy' },
    { id: 'udogie', name: 'Destiny Udogie', query: 'Destiny Udogie' },
    { id: 'cucurella', name: 'Marc Cucurella', query: 'Marc Cucurella' },
    { id: 'calafiori', name: 'Riccardo Calafiori', query: 'Riccardo Calafiori' },
    { id: 'balde', name: 'Alejandro Balde', query: 'Alejandro Balde' },
    { id: 'shaw', name: 'Luke Shaw', query: 'Luke Shaw' },
    { id: 'zinchenko', name: 'Oleksandr Zinchenko', query: 'Oleksandr Zinchenko' },
    { id: 'estupinan', name: 'Pervis Estupiñán', query: 'Pervis Estupinan' },
    { id: 'aitnouri', name: 'Rayan Aït-Nouri', query: 'Rayan Ait-Nouri' },
    // Legends
    { id: 'maldini', name: 'Paolo Maldini', query: 'Paolo Maldini' },
    { id: 'sergio-ramos', name: 'Sergio Ramos', query: 'Sergio Ramos' },
    { id: 'thiago-silva', name: 'Thiago Silva', query: 'Thiago Silva' },
    { id: 'cannavaro', name: 'Fabio Cannavaro', query: 'Fabio Cannavaro' },
    { id: 'ferdinand', name: 'Rio Ferdinand', query: 'Rio Ferdinand' },
    { id: 'terry', name: 'John Terry', query: 'John Terry' },
    { id: 'vidic', name: 'Nemanja Vidić', query: 'Nemanja Vidic' },
    { id: 'puyol', name: 'Carles Puyol', query: 'Carles Puyol' },
    { id: 'nesta', name: 'Alessandro Nesta', query: 'Alessandro Nesta' },
    { id: 'kompany', name: 'Vincent Kompany', query: 'Vincent Kompany' },
    { id: 'pique', name: 'Gerard Piqué', query: 'Gerard Pique' },
    { id: 'varane', name: 'Raphaël Varane', query: 'Raphael Varane' },
    { id: 'chiellini', name: 'Giorgio Chiellini', query: 'Giorgio Chiellini' },
    { id: 'pepe-def', name: 'Pepe', query: 'Pepe' },
    { id: 'cafu', name: 'Cafu', query: 'Cafu' },
    { id: 'lahm', name: 'Philipp Lahm', query: 'Philipp Lahm' },
    { id: 'zanetti', name: 'Javier Zanetti', query: 'Javier Zanetti' },
    { id: 'dani-alves', name: 'Dani Alves', query: 'Dani Alves' },
    { id: 'roberto-carlos', name: 'Roberto Carlos', query: 'Roberto Carlos' },
    { id: 'marcelo', name: 'Marcelo', query: 'Marcelo Vieira' },
    { id: 'ashley-cole', name: 'Ashley Cole', query: 'Ashley Cole' },
    { id: 'jordi-alba', name: 'Jordi Alba', query: 'Jordi Alba' },
    { id: 'patrice-evra', name: 'Patrice Evra', query: 'Patrice Evra' },
];

const delay = (ms) => new Promise(r => setTimeout(r, ms));

async function fetchPlayer(d) {
    const url = `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(d.query)}`;
    try {
        const res = await fetch(url);
        if (!res.ok) return { id: d.id, name: d.name, thumb: null, status: res.status };
        const data = await res.json();
        if (!data.player) return { id: d.id, name: d.name, thumb: null, status: 'no_player' };
        // Find best match - prefer soccer + defender/back positions
        const soccer = data.player.filter(p => p.strSport === 'Soccer');
        const match = soccer.find(p =>
            p.strPosition?.includes('Back') ||
            p.strPosition?.includes('Defender') ||
            p.strPosition?.includes('Centre-Back') ||
            p.strPosition?.includes('Wing')
        ) || soccer[0] || data.player[0];
        return { id: d.id, name: d.name, thumb: match.strThumb, status: 'ok', apiName: match.strPlayer };
    } catch (e) {
        return { id: d.id, name: d.name, thumb: null, status: e.message };
    }
}

async function main() {
    const results = [];
    for (let i = 0; i < defenders.length; i++) {
        const result = await fetchPlayer(defenders[i]);
        results.push(result);
        const symbol = result.thumb ? '✓' : '✗';
        console.log(`[${i + 1}/${defenders.length}] ${symbol} ${result.name} → ${result.thumb || result.status}`);
        // Wait 600ms between requests to avoid rate limiting
        if (i < defenders.length - 1) await delay(2500);
    }

    console.log('\n\n// ═══════════════════════════════════════════');
    console.log('// RESULTS: Copy these image mappings into data.js');
    console.log('// ═══════════════════════════════════════════\n');

    const mapping = {};
    results.forEach(r => {
        if (r.thumb) {
            // Extract the file path portion
            const match = r.thumb.match(/images\/media\/player\/thumb\/(.+)/);
            if (match) mapping[r.id] = match[1];
        }
    });
    console.log('const IMAGE_MAP = ' + JSON.stringify(mapping, null, 2) + ';');

    const missing = results.filter(r => !r.thumb);
    if (missing.length) {
        console.log(`\n// MISSING (${missing.length}):`);
        missing.forEach(r => console.log(`// - ${r.name} (${r.status})`));
    }
}

main();
