import { useState } from "react";
import {
  checkAdminStatus,
  loginUser,
  registerUser,
  verifyEmailOtp,
} from "./authService";

function AuthPage({ onLoginSuccess }) {
  const [showLogin, setShowLogin] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Registration data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Login data
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Verification data
  const [verificationData, setVerificationData] = useState({
    email: "",
    otp: "",
  });

  const [showVerification, setShowVerification] = useState(false);

  const handleRegisterChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleLoginChange = (event) => {
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value,
    });
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      const response = await registerUser(formData);
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
        setLoginError(
          typeof data.detail === "string"
            ? data.detail
            : "registration failed. please chek your input.",
        );
      }
    } catch (error) {
      console.error("Registration error:", error);
      setLoginError("Server se connection nahi ho pa raha. Please try again.");
    }
  };

  const handleVerifyEmail = async (event) => {
    event.preventDefault();

    try {
      const response = await verifyEmailOtp(verificationData);
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

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await loginUser(loginData);
      const data = await response.json();

      console.log("Login response:", data);

      if (response.ok) {
        const adminResponse = await checkAdminStatus();
        const isAdmin = adminResponse.ok;

        setLoginData({
          email: "",
          password: "",
        });

        setLoginError("");

        if (onLoginSuccess) {
          onLoginSuccess({ isAdmin });
        }
      } else if (
        response.status === 403 &&
        data.detail === "Please verify your email first"
      ) {
        // User exists but email is not verified
        setVerificationData({
          email: loginData.email,
          otp: "",
        });

        setShowVerification(true);
        setShowLogin(false);

        setLoginError("");
      } else {
        setLoginError(data.detail || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <div className="auth-page">
      {/* BRAND / TITLE */}
      <div className="auth-brand">
        <div className="auth-logo"></div>
        <h1>
          My <span>Portfolio</span>
        </h1>
        <p>Build · Learn · Grow</p>
      </div>

      {/* AUTHENTICATION CARD */}
      <div className="auth-container">
        {/* LEFT PANEL */}
        <div className="auth-intro">
          <h2>
            Turning Ideas Into
            <span> Real Projects</span>
          </h2>

          <p>
            A modern portfolio platform to showcase my skills, projects and
            journey as a developer.
          </p>

          <div className="auth-features">
            <div>⚡ Full Stack Development</div>
            <div>🛡️ Secure Authentication</div>
            <div>▤ Real-world Projects</div>
            <div>☆ Always Learning</div>
          </div>

          <div className="auth-tagline">
            Better Code.
            <br />
            Brighter Future.
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="auth-panel">
          {/* EMAIL VERIFICATION */}
          {showVerification ? (
            <div className="auth-form">
              <div className="auth-heading-icon">✉</div>

              <h2>Verify Your Email</h2>

              <p className="auth-description">
                OTP has been sent to your email.
              </p>

              <form onSubmit={handleVerifyEmail}>
                <label>Email Address</label>

                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={verificationData.email}
                  onChange={(event) =>
                    setVerificationData({
                      ...verificationData,
                      email: event.target.value,
                    })
                  }
                  autoComplete="email"
                  required
                />

                <label>Verification Code</label>

                <input
                  type="text"
                  name="otp"
                  placeholder="Enter OTP"
                  value={verificationData.otp}
                  onChange={(event) =>
                    setVerificationData({
                      ...verificationData,
                      otp: event.target.value,
                    })
                  }
                  required
                />

                <button type="submit" className="auth-submit">
                  Verify Email →
                </button>
              </form>
            </div>
          ) : (
            <>
              {/* LOGIN / REGISTER TABS */}
              <div className="auth-tabs">
                <button
                  type="button"
                  className={`auth-tab ${showLogin ? "active" : ""}`}
                  onClick={() => setShowLogin(true)}>
                  <span>♙</span> Login
                </button>

                <button
                  type="button"
                  className={`auth-tab ${!showLogin ? "active" : ""}`}
                  onClick={() => setShowLogin(false)}>
                  <span>♙+</span> Register
                </button>
              </div>

              {/* LOGIN FORM */}
              {showLogin ? (
                <div className="auth-form">
                  <h2>Welcome Back</h2>

                  <p className="auth-description">
                    Sign in to your account to continue.
                  </p>

                  <form onSubmit={handleLogin}>
                    <label>Email Address</label>

                    <div className="auth-input-wrap">
                      <span className="auth-input-icon">✉</span>

                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        autoComplete="email"
                        required
                      />
                    </div>

                    <label>Password</label>

                    <div className="auth-input-wrap password-field">
                      <span className="auth-input-icon">♙</span>

                      <input
                        type={showLoginPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        autoComplete="current-password"
                        required
                      />

                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        aria-label={
                          showLoginPassword ? "Hide password" : "Show password"
                        }>
                        {showLoginPassword ? "🙈" : "👁"}
                      </button>
                    </div>

                    {loginError && <p className="auth-error">{loginError}</p>}

                    <button type="submit" className="auth-submit">
                      Login →
                    </button>
                  </form>

                  <div className="auth-bottom-text">
                    Don't have an account?{" "}
                    <button type="button" onClick={() => setShowLogin(false)}>
                      Create Account
                    </button>
                  </div>

                  <div className="auth-security">
                    🛡 Your account is protected by secure authentication.
                  </div>
                </div>
              ) : (
                /* REGISTER FORM */
                <div className="auth-form">
                  <h2>Create Account</h2>

                  <p className="auth-description">
                    Join us and start building your portfolio.
                  </p>

                  <form onSubmit={handleRegister}>
                    <label>Full Name</label>

                    <div className="auth-input-wrap">
                      <span className="auth-input-icon">♙</span>

                      <input
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleRegisterChange}
                        autoComplete="name"
                        required
                      />
                    </div>

                    <label>Email Address</label>

                    <div className="auth-input-wrap">
                      <span className="auth-input-icon">✉</span>

                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={handleRegisterChange}
                        autoComplete="email"
                        required
                      />
                    </div>

                    <label>Password</label>

                    <div className="auth-input-wrap password-field">
                      <span className="auth-input-icon">♙</span>

                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={handleRegisterChange}
                        autoComplete="new-password"
                        required
                      />

                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }>
                        {showPassword ? "🙈" : "👁"}
                      </button>
                    </div>
                    {loginError && <p className="auth-error">{loginError}</p>}

                    <button type="submit" className="auth-submit">
                      Create Account →
                    </button>
                  </form>

                  <div className="auth-bottom-text">
                    Already have an account?{" "}
                    <button type="button" onClick={() => setShowLogin(true)}>
                      Login
                    </button>
                  </div>

                  <div className="auth-security">
                    🛡 Your data is protected by secure authentication.
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
