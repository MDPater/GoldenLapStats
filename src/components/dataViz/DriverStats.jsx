import React, { useState } from "react";

function DriverStats({ jsonData }) {
  const drivers = jsonData.Career.People.filter((person) =>
    person.States.some(
      (state) => state["$type"] === "Game.DriverStats, Assembly-CSharp"
    )
  );

  const [selectedDriver, setSelectedDriver] = useState("");
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
