export const filterPlayersByPosition = (players, position) => {
    return players.filter(player => player.position === position);
};

export const filterTeamsByLeague = (teams, leagueId) => {
    return teams.filter(team => team.league === leagueId);
};
