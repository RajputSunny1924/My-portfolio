const projectConfig = [
  {
    title: "Private Chat Application",
    image:
      "https://images.unsplash.com/photo-1611746872915-64382b5c76da?w=1200&q=85",
    imageAlt: "Temporary chat application preview",
    category: "REAL-TIME APPLICATION",
    url: "https://private-chat-frontend-5hrb.onrender.com/",
    description:
      "A private two-user chat application designed for real-time communication. It uses WebSocket connections to exchange messages and a backend system to handle authentication, chat processing and database operations.",
    highlights: [
      "Private two-user messaging",
      "Real-time communication using WebSockets",
      "FastAPI backend",
      "MySQL message storage",
      "User authentication",
      "Online and offline status",
      "Media functionality",
    ],
    technologies: ["React", "FastAPI", "MySQL", "WebSocket", "JWT"],
  },
  {
    title: "Developer Portfolio Website",
    image: "/assets/portfolio_img.jpg",
    imageAlt: "Developer portfolio website preview",
    category: "FRONTEND WEB DEVELOPMENT",
    url: "https://sunnysingh.is-a.dev/",
    description:
      "My personal portfolio website, designed to showcase my projects, technical skills and freelance services. Built with React and modern CSS, it features a responsive layout, smooth interactions and a clean user experience.",
    highlights: [
      "Responsive portfolio design",
      "Personal introduction and skills showcase",
      "Project showcase with live links",
      "Freelance services presentation",
      "Direct email, phone and WhatsApp contact",
      "SEO-friendly page structure",
      "Mobile-friendly user experience",
    ],
    technologies: ["React", "JavaScript", "CSS", "Vite"],
  },

  {
    title: "My Choice Shop – Catalogue Website",
    image: "/assets/catalogue_img.jpg",
    imageAlt: "My Choice Shop online clothing catalogue preview",
    category: "E-COMMERCE / PRODUCT CATALOGUE",
    url: "https://my-choice-shop.netlify.app/",
    description:
      "A responsive clothing catalogue website designed to showcase fashion products with an organized shopping experience. It features product listings, category-based browsing, product detail pages, pricing, and a modern mobile-friendly interface.",
    highlights: [
      "Responsive clothing catalogue",
      "Category-based product browsing",
      "Individual product detail pages",
      "Product pricing and discount display",
      "Modern and mobile-friendly design",
      "Product navigation using URL slugs",
      "Frontend-based product catalogue",
    ],
    technologies: ["React", "JavaScript", "CSS", "Vite"],
  },
  {
    title: "Sukoon Cafe – Restaurant Website Demo",
    image: "/assets/cafe_img.jpg",
    imageAlt: "Sukoon Cafe restaurant website preview",
    category: "RESTAURANT / CAFE WEBSITE",
    url: "https://sukkonscafe.netlify.app/",
    description:
      "A modern and visually appealing cafe website designed to showcase the cafe's atmosphere, menu, and offerings. It features a responsive layout, elegant design, intuitive navigation, and a customer-friendly experience across mobile and desktop devices.",
    highlights: [
      "Responsive cafe website design",
      "Modern and elegant user interface",
      "Cafe menu presentation",
      "Mobile-friendly layout",
      "User-friendly navigation",
      "Business contact information",
      "Restaurant-focused website experience",
    ],
    technologies: ["React", "JavaScript", "CSS", "Vite"],
  },
];

function Projects() {
  return (
    <section id="projects" className="projects-section">
      {" "}
      <div className="container">
        {" "}
        <div className="projects-heading" data-reveal>
          {" "}
          <span className="section-eyebrow">SELECTED WORK / 01</span>
          <h2>
            Projects that
            <br />
            <span>bring ideas to life.</span>
          </h2>
          <p>
            A closer look at the applications I've built, the problems they
            address and the technologies behind them.
          </p>
        </div>
        <div className="projects-showcase">
          {projectConfig.map((config, index) => {
            return (
              <article
                className={`project-case ${
                  index % 2 !== 0 ? "project-reverse" : ""
                }`}
                key={config.title}
                data-reveal>
                <div className="project-preview">
                  <div className="project-browser">
                    <div className="project-browser-bar">
                      <div className="browser-dots">
                        <span />
                        <span />
                        <span />
                      </div>

                      <span className="browser-address">
                        {index === 0
                          ? "private-chat.app"
                          : "sunny-portfolio.dev"}
                      </span>

                      <span className="browser-menu">•••</span>
                    </div>

                    <div className="project-image-wrap">
                      <img
                        src={config.image}
                        alt={config.imageAlt}
                        loading="lazy"
                      />

                      <span className="preview-placeholder">
                        TEMPORARY PREVIEW
                      </span>
                    </div>
                  </div>

                  <span className="project-preview-number">0{index + 1}</span>
                </div>

                <div className="project-information">
                  <div className="project-meta">
                    <span>FEATURED PROJECT</span>
                    <span>{config.category}</span>
                  </div>

                  <h3>{config.title}</h3>

                  <p className="project-description">{config.description}</p>

                  <div className="project-tech-stack">
                    {config.technologies.map((tech) => (
                      <span key={tech}>{tech}</span>
                    ))}
                  </div>

                  <div className="project-highlights">
                    <h4>WHAT I BUILT</h4>

                    <ul>
                      {config.highlights.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="project-actions">
                    <a
                      href={config.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="project-live-link">
                      Explore Live Project <span>↗</span>
                    </a>

                    <span className="project-status">LIVE PROJECT</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        <div className="projects-footer" data-reveal>
          <span>MORE THAN JUST CODE.</span>
          <p>
            Every project is an opportunity to solve a problem, explore an idea
            and build something meaningful.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Projects;
