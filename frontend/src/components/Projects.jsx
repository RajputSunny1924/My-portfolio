import projects from "../data/projects";

const projectConfig = [
  {
    title: "Private Chat Application",
    image:
      "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=1200&q=85",
    imageAlt: "Temporary chat application preview",
    category: "REAL-TIME APPLICATION",
    url: "https://private-chat-frontend-5hrb.onrender.com/",
    description:
      "A private two-user chat application designed for real-time communication. It uses WebSocket connections to exchange messages and a backend system to handle authentication, chat processing and database operations.",
    highlights: [
      "Private two-user messaging",
      "Real-time communication using WebSockets",
      "FastAPI backend",
      "MySQL message storage",
      "User authentication",
      "Online and offline status",
      "Media functionality",
    ],
    technologies: ["React", "FastAPI", "MySQL", "WebSocket", "JWT"],
  },
  {
    title: "Developer Portfolio & Authentication System",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=85",
    imageAlt: "Temporary developer portfolio preview",
    category: "FULL STACK WEB APPLICATION",
    url: "https://my-portfolio-h5de.onrender.com/",
    description:
      "My personal developer portfolio, built to showcase my work, skills and services. The application also includes a full-stack authentication system with email verification and security-focused backend functionality.",
    highlights: [
      "User registration and login",
      "Email OTP verification and resend",
      "Argon2 password hashing",
      "JWT authentication with HttpOnly cookies",
      "CSRF protection and protected APIs",
      "QR-based access flow",
      "Admin dashboard and analytics",
      "React frontend with Python FastAPI backend",
    ],
    technologies: [
      "React",
      "Python",
      "FastAPI",
      "MySQL",
      "SQLAlchemy",
      "Argon2",
      "JWT",
      "OTP Verification",
    ],
  },
];

function Projects() {
  return (
    <section id="projects" className="projects-section">
      {" "}
      <div className="container">
        {" "}
        <div className="projects-heading" data-reveal>
          {" "}
          <span className="section-eyebrow">SELECTED WORK / 01</span>
          <h2>
            Projects that
            <br />
            <span>bring ideas to life.</span>
          </h2>
          <p>
            A closer look at the applications I've built, the problems they
            address and the technologies behind them.
          </p>
        </div>
        <div className="projects-showcase">
          {projectConfig.map((config, index) => {
            const projectData = projects.find((project) =>
              project.title === "Full Stack Authentication Project"
                ? index === 1
                : project.title === config.title,
            );

            return (
              <article
                className={`project-case ${
                  index % 2 !== 0 ? "project-reverse" : ""
                }`}
                key={config.title}
                data-reveal>
                <div className="project-preview">
                  <div className="project-browser">
                    <div className="project-browser-bar">
                      <div className="browser-dots">
                        <span />
                        <span />
                        <span />
                      </div>

                      <span className="browser-address">
                        {index === 0
                          ? "private-chat.app"
                          : "sunny-portfolio.dev"}
                      </span>

                      <span className="browser-menu">•••</span>
                    </div>

                    <div className="project-image-wrap">
                      <img
                        src={config.image}
                        alt={config.imageAlt}
                        loading="lazy"
                      />

                      <span className="preview-placeholder">
                        TEMPORARY PREVIEW
                      </span>
                    </div>
                  </div>

                  <span className="project-preview-number">0{index + 1}</span>
                </div>

                <div className="project-information">
                  <div className="project-meta">
                    <span>FEATURED PROJECT</span>
                    <span>{config.category}</span>
                  </div>

                  <h3>{config.title}</h3>

                  <p className="project-description">{config.description}</p>

                  <div className="project-tech-stack">
                    {config.technologies.map((tech) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>

                  <div className="project-highlights">
                    <h4>WHAT I BUILT</h4>

                    <ul>
                      {config.highlights.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="project-actions">
                    <a
                      href={config.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-live-link">
                      Explore Live Project <span>↗</span>
                    </a>

                    <span className="project-status">LIVE PROJECT</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <div className="projects-footer" data-reveal>
          <span>MORE THAN JUST CODE.</span>
          <p>
            Every project is an opportunity to solve a problem, explore an idea
            and build something meaningful.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Projects;
