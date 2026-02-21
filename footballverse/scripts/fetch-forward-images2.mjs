import fs from 'fs';

const forwards = [
    // Current STs
    { id: 'haaland', query: 'Erling Haaland' },
    { id: 'mbappe', query: 'Kylian Mbappe' },
    { id: 'osimhen', query: 'Victor Osimhen' },
    { id: 'kane', query: 'Harry Kane' },
    { id: 'firmino', query: 'Roberto Firmino' },
    { id: 'nunez', query: 'Darwin Nunez' },
    { id: 'lukaku', query: 'Romelu Lukaku' },
    { id: 'morata', query: 'Alvaro Morata' },
    { id: 'dusan', query: 'Dusan Vlahovic' },
    { id: 'fullkrug', query: 'Niclas Fullkrug' },
    { id: 'gyokeres', query: 'Viktor Gyokeres' },
    { id: 'isak', query: 'Alexander Isak' },
    { id: 'watkins', query: 'Ollie Watkins' },
    { id: 'benzema', query: 'Karim Benzema' },
    { id: 'toney', query: 'Ivan Toney' },
    { id: 'ferran', query: 'Ferran Torres' },
    { id: 'jackson', query: 'Nicolas Jackson' },
    { id: 'calvert', query: 'Dominic Calvert-Lewin' },
    { id: 'lmartinez', query: 'Lautaro Martinez' },
    { id: 'depay', query: 'Memphis Depay' },
    { id: 'wolvrhampton', query: 'Hwang Hee-chan' },
    { id: 'sorloth', query: 'Alexander Sorloth' },
    // Current RWs
    { id: 'salah', query: 'Mohamed Salah' },
    { id: 'rasheM', query: 'Marcus Rashford' },
    { id: 'leao', query: 'Rafael Leao' },
    { id: 'vini', query: 'Vinicius Junior' },
    { id: 'simons', query: 'Xavi Simons' },
    { id: 'diaz', query: 'Luis Diaz' },
    { id: 'coman', query: 'Kingsley Coman' },
    { id: 'gnabry', query: 'Serge Gnabry' },
    { id: 'sancho', query: 'Jadon Sancho' },
    { id: 'lookman6', query: 'Ademola Lookman' },
    { id: 'ousmane', query: 'Ousmane Dembele' },
    { id: 'kubo', query: 'Takefusa Kubo' },
    { id: 'chukwueze', query: 'Samuel Chukwueze' },
    { id: 'mudryk', query: 'Mykhailo Mudryk' },
    // Current LWs
    { id: 'neymar', query: 'Neymar' },
    { id: 'martinelli', query: 'Gabriel Martinelli' },
    { id: 'chiesa', query: 'Federico Chiesa' },
    { id: 'diallo', query: 'Amad Diallo' },
    { id: 'pulisic', query: 'Christian Pulisic' },
    { id: 'kvara', query: 'Khvicha Kvaratskhelia' },
    { id: 'antony', query: 'Antony' },
    { id: 'madueke', query: 'Noni Madueke' },
    { id: 'cherki', query: 'Rayan Cherki' },
    // Legend STs
    { id: 'ronaldo9', query: 'Ronaldo Nazario' },
    { id: 'messi', query: 'Lionel Messi' },
    { id: 'cr7', query: 'Cristiano Ronaldo' },
    { id: 'shearer', query: 'Alan Shearer' },
    { id: 'lewa', query: 'Robert Lewandowski' },
    { id: 'ibra', query: 'Zlatan Ibrahimovic' },
    { id: 'henry', query: 'Thierry Henry' },
    { id: 'vandernistelrooy', query: 'Ruud van Nistelrooy' },
    { id: 'shevchenko', query: 'Andriy Shevchenko' },
    { id: 'batigol', query: 'Gabriel Batistuta' },
    { id: 'torres_f', query: 'Fernando Torres' },
    { id: 'drogba', query: 'Didier Drogba' },
    { id: 'tevez', query: 'Carlos Tevez' },
    { id: 'rooney', query: 'Wayne Rooney' },
    { id: 'villa', query: 'David Villa' },
    { id: 'inzaghi', query: 'Filippo Inzaghi' },
    { id: 'suarez', query: 'Luis Suarez' },
    { id: 'totti', query: 'Francesco Totti' },
    { id: 'weah', query: 'George Weah' },
    { id: 'cantona', query: 'Eric Cantona' },
    { id: 'lineker', query: 'Gary Lineker' },
    { id: 'maradona75', query: 'Diego Maradona' },
    { id: 'pele', query: 'Pele' },
    { id: 'cruyff', query: 'Johan Cruyff' },
    { id: 'adriano', query: 'Adriano' },
    { id: 'owen', query: 'Michael Owen' },
    { id: 'raul', query: 'Raul Gonzalez' },
    { id: 'hugo', query: 'Hugo Sanchez' },
    { id: 'eusebio', query: 'Eusebio' },
    { id: 'gerd', query: 'Gerd Muller' },
    { id: 'baggio', query: 'Roberto Baggio' },
    { id: 'romario', query: 'Romario' },
    { id: 'puskas', query: 'Ferenc Puskas' },
    { id: 'rivaldo', query: 'Rivaldo' },
    { id: 'wright', query: 'Ian Wright' },
    { id: 'morientes', query: 'Fernando Morientes' },
    { id: 'klinsmann', query: 'Jurgen Klinsmann' },
    // Legend Wingers
    { id: 'figo', query: 'Luis Figo' },
    { id: 'robben', query: 'Arjen Robben' },
    { id: 'ribery', query: 'Franck Ribery' },
    { id: 'giggs', query: 'Ryan Giggs' },
    { id: 'stoichkov', query: 'Hristo Stoichkov' },
    { id: 'pires', query: 'Robert Pires' },
    { id: 'overmarsA', query: 'Marc Overmars' },
    { id: 'roberto_c', query: 'Roberto Carlos' },
];

const delay = (ms) => new Promise(r => setTimeout(r, ms));

async function fetchPlayer(d) {
    const url = `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(d.query)}`;
    try {
        const res = await fetch(url);
        if (!res.ok) return { id: d.id, query: d.query, thumb: null, status: res.status };
        const data = await res.json();
        if (!data.player) return { id: d.id, query: d.query, thumb: null, status: 'no_player' };
        const soccer = data.player.filter(p => p.strSport === 'Soccer');
        const match = soccer[0] || data.player[0];
        const thumb = match?.strThumb || null;
        return { id: d.id, query: d.query, thumb, status: thumb ? 'ok' : 'no_thumb', apiName: match?.strPlayer };
    } catch (e) {
        return { id: d.id, query: d.query, thumb: null, status: e.message };
    }
}

async function main() {
    const results = [];
    for (let i = 0; i < forwards.length; i++) {
        const result = await fetchPlayer(forwards[i]);
        results.push(result);
        console.log(`Fetched ${i + 1}/${forwards.length}: ${forwards[i].query}`);
        if (i < forwards.length - 1) await delay(2000);
    }

    const imageMap = Object.fromEntries(results.filter(r => r.thumb).map(r => {
        const m = r.thumb.match(/images\/media\/player\/thumb\/(.+)/);
        return [r.id, m ? m[1] : r.thumb];
    }));

    const missing = results.filter(r => !r.thumb).map(r => r.id);

    fs.writeFileSync('scripts/forward-results.json', JSON.stringify({ imageMap, missing }, null, 2));
    console.log('Results written to scripts/forward-results.json');
}
main();
