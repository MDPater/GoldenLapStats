import React, { useState } from "react";
import LeaderBoardNav from "../components/leaderboard/LeaderBoardNav";
import LeaderBoardBuilder from "../components/leaderboard/LeaderBoardBuilder";

const isDriver = (person) =>
  person.States?.some((state) => state["$type"]?.includes("DriverStats"));

function LeaderBoard({ jsonData }) {
  const [activeTab, setActiveTab] = useState("Wins");
  const drivers = jsonData.Career.People.filter(isDriver);

  return (
    <div>
      <LeaderBoardNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="container">
        <LeaderBoardBuilder activeTab={activeTab} jsonData={drivers} />
      </div>
    </div>
  );
}

export default LeaderBoard;
