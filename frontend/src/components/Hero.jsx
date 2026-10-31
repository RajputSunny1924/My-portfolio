function Hero() {
  return (
    <section id="home" className="hero-section" data-reveal>
      <div className="hero-copy">
        <p className="hero-kicker">
          <span className="hero-kicker-line"></span>
          FULL STACK DEVELOPER
        </p>

        <h1 className="hero-heading">
          <span className="reveal-line">
            <span>Building</span>
          </span>

          <span className="reveal-line">
            <span className="accent-text">Digital</span>
          </span>

          <span className="reveal-line">
            <span>Experiences.</span>
          </span>
        </h1>

        <h2 className="hero-subheading">
          Hi, I'm <span className="hero-typing-text">Sunny Singh</span>
        </h2>

        <p className="hero-description">
          I design and develop modern web applications that combine thoughtful
          user experiences with powerful backend systems. Turning ideas into
          practical digital products.
        </p>

        <div className="hero-socials">
          <a
            href="https://github.com/RajputSunny1924"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub">
            GH <span>↗</span>
          </a>

          <a
            href="https://www.linkedin.com/in/sunny-singh-rajput-677471417"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn">
            IN <span>↗</span>
          </a>
        </div>

        <div className="hero-actions">
          <a href="#projects" className="hero-primary-btn">
            Explore Projects <span>↗</span>
          </a>

          <a href="#contact" className="hero-secondary-btn">
            Let's Talk
          </a>
        </div>
      </div>

      <div className="hero-profile" data-reveal>
        <div className="hero-profile-glow"></div>

        <img
          src="/sunny-profile.png"
          alt="Sunny Singh - Full Stack Developer"
          className="hero-profile-image"
          loading="eager"
        />
      </div>

      <div className="hero-bottom-line" data-reveal>
        <span>REACT</span>
        <span>PYTHON</span>
        <span>FASTAPI</span>
        <span>WEB DEVELOPMENT</span>
      </div>
    </section>
  );
}

export default Hero;
