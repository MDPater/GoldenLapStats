import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function Teams({ setYear, jsonData }) {
  const [activeTab, setActiveTab] = useState('standings'); // 'standings' or 'chart'
  const chartRef = useRef(null); // Ref for the chart canvas
  const chartInstanceRef = useRef(null); // Ref to store the Chart.js instance

  // Find the specific year data
  const year = jsonData.Career.Years.find((y) => y.CalendarYear == setYear);

  const calculateTeamTotals = (weekends = []) => {
    const teamTotals = {}; // Stores the final total points for standings
    const raceDataForChart = []; // Stores cumulative points for the chart

    // First pass: Collect all unique team names across all weekends
    const allUniqueTeams = new Set();
    weekends.forEach(weekend => {
        const standings = weekend.Results?.TeamsRaceStanding || [];
        standings.forEach(entry => {
            if (entry.Team) {
                allUniqueTeams.add(entry.Team);
            }
        });
    });

    // Initialize current points for all teams to 0
    const currentCumulativeScores = {};
    allUniqueTeams.forEach(team => {
        currentCumulativeScores[team] = 0;
    });

    weekends.forEach((weekend, weekendIndex) => {
      const standings = weekend.Results?.TeamsRaceStanding || [];

      // Update scores for the current weekend
      standings.forEach((entry) => {
        const team = entry.Team;
        // Ensure score is a number, default to 0 if not present
        const score = Number(entry.Score) || 0;

        if (!team) return; // Skip if team name is missing

        // Add to final team totals
        if (!teamTotals[team]) {
          teamTotals[team] = 0;
        }
        teamTotals[team] += score;

        // Update current cumulative score for this team
        currentCumulativeScores[team] += score;
      });

      // Capture the snapshot of cumulative scores for the chart
      const weekendCumulativeScoresSnapshot = {
        weekend: weekend.TrackData // Use TrackData directly as it's the name
      };
      allUniqueTeams.forEach(team => {
          // Ensure all teams are present in the snapshot, even if they didn't score
          weekendCumulativeScoresSnapshot[team] = currentCumulativeScores[team];
      });
      raceDataForChart.push(weekendCumulativeScoresSnapshot);
    });

    const finalStandings = Object.entries(teamTotals)
      .map(([Team, Score]) => ({ Team, Score }))
      .sort((a, b) => b.Score - a.Score);

    return { finalStandings, raceDataForChart };
  };

  // Get data, gracefully handle if year or weekends are missing
  const { finalStandings, raceDataForChart } = calculateTeamTotals(year?.Weekends || []);

  // Effect to render or update the chart
  useEffect(() => {
    if (activeTab === 'chart' && chartRef.current && raceDataForChart.length > 0) {
      // Destroy existing chart instance if it exists
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const ctx = chartRef.current.getContext('2d');

      const labels = raceDataForChart.map(data => data.weekend); // Race names or round numbers

      // Get all unique team names from the raceDataForChart (keys excluding 'weekend')
      const allTeams = Array.from(new Set(
        raceDataForChart.flatMap(data => Object.keys(data).filter(key => key !== 'weekend'))
      ));

      const datasets = allTeams.map(team => {
        // Collect scores for the current team across all weekends
        const dataPoints = raceDataForChart.map(weekendData => weekendData[team] || 0);

        return {
          label: team,
          data: dataPoints,
          fill: false,
          tension: 0.1,
          borderColor: getRandomColor(), // Helper function to get a random color
        };
      });

      // Check if labels or datasets are still empty
      if (labels.length === 0 || datasets.length === 0 || datasets.every(ds => ds.data.every(val => val === 0))) {
          console.warn("Chart data is empty or all zeroes. Chart won't display points.");
          return; // Prevent chart creation if data is truly missing
      }


      chartInstanceRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: datasets,
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // Allows flexible sizing
          plugins: {
            tooltip: {
              mode: 'index',
              intersect: false,
            },
            title: {
              display: true,
              text: `Team Cumulative Points per Race (${setYear})`
            }
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Race Weekend'
              }
            },
            y: {
              title: {
                display: true,
                text: 'Cumulative Points'
              },
              beginAtZero: true
            }
          }
        },
      });

      console.log(raceDataForChart)
    }
  }, [activeTab, raceDataForChart, setYear]); // Re-run effect when tab changes or data updates

  // Helper function to generate random colors for chart lines
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };


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

  // Improved initial check for year data
  if (!year || !year.Weekends || year.Weekends.length === 0) {
    return (
      <div className="container mt-4 alert alert-warning">
        No race data found for year {setYear}.
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
            Team Standings
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

      {/* Conditional Rendering based on activeTab */}
      {activeTab === 'standings' && (
        finalStandings.length > 0 ? (
          <ul className="list-group">
            {finalStandings.map((team, i) => (
              <li
                key={i}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>
                  <strong>{i + 1}.</strong> {team.Team}
                </span>
                <span className={`badge rounded-pill ${getBadgeClass(i)}`}>
                  {team.Score} pts
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="alert alert-info">No team standings available.</div>
        )
      )}

      {activeTab === 'chart' && (
        <div style={{ height: '400px' }}> {/* Set a height for the chart container */}
          {raceDataForChart.length > 0 && finalStandings.some(team => team.Score > 0) ? (
            <canvas ref={chartRef}></canvas>
          ) : (
            <div className="alert alert-info">No race data available or no points scored to display chart.</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Teams;