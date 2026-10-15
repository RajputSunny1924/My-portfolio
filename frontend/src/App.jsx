import { useEffect, useState } from "react";

// const API_BASE = "http://127.0.0.1:8000";
const API_BASE = "https://portfolio-backend-2swx.onrender.com";
import AdminDashboard from "./AdminDashboard";

function App() {
  // -------------------------
  // Authentication states
  // -------------------------

  const [showLogin, setShowLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [showAdminDashboard, setShowAdminDashboard] = useState(false);
  // -------------------------
  // Registration data
  // -------------------------

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // -------------------------
  // Login data
  // -------------------------

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // -------------------------
  // Verification data
  // -------------------------

  const [verificationData, setVerificationData] = useState({
    email: "",
    otp: "",
  });

  const [showVerification, setShowVerification] = useState(false);

  // -------------------------
  // Selected project
  // -------------------------

  const [selectedProject, setSelectedProject] = useState(null);

  // -------------------------
  // Check authentication
  // -------------------------
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_BASE}/profile`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          setIsLoggedIn(true);

          const adminResponse = await fetch(`${API_BASE}/admin/me`, {
            method: "GET",
            credentials: "include",
          });

          setIsAdmin(adminResponse.ok);
        } else {
          setIsLoggedIn(false);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsLoggedIn(false);
        setIsAdmin(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return undefined;

    const revealItems = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -42px" },
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [isLoggedIn]);

  // -------------------------
  // Logout
  // -------------------------
  const handleLogout = async () => {
    try {
      // Get CSRF token from backend
      const csrfResponse = await fetch(`${API_BASE}/csrf`, {
        method: "GET",
        credentials: "include",
      });

      if (!csrfResponse.ok) {
        console.error("CSRF fetch failed:", csrfResponse.status);
        return;
      }

      const csrfData = await csrfResponse.json();

      // Logout request
      const response = await fetch(`${API_BASE}/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "X-CSRF-Token": csrfData.csrf_token,
        },
      });

      if (!response.ok) {
        console.error("Logout failed:", response.status);
        return;
      }

      setIsLoggedIn(false);
      setSelectedProject(null);

      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  // -------------------------
  // Registration input
  // -------------------------

  const handleRegisterChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  // -------------------------
  // Login input
  // -------------------------

  const handleLoginChange = (event) => {
    setLoginData({
      ...loginData,
      [event.target.name]: event.target.value,
    });
  };

  // -------------------------
  // Registration
  // -------------------------

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${API_BASE}/register`, {
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

  // -------------------------
  // Email verification
  // -------------------------

  const handleVerifyEmail = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${API_BASE}/verify-email`, {
        method: "POST",
        credentials: "include",
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

  // -------------------------
  // Login
  // -------------------------

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      console.log("Login response:", data);

      if (response.ok) {
        setIsLoggedIn(true);

        const adminResponse = await fetch(`${API_BASE}/admin/me`, {
          method: "GET",
          credentials: "include",
        });

        setIsAdmin(adminResponse.ok);

        setLoginData({
          email: "",
          password: "",
        });

        setLoginError("");
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
  // -------------------------
  // Loading screen
  // -------------------------

  if (checkingAuth) {
    return (
      <div className="auth-loader">
        <div className="loader-spinner"></div>
        <p>Checking authentication...</p>
      </div>
    );
  }
  if (isAdmin && showAdminDashboard) {
    return (
      <AdminDashboard onBackToPortfolio={() => setShowAdminDashboard(false)} />
    );
  }

  // =====================================================
  // LOGIN / REGISTER SCREEN
  // =====================================================

  if (!isLoggedIn) {
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
                          onClick={() =>
                            setShowLoginPassword(!showLoginPassword)
                          }
                          aria-label={
                            showLoginPassword
                              ? "Hide password"
                              : "Show password"
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

  // =====================================================
  // PROJECT DATA
  // =====================================================

  const projects = [
    {
      id: 0,

      title: "Full Stack Authentication Project",

      tech: "React • FastAPI • MySQL • SQLAlchemy • JWT • Argon2 • Resend API",

      description:
        "A secure full-stack authentication system with user registration, email OTP verification, Argon2 password hashing, JWT-based authentication, HttpOnly cookie authentication, CSRF protection, protected APIs, input validation, login rate limiting, and secure frontend-backend communication.",

      features: [
        "User registration and login",
        "Email OTP verification",
        "Resend OTP functionality",
        "OTP expiry and attempt tracking",
        "Argon2 password hashing",
        "JWT authentication",
        "HttpOnly cookie-based authentication",
        "CSRF protection",
        "Protected API endpoints",
        "Login rate limiting",
        "Email validation",
        "Password length validation",
        "Input validation using Pydantic",
        "React frontend connected with FastAPI",
        "SQLAlchemy database operations",
        "MySQL database",
        "Secure CORS configuration",
        "Secure cookie configuration",
        "Automatic authentication check on application startup",
        "Secure logout with cookie removal",
      ],

      architecture: `React Frontend
      ↓
FastAPI API
      ↓
Authentication & Security Logic
      ↓
SQLAlchemy ORM
      ↓
MySQL Database`,

      structure: `frontend/
├── App.jsx
├── App.css
└── main.jsx

backend/
├── main.py
├── database.py
├── models.py
└── schemas.py`,

      flowTitle: "Authentication Flow",

      flow: `Register
   ↓
Generate Secure OTP
   ↓
Hash Password + OTP
   ↓
Save User
   ↓
Send OTP via Resend API
   ↓
Email Verification
   ↓
Login
   ↓
Create JWT
   ↓
HttpOnly Secure Cookie
   ↓
CSRF Protection
   ↓
Protected API`,

      security: [
        "Passwords are stored as Argon2 hashes.",
        "OTP values are securely generated and stored as hashes.",
        "OTP verification uses a 5-minute expiry time.",
        "OTP attempts are tracked.",
        "Users must verify their email before login.",
        "JWT is stored inside an HttpOnly cookie.",
        "Secure and SameSite cookie settings are used in production.",
        "Protected endpoints verify the authentication cookie.",
        "CSRF protection is applied to state-changing requests.",
        "Login attempts are rate-limited to reduce brute-force attempts.",
        "Email addresses are validated using Pydantic EmailStr.",
        "Password input has minimum and maximum length validation.",
        "OTP format is validated.",
        "CORS is restricted to the deployed frontend.",
        "Security response headers are configured.",
        "Authentication state is checked when the React application starts.",
      ],

      apis: [
        "POST /register",
        "POST /verify-email",
        "POST /resend-otp",
        "POST /login",
        "GET /profile",
        "GET /csrf",
        "POST /logout",
      ],

      problems: [
        "Frontend and backend initially had cookie communication issues.",
        "Production required secure cross-origin cookie configuration.",
        "SMTP email delivery was not suitable for the Render deployment environment.",
        "Email delivery was moved to the Resend API.",
        "Unverified users can request a new OTP instead of getting permanently blocked.",
        "Authentication state is checked automatically when the React application starts.",
        "CSRF handling was adjusted for the deployed frontend and backend architecture.",
      ],

      future: [
        "Password reset functionality",
        "Role-based authorization",
        "Refresh token system",
        "Account lockout improvements",
        "Production monitoring and logging",
      ],
    },

    {
      id: 2,
      title: "JARVIS AI Desktop Assistant",
      tech: "Python • React • FastAPI • WebSocket",

      description:
        "An AI desktop assistant that connects a React interface with a Python and FastAPI backend to process voice commands and perform desktop, browser and application operations.",

      features: [
        "Voice command interaction",
        "Desktop operations",
        "Browser operations",
        "Application operations",
        "React frontend",
        "FastAPI backend",
        "Real-time WebSocket communication",
      ],

      architecture: `React Frontend
      ↓
WebSocket Connection
      ↓
FastAPI Backend
      ↓
Python Assistant Logic
      ↓
Desktop / Browser / Applications`,

      structure: `frontend/
└── React Interface

backend/
├── FastAPI
├── WebSocket
└── Python Assistant Logic`,

      flowTitle: "Communication Flow",

      flow: `User Command
      ↓
React Interface
      ↓
WebSocket
      ↓
FastAPI
      ↓
Python Logic
      ↓
System / Browser / Application`,

      problems: [
        "Real-time interaction requires continuous communication between frontend and backend.",
        "WebSocket communication was used instead of making every interaction a separate HTTP request.",
      ],

      future: [
        "More desktop automation",
        "More application integrations",
        "Improved AI task handling",
      ],
    },

    {
      id: 3,
      title: "Private Chat Application",
      tech: "React • FastAPI • MySQL • WebSocket • JWT",

      description:
        "A private two-user chat application with authentication, real-time messaging, database-backed messages and media-related functionality.",

      features: [
        "User authentication",
        "Private two-user messaging",
        "Real-time messaging",
        "WebSocket communication",
        "MySQL message storage",
        "Online and offline status",
        "Media functionality",
      ],

      architecture: `React Chat Interface
      ↓
FastAPI Backend
      ↓
WebSocket Connection
      ↓
Chat Processing
      ↓
MySQL Database`,

      structure: `frontend/
├── React UI
├── Authentication
└── Chat Interface

backend/
├── FastAPI
├── Authentication
├── WebSocket
├── Database Logic
└── Media Handling

database/
└── MySQL`,

      flowTitle: "Real-Time Messaging Flow",

      flow: `User A
  ↓
React
  ↓
WebSocket
  ↓
FastAPI
  ↓
Chat Processing
  ↓
MySQL
  ↓
WebSocket
  ↓
User B`,

      security: [
        "User authentication is required for the application.",
        "JWT is used as part of the authentication system.",
      ],

      problems: [
        "Real-time messaging requires maintaining WebSocket connections.",
        "Media handling requires separate upload and file-serving logic.",
        "WebSocket communication needed to be handled separately from normal HTTP requests.",
      ],

      future: [
        "Message delivery indicators",
        "Improved media handling",
        "Message reactions",
        "Group conversations",
      ],
    },

    {
      id: 4,
      title: "Student Management System",
      tech: "Flask • MySQL • REST API",

      description:
        "A web-based student management system for adding, updating, deleting and searching student records through REST APIs and a MySQL database.",

      features: [
        "Add student records",
        "Update student records",
        "Delete student records",
        "Search student records",
        "REST API",
        "MySQL database",
        "CRUD operations",
      ],

      architecture: `Client
  ↓
Flask REST API
  ↓
CRUD Logic
  ↓
MySQL Database`,

      structure: `Application
├── Flask REST API
├── Student CRUD Logic
└── Database Connection

Database
└── MySQL`,

      flowTitle: "CRUD Flow",

      flow: `Client Request
     ↓
Flask REST API
     ↓
Validate Request
     ↓
CRUD Operation
     ↓
MySQL
     ↓
JSON Response`,

      problems: [
        "Student records require consistent CRUD operations.",
        "REST endpoints were used to separate client requests from database operations.",
      ],

      future: [
        "Authentication",
        "Pagination",
        "Student profiles",
        "Improved frontend dashboard",
      ],
    },

    {
      id: 5,
      title: "Tic-Tac-Toe AI",
      tech: "Python • Minimax • FastAPI • React",

      description:
        "An AI-based Tic-Tac-Toe game where the computer evaluates possible game states using the Minimax algorithm.",

      features: [
        "Single-player AI mode",
        "Game state management",
        "Minimax algorithm",
        "Optimal move selection",
        "Game result detection",
      ],

      architecture: `React Game Interface
      ↓
FastAPI Backend
      ↓
Game Logic
      ↓
Minimax Algorithm
      ↓
Best Move`,

      structure: `Game
├── Board State
├── Player Move
├── Move Generation
├── Minimax Algorithm
└── Winner Detection`,

      flowTitle: "AI Decision Flow",

      flow: `Current Board
      ↓
Generate Possible Moves
      ↓
Simulate Game States
      ↓
Minimax Evaluation
      ↓
Compare Scores
      ↓
Select Best Move
      ↓
Computer Move`,

      problems: [
        "The AI needs to evaluate possible future game states before selecting a move.",
        "Minimax recursively evaluates available moves to determine the best decision.",
      ],

      future: [
        "Difficulty levels",
        "Improved game interface",
        "Two-player mode",
        "Game statistics",
      ],
    },

    {
      id: 6,
      title: "AI Email Automation System",
      tech: "Python • FastAPI • React • MySQL • SQLAlchemy • Groq AI",

      description:
        "An AI-powered email automation system that reads pending emails from a MySQL database, classifies them using Groq AI, generates short summaries, performs category-based actions, and provides a React dashboard for monitoring email processing.",

      features: [
        "AI-powered email classification",
        "Email summarization",
        "Customer support email detection",
        "Work email detection",
        "Personal email detection",
        "Spam email detection",
        "Automatic action selection",
        "MySQL email storage",
        "SQLAlchemy ORM",
        "FastAPI backend",
        "React dashboard",
        "Background worker for automatic processing",
        "Pending email processing",
        "Processed and error status tracking",
        "Automatic retry handling",
        "Maximum retry limit",
        "Error state handling",
        "Processing count tracking",
      ],

      architecture: `MySQL Database
      ↓
Pending Emails
      ↓
Background Worker
      ↓
FastAPI / AI Processing
      ↓
Groq AI
      ↓
Category + Summary + Action
      ↓
MySQL Database
      ↓
React Dashboard`,

      structure: `frontend/
├── src/
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx

backend/
├── main.py
├── ai.py
├── worker.py
├── database.py
├── models.py
└── .env

database/
└── MySQL emails table`,

      flowTitle: "AI Email Processing Flow",

      flow: `Pending Email
      ↓
Worker Checks Database
      ↓
Send Email to Groq AI
      ↓
AI Classifies Email
      ↓
Generate Summary
      ↓
Select Action
      ↓
Update Database
      ↓
Execute Action
      ↓
Mark Email as Processed`,

      security: [
        "Groq API key is stored in environment variables.",
        "AI processing is performed on the backend instead of exposing the API key to React.",
        "CORS is configured for the React frontend.",
        "Database credentials are stored using environment variables.",
        "Input data is processed through the backend before database updates.",
      ],

      apis: ["GET /", "POST /process-emails", "GET /emails"],

      problems: [
        "AI responses initially required strict JSON parsing to reliably update the database.",
        "Pending emails needed to be processed automatically without manually running the API every time.",
        "AI or database failures could leave emails unprocessed.",
        "A retry mechanism was implemented to handle temporary processing failures.",
        "Emails that repeatedly fail processing are moved to an error state.",
        "The React frontend and FastAPI backend required CORS configuration for local development.",
      ],

      future: [
        "Gmail API integration",
        "Outlook API integration",
        "Automatic email fetching",
        "Automatic email replies",
        "Manual retry button for failed emails",
        "Real-time worker monitoring",
        "Cloud deployment",
        "Advanced AI-based email actions",
      ],
    },
  ];

  // =====================================================
  // HOME PAGE
  // =====================================================

  return (
    <div className="portfolio-shell">
      {/* =========================
          NAVBAR
      ========================= */}

      <nav>
        <h2>My Portfolio</h2>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>

          <div className="menu-container">
            <button
              type="button"
              className="menu-toggle"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-label="Open account menu"
              aria-expanded={menuOpen}>
              ⋮
            </button>

            {menuOpen && (
              <div className="dropdown-menu">
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdminDashboard(true);
                      setMenuOpen(false);
                    }}>
                    ⚙️ Admin Dashboard
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    handleLogout();
                  }}>
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* =========================
          HERO SECTION
      ========================= */}

      <section id="home">
        <div className="hero-visuals" aria-hidden="true">
          <span className="hero-visual hero-visual--one" />
          <span className="hero-visual hero-visual--two" />
          <span className="hero-visual hero-visual--three" />
        </div>

        <div className="hero-content">
          <p className="hero-kicker">// Building thoughtful digital systems</p>
          <h1>Hi, I'm Sunny Singh</h1>

          <h2>
            <span>Full Stack Developer</span>
          </h2>

          <p>
            I build practical applications using Python, FastAPI, React and
            MySQL.
          </p>

          <p>
            Interested in backend development, full-stack applications and AI
            automation.
          </p>
        </div>
      </section>

      {/* =========================
          ABOUT SECTION
      ========================= */}
      <section id="about">
        <h2 data-reveal>About Me</h2>

        <div className="about-image" data-reveal>
          <img src="/about-hero.png" alt="Software development workspace" />
        </div>

        <div className="about-copy" data-reveal>
          <p>
            I am a BSc IT student and a Python-focused Full Stack Developer
            interested in building practical, secure and real-world
            applications.
          </p>

          <p>
            My main focus is backend development with Python and FastAPI. I work
            with REST APIs, SQLAlchemy and MySQL, and I use React to build and
            connect the frontend with my backend services.
          </p>

          <p>
            I have built projects involving authentication, email OTP
            verification, password hashing, JWT-based authentication, WebSocket
            communication and database operations.
          </p>

          <p>
            I learn by building projects rather than only studying theory. My
            goal is to strengthen my backend and full-stack development skills
            while understanding how every part of an application works and
            connects together.
          </p>

          <h3>What I Work With</h3>

          <p className="tech-list">
            Python | FastAPI | React | MySQL | SQLAlchemy | REST API | JWT |
            WebSocket | Authentication | Git | GitHub
          </p>

          <h3>Development Focus</h3>

          <p>
            Python Backend Development | Full Stack Development | Secure
            Authentication | API Development | Real-Time Applications
          </p>

          {/* 👇 CARDS YAHAN HONE CHAHIYE */}

          <div className="about-strengths">
            <div className="strength-card">
              <div className="strength-icon">&lt;/&gt;</div>
              <div>
                <h4>Problem Solver</h4>
                <p>Finds better ways</p>
              </div>
            </div>

            <div className="strength-card">
              <div className="strength-icon">🧠</div>
              <div>
                <h4>Quick Learner</h4>
                <p>Adapts fast</p>
              </div>
            </div>

            <div className="strength-card">
              <div className="strength-icon">👥</div>
              <div>
                <h4>Team Player</h4>
                <p>Builds together</p>
              </div>
            </div>

            <div className="strength-card">
              <div className="strength-icon">🎯</div>
              <div>
                <h4>Goal Oriented</h4>
                <p>Always forward</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* =========================
          PROJECTS SECTION
      ========================= */}

      <section id="projects">
        <h2 data-reveal>My Projects</h2>

        <p data-reveal>Click on a project to explore its details.</p>

        <div>
          {projects.map((project) => (
            <div key={project.id} className="project-card" data-reveal>
              <h3>{project.title}</h3>

              <p>{project.tech}</p>

              <p>{project.description}</p>

              <button
                onClick={() => {
                  setSelectedProject(project);

                  setTimeout(() => {
                    document.getElementById("project-details")?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }, 100);
                }}>
                View Project
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* =========================
          PROJECT DETAIL
      ========================= */}

      {selectedProject && (
        <section id="project-details" className="project-detail" data-reveal>
          <h2>{selectedProject.title}</h2>

          <h3>Technology</h3>
          <p>{selectedProject.tech}</p>

          <h3>Overview</h3>
          <p>{selectedProject.description}</p>

          <h3>What I Built</h3>

          <div>
            {selectedProject.features.map((feature, index) => (
              <p key={index}>• {feature}</p>
            ))}
          </div>

          <h3>Architecture</h3>

          <pre>{selectedProject.architecture}</pre>

          {selectedProject.structure && (
            <>
              <h3>Project Structure</h3>

              <pre>{selectedProject.structure}</pre>
            </>
          )}

          {selectedProject.flow && (
            <>
              <h3>{selectedProject.flowTitle}</h3>

              <pre>{selectedProject.flow}</pre>
            </>
          )}

          {selectedProject.security && (
            <>
              <h3>Security</h3>

              <div>
                {selectedProject.security.map((item, index) => (
                  <p key={index}>• {item}</p>
                ))}
              </div>
            </>
          )}

          {selectedProject.apis && (
            <>
              <h3>API Endpoints</h3>

              <div>
                {selectedProject.apis.map((api, index) => (
                  <p key={index}>• {api}</p>
                ))}
              </div>
            </>
          )}

          <h3>Problems & Solutions</h3>

          <div>
            {selectedProject.problems.map((problem, index) => (
              <p key={index}>• {problem}</p>
            ))}
          </div>

          <h3>Future Improvements</h3>

          <div>
            {selectedProject.future.map((item, index) => (
              <p key={index}>• {item}</p>
            ))}
          </div>

          <button
            onClick={() => {
              document.getElementById("projects")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}>
            Back to Projects
          </button>
        </section>
      )}
      {/* =========================
          CONTACT SECTION
      ========================= */}

      <section id="contact">
        <h2 data-reveal>Contact Me</h2>

        <p data-reveal>
          Feel free to connect with me for opportunities, projects, or
          collaboration.
        </p>

        <div className="contact-details" data-reveal>
          <p>
            <strong>Email:</strong>{" "}
            <a href="mailto:sunnysinghforeverat@gmail.com">
              sunnysinghforeverat@gmail.com
            </a>
          </p>

          <p>
            <strong>Phone:</strong> <a href="tel:7350288505">+91 7350288505</a>
          </p>

          <p>
            <strong>Location:</strong> Mumbai, Maharashtra
          </p>

          <p>
            <strong>GitHub:</strong>{" "}
            <a
              href="https://github.com/RajputSunny1924"
              target="_blank"
              rel="noopener noreferrer">
              github.com/RajputSunny1924
            </a>
          </p>

          <p>
            <strong>LinkedIn:</strong>{" "}
            <a
              href="https://www.linkedin.com/in/sunny-singh-rajput-677471417"
              target="_blank"
              rel="noopener noreferrer">
              LinkedIn Profile
            </a>
          </p>
        </div>

        <a
          className="resume-link"
          href="/sunny-resume.pdf"
          download
          data-reveal>
          Download Resume
        </a>
      </section>

      {/* =========================
          FOOTER
      ========================= */}

      <footer>
        <p>© 2026 Sunny Singh. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
