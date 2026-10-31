import Skills from "./Skills";

function About() {
  return (
    <section id="about" className="about-section">
      {" "}
      <div className="container">
        {/* SECTION HEADING */}
        <div className="about-heading" data-reveal>
          <span className="section-eyebrow">GET TO KNOW ME</span>

          <h2>
            About <span>Me.</span>
          </h2>

          <p>
            The person behind the code, the ideas and the digital experiences.
          </p>
        </div>

        {/* ABOUT CONTENT */}
        <div className="about-grid">
          <div className="about-visual" data-reveal>
            <div className="about-visual-card">
              <span className="about-card-label">DEVELOPER PROFILE — 001</span>

              <div className="about-visual-symbol">{"</>"}</div>

              <h3>
                Building with
                <span> Logic & Creativity.</span>
              </h3>

              <p>
                I believe great websites are not just about appearance. They
                should solve problems, deliver value and create meaningful
                digital experiences.
              </p>

              <div className="about-card-bottom">
                <span>PYTHON</span>
                <span>REACT</span>
                <span>FASTAPI</span>
                <span>MYSQL</span>
              </div>
            </div>
          </div>

          <div className="about-copy" data-reveal>
            <span className="about-intro-label">WHO I AM</span>

            <h3>
              I'm Sunny Singh,
              <span>
                {" "}
                a Developer focused on building real-world applications.
              </span>
            </h3>

            <p>
              I am a BSc IT student and a Python-focused Full Stack Developer
              interested in building practical, secure and scalable web
              applications.
            </p>

            <p>
              My primary focus is backend development using Python and FastAPI.
              I work with REST APIs, SQLAlchemy and MySQL, while using React to
              create interactive frontend experiences.
            </p>

            <p>
              I have worked on application features including authentication,
              email OTP verification, password hashing, JWT authentication,
              WebSocket communication and database operations.
            </p>

            <p>
              I believe in learning through practical implementation. Every
              project gives me an opportunity to improve my problem-solving
              ability and understand how real-world applications work.
            </p>

            <p>
              My goal is to build digital products that combine functionality,
              performance and thoughtful design.
            </p>
          </div>
        </div>

        {/* SKILLS */}
        <Skills />
      </div>
    </section>
  );
}

export default About;
