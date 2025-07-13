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
      <main>
        <div className="row row-cols-3 justify-content-center align-items-center text-center">
          <div className="container-sm d-flex justify-content-center gap-2">
            <button
              type="button"
              className="mx-auto btn btn-secondary btn-sm"
              onClick={() => {
                setActive(!active);
              }}
            >
              Select your local save file
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
          <div className="d-flex justify-content-end align-items-center">
            <a
              href="https://store.steampowered.com/app/2052040/Golden_Lap/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary d-flex align-items-center gap-2"
              style={{ backgroundColor: "#171a21", borderColor: "#171a21" }} // Steam dark blue
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg"
                alt="Steam Logo"
                style={{ width: "24px", height: "24px" }}
              />
              <span>Visit Golden Lap on Steam</span>
            </a>
          </div>
        </div>
        {active && (
          <FileUploader onClose={() => setActive(false)} setData={setData} />
        )}
        {!data && <LandingPage />}
        {data && <SeasonStats data={data} />}
      </main>
      <Footer />
    </div>
  );
}

export default App;
