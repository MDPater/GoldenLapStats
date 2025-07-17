import React, { useEffect, useState, useRef, useMemo } from "react";
import Chart from 'chart.js/auto';
import CalendarYearDropdown from "../CalendarYearDropdown";

// --- Helper for Chart Colors ---
// Using consistent colors for Driver One and Driver Two
const getDriverColors = () => ({
  driverOneColor: '#4CAF50', // Green
  driverTwoColor: '#2196F3', // Blue
});

// --- Utility Function for Processing Higher Performance Chart Data ---
// Shows how many times each driver qualified higher and finished higher than the other
const processHigherPerformanceChartData = (driverOneData = [], driverTwoData = [], driverOneName, driverTwoName) => {
  let driverOneHigherQualiCount = 0;
  let driverTwoHigherQualiCount = 0;
  let driverOneHigherRaceCount = 0;
  let driverTwoHigherRaceCount = 0;

  // Create maps for quick lookup by round for each driver's data
  const driverTwoRoundsMap = new Map(driverTwoData.map(item => [item.round, item]));

  driverOneData.forEach(driverOneRace => {
    const roundName = driverOneRace.round;
    const driverTwoRace = driverTwoRoundsMap.get(roundName);

    // Only compare if both drivers have qualifying AND race results for this round
    if (driverOneRace.quali && driverTwoRace?.quali && driverOneRace.race && driverTwoRace?.race) {
      // Quali comparison
      const driverOneQualiPos = driverOneRace.quali.Position;
      const driverTwoQualiPos = driverTwoRace.quali.Position;

      if (driverOneQualiPos < driverTwoQualiPos) {
        driverOneHigherQualiCount++;
      } else if (driverTwoQualiPos < driverOneQualiPos) {
        driverTwoHigherQualiCount++;
      }

      // Race comparison
      const driverOneRacePos = driverOneRace.race.Position;
      const driverTwoRacePos = driverTwoRace.race.Position;

      if (driverOneRacePos < driverTwoRacePos) {
        driverOneHigherRaceCount++;
      } else if (driverTwoRacePos < driverOneRacePos) {
        driverTwoHigherRaceCount++;
      }
    }
  });

  // Determine if there's any data to display
  const hasChartData = (driverOneHigherQualiCount > 0 || driverTwoHigherQualiCount > 0 ||
                        driverOneHigherRaceCount > 0 || driverTwoHigherRaceCount > 0);

  const colors = getDriverColors();

  return {
    labels: ['Quali Head-to-Head', 'Race Head-to-Head'],
    datasets: hasChartData ? [
      {
        label: driverOneName,
        data: [driverOneHigherQualiCount, driverOneHigherRaceCount],
        backgroundColor: colors.driverOneColor,
        barPercentage: 0.7,
        categoryPercentage: 0.7,
      },
      {
        label: driverTwoName,
        data: [driverTwoHigherQualiCount, driverTwoHigherRaceCount],
        backgroundColor: colors.driverTwoColor,
        barPercentage: 0.7,
        categoryPercentage: 0.7,
      }
    ] : [],
    hasChartData,
  };
};

function HeadToHead({ jsonData }) {
  const [yearViz, setYearViz] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [driverOne, setDriverOne] = useState("");
  const [driverTwo, setDriverTwo] = useState("");
  const [driverOneRawResult, setDriverOneRawResult] = useState([]);
  const [driverTwoRawResult, setDriverTwoRawResult] = useState([]);
  const [isFocusedOne, setIsFocusedOne] = useState(false);
  const [isFocusedTwo, setIsFocusedTwo] = useState(false);

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!yearViz) {
      setDrivers([]);
      setDriverOne("");
      setDriverTwo("");
      setDriverOneRawResult([]);
      setDriverTwoRawResult([]);
      return;
    }

    const updatedDrivers = getDriverNamesForYear(jsonData.Career, yearViz);
    setDrivers(updatedDrivers);

    if (driverOne && yearViz) {
      const results = getDriverResults(jsonData, yearViz, driverOne);
      setDriverOneRawResult(results[driverOne] || []);
    } else {
      setDriverOneRawResult([]);
    }

    if (driverTwo && yearViz) {
      const results = getDriverResults(jsonData, yearViz, driverTwo);
      setDriverTwoRawResult(results[driverTwo] || []);
    } else {
      setDriverTwoRawResult([]);
    }

  }, [yearViz, jsonData, driverOne, driverTwo]);

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

  // Use useMemo to optimize chart data processing for the 'higher performance' chart
  const { labels, datasets, hasChartData } = useMemo(() => {
    return processHigherPerformanceChartData(
      driverOneRawResult,
      driverTwoRawResult,
      driverOne,
      driverTwo
    );
  }, [driverOneRawResult, driverTwoRawResult, driverOne, driverTwo]);

  // Effect to render or update the chart
  useEffect(() => {
    if (!hasChartData || !chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
      return;
    }

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar', // Bar chart type
      data: {
        labels: labels,
        datasets: datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            mode: 'index',
            intersect: false, // Show tooltips for both bars at the same label
          },
          title: {
            display: true,
            text: `Head-to-Head Superior Performance (${yearViz})` // Chart title
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Category',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Count of Higher Finishes',
            },
            beginAtZero: true,
            ticks: {
              precision: 0 // Ensure integer ticks for counts
            }
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [hasChartData, labels, datasets, yearViz]);

  return (
    <div className="card shadow-lg bg-dark text-light p-4 mb-4">
      <div className="card-body">
        <h5 className="card-title text-center mb-4">Head to Head Comparison</h5>
        <div className="w-50 mb-4">
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
                    setDriverOneRawResult([]);
                  }}
                  style={{ zIndex: 2 }}
                >
                  &times;
                </button>
              )}
            </div>
            {isFocusedOne && (
              <ul className="list-group mt-2 position-absolute w-100" style={{ zIndex: 1000 }}>
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
                    setDriverTwoRawResult([]);
                  }}
                  style={{ zIndex: 2 }}
                >
                  &times;
                </button>
              )}
            </div>
            {isFocusedTwo && (
              <ul className="list-group mt-2 position-absolute w-100" style={{ zIndex: 1000 }}>
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

        {driverOne && driverTwo ? (
          <div className="mt-4">
            <h5 className="mb-3 text-center">Who Qualified/Finished Higher?</h5>
            <div style={{ height: '400px' }}>
              {hasChartData ? (
                <canvas ref={chartRef}></canvas>
              ) : (
                <div className="alert alert-info text-center">
                  No common qualifying or race data found for selected drivers in {yearViz} where one finished higher than the other.
                </div>
              )}
            </div>
          </div>
        ) : (
            <div className="alert alert-info mt-4 text-center">
                Select two unique drivers to compare their head-to-head performance.
            </div>
        )}
      </div>
    </div>
  );
}

export default HeadToHead;