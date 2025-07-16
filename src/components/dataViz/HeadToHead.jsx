import { useEffect, useState } from "react";
import CalendarYearDropdown from "../CalendarYearDropdown";

function HeadToHead({ jsonData }) {
  const [yearViz, setYearViz] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [driverOne, setDriverOne] = useState("");
  const [driverTwo, setDriverTwo] = useState("");
  const [driverOneResult, setDriverOneResult] = useState({});
  const [driverTwoResult, setDriverTwoResult] = useState({});
  const [isFocusedOne, setIsFocusedOne] = useState(false);
  const [isFocusedTwo, setIsFocusedTwo] = useState(false);

  useEffect(() => {
    if (!yearViz) {
      setDrivers([]);
      setDriverOne("");
      setDriverTwo("");
      setDriverOneResult("");
      setDriverTwoResult("");
      return;
    }

    console.log("Driver One Results:", driverOneResult);
    console.log("Driver Two Results:", driverTwoResult);

    const updatedDrivers = getDriverNamesForYear(jsonData.Career, yearViz);
    setDrivers(updatedDrivers);
  }, [yearViz, jsonData, driverOneResult, driverTwoResult]);

  const getDriverNamesForYear = (data, calendarYear) => {
    if (!calendarYear || !data?.Years) return [];

    const year = data.Years.find(
      (y) => y.CalendarYear === Number(calendarYear)
    );
    if (!year || !Array.isArray(year.Weekends)) return [];

    const driverNames = new Set();

    year.Weekends.forEach((weekend) => {
      const results = weekend?.Results;
      if (!results) return;

      results.DriversQualiStanding?.forEach((entry) => {
        if (entry?.Driver) driverNames.add(entry.Driver);
      });

      results.DriversRaceStanding?.forEach((entry) => {
        if (entry?.Driver) driverNames.add(entry.Driver);
      });
    });

    return Array.from(driverNames);
  };

  const getDriverResults = (data, calendarYear, driver) => {
    if (!data.Career.Years || !calendarYear || !driver) return {};
    const year = data.Career.Years.find(
      (y) => y.CalendarYear === Number(calendarYear)
    );
    if (!year || !Array.isArray(year.Weekends)) return {};

    const driverResults = [];

    year.Weekends.forEach((weekend) => {
      const round = weekend.TrackData;
      const result = weekend.Results;

      if (!result) return;

      const quali = result.DriversQualiStanding?.find(
        (entry) => entry.Driver === driver
      );
      const race = result.DriversRaceStanding?.find(
        (entry) => entry.Driver === driver
      );

      if (quali || race) {
        driverResults.push({
          round,
          quali: quali || null,
          race: race || null,
        });
      }
    });

    return {
      [driver]: driverResults,
    };
  };

  return (
    <div className="card shadow-lg bg-dark text-light p-4 mb-4">
      <div className="card-body">
        <h5 className="card-title text-center mb-4">Head to Head</h5>
        <div className="w-50">
          <CalendarYearDropdown
            defaultText={"Choose a Year"}
            data={jsonData.Career.Years}
            year={yearViz}
            setYear={setYearViz}
          />
        </div>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label fw-bold">Driver One</label>
            <div className="position-relative">
              <input
                type="text"
                className="form-control"
                value={driverOne}
                onFocus={() => setIsFocusedOne(true)}
                onBlur={() => setTimeout(() => setIsFocusedOne(false), 100)}
                onChange={(e) => setDriverOne(e.target.value)}
                placeholder="Type to search..."
              />
              {driverOne && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-light position-absolute top-50 end-0 translate-middle-y me-2"
                  onClick={() => {
                    setDriverOne("");
                    setDriverOneResult("");
                  }}
                  style={{ zIndex: 2 }}
                >
                  &times;
                </button>
              )}
            </div>
            {isFocusedOne && (
              <ul className="list-group mt-2">
                {drivers
                  .filter(
                    (name) =>
                      name.toLowerCase().includes(driverOne.toLowerCase()) &&
                      name !== driverTwo
                  )
                  .map((name, i) => (
                    <li
                      key={i}
                      className="list-group-item list-group-item-action"
                      onClick={() => {
                        setDriverOne(name);
                        const results = getDriverResults(
                          jsonData,
                          yearViz,
                          name
                        );
                        setDriverOneResult(results);
                        setIsFocusedOne(false);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {name}
                    </li>
                  ))}
              </ul>
            )}
          </div>

          <div className="col-md-6">
            <label className="form-label fw-bold">Driver Two</label>
            <div className="position-relative">
              <input
                type="text"
                className="form-control"
                value={driverTwo}
                onFocus={() => setIsFocusedTwo(true)}
                onBlur={() => setTimeout(() => setIsFocusedTwo(false), 100)}
                onChange={(e) => setDriverTwo(e.target.value)}
                placeholder="Type to search..."
              />
              {driverTwo && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-light position-absolute top-50 end-0 translate-middle-y me-2"
                  onClick={() => {
                    setDriverTwo("");
                    setDriverTwoResult(""); // Clear results too
                  }}
                  style={{ zIndex: 2 }}
                >
                  &times;
                </button>
              )}
            </div>
            {isFocusedTwo && (
              <ul className="list-group mt-2">
                {drivers
                  .filter(
                    (name) =>
                      name.toLowerCase().includes(driverTwo.toLowerCase()) &&
                      name !== driverOne
                  )
                  .map((name, i) => (
                    <li
                      key={i}
                      className="list-group-item list-group-item-action"
                      onClick={() => {
                        setDriverTwo(name);
                        const results = getDriverResults(
                          jsonData,
                          yearViz,
                          name
                        );
                        setDriverTwoResult(results);
                        setIsFocusedTwo(false);
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      {name}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeadToHead;
