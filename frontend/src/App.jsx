import { useEffect, useState } from "react";

function App() {
  // Decide which form to show
  const [showLogin, setShowLogin] = useState(true);

  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Registration form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Login form data
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Email verification data
  const [verificationData, setVerificationData] = useState({
    email: "",
    otp: "",
  });

  // Decide whether verification form should be shown
  const [showVerification, setShowVerification] = useState(false);

  // Check authentication using saved JWT
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        setCheckingAuth(false);
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem("access_token");
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsLoggedIn(false);
      }

      setCheckingAuth(false);
    };

    checkAuth();
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsLoggedIn(false);
  };

  // Handle registration input changes
  const handleRegisterChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  // Handle login input changes
  const handleLoginChange = (event) => {
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value,
    });
  };

  // Handle registration
  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      console.log("Register response:", data);

      if (response.ok) {
        setVerificationData({
          email: formData.email,
          otp: "",
        });

        setShowVerification(true);

        setFormData({
          name: "",
          email: "",
          password: "",
        });
      } else {
        console.error("Registration failed:", data.detail);
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  // Handle email verification
  const handleVerifyEmail = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(verificationData),
      });

      const data = await response.json();

      console.log("Verification response:", data);

      if (response.ok) {
        setShowVerification(false);
        setShowLogin(true);

        setVerificationData({
          email: "",
          otp: "",
        });
      } else {
        console.error("Verification failed:", data.detail);
      }
    } catch (error) {
      console.error("Verification error:", error);
    }
  };

  // Handle login
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      console.log("Login response:", data);

      if (response.ok) {
        localStorage.setItem("access_token", data.access_token);

        setIsLoggedIn(true);
      } else {
        console.error("Login failed:", data.detail);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  // Show loading while checking existing token
  if (checkingAuth) {
    return <h2>Checking authentication...</h2>;
  }

  // Logged-in page
  if (isLoggedIn) {
    return (
      <div>
        <h1>My Portfolio</h1>

        <h2>Welcome to my portfolio</h2>

        <p>You have successfully logged in.</p>

        <button onClick={handleLogout}>Logout</button>
      </div>
    );
  }

  return (
    <div>
      <h1>My Portfolio</h1>

      {/* Email Verification */}
      {showVerification ? (
        <div>
          <h2>Verify Your Email</h2>

          <p>OTP has been sent to {verificationData.email}</p>

          <form onSubmit={handleVerifyEmail}>
            <div>
              <label>OTP</label>

              <input
                type="text"
                name="otp"
                placeholder="Enter 6-digit OTP"
                value={verificationData.otp}
                onChange={(event) =>
                  setVerificationData({
                    ...verificationData,
                    otp: event.target.value,
                  })
                }
              />
            </div>

            <button type="submit">Verify Email</button>
          </form>
        </div>
      ) : (
        <>
          {/* Login / Register buttons */}
          <button onClick={() => setShowLogin(true)}>Login</button>

          <button onClick={() => setShowLogin(false)}>Register</button>

          {/* Login Form */}
          {showLogin && (
            <div>
              <h2>Login</h2>

              <form onSubmit={handleLogin}>
                <div>
                  <label>Email</label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                  />
                </div>

                <div>
                  <label>Password</label>

                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={handleLoginChange}
                  />
                </div>

                <button type="submit">Login</button>
              </form>
            </div>
          )}

          {/* Registration Form */}
          {!showLogin && (
            <div>
              <h2>Create Account</h2>

              <form onSubmit={handleRegister}>
                <div>
                  <label>Name</label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={handleRegisterChange}
                  />
                </div>

                <div>
                  <label>Email</label>

                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleRegisterChange}
                  />
                </div>

                <div>
                  <label>Password</label>

                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleRegisterChange}
                  />
                </div>

                <button type="submit">Register</button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
