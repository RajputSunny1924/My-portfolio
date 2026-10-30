function Skills() {
  return (
    <>
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
    </>
  );
}

export default Skills;
