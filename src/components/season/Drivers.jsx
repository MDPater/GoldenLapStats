function Drivers({ setYear, jsonData }) {
  const year = jsonData.Career.Years.find((y) => y.CalendarYear == setYear);

  return (
    <div>
      <h1>Drivers</h1>
    </div>
  );
}

export default Drivers;
