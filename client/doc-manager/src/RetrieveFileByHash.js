import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const apiUrl = process.env.REACT_APP_API_URL;

const RetrieveFileByHash = () => {
  const [fileHash, setFileHash] = useState("");
  const [fileURL, setFileURL] = useState(null);
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
          //   "Content-Type": "application/json",
        },
      })
        .then((response) => response.blob())
        .then((blob) => {
          const fileUrl = URL.createObjectURL(blob);
          setFileURL(fileUrl);
        })
        .catch((error) => {
          console.error("Error:", error);
          // Handle the error appropriately
        });
    } catch (error) {
      console.error(error);
    }
  };
  const handleBack = () => {
    navigate("/");
  };
  useEffect(() => {
    if (fileURL) {
      const link = document.createElement("a");
      link.href = fileURL;
      link.click();
    }
  }, [fileURL]);

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
