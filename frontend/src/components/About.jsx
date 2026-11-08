import Skills from "./Skills";

function About() {
  return (
    <section id="about" className="about-section">
      <div className="container">
        {/* SECTION HEADING */}
        <div className="about-heading" data-reveal>
          <span className="section-eyebrow">GET TO KNOW ME</span>

          <h2>
            About <span>Me</span>
          </h2>

          <p>
            I'm Sunny Singh Rajput, a freelance Full Stack Developer based in
            Mumbai, India. I help businesses and individuals build professional
            websites and custom web applications tailored to their needs.
          </p>
        </div>

        {/* ABOUT CONTENT */}
        <div className="about-grid">
          <div className="about-visual" data-reveal>
            <div className="about-visual-card">
              <span className="about-card-label">MY APPROACH </span>

              <div className="about-visual-symbol">{"</>"}</div>

              <h3>
                More than just code,
                <span> solutions built around your needs.</span>
              </h3>

              <p>
                Every project starts with understanding your goals. I focus on
                choosing the right technology, creating user-friendly
                experiences and delivering reliable solutions that serve a real
                purpose.
              </p>

              <div className="about-card-bottom">
                <span>QUALITY</span>
                <span>CLARITY</span>
                <span>RELIABILITY</span>
              </div>
            </div>
          </div>

          <div className="about-copy" data-reveal>
            <span className="about-intro-label">WHO I AM</span>

            <h3>
              Building digital solutions,
              <span>
                {" "}
                with a focus on quality, functionality and real-world needs.
              </span>
            </h3>

            <p>
              I'm a freelance Full Stack Developer based in Mumbai, India,
              focused on creating modern websites and custom web applications.
              My goal is to help businesses establish a strong online presence
              and simplify their digital workflows through practical technology
              solutions.
            </p>

            <p>
              On the frontend, I work with React, JavaScript and CSS to build
              responsive, user-friendly interfaces. On the backend, I use Python
              and FastAPI to develop REST APIs, application logic,
              authentication systems and database-driven features using MySQL
              and SQLAlchemy.
            </p>

            <p>
              I work with both frontend-only and full-stack architectures. Not
              every project needs a complex backend or database. I choose the
              right technology based on the project's actual requirements,
              functionality and expected scale.
            </p>

            <p>
              My approach starts with understanding your requirements. I discuss
              the project scope, suggest a suitable technical approach, and keep
              communication clear throughout development. I focus on
              maintainable code, responsive design and reliable functionality.
            </p>

            <p>
              Whether you need a business website, a personal portfolio, a
              custom web application or a suitable automation solution, I aim to
              deliver a practical solution that fits your goals and budget.
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
