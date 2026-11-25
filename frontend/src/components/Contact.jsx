import { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    service: "",
    details: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const phone = formData.phone.replace(/\D/g, "");

    if (phone.length !== 10) {
      alert("Please enter a valid 10-digit WhatsApp number.");
      return;
    }

    const message = `NEW WEBSITE PROJECT INQUIRY

Name: ${formData.name}
WhatsApp: ${formData.phone}
Service: ${formData.service}

Project Details:
${formData.details || "Not provided"}`;

    const whatsappURL = `https://wa.me/917350288505?text=${encodeURIComponent(
      message,
    )}`;

    window.open(whatsappURL, "_blank");
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="contact-heading" data-reveal>
          <span className="section-eyebrow">HAVE A PROJECT IN MIND?</span>

          <h2>
            Let's build
            <br />
            <span>something meaningful.</span>
          </h2>

          <p>
            Looking for a professional website or a custom web application?
            Share your requirements with me. Let's discuss your idea and find
            the right solution for your project.
          </p>

          <a href="#project-inquiry" className="contact-main-button">
            Start Your Project <span>↓</span>
          </a>
        </div>

        {/* EXISTING CONTACT DETAILS */}

        <div className="contact-content contact-layout">
          {/* LEFT SIDE */}
          <div className="contact-left-column" data-reveal>
            <div className="contact-info">
              <span className="contact-small-label">GET IN TOUCH</span>

              <h3>Let's talk.</h3>

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
                href="https://wa.me/917350288505"
                className="contact-whatsapp-icon"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with me on WhatsApp">
                <svg viewBox="0 0 32 32" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M16 .5A15.3 15.3 0 0 0 2.8 23.5L.7 31.2l7.9-2.1A15.5 15.5 0 1 0 16 .5Zm0 27.8a12.5 12.5 0 0 1-6.4-1.8l-.5-.3-4.7 1.2 1.3-4.6-.3-.5A12.4 12.4 0 1 1 16 28.3Zm6.8-9.3c-.4-.2-2.2-1.1-2.5-1.2-.3-.1-.6-.2-.8.2-.3.4-.9 1.2-1.1 1.4-.2.2-.4.3-.8.1-.4-.2-1.6-.6-3-1.9-1.1-1-1.9-2.2-2.1-2.6-.2-.4 0-.6.2-.8l.6-.7c.2-.2.3-.4.4-.7.1-.2 0-.5 0-.7-.1-.2-.8-2-1.1-2.7-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.7.1-1 .5-.4.4-1.3 1.3-1.3 3.1s1.3 3.6 1.5 3.8c.2.3 2.6 4 6.2 5.4.9.4 1.6.6 2.1.7.9.3 1.7.2 2.3.1.7-.1 2.2-.9 2.5-1.8.3-.9.3-1.7.2-1.8-.1-.2-.3-.3-.7-.5Z"
                  />
                </svg>
              </a>
            </div>

            <div className="contact-socials">
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
                href="/Sunny-Singh-Resume.pdf"
                download="Sunny-Singh-Resume.pdf"
                className="resume-btn">
                Download Resume
              </a>
            </div>
          </div>

          {/* RIGHT SIDE - FORM */}
          <div className="project-inquiry-wrapper" id="project-inquiry">
            <div className="project-inquiry-heading">
              <span className="contact-small-label">PROJECT INQUIRY</span>

              <h3>Start your project.</h3>

              <p>Tell me what you need and let's make it happen.</p>
            </div>

            <form className="project-inquiry-form" onSubmit={handleSubmit}>
              <div className="inquiry-field">
                <label htmlFor="inquiry-name">Full Name *</label>

                <input
                  type="text"
                  id="inquiry-name"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  maxLength={100}
                />
              </div>

              <div className="inquiry-field">
                <label htmlFor="inquiry-phone">WhatsApp Number *</label>

                <input
                  type="tel"
                  id="inquiry-phone"
                  name="phone"
                  placeholder="10-digit number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  maxLength={10}
                  minLength={10}
                  inputMode="numeric"
                />
              </div>

              <div className="inquiry-field">
                <label htmlFor="inquiry-service">Service Required *</label>

                <select
                  id="inquiry-service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required>
                  <option value="" disabled>
                    Select a service
                  </option>

                  <option value="Business Website">Business Website</option>

                  <option value="Gym website">Gym website</option>

                  <option value="Restaurant / Cafe Website">
                    Restaurant / Cafe Website
                  </option>

                  <option value="E-commerce Website">E-commerce Website</option>

                  <option value="Automation systems">Automation systems</option>

                  <option value="Portfolio Website">Portfolio Website</option>

                  <option value="Landing Page">Landing Page</option>

                  <option value="Website Redesign">Website Redesign</option>

                  <option value="Custom Web Application">
                    Custom Web Application
                  </option>

                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="inquiry-field">
                <label htmlFor="inquiry-details">
                  Project Details <span>(Optional)</span>
                </label>

                <textarea
                  id="inquiry-details"
                  name="details"
                  placeholder="Briefly describe your project..."
                  value={formData.details}
                  onChange={handleChange}
                  rows="3"
                  maxLength={1000}
                />
              </div>

              <button type="submit" className="inquiry-submit-button">
                Send Inquiry <span>↗</span>
              </button>

              <p className="inquiry-form-note">
                Your inquiry will open directly in WhatsApp.
              </p>
            </form>
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
