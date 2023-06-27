import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FileDownload from "./FileDownload";

import "./FileVersions.css";

function FileVersionsList(props) {
  const file_versions = props.file_versions;
  return file_versions.map((file_version) => (
    <div className="file-version" key={file_version.id}>
      <h2>
        File Name:{" "}
        {file_version.file_name + "." + file_version.file.split(".").pop()}
      </h2>
      <p>
        ID: {file_version.id} Version: {file_version.version_number}
      </p>
      <div>
        {/* Use the FileDownload component with appropriate props */}
        <FileDownload
          file_name={file_version.file_name}
          version_number={file_version.version_number}
          path={
            file_version.url +
            "" +
            file_version.file_name +
            "." +
            file_version.file.split(".").pop()
          }
        />
      </div>
    </div>
  ));
}
function FileVersions() {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  console.log(data);

  useEffect(() => {
    // fetch data
    console.log();
    const dataFetch = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(`${apiUrl}file_versions`, {
        headers: {
          Authorization: `Token ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setData(data);
      } else {
        // handle error
        console.error("Failed to fetch file versions");
      }
    };

    dataFetch();
  }, []);

  const handleUploadClick = () => {
    navigate("/upload");
  };
  return (
    <div className="d-flex flex-column">
      <h1>Found {data.length} File Versions</h1>
      <button onClick={handleUploadClick} className="btn btn-primary">
        Upload File
      </button>
      <br />
      <div>
        <FileVersionsList file_versions={data} />
      </div>
    </div>
  );
}

export default FileVersions;
