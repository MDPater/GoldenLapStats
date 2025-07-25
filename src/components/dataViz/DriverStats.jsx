import React, { useState, useRef, useEffect } from "react";
import Chart from "chart.js/auto";
import "./DriverStats.css"; // If you want to use a separate CSS file

// Helper to rank tracks by points and race position
function getTrackSuccess(trackResults) {
  // Returns array: [{ track, totalPoints, avgRacePos, count }]
  return (
    Object.entries(trackResults)
      .map(([track, results]) => {
        let totalPoints = 0;
        let racePositions = [];
        results.forEach(({ race }) => {
          if (race) {
            // Points: fallback to 0 if missing
            totalPoints += race.Score ?? 0;
            // Race position: fallback to null if missing
            if (race.Position != null) racePositions.push(race.Position);
          }
        });
        const avgRacePos =
          racePositions.length > 0
            ? racePositions.reduce((a, b) => a + b, 0) / racePositions.length
            : null;
        return {
          track,
          totalPoints,
          avgRacePos,
          count: results.length,
        };
      })
      // Sort: most points, then best (lowest) avg position
      .sort((a, b) => {
        if (b.totalPoints !== a.totalPoints)
          return b.totalPoints - a.totalPoints;
        if (a.avgRacePos !== null && b.avgRacePos !== null)
          return a.avgRacePos - b.avgRacePos;
        return 0;
      })
  );
}

// Helper function to get driver stats and results per track/year
function getDriverStats(drivers, driverName, jsonData) {
  const driver = drivers.find((d) => d.Name === driverName);
  if (!driver) return null;

  // Group results by track, with results listed per year
  const trackResults = {};

  jsonData.Career.Years.forEach((yearObj) => {
    const year = yearObj.CalendarYear;
    yearObj.Weekends.forEach((weekend) => {
      // TrackData is a string, not an object
      const trackName =
        typeof weekend.TrackData === "string"
          ? weekend.TrackData
          : weekend.TrackData?.Name || "Unknown Track";
      const qualiResults = weekend.Results?.DriversQualiStanding || [];
      const raceResults = weekend.Results?.DriversRaceStanding || [];

      // Find driver's quali and race result for this track
      const quali = qualiResults.find((r) => r.Driver === driverName);
      const race = raceResults.find((r) => r.Driver === driverName);

      if (quali || race) {
        if (!trackResults[trackName]) {
          trackResults[trackName] = [];
        }
        trackResults[trackName].push({
          year,
          quali,
          race,
        });
      }
    });
  });

  return {
    name: driver.Name,
    states: driver.States,
    trackResults,
  };
}

// New helper function to get wins by track and year
function getWinsByTrackAndYear(trackResults) {
  // { [track]: { [year]: winCount } }
  const wins = {};
  Object.entries(trackResults).forEach(([track, results]) => {
    results.forEach(({ year, race }) => {
      if (race && race.Position === 1) {
        if (!wins[track]) wins[track] = {};
        wins[track][year] = (wins[track][year] || 0) + 1;
      }
    });
  });
  return wins;
}

