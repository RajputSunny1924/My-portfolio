import { useState } from "react";
// import "./app.css";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [registerError, setRegisterError] = useState("");

  // registration
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");

  // login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // function to handle submit
  async function handleSubmit(e) {
    e.preventDefault();

    setRegisterError("");

    const response = await fetch("http://127.0.0.1:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        email: email,
        password: password,
      }),
    });

    const data = await response.json();

    console.log(data);

    if (response.ok) {
      setShowRegister(false);
    } else {
      setRegisterError(data.detail);
    }
  }

  // function to handle login
  async function handleLogin(e) {
    e.preventDefault();
    setLoginError("");

    const response = await fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword,
      }),
    });

    const data = await response.json();
    console.log(data);

    if (data.token) {
      localStorage.setItem("token", data.token);
      setIsLoggedIn(true);
    } else {
      setLoginError("Invalid email or password");
    }
  }

  // function to handle profile
  async function handleProfile() {
    const token = localStorage.getItem("token");

    const response = await fetch("http://127.0.0.1:8000/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    console.log(data);
  }

  async function handleUser() {
    const token = localStorage.getItem("token");

    const profileResponse = await fetch("http://127.0.0.1:8000/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const profileData = await profileResponse.json();
    console.log("profile:", profileData);

    if (!profileResponse.ok) {
      console.log("please login first");
      return;
    }

    const userId = profileData.user.user_id;

    const response = await fetch(`http://127.0.0.1:8000/users/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log("USER:", data);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    console.log("Logout sucessful");
  }

  return (
    <div>
      {isLoggedIn ? (
        <div>
          <h1>Full Stack Project Documentation</h1>

          <p>React + FastAPI + MySQL + SQLAlchemy + JWT Authentication</p>

          <hr />

          <h2>Project Overview</h2>

          <p>
            This project is a full stack web application where React is used for
            the frontend, FastAPI is used for the backend, and MySQL is used for
            storing user data.
          </p>

          <h2>Technologies Used</h2>

          <ul>
            <li>React - Frontend</li>
            <li>FastAPI - Backend API</li>
            <li>MySQL - Database</li>
            <li>SQLAlchemy - Database connection and queries</li>
            <li>JWT - Authentication</li>
            <li>Argon2 - Password hashing</li>
          </ul>

          <h2>Project Flow</h2>

          <p>React → FastAPI → SQLAlchemy → MySQL</p>

          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : showRegister ? (
        <div>
          <h1>Registration Page</h1>

          <form onSubmit={handleSubmit}>
            <label>Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <br />

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <br />

            <label>Password</label>

            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            />

            <br />

            {registerError && <p>{registerError}</p>}

            <button type="submit">Create Account</button>
          </form>

          <button type="button" onClick={() => setShowRegister(false)}>
            Back to Login
          </button>
        </div>
      ) : (
        <div>
          <h1>Login Page</h1>

          <form onSubmit={handleLogin}>
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />

            <br />

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />

            <br />

            {loginError && <p>{loginError}</p>}

            <button type="submit">Login</button>
          </form>

          <button type="button" onClick={() => setShowRegister(true)}>
            Create Account
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
