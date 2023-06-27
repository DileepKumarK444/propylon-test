import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const apiUrl = process.env.REACT_APP_API_URL;

async function uploadFile(file, fileName, url) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("file_name", fileName);
  formData.append("url", url);

  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${apiUrl}file_upload/`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Token ${token}`,
        // "Content-Type": `multipart/form-data; boundary=${boundary}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error("Error uploading file");
    }
  } catch (error) {
    throw new Error(error.message);
  }
}

const FileUploader = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [url, setURL] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileNameChange = (event) => {
    setFileName(event.target.value);
  };

  const handleURLChange = (event) => {
    setURL(event.target.value);
  };

  const handleFileUpload = async () => {
    try {
      if (file && fileName && url) {
        const data = await uploadFile(file, fileName, url);
        setSuccessMessage("File uploaded successfully!");
        setErrorMessage("");
        // console.log(data);
        // console.log("File Name:", data.file_name);
        // console.log("URL:", data.url);
      } else {
        setErrorMessage("Please fill in all fields");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setSuccessMessage("");
      console.error(error);
    }
  };
  const handleBack = () => {
    navigate("/");
  };
  return (
    <div className="d-flex flex-column">
      <h1>File Upload</h1>
      <div className="mb-3">
        <input
          type="file"
          className="form-control"
          id="fileInput"
          onChange={handleFileChange}
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          id="fileName"
          placeholder="File Name"
          value={fileName}
          onChange={handleFileNameChange}
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          id="url"
          placeholder="URL"
          value={url}
          onChange={handleURLChange}
        />
      </div>
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleFileUpload}
      >
        Upload
      </button>
      <br />
      <button type="button" className="btn btn-primary" onClick={handleBack}>
        Back
      </button>
      <br />
      {successMessage && <p>{successMessage}</p>}
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default FileUploader;
