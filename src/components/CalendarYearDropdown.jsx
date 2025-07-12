function CalendarYearDropdown({ data, setYear }) {
  if (!data || !Array.isArray(data)) return null;

  const handleChange = (e) => {
    setYear(e.target.value);
  };

  return (
    <div className="mb-3">
      <label className="form-label text-light fw-bold">Select Year</label>
      <select className="form-select" onChange={handleChange}>
        <option value="">-- Choose a year --</option>
        {data.map((yearObj, index) => (
          <option key={index} value={yearObj.CalendarYear}>
            {yearObj.CalendarYear}
          </option>
        ))}
      </select>
    </div>
  );
}

export default CalendarYearDropdown;
