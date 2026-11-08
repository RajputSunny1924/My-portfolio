const skills = [
  {
    name: "Python",
    category: "Backend Programming",
    number: "01",
  },
  {
    name: "FastAPI",
    category: "Backend Development",
    number: "02",
  },
  {
    name: "React",
    category: "Frontend Development",
    number: "03",
  },
  {
    name: "JavaScript",
    category: "Frontend Programming",
    number: "04",
  },
  {
    name: "MySQL",
    category: "Database Management",
    number: "05",
  },
  {
    name: "SQLAlchemy",
    category: "Database ORM",
    number: "06",
  },
  {
    name: "REST APIs",
    category: "API Development",
    number: "07",
  },
  {
    name: "JWT",
    category: "Authentication",
    number: "08",
  },
  {
    name: "WebSockets",
    category: "Real-Time Applications",
    number: "09",
  },
  {
    name: "Git & GitHub",
    category: "Version Control",
    number: "10",
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
    <div className="skills-section">
      {/* TECHNICAL SKILLS */}
      <div className="skills-heading" data-reveal>
        <span className="section-eyebrow">TECHNICAL SKILLS / 01</span>

        <h3>
          Technologies I <span>Work With.</span>
        </h3>

        <p>
          My technical toolkit for frontend development, backend engineering,
          database integration and building modern web applications.
        </p>
      </div>

      <div className="skills-grid">
        {skills.map((skill, index) => (
          <div
            className="skill-card"
            key={skill.name}
            data-reveal
            style={{ "--skill-index": index }}>
            <span className="skill-number">{skill.number}</span>

            <div className="skill-info">
              <h4>{skill.name}</h4>
              <span>{skill.category}</span>
            </div>

            <span className="skill-arrow" aria-hidden="true">
              ↗
            </span>
          </div>
        ))}
      </div>

      {/* DEVELOPMENT EXPERTISE */}
      <div className="development-focus" data-reveal>
        <div>
          <span className="section-eyebrow">DEVELOPMENT EXPERTISE / 02</span>

          <h3>
            What I <span>Build.</span>
          </h3>
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
          <span className="section-eyebrow">MY APPROACH / 03</span>

          <h3>
            Beyond the <span>Code.</span>
          </h3>

          <p>
            Effective web development starts with understanding the problem. I
            focus on clear requirements, practical solutions and maintainable
            development.
          </p>
        </div>

        <div className="about-strengths">
          {strengths.map((item, index) => (
            <div
              className="strength-card"
              key={item.title}
              data-reveal
              style={{ "--skill-index": index }}>
              <div className="strength-icon">{item.icon}</div>

              <h4>{item.title}</h4>

              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Skills;
