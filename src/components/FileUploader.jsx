import { useState } from "react";

function FileUploader({ onClose, setData }) {
  const [fileSelected, setFileSelected] = useState(false);
  const [file, setFile] = useState();

  const fileUpload = (e) => {
    const file = e.target.files[0];
    setFileSelected(!!file);
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsedJson = JSON.parse(event.target.result);
        setFile(parsedJson);
        console.log("Parsed JSON: ", parsedJson);
      } catch (error) {
        console.error("Invalid JSON File", error);
      }
    };

    reader.readAsText(file, "UTF-8");
  };

  const saveData = () => {
    setData(file);
    onClose();
  };

  return (
    <div className="bg-dark container mt-4 border border-light p-3 rounded">
      <div className="alert alert-warning small" role="alert">
        <strong>Note:</strong> This file input is only used to load your local
        <em> Golden Lap </em> save file (<code>.json</code>). <br />
        Your file stays in your browser and is never uploaded or saved remotely.
      </div>

      <div className="row align-items-center g-2 mb-3">
        <div className="col-md">
          <input
            className="form-control"
            type="file"
            accept=".json"
            onChange={fileUpload}
          />
        </div>
        {fileSelected && (
          <div className="col-auto">
            <button onClick={saveData} className="btn btn-success btn-sm">
              Use Save File
            </button>
          </div>
        )}
        <div className="col-auto">
          <button
            onClick={onClose}
            className="btn btn-danger btn-sm"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
      </div>

      <p className="mt-3">Current Save:</p>
      {file && (
        <div className="mt-3 container">
          <div className="row align-items-center gx-2">
            <div className="col">
              <pre className="text-light p-3 rounded mb-0">
                Save Name: {file.CareerHeader?.CareerName}
              </pre>
              <pre className="text-light p-3 rounded mb-0">
                Team: {file.CareerHeader?.TeamInfo}
              </pre>
              <pre className="text-light p-3 rounded mb-0">
                Current Year: {file.CareerHeader?.CurrentYear}
              </pre>
            </div>
            <div className="col">
              <pre className="text-light p-3 rounded mb-0">
                Driver 1: {file.CareerHeader?.Driver1}
              </pre>
              <pre className="text-light p-3 rounded mb-0">
                Driver 2: {file.CareerHeader?.Driver2}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUploader;
