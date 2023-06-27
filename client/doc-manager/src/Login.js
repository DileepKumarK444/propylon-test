import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const apiUrlLogin = process.env.REACT_APP_API_URL_LOGIN;

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${apiUrlLogin}auth-token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;

        // Store the token in local storage or cookies
        localStorage.setItem("token", token);

        // Call setIsAuthenticated with the appropriate value
        onLogin();
        localStorage.setItem("isAuthenticated", JSON.stringify(true));
        navigate("/");

        // Redirect the user or update the UI accordingly
        // e.g., history.push('/dashboard') or setLoggedIn(true)
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      // Handle login error
      console.error("Login failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="d-flex flex-column">
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            id="username"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Login
        </button>
      </div>
    </form>
  );
};

export default Login;
