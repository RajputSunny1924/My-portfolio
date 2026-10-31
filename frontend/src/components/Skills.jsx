const skills = [
  { name: "Python", category: "Backend Development", number: "01" },
  { name: "FastAPI", category: "Backend Framework", number: "02" },
  { name: "React", category: "Frontend Development", number: "03" },
  { name: "JavaScript", category: "Programming Language", number: "04" },
  { name: "MySQL", category: "Database Management", number: "05" },
  { name: "SQLAlchemy", category: "ORM", number: "06" },
  { name: "REST API", category: "API Development", number: "07" },
  { name: "JWT", category: "Authentication", number: "08" },
  { name: "WebSocket", category: "Real-Time Communication", number: "09" },
  { name: "Git & GitHub", category: "Version Control", number: "10" },
];

const strengths = [
  {
    icon: "</>",
    title: "Problem Solving",
    description:
      "Breaking complex problems into practical and manageable solutions.",
  },
  {
    icon: "✳",
    title: "Continuous Learning",
    description:
      "Improving technical knowledge through consistent hands-on practice.",
  },
  {
    icon: "◎",
    title: "Clean Development",
    description:
      "Writing structured code that is easier to understand and maintain.",
  },
  {
    icon: "↗",
    title: "Growth Mindset",
    description:
      "Learning from every project and continuously improving my approach.",
  },
];

function Skills() {
  return (
    <div className="skills-section">
      {" "}
      <div className="skills-heading" data-reveal>
        {" "}
        <span className="section-eyebrow">MY TECH STACK / 01</span>
        <h3>
          Technologies I <span>Work With.</span>
        </h3>
        <p>
          The tools and technologies I use to build functional web applications.
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
      <div className="development-focus" data-reveal>
        <div>
          <span className="section-eyebrow">MY EXPERTISE / 02</span>

          <h3>
            What I <span>Focus On.</span>
          </h3>
        </div>

        <div className="focus-tags">
          <span>Python Backend Development</span>
          <span>Full Stack Web Development</span>
          <span>Secure Authentication</span>
          <span>REST API Development</span>
          <span>Database Integration</span>
          <span>Real-Time Applications</span>
        </div>
      </div>
      <div className="strengths-section">
        <div className="skills-heading" data-reveal>
          <span className="section-eyebrow">MY APPROACH / 03</span>

          <h3>
            Beyond the <span>Code.</span>
          </h3>

          <p>
            Good development is not only about writing code. It is also about
            how problems are understood and solved.
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
