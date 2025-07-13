function Drivers({ setYear, jsonData }) {
  const year = jsonData.Career.Years.find((y) => y.CalendarYear == setYear);

  const calculateDriverTotals = (weekends = []) => {
    const driverTotals = {};

    weekends.forEach((weekend) => {
      const standings = weekend.Results?.DriversRaceStanding || [];
      if (Array.isArray(standings) && standings.length > 0) {
        standings.forEach((entry) => {
          const driver = entry.Driver;
          const team = entry.Team || "Unknown Team";
          // Default score to 0 if missing
          const score = typeof entry.Score === "number" ? entry.Score : 0;

          if (!driver) return;

          if (!driverTotals[driver]) {
            driverTotals[driver] = { Score: 0, Team: team };
          }

          driverTotals[driver].Score += score;
        });
      }
    });

    return Object.entries(driverTotals)
      .map(([Driver, { Score, Team }]) => ({ Driver, Team, Score }))
      .sort((a, b) => b.Score - a.Score);
  };

  const driverStandings = calculateDriverTotals(year?.Weekends);

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
      <h2 className="mb-3">Driver Standings</h2>
      {driverStandings.length > 0 ? (
        <ul className="list-group">
          {driverStandings.map((driver, i) => (
            <li
              key={i}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>
                <strong>{i + 1}.</strong> {driver.Driver}{" "}
                <small className="text-muted">({driver.Team})</small>
              </span>
              <span className={`badge rounded-pill ${getBadgeClass(i)}`}>
                {driver.Score} pts
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <div className="alert alert-info">No driver standings available.</div>
      )}
    </div>
  );
}

export default Drivers;
