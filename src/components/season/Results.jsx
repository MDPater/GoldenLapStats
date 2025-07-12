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
                className={`accordion-button ${index !== 0 ? "collapsed" : ""}`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapse-${index}`}
                aria-expanded={index === 0 ? "true" : "false"}
                aria-controls={`collapse-${index}`}
              >
                {weekend.TrackData}
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
                {/* Customize this based on weekend object structure */}
                <pre>{JSON.stringify(weekend, null, 2)}</pre>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Results;
