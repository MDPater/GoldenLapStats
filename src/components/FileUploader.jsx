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

    reader.readAsText(file);
  };

  const saveData = () => {
    setData(file);
    onClose();
  };

  return (
    <div className="bg-dark container mt-4 border border-light p-3 position-relative">
      <div
        className="position-absolute d-flex gap-2"
        style={{ top: "10px", right: "10px" }}
      >
        {fileSelected && (
          <button onClick={saveData} className="btn btn-success btn-sm">
            Use Save File
          </button>
        )}
        <button
          onClick={onClose}
          className="btn btn-danger btn-sm"
          aria-label="Close"
        >
          &times;
        </button>
      </div>
      <div className="row">
        <input
          className="col"
          type="file"
          accept=".json"
          onChange={fileUpload}
        />
      </div>
      <p>Current Save:</p>
      {file && (
        <div>
          <div className="mt-5 container">
            <div className="row align-items-center gx-2 container-fluid">
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
        </div>
      )}
    </div>
  );
}

export default FileUploader;
