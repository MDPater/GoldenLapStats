import React, { useState, useEffect, useRef, useMemo } from 'react';
import Chart from 'chart.js/auto';

// --- Utility Function for Data Calculation (Extracted for Simplicity) ---
const calculateDriverData = (weekends = []) => {
  const driverTotals = {}; // Final totals for standings
  const raceDataForChart = []; // Cumulative points for chart

  // Collect all unique driver names first
  const allUniqueDrivers = new Set();
  weekends.forEach(weekend => {
    const standings = weekend.Results?.DriversRaceStanding || [];
    standings.forEach(entry => {
      if (entry.Driver) {
        allUniqueDrivers.add(entry.Driver);
      }
    });
  });

  // Initialize cumulative scores for all drivers to 0
  const currentCumulativeScores = {};
  allUniqueDrivers.forEach(driver => {
    currentCumulativeScores[driver] = 0;
  });

  weekends.forEach(weekend => {
    const standings = weekend.Results?.DriversRaceStanding || [];

    // Update scores for the current weekend
    standings.forEach(entry => {
      const driver = entry.Driver;
      const team = entry.Team || "Unknown Team"; // Keep team for final standings
      const score = Number(entry.Score) || 0; // Ensure score is a number

      if (!driver) return;

      // Update final driver totals (used for standings list)
      if (!driverTotals[driver]) {
        driverTotals[driver] = { Score: 0, Team: team };
      }
      driverTotals[driver].Score += score;

      // Update current cumulative score for this driver (used for chart)
      currentCumulativeScores[driver] += score;
    });

    // Capture the snapshot of cumulative scores for the chart
    const weekendCumulativeScoresSnapshot = {
      weekend: weekend.TrackData // Use TrackData directly as it's the name
    };
    allUniqueDrivers.forEach(driver => {
      // Ensure all drivers are present in the snapshot, even if they didn't score
      weekendCumulativeScoresSnapshot[driver] = currentCumulativeScores[driver];
    });
    raceDataForChart.push(weekendCumulativeScoresSnapshot);
  });

  console.log(raceDataForChart)

  const finalStandings = Object.entries(driverTotals)
    .map(([Driver, { Score, Team }]) => ({ Driver, Team, Score }))
    .sort((a, b) => b.Score - a.Score);

  return { finalStandings, raceDataForChart, allUniqueDrivers: Array.from(allUniqueDrivers) };
};

// --- Helper for Chart Colors ---
const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

function Drivers({ setYear, jsonData }) {
  const [activeTab, setActiveTab] = useState('standings');
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // Use useMemo to prevent recalculating data on every render unless dependencies change
  const { finalStandings, raceDataForChart, allUniqueDrivers } = useMemo(() => {
    const yearData = jsonData.Career.Years.find((y) => y.CalendarYear == setYear);
    return calculateDriverData(yearData?.Weekends || []);
  }, [jsonData, setYear]);

  // Determine if there's any data to display, and if any driver scored points
  const hasStandingsData = finalStandings.length > 0;
  const hasChartData = raceDataForChart.length > 0 && finalStandings.some(driver => driver.Score > 0);

  // Effect to render or update the chart
  useEffect(() => {
    // If not on chart tab, or no chart ref, or no chart data, destroy existing chart and exit
    if (activeTab !== 'chart' || !chartRef.current || !hasChartData) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
      return;
    }

    // Destroy existing chart before creating a new one (important for updates)
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    const labels = raceDataForChart.map(data => data.weekend);
    const datasets = allUniqueDrivers.map(driver => ({
      label: driver,
      data: raceDataForChart.map(weekendData => weekendData[driver] || 0),
      fill: false,
      tension: 0.1,
      borderColor: getRandomColor(),
    }));

    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: { mode: 'index', intersect: false },
          title: { display: true, text: `Driver Cumulative Points per Race (${setYear})` }
        },
        scales: {
          x: { title: { display: true, text: 'Race Weekend' } },
          y: { title: { display: true, text: 'Cumulative Points' }, beginAtZero: true }
        }
      },
    });
  }, [activeTab, raceDataForChart, allUniqueDrivers, setYear, hasChartData]); // Dependencies for useEffect

  // Badge class helper
  const getBadgeClass = (index) => {
    switch (index) {
      case 0: return "bg-warning text-dark"; // Gold
      case 1: return "bg-secondary text-white"; // Silver
      case 2: return "bg-bronze text-white"; // Bronze (custom)
      default: return "bg-primary";
    }
  };

  // Early exit if no relevant year data
  if (!jsonData.Career?.Years?.find((y) => y.CalendarYear == setYear)) {
    return (
      <div className="container mt-4 alert alert-warning">
        No data found for year {setYear}.
      </div>
    );
  }

  return (
    <div className="container mt-4">

      {/* Navigation Tabs */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'standings' ? 'active' : ''}`}
            onClick={() => setActiveTab('standings')}
          >
            Driver Standings
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'chart' ? 'active' : ''}`}
            onClick={() => setActiveTab('chart')}
          >
            Points Over Season
          </button>
        </li>
      </ul>

      {/* Conditional Content */}
      {activeTab === 'standings' && (
        hasStandingsData ? (
          <ul className="list-group">
            {finalStandings.map((driver, i) => (
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
        )
      )}

      {activeTab === 'chart' && (
        <div style={{ height: '400px' }}>
          {hasChartData ? (
            <canvas ref={chartRef}></canvas>
          ) : (
            <div className="alert alert-info">No race data or points scored to display chart.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Drivers;