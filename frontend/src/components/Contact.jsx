function Contact() {
  return (
    <section id="contact">
      <h2 data-reveal>Contact Me</h2>

      <p data-reveal>
        Feel free to connect with me for opportunities, projects, or
        collaboration.
      </p>

      <div className="contact-details" data-reveal>
        <p>
          <strong>Email:</strong>{" "}
          <a href="mailto:sunnysinghforeverat@gmail.com">
            sunnysinghforeverat@gmail.com
          </a>
        </p>

        <p>
          <strong>Phone:</strong> <a href="tel:7350288505">+91 7350288505</a>
        </p>

        <p>
          <strong>Location:</strong> Mumbai, Maharashtra
        </p>

        <p>
          <strong>GitHub:</strong>{" "}
          <a
            href="https://github.com/RajputSunny1924"
            target="_blank"
            rel="noopener noreferrer">
            github.com/RajputSunny1924
          </a>
        </p>

        <p>
          <strong>LinkedIn:</strong>{" "}
          <a
            href="https://www.linkedin.com/in/sunny-singh-rajput-677471417"
            target="_blank"
            rel="noopener noreferrer">
            LinkedIn Profile
          </a>
        </p>
      </div>

      <a
        className="resume-link"
        href="/sunny-resume.pdf"
        download
        data-reveal>
        Download Resume
      </a>
    </section>
  );
}

export default Contact;
