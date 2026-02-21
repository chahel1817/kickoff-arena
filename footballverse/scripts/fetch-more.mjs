import fs from 'fs';

const PLAYERS = {
    'CM': [
        "Toni Kroos", "Sergio Busquets", "Fabinho", "Thiago Alcantara", "Marco Verratti", "Ivan Rakitic",
        "Paul Pogba", "N'Golo Kante", "Isco", "Dele Alli", "Marcelo Brozovic", "Piotr Zielinski",
        "Thomas Partey", "Houssem Aouar", "Saul Niguez", "Arturo Vidal", "Koke", "Marcos Llorente",
        "Youri Tielemans", "Jordan Henderson", "Mikel Merino", "Sergej Milinkovic-Savic", "Renato Sanches",
        "Emre Can", "Axel Witsel", "Christian Eriksen", "Leandro Paredes", "Donny van de Beek",
        "Dani Ceballos", "Giovani Lo Celso", "Marten de Roon", "Rodrigo Bentancur", "Pierre-Emile Hojbjerg",
        "Weston McKennie", "Joao Moutinho", "Geoffrey Kondogbia", "Lucas Torreira", "Granit Xhaka",
        "Fred", "Scott McTominay", "Boubacar Kamara", "Teun Koopmeiners", "Franck Kessie",
        "Seko Fofana", "Mario Gotze", "Julian Draxler", "Oscar", "James Rodriguez", "Ianis Hagi",
        "Lucas Paqueta", "Arthur Melo", "Harvey Elliott", "Curtis Jones", "Cole Palmer", "Eberechi Eze"
    ],
    'ST': [
        "Dusan Tadic", "Antoine Griezmann", "Joao Felix", "Memphis Depay", "Wissam Ben Yedder", "Ciro Immobile",
        "Richarlison", "Gabriel Jesus", "Tammy Abraham", "Raul Jimenez", "Andrea Belotti", "Domenico Berardi",
        "Gareth Bale", "Eden Hazard", "Marco Reus", "Leroy Sane", "Riyad Mahrez", "Heung-min Son",
        "Anthony Martial", "Harvey Barnes", "Wilfried Zaha", "Allan Saint-Maximin",
        "Callum Hudson-Odoi", "Nicolas Pepe", "Pedro Neto", "Adama Traore", "Ansu Fati", "Rodrygo",
        "Raphinha", "Diogo Jota", "Dejan Kulusevski", "Joaquin Correa", "Jonathan David", "Patrik Schick",
        "Sebastian Haller", "Cody Gakpo", "Julian Alvarez"
    ],
    'GK': [
        "Edouard Mendy", "Simon Mignolet", "Loris Karius", "Kepa Arrizabalaga", "Yassine Bounou", "Rui Patricio",
        "Keylor Navas", "Lukas Hradecky", "Kevin Trapp", "Oliver Baumann", "Illan Meslier", "Alex Remiro",
        "Dominik Livakovic", "Pau Lopez", "Alex Meret", "Wladimiro Falcone", "Ivan Provedel", "Jose Sa",
        "Odysseas Vlachodimos", "Jasper Cillessen", "Justin Bijlow", "Andries Noppert", "Dean Henderson",
        "Sam Johnstone", "Arijanet Muric", "James Trafford", "Tom Heaton", "Martin Dubravka",
        "Karl Darlow", "Danny Ward", "Wayne Hennessey", "Lukasz Fabianski", "Rui Silva", "David Ospina",
        "Fernando Muslera", "Stefan Ortega", "Scott Carson"
    ]
};

const fetchWithTimeout = async (url, options = {}) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 3000);
    try {
        const response = await fetch(url, { ...options, signal: controller.signal });
        clearTimeout(id);
        return response;
    } catch (e) {
        clearTimeout(id);
        throw e;
    }
}

async function checkImage(filename) {
    const urlWww = `https://images.weserv.nl/?url=www.thesportsdb.com/images/media/player/thumb/${filename}&w=400&h=500&fit=cover&a=top`;
    const urlR2 = `https://images.weserv.nl/?url=r2.thesportsdb.com/images/media/player/thumb/${filename}&w=400&h=500&fit=cover&a=top`;

    try {
        const resWww = await fetchWithTimeout(urlWww);
        if (resWww.status === 200) return 'tsdb';
    } catch (e) { }
    try {
        const resR2 = await fetchWithTimeout(urlR2);
        if (resR2.status === 200) return 'img';
    } catch (e) { }
    return null;
}

const delay = ms => new Promise(r => setTimeout(r, ms));

async function main() {
    console.log('Fetching new players...');
    const results = { CM: [], ST: [], GK: [] };

    for (const [pos, names] of Object.entries(PLAYERS)) {
        console.log(`\n--- Fetching ${pos} (${names.length}) ---`);
        for (const query of names) {
            try {
                const url = `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(query)}`;
                const res = await fetch(url);
                const data = await res.json();
                const match = data.player ? data.player[0] : null;

                if (match && match.strThumb) {
                    const filename = match.strThumb.split('/').pop();
                    const domainFunc = await checkImage(filename);
                    if (domainFunc) {
                        const id = query.toLowerCase().replace(/[^a-z0-9]/g, '');
                        // Random rating between 79 and 88 if we don't know it
                        const rating = Math.floor(Math.random() * (88 - 79 + 1) + 79);

                        const obj = `    { id: '${id}', name: '${match.strPlayer.replace(/'/g, "\\'")}', country: '${match.strNationality}', club: '${match.strTeam?.replace(/'/g, "\\'") || 'Free Agent'}', rating: ${rating}, position: '${pos}', tier: 'current', image: ${domainFunc}('${filename}') },`;

                        results[pos].push(obj);
                        console.log(`[OK] ${query} -> ${match.strPlayer}`);
                    } else {
                        console.log(`[IMG BROKEN] ${query}`);
                    }
                } else {
                    console.log(`[NOT FOUND] ${query}`);
                }
            } catch (e) {
                console.log(`[ERROR] ${query}`);
            }
            await delay(250);
        }
    }

    fs.writeFileSync('scripts/new-players-output.json', JSON.stringify(results, null, 2), 'utf8');
    console.log('\nFinished all fetches. Results written to scripts/new-players-output.json');
}

main();
