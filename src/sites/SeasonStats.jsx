import { useState } from "react";
import CalendarYearDropdown from "../components/CalendarYearDropdown";
import Teams from "../components/season/Teams";
import Results from "../components/season/Results";
import Drivers from "../components/season/Drivers";

function SeasonStats({ data }) {
  const [year, setYear] = useState();
  const [activeTab, setActiveTab] = useState("results");

  return (
    <div className="p-4">
      <h1>Save File: {data.CareerHeader?.CareerName}</h1>
      <div className="w-25">
        <CalendarYearDropdown data={data.Career?.Years} setYear={setYear} />
      </div>
      {year && (
        <>
          <ul className="nav nav-tabs justify-content-center">
            <li className="nav-item">
              <a
                className={`nav-link ${
                  activeTab === "results" ? "active" : ""
                } px-5`}
                href="#results"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("results");
                }}
              >
                Results
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${
                  activeTab === "teams" ? "active" : ""
                } px-5`}
                href="#teams"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("teams");
                }}
              >
                Teams
              </a>
            </li>
            <li className="nav-item">
              <a
                className={`nav-link ${
                  activeTab === "drivers" ? "active" : ""
                } px-5`}
                href="#drivers"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("drivers");
                }}
              >
                Drivers
              </a>
            </li>
          </ul>
          <div className="mt-3 mb-5">
            {activeTab === "results" && (
              <Results setYear={year} jsonData={data} />
            )}
            {activeTab === "teams" && <Teams setYear={year} jsonData={data} />}
            {activeTab === "drivers" && (
              <Drivers setYear={year} jsonData={data} />
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default SeasonStats;
