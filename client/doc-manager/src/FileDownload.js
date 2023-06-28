import React, { useEffect, useState } from "react";

const apiUrl = process.env.REACT_APP_API_URL;

const FileDownload = ({ file_name, version_number, path }) => {
  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`${apiUrl}file/${file_name}/version/${version_number}/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const fileUrl = URL.createObjectURL(blob);
        console.log(fileUrl);
        setFileUrl(fileUrl);
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle the error appropriately
      });

    // Clean up the created object URL when component unmounts
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [file_name, version_number]);

  const handleFileDownload = () => {
    if (fileUrl) {
      const link = document.createElement("a");
      link.href = fileUrl;
      const fileNameWithExtension = file_name + getExtensionFromPath(path); // Add the file extension
      link.setAttribute("download", fileNameWithExtension);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const getExtensionFromPath = (path) => {
    return path.substring(path.lastIndexOf("."));
  };
  return (
    <div>
      {/* <h1>File Download: {file_name}</h1> */}
      {fileUrl && (
        <button
          className="btn btn-primary col-sm-12"
          onClick={handleFileDownload}
          download
        >
          {path}
        </button>
      )}
    </div>
  );
};

export default FileDownload;
