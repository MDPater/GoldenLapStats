const fieldMap = {
  Wins: "FirstPlaces",
  Podiums: "Podiums",
  Championships: "SeasonsWon",
  "Career Points": "CareerPoints",
  "Fastest Laps": "GoldenLaps",
  "Pole Positions": "PolePositions",
  "Races Completed": "RacesCompleted",
  "Seasons Completed": "SeasonsCompleted",
};

function LeaderBoardBuilder({ activeTab, jsonData }) {
  const fieldKey = fieldMap[activeTab];

  if (!fieldKey) {
    return <div>No data available</div>;
  }

  const sortedStats = jsonData
    .map((person) => {
      const stats = person.States[0];
      return {
        name: person.Name,
        value: stats[fieldKey] || 0,
      };
    })
    .filter((driver) => driver.value > 0)
    .sort((a, b) => b.value - a.value);

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
    <div className="container py-3">
      <h4 className="mb-3 text-center">{activeTab} Leaderboard</h4>
      <div className="table-responsive">
        <table className="table table-striped table-hover table-bordered">
          <thead className="table-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Driver</th>
              <th scope="col">{activeTab}</th>
            </tr>
          </thead>
          <tbody>
            {sortedStats.map((driver, index) => (
              <tr key={driver.name}>
                <td>{index + 1}</td>
                <td>{driver.name}</td>
                <td>
                  <div className="d-flex justify-content-center">
                    <span
                      className={`badge rounded-pill ${getBadgeClass(index)}`}
                    >
                      {driver.value}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default LeaderBoardBuilder;
