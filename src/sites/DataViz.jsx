import DriverStats from "../components/dataViz/DriverStats";
import HeadToHead from "../components/dataViz/HeadToHead";

function DataViz({ data }) {
  return (
    <div>
      <h1>Data Viz</h1>
      <HeadToHead jsonData={data} />
      <DriverStats jsonData={data}/>
    </div>
  );
}

export default DataViz;
