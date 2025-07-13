import { useState } from "react";
import FileUploader from "./components/FileUploader";
import LandingPage from "./sites/LandingPage";
import SeasonStats from "./sites/SeasonStats";
import testData from "./model/testData.json";
import "./App.css";
import Footer from "./components/Footer";

function App() {
  const [active, setActive] = useState(false);
  const [data, setData] = useState();

  return (
    <div>
      <div className="row row-cols-3 justify-content-center align-items-center text-center">
        <div className="container-sm d-flex justify-content-center gap-2">
          <button
            type="button"
            className="mx-auto btn btn-secondary btn-sm"
            onClick={() => {
              setActive(!active);
            }}
          >
            Upload Save File
          </button>
          <button
            type="button"
            className="btn btn-outline-warning btn-sm"
            onClick={() => setData(testData)}
          >
            Load Test Data
          </button>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => setData(null)} // <- define this function in your component
          >
            Delete Data
          </button>
        </div>
        <h1 className="h1 py-3">Golden Lap Stats</h1>
        <div className="" />
      </div>
      {active && (
        <FileUploader onClose={() => setActive(false)} setData={setData} />
      )}
      {!data && <LandingPage />}
      {data && <SeasonStats data={data} />}
      <Footer />
    </div>
  );
}

export default App;
