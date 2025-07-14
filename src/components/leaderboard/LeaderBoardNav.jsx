function LeaderBoardNav({ activeTab, setActiveTab }) {
  const tabs = [
    "Wins",
    "Podiums",
    "Championships",
    "Career Points",
    "Fastest Laps",
    "Pole Positions",
    "Races Completed",
    "Seasons Completed",
  ];

  return (
    <div className="container my-4">
      <ul className="nav nav-pills flex-wrap justify-content-center gap-2">
        {tabs.map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LeaderBoardNav;
