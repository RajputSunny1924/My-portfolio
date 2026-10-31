const services = [
  {
    number: "01",
    category: "WEB DESIGN & DEVELOPMENT",
    title: "Business Websites",
    description:
      "A professional online presence for shops, cafes, startups and businesses. Designed to showcase your brand and help customers connect with you.",
    tags: ["Custom Design", "Mobile Responsive", "Contact Integration"],
  },
  {
    number: "02",
    category: "PERSONAL BRANDING",
    title: "Portfolio Websites",
    description:
      "A personal website that presents your identity, skills, projects and achievements in a professional way.",
    tags: ["Personal Branding", "Project Showcase", "Modern UI"],
  },
  {
    number: "03",
    category: "PRODUCT & MARKETING",
    title: "Landing Pages",
    description:
      "Focused pages for products, services and campaigns, built to communicate your offer clearly and guide visitors towards action.",
    tags: ["Product Showcase", "Call To Action", "Responsive Layout"],
  },
  {
    number: "04",
    category: "SERVER-SIDE ENGINEERING",
    title: "Backend & API Development",
    description:
      "Backend systems that handle application logic, authentication, data processing and communication between services.",
    tags: ["Python", "FastAPI", "REST APIs", "MySQL"],
  },
  {
    number: "05",
    category: "END-TO-END DEVELOPMENT",
    title: "Full Stack Applications",
    description:
      "Frontend and backend development connected into a complete web application, built around your project requirements.",
    tags: ["React", "Python", "Database Integration"],
  },
  {
    number: "06",
    category: "ONGOING TECHNICAL SUPPORT",
    title: "Maintenance & Improvements",
    description:
      "Existing website updates, bug fixes and technical improvements within an agreed scope of work.",
    tags: ["Bug Fixes", "Updates", "Performance Improvements"],
  },
];

function Services() {
  return (
    <section className="services-section" id="services">
      {" "}
      <div className="container">
        {" "}
        <div className="services-intro" data-reveal>
          {" "}
          <span className="section-label">WHAT I CAN BUILD / 01</span>
          <h2>
            Digital solutions.
            <br />
            <span className="accent-text">Built with purpose.</span>
          </h2>
          <p>
            I work with individuals and businesses to turn their requirements
            into practical digital experiences — from websites to complete web
            applications.
          </p>
        </div>
        <div className="services-list">
          {services.map((service) => (
            <article className="service-row" key={service.number} data-reveal>
              <span className="service-number">{service.number}</span>

              <div className="service-main">
                <div className="service-details">
                  <span className="service-category">{service.category}</span>

                  <h3>{service.title}</h3>

                  <p>{service.description}</p>

                  <div className="service-tags">
                    {service.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </div>

              <a
                href="#contact"
                className="service-arrow"
                aria-label={`Discuss ${service.title}`}>
                ↗
              </a>
            </article>
          ))}
        </div>
        <div className="services-bottom" data-reveal>
          <p>Have a project that doesn't fit these services?</p>

          <a href="#contact">
            Tell me about your idea <span>↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default Services;
