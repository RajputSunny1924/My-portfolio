function Hero() {
  return (
    <section id="home" className="hero-section">
      <div className="hero-copy">
        <p className="hero-kicker">
          <span className="hero-kicker-line"></span>
          FULL STACK · AI AUTOMATION
        </p>

        <h1 className="hero-heading">
          <span className="reveal-line">
            <span>Building</span>
          </span>

          <span className="reveal-line">
            <span className="accent-text">Digital</span>
          </span>

          <span className="reveal-line">
            <span>Experiences</span>
          </span>
        </h1>

        <h2 className="hero-subheading">
          Hi, I'm <span className="hero-typing-text">Sunny Singh Rajput</span>
        </h2>

        <p className="hero-description">
          I'm Sunny Singh Rajput, a Full Stack Developer and Freelance Web
          Developer based in Mumbai, India. I build fast, secure and responsive
          websites, custom web applications and AI automation systems for
          businesses and individuals, with clear communication from the first
          idea to the final delivery.
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
            Start a Project
          </a>
        </div>
      </div>

      <div className="hero-profile">
        <div className="hero-profile-glow"></div>

        <img
          src="/sunny-profile.webp"
          alt="Sunny Singh Rajput"
          className="hero-profile-image"
          loading="eager"
          fetchPriority="high"
          width="560"
          height="747"
        />
      </div>

      <div className="hero-bottom-line">
        <span>REACT</span>
        <span>PYTHON</span>
        <span>FASTAPI</span>
        <span>WEB DEVELOPMENT</span>
      </div>
    </section>
  );
}

export default Hero;
