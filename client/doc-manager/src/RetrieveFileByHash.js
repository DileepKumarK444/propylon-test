import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const apiUrl = process.env.REACT_APP_API_URL;

const RetrieveFileByHash = () => {
  const [fileHash, setFileHash] = useState("");
  const [fileURL, setFileURL] = useState(null);
  const [fileName, setFileName] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    setFileHash(event.target.value);
  };

  const handleDownload = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${apiUrl}file/${fileHash}`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const header = response.headers.get("content-disposition");
      const blob = await response.blob();
      const parts = header.split("=");
      var filename = "sample";
      if (parts.length === 2) {
        var filename = parts[1].replace(/"/g, "").trim();
      }
      const fileUrl = URL.createObjectURL(blob);

      // Create a link element and simulate a click to initiate the download
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = filename;
      link.click();

      // Clean up the temporary URL
      URL.revokeObjectURL(fileUrl);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="d-flex flex-column">
      <h1>Download File using Hash</h1>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          value={fileHash}
          onChange={handleInputChange}
          placeholder="Enter file hash"
        />
      </div>
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleDownload}
      >
        Download File
      </button>
      <br />
      <button type="button" className="btn btn-primary" onClick={handleBack}>
        Back
      </button>
    </div>
  );
};

export default RetrieveFileByHash;
