import React, { useState } from "react";

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
      const trackName = typeof weekend.TrackData === "string"
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
            <h6>Selected Driver:</h6>
            <p className="fw-bold">{selectedDriver}</p>
            {driverStats && (
              <div>
                <pre className="text-light text-start bg-secondary p-2 rounded">
                  {JSON.stringify(driverStats, null, 2)}
                </pre>
              </div>
            ) }
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
