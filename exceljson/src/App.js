import logo from "./logo.svg";
import "./App.css";
import * as XLSX from "xlsx";
import JSZip from "jszip";

function App() {
  const readUploadFile = (e) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        const zip = new JSZip();
        const files = [];

        jsonData.forEach((row, index) => {
          const jsonString = JSON.stringify(row, null, 2);
          zip.file(`data_${index + 1}.json`, jsonString);
          files.push(`data_${index + 1}.json`);
        });

        zip.generateAsync({ type: "blob" }).then((content) => {
          const url = URL.createObjectURL(content);
          const link = document.createElement("a");
          link.href = url;
          link.download = "data.zip";

          document.body.appendChild(link);
          link.click();

          URL.revokeObjectURL(url);
          document.body.removeChild(link);
        });
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Excel to JSON Downloader</h1>
      </header>
      <div className="App-content">
        <label htmlFor="upload" className="upload-label">
          Upload Excel File
          <input
            type="file"
            name="upload"
            id="upload"
            onChange={readUploadFile}
          />
        </label>
      </div>
    </div>
  );
}

export default App;
