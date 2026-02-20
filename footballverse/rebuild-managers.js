const fs = require('fs');
const path = require('path');

const API_KEY = 'f01d4bcb025494c23875498528ac72bb96cf0598a98f299610dd27be038a2327';
const MANAGERS_PATH = path.join(__dirname, 'data', 'managers.json');

async function fetchFromSportsDB(name) {
    const url = `https://www.thesportsdb.com/api/v1/json/3/searchplayers.php?p=${encodeURIComponent(name)}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.player && data.player.length > 0) {
            const p = data.player.find(x => x.strThumb) || data.player[0];
            if (p.strThumb) {
                return `https://images.weserv.nl/?url=${p.strThumb.replace(/^https?:\/\//, '')}&w=400&h=400&fit=cover&a=top`;
            }
        }
    } catch (e) { }
    return null;
}

async function start() {
    const legends = JSON.parse(fs.readFileSync(MANAGERS_PATH, 'utf8'));
    const managerNames = new Set(legends.map(m => m.name.toLowerCase()));

    // Major leagues to get current managers
    const leagueIds = [152, 302, 207, 175, 168];
    const allManagers = [...legends];

    console.log("Fetching current professional coaches...");

    for (const lid of leagueIds) {
        const url = `https://apiv2.allsportsapi.com/football/?met=Teams&leagueId=${lid}&APIkey=${API_KEY}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            const teams = data.result || [];

            for (const team of teams) {
                if (team.coaches && team.coaches.length > 0) {
                    const coach = team.coaches[0];
                    if (coach.coach_name && !managerNames.has(coach.coach_name.toLowerCase())) {
                        console.log(`Searching face for: ${coach.coach_name}...`);
                        const image = await fetchFromSportsDB(coach.coach_name);

                        if (image) {
                            allManagers.push({
                                id: `api_${coach.coach_name.toLowerCase().replace(/\s+/g, '_')}`,
                                name: coach.coach_name,
                                country: coach.coach_country || team.team_name,
                                style: "Tactical Specialist",
                                reputation: team.team_name.includes('City') || team.team_name.includes('Real') ? 92 : 82,
                                image: image,
                                team: team.team_name
                            });
                            managerNames.add(coach.coach_name.toLowerCase());
                        }
                    }
                }
            }
        } catch (e) { }
    }

    fs.writeFileSync(MANAGERS_PATH, JSON.stringify(allManagers, null, 2));
    console.log(`Sync complete! Total managers with visible faces: ${allManagers.length}`);
}

start();
