import ResultBuilder from "./ResultBuilder";

function Results({ setYear, jsonData }) {
  const year = jsonData.Career.Years.find((y) => y.CalendarYear == setYear);

  return (
    <div>
      <h3>Weekends for {setYear}</h3>
      <div className="accordion" id="weekendAccordion">
        {year.Weekends.map((weekend, index) => (
          <div className="accordion-item" key={index}>
            <h2 className="accordion-header" id={`heading-${index}`}>
              <button
                className={`accordion-button d-flex justify-content-between align-items-center ${
                  index !== 0 ? "collapsed" : ""
                }`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse-${index}`}
                aria-expanded={index === 0 ? "true" : "false"}
                aria-controls={`collapse-${index}`}
              >
                <div className="d-flex justify-content-between align-items-center w-100">
                  <span>{weekend.TrackData}</span>
                  {weekend.Results?.DriversRaceStanding && (
                    <div className="d-flex gap-2">
                      {weekend.Results.DriversRaceStanding.slice(0, 3).map(
                        (driver, i) => {
                          const badgeClass =
                            i === 0
                              ? "bg-warning text-dark" // 🥇 Gold
                              : i === 1
                              ? "bg-secondary" // 🥈 Silver
                              : "bg-bronze"; // 🥉 Custom bronze class
                          return (
                            <span
                              key={i}
                              className={`badge ${badgeClass}`}
                              title={driver.Driver}
                            >
                              {driver.Position}. {driver.Driver}
                            </span>
                          );
                        }
                      )}
                    </div>
                  )}
                </div>
              </button>
            </h2>
            <div
              id={`collapse-${index}`}
              className={`accordion-collapse collapse ${
                index === 0 ? "show" : ""
              }`}
              aria-labelledby={`heading-${index}`}
              data-bs-parent="#weekendsAccordion"
            >
              <div className="accordion-body">
                <ResultBuilder weekend={weekend} />
                {/*<pre>{JSON.stringify(weekend, null, 2)}</pre>*/}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Results;
