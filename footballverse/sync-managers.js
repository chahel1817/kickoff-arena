const fs = require('fs');
const path = require('path');

const API_KEY = 'f01d4bcb025494c23875498528ac72bb96cf0598a98f299610dd27be038a2327';
const TEAMS_PATH = path.join(__dirname, 'data', 'teams.json');
const LEAGUES_PATH = path.join(__dirname, 'data', 'leagues.json');
const MANAGERS_PATH = path.join(__dirname, 'data', 'managers.json');

async function fetchTeamCoaches(leagueId) {
    const url = `https://apiv2.allsportsapi.com/football/?met=Teams&leagueId=${leagueId}&APIkey=${API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.result || [];
    } catch (e) {
        console.error(`Error fetching league ${leagueId}:`, e);
        return [];
    }
}

async function start() {
    // Start with our legends
    const legends = JSON.parse(fs.readFileSync(MANAGERS_PATH, 'utf8'));
    const managerNames = new Set(legends.map(m => m.name.toLowerCase()));

    // We already have leagues data (manually curated or from file)
    // Major leagues: 152(PL), 302(La Liga), 207(Serie A), 175(Bundesliga), 168(Ligue 1)
    const leagueIds = [152, 302, 207, 175, 168];

    console.log("Fetching current coaches from top European leagues...");

    const allManagers = [...legends];

    for (const lid of leagueIds) {
        console.log(`Processing league ${lid}...`);
        const teams = await fetchTeamCoaches(lid);

        for (const team of teams) {
            if (team.coaches && team.coaches.length > 0) {
                const coach = team.coaches[0]; // Take main coach
                if (coach.coach_name && !managerNames.has(coach.coach_name.toLowerCase())) {
                    allManagers.push({
                        id: `api_${coach.coach_name.toLowerCase().replace(/\s+/g, '_')}`,
                        name: coach.coach_name,
                        country: coach.coach_country || team.team_name,
                        style: "Current Club Manager",
                        reputation: team.team_name.includes('City') || team.team_name.includes('Real') ? 85 : 75,
                        image: null, // No image from AllSportsAPI
                        team: team.team_name
                    });
                    managerNames.add(coach.coach_name.toLowerCase());
                }
            }
        }
    }

    fs.writeFileSync(MANAGERS_PATH, JSON.stringify(allManagers, null, 2));
    console.log(`Sync complete! Total managers: ${allManagers.length}`);
}

start();
