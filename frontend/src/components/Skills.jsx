
const skillGroups = [
  {
    title: "Programming Languages",
    description: "Languages I use to develop web applications and application logic.",
    skills: ["Python", "JavaScript", "HTML5", "CSS3"],
  },
  {
    title: "Frameworks & Development",
    description: "Technologies used to build frontend and backend applications.",
    skills: ["React", "FastAPI", "REST APIs", "WebSockets"],
  },
  {
    title: "Database & Backend",
    description: "Database handling, ORM and backend application functionality.",
    skills: ["MySQL", "SQLAlchemy", "JWT Authentication"],
  },
  {
    title: "Developer Tools",
    description: "Tools used for coding, development, version control and project management.",
    skills: ["VS Code", "Git", "GitHub"],
  },
  {
    title: "AI Tools & Workflow",
    description: "AI tools I use for research, coding assistance, debugging and development workflows.",
    skills: ["ChatGPT", "Google Gemini", "Antigravity", "Ollama"],
  },
];

const strengths = [
  {
    icon: "◎",
    title: "Problem Solving",
    description:
      "Understanding project requirements and breaking complex problems into practical, maintainable solutions.",
  },
  {
    icon: "✳",
    title: "Requirement-Based Development",
    description:
      "Choosing suitable technologies and development approaches based on each project's actual needs.",
  },
  {
    icon: "◇",
    title: "Clean & Maintainable Code",
    description:
      "Writing structured, organized code that is easier to understand, maintain and improve.",
  },
  {
    icon: "↗",
    title: "Continuous Improvement",
    description:
      "Applying hands-on learning and practical experience to improve development quality and technical skills.",
  },
];

function Skills() {
  return (
    <section className="skills-section" aria-labelledby="skills-title">
      {/* TECHNICAL SKILLS */}
      <div className="skills-heading" data-reveal>
        <span className="section-eyebrow">
          TECHNICAL SKILLS / 01
        </span>

        <h2 id="skills-title">
          Technologies I <span>Work With.</span>
        </h2>

        <p>
          Technologies, development tools and AI-assisted workflows
          I use to build, improve and maintain modern web applications.
        </p>
      </div>

      <div className="skills-grid">
        {skillGroups.map((group, index) => (
          <article
            className="skill-card"
            key={group.title}
            data-reveal
            style={{ "--skill-index": index }}
          >
            <span className="skill-number">
              {String(index + 1).padStart(2, "0")}
            </span>

            <div className="skill-info">
              <h3>{group.title}</h3>

              <p className="skill-description">
                {group.description}
              </p>

              <div className="skill-tags">
                {group.skills.map((skill) => (
                  <span className="skill-tag" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <span className="skill-arrow" aria-hidden="true">
              ↗
            </span>
          </article>
        ))}
      </div>

      {/* DEVELOPMENT EXPERTISE */}
      <div className="development-focus" data-reveal>
        <div>
          <span className="section-eyebrow">
            DEVELOPMENT EXPERTISE / 02
          </span>

          <h2>
            What I <span>Build.</span>
          </h2>
        </div>

        <div className="focus-tags">
          <span>Frontend Development</span>
          <span>Backend Development</span>
          <span>Full Stack Web Applications</span>
          <span>REST API Development</span>
          <span>Database Integration</span>
          <span>Authentication Systems</span>
          <span>Real-Time Applications</span>
          <span>AI Integration</span>
        </div>
      </div>

      {/* DEVELOPMENT APPROACH */}
      <div className="strengths-section">
        <div className="skills-heading" data-reveal>
          <span className="section-eyebrow">
            MY APPROACH / 03
          </span>

          <h2>
            Beyond the <span>Code.</span>
          </h2>

          <p>
            Effective web development starts with understanding
            the problem. I focus on clear requirements, practical
            solutions and maintainable development.
          </p>
        </div>

        <div className="about-strengths">
          {strengths.map((item, index) => (
            <article
              className="strength-card"
              key={item.title}
              data-reveal
              style={{ "--skill-index": index }}
            >
              <div className="strength-icon" aria-hidden="true">
                {item.icon}
              </div>

              <h3>{item.title}</h3>

              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;
