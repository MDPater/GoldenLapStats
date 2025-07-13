function Teams({ setYear, jsonData }) {
  const year = jsonData.Career.Years.find((y) => y.CalendarYear == setYear);

  const calculateTeamTotals = (weekends = []) => {
    const teamTotals = {};

    weekends.forEach((weekend) => {
      const standings = weekend.Results?.TeamsRaceStanding || [];
      standings.forEach((entry) => {
        const team = entry.Team;
        const score = entry.Score || 0;

        if (!team) return;

        if (!teamTotals[team]) {
          teamTotals[team] = 0;
        }

        teamTotals[team] += score;
      });
    });

    return Object.entries(teamTotals)
      .map(([Team, Score]) => ({ Team, Score }))
      .sort((a, b) => b.Score - a.Score);
  };

  const teamStandings = calculateTeamTotals(year.Weekends);

  const getBadgeClass = (index) => {
    switch (index) {
      case 0:
        return "bg-warning text-dark"; // 🥇 Gold
      case 1:
        return "bg-secondary text-white"; // 🥈 Silver
      case 2:
        return "bg-bronze text-white"; // 🥉 Bronze (custom)
      default:
        return "bg-primary";
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Team Standings</h2>
      {teamStandings.length > 0 ? (
        <ul className="list-group">
          {teamStandings.map((team, i) => (
            <li
              key={i}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>
                <strong>{i + 1}.</strong> {team.Team}
              </span>
              <span className={`badge rounded-pill ${getBadgeClass(i)}`}>
                {team.Score} pts
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="alert alert-info">No team standings available.</div>
      )}
    </div>
  );
}

export default Teams;
