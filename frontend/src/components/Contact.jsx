function Contact() {
  return (
    <section id="contact" className="contact-section">
      {" "}
      <div className="container">
        {" "}
        <div className="contact-heading" data-reveal>
          {" "}
          <span className="section-eyebrow">HAVE A PROJECT IN MIND?</span>
          <h2>
            Let's build
            <br />
            <span>something meaningful.</span>
          </h2>
          <p>
            Have an idea, need a website or looking for a developer to
            collaborate with? Tell me what you're planning. Let's discuss it.
          </p>
          <a
            href="mailto:sunnysinghforeverat@gmail.com?subject=Project%20Inquiry"
            className="contact-main-button">
            Start a Conversation <span>↗</span>
          </a>
        </div>
        <div className="contact-content">
          <div className="contact-info" data-reveal>
            <span className="contact-small-label">CONTACT DETAILS</span>

            <h3>Get in touch.</h3>

            <a href="mailto:sunnysinghforeverat@gmail.com">
              <span>EMAIL</span>
              sunnysinghforeverat@gmail.com
              <span className="contact-arrow">↗</span>
            </a>

            <a href="tel:+917350288505">
              <span>PHONE</span>
              +91 7350288505
              <span className="contact-arrow">↗</span>
            </a>

            <div className="contact-location">
              <span>LOCATION</span>
              Mumbai, Maharashtra, India
            </div>
          </div>

          <div className="contact-socials" data-reveal>
            <span className="contact-small-label">FIND ME ONLINE</span>

            <a
              href="https://github.com/RajputSunny1924"
              target="_blank"
              rel="noopener noreferrer">
              GitHub <span>↗</span>
            </a>

            <a
              href="https://www.linkedin.com/in/sunny-singh-rajput-677471417"
              target="_blank"
              rel="noopener noreferrer">
              LinkedIn <span>↗</span>
            </a>

            <a href="/sunny-resume.pdf" download>
              Download Resume <span>↓</span>
            </a>
          </div>
        </div>
        <div className="contact-bottom" data-reveal>
          <span>OPEN TO FREELANCE PROJECTS & COLLABORATIONS</span>
          <span>LET'S CREATE SOMETHING GREAT.</span>
        </div>
      </div>
    </section>
  );
}

export default Contact;
