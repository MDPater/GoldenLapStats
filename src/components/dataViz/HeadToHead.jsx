import { useEffect, useState } from "react";
import CalendarYearDropdown from "../CalendarYearDropdown";

function HeadToHead({ jsonData }) {
  const [yearViz, setYearViz] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [searchOne, setSearchOne] = useState("");
  const [searchTwo, setSearchTwo] = useState("");
  const [isFocusedOne, setIsFocusedOne] = useState(false);
  const [isFocusedTwo, setIsFocusedTwo] = useState(false);

  useEffect(() => {
    if (!yearViz) return setDrivers([]);

    const updatedDrivers = getDriverNamesForYear(jsonData.Career, yearViz);
    setDrivers(updatedDrivers);
  }, [yearViz, jsonData]);

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

  console.log(drivers);

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
                value={searchOne}
                onFocus={() => setIsFocusedOne(true)}
                onBlur={() => setTimeout(() => setIsFocusedOne(false), 100)}
                onChange={(e) => setSearchOne(e.target.value)}
                placeholder="Type to search..."
              />
              {searchOne && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-light position-absolute top-50 end-0 translate-middle-y me-2"
                  onClick={() => setSearchOne("")}
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
                      name.toLowerCase().includes(searchOne.toLowerCase()) &&
                      name !== searchTwo
                  )
                  .map((name, i) => (
                    <li
                      key={i}
                      className="list-group-item list-group-item-action"
                      onClick={() => {
                        setSearchOne(name);
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
                value={searchTwo}
                onFocus={() => setIsFocusedTwo(true)}
                onBlur={() => setTimeout(() => setIsFocusedTwo(false), 100)}
                onChange={(e) => setSearchTwo(e.target.value)}
                placeholder="Type to search..."
              />
              {searchTwo && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-light position-absolute top-50 end-0 translate-middle-y me-2"
                  onClick={() => setSearchTwo("")}
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
                      name.toLowerCase().includes(searchTwo.toLowerCase()) &&
                      name !== searchOne
                  )
                  .map((name, i) => (
                    <li
                      key={i}
                      className="list-group-item list-group-item-action"
                      onClick={() => {
                        setSearchTwo(name);
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
