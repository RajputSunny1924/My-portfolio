function Hero() {
  return (
    <section id="home">
      <div className="hero-visuals" aria-hidden="true">
        <span className="hero-visual hero-visual--one" />
        <span className="hero-visual hero-visual--two" />
        <span className="hero-visual hero-visual--three" />
      </div>

      <div className="hero-content">
        <p className="hero-kicker">// Building thoughtful digital systems</p>
        <h1>Hi, I'm Sunny Singh</h1>

        <h2>
          <span>Full Stack Developer</span>
        </h2>

        <p>
          I build practical applications using Python, FastAPI, React and
          MySQL.
        </p>

        <p>
          Interested in backend development, full-stack applications and AI
          automation.
        </p>
      </div>
    </section>
  );
}

export default Hero;