function DriverStats({ jsonData }) {
  //get all drivers from jsonData
  const drivers = jsonData.Career.People.filter((person) =>
    person.States.some(
      (state) => state["$type"] === "Game.DriverStats, Assembly-CSharp"
    )
  );

  const [selectedDriver, setSelectedDriver] = useState("");
  const driverStats = selectedDriver
    ? getDriverStats(drivers, selectedDriver, jsonData)
    : null;

  const trackSuccess =
    driverStats && driverStats.trackResults
      ? getTrackSuccess(driverStats.trackResults)
      : [];

  // Sort trackSuccess for avg position chart (lowest avgRacePos first)
  const avgPosSorted = [...trackSuccess].sort((a, b) => {
    if (a.avgRacePos === null) return 1;
    if (b.avgRacePos === null) return -1;
    return a.avgRacePos - b.avgRacePos;
  });

  const avgQualiSorted = trackSuccess
    .map((track) => {
      // Calculate average quali position for each track
      const qualiPositions = driverStats.trackResults[track.track]
        .map((result) => result.quali?.Position)
        .filter((pos) => pos != null);
      const avgQualiPos =
        qualiPositions.length > 0
          ? qualiPositions.reduce((a, b) => a + b, 0) / qualiPositions.length
          : null;
      return {
        track: track.track,
        avgQualiPos,
      };
    })
    .sort((a, b) => {
      if (a.avgQualiPos === null) return 1;
      if (b.avgQualiPos === null) return -1;
      return a.avgQualiPos - b.avgQualiPos;
    });

  const winsByTrackAndYear = driverStats
    ? getWinsByTrackAndYear(driverStats.trackResults)
    : {};

  const allTracks = Object.keys(winsByTrackAndYear);
  const allYears = Array.from(
    new Set(
      allTracks.flatMap((track) => Object.keys(winsByTrackAndYear[track]))
    )
  ).sort();

  const winsChartData = {
    labels: allTracks,
    datasets: allYears.map((year, i) => ({
      label: year,
      data: allTracks.map((track) => winsByTrackAndYear[track][year] || 0),
      backgroundColor: `hsl(${(i * 40) % 360}, 70%, 70%)`,
      stack: "wins",
    })),
  };

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);
  const avgPosChartRef = useRef(null);
  const avgPosChartInstanceRef = useRef(null);
  const avgQualiChartRef = useRef(null);
  const avgQualiChartInstanceRef = useRef(null);
  const winsChartRef = useRef(null);
  const winsChartInstanceRef = useRef(null);

  useEffect(() => {
    // Points chart (already sorted by getTrackSuccess)
    if (chartRef.current && selectedDriver) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      chartInstanceRef.current = new Chart(chartRef.current, {
        type: "bar",
        data: {
          labels: trackSuccess.map((t) => t.track),
          datasets: [
            {
              label: "Total Points",
              data: trackSuccess.map((t) => t.totalPoints),
              backgroundColor: "rgba(255, 206, 86, 0.7)",
              borderColor: "rgba(255, 206, 86, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
          },
          scales: {
            x: { title: { display: true, text: "Track" } },
            y: {
              title: { display: true, text: "Total Points" },
              beginAtZero: true,
            },
          },
        },
      });
    }
    // Avg position chart (sorted by best avg position)
    if (avgPosChartRef.current && selectedDriver) {
      if (avgPosChartInstanceRef.current) {
        avgPosChartInstanceRef.current.destroy();
      }
      avgPosChartInstanceRef.current = new Chart(avgPosChartRef.current, {
        type: "bar",
        data: {
          labels: avgPosSorted.map((t) => t.track),
          datasets: [
            {
              label: "Average Race Position",
              data: avgPosSorted.map((t) =>
                t.avgRacePos !== null ? t.avgRacePos : null
              ),
              backgroundColor: "rgba(54, 162, 235, 0.7)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
          },
          scales: {
            x: { title: { display: true, text: "Track" } },
            y: {
              title: { display: true, text: "Avg Position" },
              beginAtZero: true,
              reverse: false,
            },
          },
        },
      });
    }
    // Average Quali Position Chart
    if (avgQualiChartRef.current && selectedDriver) {
      if (avgQualiChartInstanceRef.current) {
        avgQualiChartInstanceRef.current.destroy();
      }
      avgQualiChartInstanceRef.current = new Chart(avgQualiChartRef.current, {
        type: "bar",
        data: {
          labels: avgQualiSorted.map((t) => t.track),
          datasets: [
            {
              label: "Average Quali Position",
              data: avgQualiSorted.map((t) =>
                t.avgQualiPos !== null ? t.avgQualiPos : null
              ),
              backgroundColor: "rgba(102, 255, 204, 0.7)",
              borderColor: "rgba(102, 255, 204, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
            tooltip: { enabled: true },
          },
          scales: {
            x: { title: { display: true, text: "Track" } },
            y: {
              title: { display: true, text: "Avg Quali Position" },
              beginAtZero: true,
              reverse: false,
            },
          },
        },
      });
    }
    // Wins by Track and Year Chart
    if (winsChartRef.current && selectedDriver) {
      if (winsChartInstanceRef.current) {
        winsChartInstanceRef.current.destroy();
      }
      winsChartInstanceRef.current = new Chart(winsChartRef.current, {
        type: "bar",
        data: winsChartData,
        options: {
          responsive: true,
          plugins: {
            legend: { position: "right" },
            tooltip: { enabled: true },
            title: {
              display: true,
              text: `${selectedDriver}'s Race Wins By Track`,
            },
          },
          scales: {
            x: { title: { display: true, text: "Track" }, stacked: true },
            y: {
              title: { display: true, text: "Wins" },
              beginAtZero: true,
              stacked: true,
            },
          },
        },
      });
    }
    // Cleanup all charts
    return () => {
      if (chartInstanceRef.current) chartInstanceRef.current.destroy();
      if (avgPosChartInstanceRef.current)
        avgPosChartInstanceRef.current.destroy();
      if (avgQualiChartInstanceRef.current)
        avgQualiChartInstanceRef.current.destroy();
      if (winsChartInstanceRef.current) winsChartInstanceRef.current.destroy();
    };
  }, [
    trackSuccess,
    avgQualiSorted,
    selectedDriver,
    driverStats,
    winsChartData,
  ]);

  const handleClear = () => setSelectedDriver("");

  return (
    <div className="card shadow-lg bg-dark text-light p-4 mb-4">
      <div className="card-body">
        <h5 className="card-title text-center mb-4">Driver Stats</h5>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label fw-bold">Select Driver</label>
            <div className="d-flex align-items-center">
              <select
                className="form-select"
                value={selectedDriver}
                onChange={(e) => setSelectedDriver(e.target.value)}
              >
                <option value="">Choose a driver</option>
                {drivers.map((driver) => (
                  <option key={driver.Name} value={driver.Name}>
                    {driver.Name}
                  </option>
                ))}
              </select>
              {selectedDriver && (
                <button
                  type="button"
                  className="btn btn-outline-secondary ms-2"
                  onClick={handleClear}
                >
                  clear
                </button>
              )}
            </div>
          </div>
        </div>
        {selectedDriver ? (
          <div className="mt-4 text-center">
            <pre
              className="bg-dark text-light text-start p-2 rounded"
              style={{ maxHeight: 300, overflowY: "auto", fontSize: 13 }}
            >
              {/*JSON.stringify(driverStats, null, 2)*/}
            </pre>
            {driverStats && (
              <div>
                <div
                  className="d-flex flex-row flex-wrap justify-content-center align-items-start"
                  style={{ gap: 32 }}
                >
                  {/* Driver States */}
                  <div
                    className="mb-4 text-start"
                    style={{ maxWidth: 600, minWidth: 300 }}
                  >
                    {driverStats.states
                      .filter(
                        (state) =>
                          state["$type"] === "Game.DriverStats, Assembly-CSharp"
                      )
                      .map((state, idx) => (
                        <div
                          key={idx}
                          className="mb-3 p-2 bg-secondary rounded"
                        >
                          <div className="fw-bold">{selectedDriver}</div>
                          <ul className="mb-0">
                            {Object.entries(state)
                              .filter(([key]) => key !== "$type")
                              .map(([key, value]) => (
                                <li key={key}>
                                  <span className="text-warning">{key}:</span>{" "}
                                  <span className="text-light">
                                    {String(value)}
                                  </span>
                                </li>
                              ))}
                          </ul>
                        </div>
                      ))}
                  </div>
                  {/* Wins by Track and Year Chart */}
                  <div className="chart-container mb-4">
                    <h6 className="mb-2">
                      {selectedDriver}'s Race Wins By Track
                    </h6>
                    <canvas ref={winsChartRef} />
                  </div>
                </div>

                {/* Track Success Charts */}
                <h6 className="mt-4">Track Success (Most to Least):</h6>
                <div
                  className="d-flex flex-row justify-content-center"
                  style={{ gap: 32, overflowX: "auto", minHeight: 350 }}
                >
                  <div className="chart-container">
                    <canvas ref={chartRef} />
                    <div className="fw-bold mt-2">Total Points per Track</div>
                  </div>
                  <div className="chart-container">
                    <canvas ref={avgPosChartRef} />
                    <div className="fw-bold mt-2">
                      Average Position per Track
                    </div>
                  </div>
                </div>
                <div
                  className="chart-container mt-4"
                  style={{ maxWidth: 700, margin: "0 auto" }}
                >
                  <canvas ref={avgQualiChartRef} />
                  <div className="fw-bold mt-2">
                    Average Quali Position per Track
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="alert alert-info mt-4 text-center">
            Please select a driver to view stats.
          </div>
        )}
      </div>
    </div>
  );
}

export default DriverStats;
