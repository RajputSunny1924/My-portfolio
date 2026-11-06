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
            I'm a Full Stack Developer based in Mumbai, India. I specialize in
            building modern, responsive websites, secure web applications and
            AI-powered automation systems for businesses and individuals.
          </p>
        </div>

        {/* ABOUT CONTENT */}
        <div className="about-grid">
          <div className="about-visual" data-reveal>
            <div className="about-visual-card">
              <span className="about-card-label">DEVELOPER PROFILE — 001</span>

              <div className="about-visual-symbol">{"</>"}</div>

              <h3>
                I'm Sunny Singh Rajput,
                <span>
                  {" "}
                  a Full Stack Developer and Freelance Web Developer.
                </span>
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
                a Full Stack Developer who builds reliable software for real
                businesses.
              </span>
            </h3>

            <p>
              I'm a Python-focused Full Stack Developer and freelancer based in
              Mumbai. I build secure web applications, business websites and
              AI-powered automation systems, taking each project from the first
              idea to a working, deployed product.
            </p>

            <p>
              My core strength is backend engineering with Python and FastAPI:
              REST APIs, database design with SQLAlchemy and MySQL, and secure
              authentication using JWT, Argon2 password hashing and email OTP
              verification. On the frontend, I use React to deliver fast,
              responsive interfaces.
            </p>

            <p>
              Beyond standard web applications, I build real-time systems with
              WebSockets and AI automation that takes over repetitive work, such
              as classifying and processing emails with language models, so
              businesses can save time and reduce manual effort.
            </p>

            <p>
              I work the way clients expect a professional to work: I clarify
              requirements first, communicate clearly at every stage, write
              clean and maintainable code, and deliver work that is secure, fast
              and ready for production.
            </p>

            <p>
              Whether you need a website that represents your business or a
              custom system that automates how it runs, I focus on building
              solutions that are dependable and easy to grow with.
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
