function CalendarYearDropdown({ data, year, setYear }) {
  if (!data || !Array.isArray(data)) return null;

  const handleChange = (e) => {
    setYear(e.target.value);
  };

  return (
    <div className="mb-3">
      <label className="form-label text-light fw-bold">Select Year</label>
      <div className="d-flex gap-2">
        <select className="form-select" value={year} onChange={handleChange}>
          <option value="">Choose a year</option>
          {data.map((yearObj, index) => (
            <option key={index} value={yearObj.CalendarYear}>
              {yearObj.CalendarYear}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => setYear("")}
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export default CalendarYearDropdown;
