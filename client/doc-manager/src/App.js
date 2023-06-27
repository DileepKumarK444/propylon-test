// import "./App.css";
// import FileVersions from "./FileVersions";

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <FileVersions />
//       </header>
//     </div>
//   );
// }

// export default App;

import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import FileVersions from "./FileVersions";
import FileUpload from "./FileUploader";
import Login from "./Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    JSON.parse(localStorage.getItem("isAuthenticated")) || false
  );

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", JSON.stringify(true));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("isAuthenticated");
  };

  const ProtectedRoute = ({ path, element }) => {
    // console.log(element);
    if (isAuthenticated) {
      return element;
    } else {
      return <Navigate to="/login" />;
    }
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/"
          element={<ProtectedRoute element={<FileVersions />} />}
        />
        <Route
          path="/upload"
          element={<ProtectedRoute element={<FileUpload />} />}
        />
      </Routes>
      {isAuthenticated ? (
        <button className="btn btn-link" onClick={handleLogout}>
          Logout
        </button>
      ) : (
        <Navigate to="/login" />
      )}
    </Router>
  );
}

export default App;
