import { useState } from "react";

function ResultBuilder({ weekend }) {
  const [activeTab, setActiveTab] = useState("qualifying");

  const qualifyingStandings = weekend.Results?.DriversQualiStanding;
  const raceStandings = weekend.Results?.DriversRaceStanding;
  const teamStandings = weekend.Results?.TeamsRaceStanding;

  if (!qualifyingStandings && !raceStandings && !teamStandings)
    return <p>Session hasnt Started yet</p>;

  function formatTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const milliseconds = ms % 1000;
    return `${minutes}:${seconds.toString().padStart(2, "0")}.${milliseconds
      .toString()
      .padStart(3, "0")}`;
  }

  const QualiStandings = (standings) => {
    return (
      <div className="container mt-4">
        <h3 className="text-center mb-3">Qualifying Standings</h3>
        <table className="table table-dark table-bordered table-striped table-hover">
          <thead className="table-light">
            <tr>
              <th>Pos</th>
              <th>Driver</th>
              <th>Fastest Lap</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((driver, index) => (
              <tr key={index}>
                <td>{driver.Position}</td>
                <td>{driver.Driver}</td>
                <td>{formatTime(driver.FastestLapTime)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const RaceStandings = (standings) => {
    return (
      <div className="container mt-4">
        <h3 className="text-center mb-3">Race Standings</h3>
        <table className="table table-dark table-bordered table-striped table-hover">
          <thead className="table-light">
            <tr>
              <th>Pos</th>
              <th>Driver</th>
              <th>Team</th>
              <th>Laps</th>
              <th>Pits</th>
              <th>Race Time</th>
              <th>Fastest Lap</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((driver, index) => (
              <tr key={index}>
                <td>{driver.Position}</td>
                <td>{driver.Driver}</td>
                <td>{driver.Team}</td>
                <td>{driver.Laps}</td>
                <td>{driver.Pits}</td>
                <td>
                  {driver.LapTime === 0 ? "DNF" : formatTime(driver.LapTime)}
                </td>
                <td>
                  {formatTime(driver.FastestLapTime)}
                  {driver.FastestLap && (
                    <span className="badge bg-warning text-dark ms-2">FL</span>
                  )}
                </td>
                <td>{driver.Score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const TeamStandings = (standings) => {
    return (
      <div className="container mt-4">
        <h3 className="text-center mb-3">Team Standings</h3>
        <table className="table table-dark table-bordered table-striped table-hover">
          <thead className="table-light">
            <tr>
              <th>Pos</th>
              <th>Team</th>
              <th>Points</th>
              <th>Fastest Lap</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team, index) => (
              <tr key={index}>
                <td>{team.Position}</td>
                <td>{team.Team}</td>
                <td>{team.Score}</td>
                <td>
                  {team.FastestLap && (
                    <span className="badge bg-warning text-dark ms-2">FL</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <a
            className={`nav-link ${
              activeTab === "qualifying" ? "active" : ""
            } px-5`}
            href="#qualifying"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("qualifying");
            }}
          >
            Qualifying
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === "race" ? "active" : ""} px-5`}
            href="#race"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("race");
            }}
          >
            Race
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === "team" ? "active" : ""} px-5`}
            href="#team"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab("team");
            }}
          >
            Team
          </a>
        </li>
      </ul>
      <div className="mt-3">
        {activeTab === "qualifying" && QualiStandings(qualifyingStandings)}
        {activeTab === "race" && RaceStandings(raceStandings)}
        {activeTab === "team" && TeamStandings(teamStandings)}
      </div>
    </div>
  );
}

export default ResultBuilder;
