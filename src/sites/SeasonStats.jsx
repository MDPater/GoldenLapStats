import { useState } from "react";
import CalendarYearDropdown from "../components/CalendarYearDropdown";
import Teams from "../components/season/Teams";
import Results from "../components/season/Results";
import Drivers from "../components/season/Drivers";
import LeaderBoard from "./LeaderBoard";

function SeasonStats({ data }) {
  const [year, setYear] = useState();
  const [activeTab, setActiveTab] = useState("results");
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="p-4">
      <h1>Save File: {data.CareerHeader?.CareerName}</h1>
      <div className="d-flex align-items-center gap-3 mb-3">
        <h5 className="">Your Team: {data.CareerHeader?.TeamInfo}</h5>
        <h5 className="">Engineer: {data.CareerHeader?.Engineer}</h5>
        <h5 className="">Crew Chief: {data.CareerHeader?.CrewChief}</h5>
      </div>
      <div className="d-flex align-items-center gap-3 mb-3">
        <div className="w-25">
          <CalendarYearDropdown data={data.Career?.Years} setYear={setYear} />
        </div>
        <button
          className="btn btn-outline-info mt-3 btn-sm"
          onClick={() => setShowPopup(false)}
        >
          Golden Lap Statistics
        </button>
      </div>

      {
        /*Show the LeaderBoard on button click*/
        showPopup && (
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Statistics</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowPopup(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <LeaderBoard jsonData={data} />
                </div>
              </div>
            </div>
          </div>
        )
      }

      {
        /*show the year statistics if a year is set*/
        year && (
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
            <div className="mt-3">
              {activeTab === "results" && (
                <Results setYear={year} jsonData={data} />
              )}
              {activeTab === "teams" && (
                <Teams setYear={year} jsonData={data} />
              )}
              {activeTab === "drivers" && (
                <Drivers setYear={year} jsonData={data} />
              )}
            </div>
          </>
        )
      }

      {!year && <h1>{/* Add driver cards in future */}</h1>}
    </div>
  );
}

export default SeasonStats;
