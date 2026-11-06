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

            <a
              href="https://wa.me/917350288505?text=Hi%20Sunny%2C%20I%20visited%20your%20portfolio%20and%20would%20like%20to%20discuss%20a%20project."
              className="contact-whatsapp-icon"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat with me on WhatsApp"
              title="Chat on WhatsApp">
              <svg viewBox="0 0 32 32" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M16 .5A15.3 15.3 0 0 0 2.8 23.5L.7 31.2l7.9-2.1A15.5 15.5 0 1 0 16 .5Zm0 27.8a12.5 12.5 0 0 1-6.4-1.8l-.5-.3-4.7 1.2 1.3-4.6-.3-.5A12.4 12.4 0 1 1 16 28.3Zm6.8-9.3c-.4-.2-2.2-1.1-2.5-1.2-.3-.1-.6-.2-.8.2-.3.4-.9 1.2-1.1 1.4-.2.2-.4.3-.8.1-.4-.2-1.6-.6-3-1.9-1.1-1-1.9-2.2-2.1-2.6-.2-.4 0-.6.2-.8l.6-.7c.2-.2.3-.4.4-.7.1-.2 0-.5 0-.7-.1-.2-.8-2-1.1-2.7-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.7.1-1 .5-.4.4-1.3 1.3-1.3 3.1s1.3 3.6 1.5 3.8c.2.3 2.6 4 6.2 5.4.9.4 1.6.6 2.1.7.9.3 1.7.2 2.3.1.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.7.2-1.8-.1-.2-.3-.3-.7-.5Z"
                />
              </svg>
            </a>
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

            <a
              href="/Sunny-Resume.pdf"
              download="Sunny-Singh-Resume.pdf"
              className="resume-btn">
              Download Resume
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
