const services = [
  {
    number: "01",
    category: "WEB DESIGN & DEVELOPMENT",
    title: "Business Website Development",
    description:
      "Professional, mobile-friendly websites for small businesses, shops, cafes and startups. Present your brand, showcase your services and make it easier for potential customers to reach you.",
    tags: ["Custom Website Design", "Mobile Responsive", "Contact Integration"],
  },
  {
    number: "02",
    category: "PERSONAL BRANDING",
    title: "Portfolio Website Development",
    description:
      "Personal portfolio websites for professionals, developers, freelancers and creatives. Showcase your skills, experience and projects through a well-structured online presence.",
    tags: ["Personal Branding", "Project Showcase", "Modern UI"],
  },
  {
    number: "03",
    category: "PRODUCT & MARKETING",
    title: "Landing Page Development",
    description:
      "Focused landing pages for products, services and marketing campaigns. Present your offer clearly, highlight key benefits and guide visitors towards taking action.",
    tags: ["Conversion-Focused Layout", "Call-to-Action", "Responsive Design"],
  },
  {
    number: "04",
    category: "BACKEND ENGINEERING",
    title: "Backend & API Development",
    description:
      "Custom backend development for web applications, including server-side logic, REST APIs, authentication and database integration to support your application's requirements.",
    tags: ["Python", "FastAPI", "REST APIs", "MySQL"],
  },
  {
    number: "05",
    category: "END-TO-END DEVELOPMENT",
    title: "Full Stack Web Applications",
    description:
      "Complete web application development combining frontend interfaces, backend functionality and database integration. Each solution is designed around your specific features and business requirements.",
    tags: ["React", "Python", "API Integration", "Database Design"],
  },
  {
    number: "06",
    category: "AI & WORKFLOW AUTOMATION",
    title: "AI Automation Solutions",
    description:
      "Custom automation solutions that use AI and software workflows to reduce repetitive manual tasks, process information and improve everyday business operations.",
    tags: [
      "Python",
      "AI Integration",
      "Workflow Automation",
      "API Integration",
    ],
  },
  {
    number: "07",
    category: "WEBSITE SUPPORT & MAINTENANCE",
    title: "Website Maintenance & Improvements",
    description:
      "Ongoing technical support for existing websites, including content updates, bug fixes, performance improvements and agreed functionality enhancements.",
    tags: ["Bug Fixes", "Website Updates", "Performance Improvements"],
  },
];

function Services() {
  return (
    <section className="services-section" id="services">
      <div className="container">
        <div className="services-intro" data-reveal>
          <span className="section-label">WHAT I CAN BUILD / 01</span>

          <h2>
            Digital solutions.
            <br />
            <span className="accent-text">Built around your needs.</span>
          </h2>

          <p>
            From professional business websites to custom web applications and
            workflow automation, I provide practical development solutions based
            on your requirements, goals and budget.
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
