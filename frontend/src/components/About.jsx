import Skills from "./Skills";

function About() {
  return (
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

        <Skills />
      </div>
    </section>
  );
}

export default About;
