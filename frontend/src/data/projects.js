export const projects = [
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

export default projects;
