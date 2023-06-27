import React, { useEffect, useState } from "react";

const FileDownload = ({ file_name, version_number, path }) => {
  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(
      `http://localhost:8001/api/file/${file_name}/version/${version_number}/`,
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    )
      .then((response) => response.blob())
      .then((blob) => {
        const fileUrl = URL.createObjectURL(blob);
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

  return (
    <div>
      {/* <h1>File Download: {file_name}</h1> */}
      {fileUrl && (
        <a href={fileUrl} download>
          {path}
        </a>
      )}
    </div>
  );
};

export default FileDownload;
