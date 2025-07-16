import HeadToHead from "../components/dataViz/HeadToHead";

function DataViz({ data }) {
  return (
    <div>
      <h1>Data Viz</h1>
      <HeadToHead jsonData={data} />
    </div>
  );
}

export default DataViz;
