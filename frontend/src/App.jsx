import { useEffect, useState } from "react";

function App() {
  // -------------------------
  // Authentication states
  // -------------------------

  const [showLogin, setShowLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loginError, setLoginError] = useState("");

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
        const response = await fetch(
          "https://portfolio-backend-2swx.onrender.com/profile",
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (response.ok) {
          setIsLoggedIn(true);
        } else {
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

  // Reveal content only when it enters the viewport. The class-based approach
  // keeps the animation behaviour separate from the portfolio content.
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

  const getCsrfToken = () => {
    const cookies = document.cookie.split("; ");

    const csrfCookie = cookies.find((cookie) =>
      cookie.startsWith("csrf_token="),
    );

    return csrfCookie ? csrfCookie.split("=")[1] : null;
  };
  // -------------------------
  // Logout
  // -------------------------

  const handleLogout = async () => {
    try {
      const csrfToken = getCsrfToken();

      await fetch("https://portfolio-backend-2swx.onrender.com/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          "X-CSRF-Token": csrfToken,
        },
      });

      setIsLoggedIn(false);
      setSelectedProject(null);
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
      const response = await fetch(
        "https://portfolio-backend-2swx.onrender.com/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

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

  // -------------------------
  // Email verification
  // -------------------------

  const handleVerifyEmail = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "https://portfolio-backend-2swx.onrender.com/verify-email",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(verificationData),
        },
      );

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
      const response = await fetch(
        "https://portfolio-backend-2swx.onrender.com/login",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(loginData),
        },
      );

      const data = await response.json();

      console.log("Login response:", data);

      if (response.ok) {
        setIsLoggedIn(true);

        setLoginData({
          email: "",
          password: "",
        });
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
      <div>
        <h2>Checking authentication...</h2>
      </div>
    );
  }

  // =====================================================
  // LOGIN / REGISTER SCREEN
  // =====================================================

  if (!isLoggedIn) {
    return (
      <div>
        <h1>My PortFolio</h1>

        {/* -------------------------
            Verification Form
        ------------------------- */}

        {showVerification ? (
          <div>
            <h2>Verify Your Email</h2>

            <p>OTP has been sent to your email.</p>

            <form onSubmit={handleVerifyEmail}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={verificationData.email}
                onChange={(event) =>
                  setVerificationData({
                    ...verificationData,
                    email: event.target.value,
                  })
                }
              />

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
              />

              <button type="submit">Verify Email</button>
            </form>
          </div>
        ) : showLogin ? (
          /* -------------------------
             Login Form
          ------------------------- */

          <div>
            <h2>Login</h2>

            <form onSubmit={handleLogin}>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={loginData.email}
                onChange={handleLoginChange}
                autoComplete="new-password"
              />
              {loginError && <p style={{ color: "red" }}>{loginError}</p>}

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginData.password}
                onChange={handleLoginChange}
                autoComplete="current-password"
              />

              <button type="submit">Login</button>
            </form>

            <p>Don't have an account?</p>

            <button onClick={() => setShowLogin(false)}>Create Account</button>
          </div>
        ) : (
          /* -------------------------
             Registration Form
          ------------------------- */

          <div>
            <h2>Create Account</h2>

            <form onSubmit={handleRegister}>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleRegisterChange}
              />

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleRegisterChange}
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleRegisterChange}
              />

              <button type="submit">Register</button>
            </form>

            <p>Already have an account?</p>

            <button onClick={() => setShowLogin(true)}>Login</button>
          </div>
        )}
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
      tech: "React • FastAPI • MySQL • SQLAlchemy • JWT",

      description:
        "A secure full-stack authentication system with user registration, email OTP verification, password hashing, JWT authentication and protected backend APIs.",

      features: [
        "User registration and login",
        "Email OTP verification",
        "Argon2 password hashing",
        "JWT authentication",
        "HttpOnly cookie-based authentication",
        "Protected API endpoints",
        "React frontend connected with FastAPI",
        "SQLAlchemy database operations",
      ],

      architecture: `React Frontend
      ↓
FastAPI API
      ↓
Authentication Logic
      ↓
SQLAlchemy
      ↓
MySQL`,

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
Generate OTP
   ↓
Hash Password + OTP
   ↓
Save User
   ↓
Email Verification
   ↓
Login
   ↓
Create JWT
   ↓
HttpOnly Cookie
   ↓
Protected API`,

      security: [
        "Passwords are stored as Argon2 hashes.",
        "Email OTP is generated securely and stored as a hash.",
        "OTP verification uses an expiry time.",
        "JWT is stored inside an HttpOnly cookie.",
        "Protected endpoints verify the authentication cookie.",
        "CORS is configured for frontend-backend communication.",
      ],

      apis: [
        "POST /register",
        "POST /verify-email",
        "POST /login",
        "GET /profile",
        "POST /logout",
      ],

      problems: [
        "Frontend and backend initially used different hostnames for cookie communication.",
        "Using 192.168.0.103 consistently fixed the cookie issue.",
        "Authentication state is checked when the React application starts.",
      ],

      future: [
        "CSRF protection",
        "HTTPS with Secure cookies",
        "Rate limiting",
        "Password reset",
        "Role-based authorization",
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
      title: "Banking Management System",
      tech: "Python • MySQL",

      description:
        "A banking management application focused on user registration, login, account management and common banking operations with validation.",

      features: [
        "User registration",
        "User login",
        "Account management",
        "Deposit",
        "Withdrawal",
        "Balance inquiry",
        "Transaction handling",
        "Input validation",
      ],

      architecture: `User
  ↓
Python Application
  ↓
Banking Logic
  ↓
MySQL Database`,

      structure: `Application
├── User Management
├── Authentication
├── Account Management
├── Transactions
└── Database Operations

Database
└── MySQL`,

      flowTitle: "Transaction Flow",

      flow: `User Request
     ↓
Validate Input
     ↓
Banking Operation
     ↓
Update Account Data
     ↓
MySQL
     ↓
Return Result`,

      problems: [
        "Banking operations require validation before modifying account data.",
        "Account-related operations need consistent database updates.",
      ],

      future: [
        "Transaction history",
        "Improved authentication",
        "Role-based access",
        "Web-based interface",
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

        <div>
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>

          <button onClick={handleLogout}>Logout</button>
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
