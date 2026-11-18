import { Link } from "react-router-dom";
import SEO from "../components/SEO";
const pricingPlans = [
  {
    name: "Portfolio Website",
    price: "₹1,000",
    description:
      "A professional online presence for individuals and freelancers.",
    features: [
      "Modern responsive design",
      "About and services sections",
      "Contact information",
      "Mobile-friendly layout",
      "Basic on-page SEO",
    ],
    note: "Final price depends on requirements.",
  },
  {
    name: "Catalogue Website",
    price: "₹2,000 – ₹3,000",
    description:
      "Showcase your products and services through a clean catalogue.",
    features: [
      "Product catalogue",
      "Category-wise organization",
      "Product images and details",
      "Responsive design",
      "WhatsApp enquiry integration",
    ],
    note: "Product quantity and features affect pricing.",
    featured: true,
  },
  {
    name: "Full-Stack Website",
    price: "₹5,000 – ₹7,000",
    description:
      "A website with backend functionality and database integration.",
    features: [
      "Frontend and backend",
      "Database integration",
      "API development",
      "Admin functionality where required",
      "Responsive user interface",
    ],
    note: "Final scope will be discussed before development.",
  },
  {
    name: "E-Commerce Website",
    price: "₹10,000 – ₹15,000",
    description: "An online store to showcase and sell your products.",
    features: [
      "Product listing and categories",
      "Shopping cart functionality",
      "Payment gateway integration",
      "Order management",
      "Responsive design",
    ],
    note: "Payment gateway, domain and hosting charges are separate.",
  },
];

function Pricing() {
  return (
    <>
      <SEO
        title="Website Development Pricing | Sunny Singh Rajput"
        description="Explore freelance website development pricing for portfolio websites, catalogue websites, full-stack applications and e-commerce websites."
        path="/pricing"
      />

      <main className="service-page">
        <section className="service-page-hero">
          <span className="section-eyebrow">INVESTMENT & SERVICES</span>

          <h1>
            Simple Pricing.
            <br />
            <span className="accent-text">Real Value.</span>
          </h1>

          <p>
            Transparent starting prices for websites and digital solutions.
            Every project is different, so the final quotation depends on your
            requirements and project scope.
          </p>

          <Link to="/offers" className="btn btn-primary">
            Explore Current Offers
          </Link>
        </section>

        <section className="pricing-section container">
          <div className="service-page-heading">
            <span className="section-eyebrow">WHAT I OFFER</span>
            <h2>Website Development Pricing</h2>
            <p>Choose a service that matches your business needs.</p>
          </div>

          <div className="pricing-grid">
            {pricingPlans.map((plan) => (
              <article
                className={`pricing-card ${plan.featured ? "featured" : ""}`}
                key={plan.name}>
                {plan.featured && (
                  <span className="pricing-badge">POPULAR CHOICE</span>
                )}

                <h3>{plan.name}</h3>
                <div className="pricing-amount">{plan.price}</div>

                <p className="pricing-description">{plan.description}</p>

                <div className="pricing-divider" />

                <h4>What's included</h4>

                <ul className="pricing-features">
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <span aria-hidden="true">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <p className="pricing-note">{plan.note}</p>

                <Link to="/#contact" className="btn btn-outline pricing-button">
                  Discuss Your Project
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="custom-pricing container">
          <span className="section-eyebrow">CUSTOM SOLUTIONS</span>
          <h2>Need Something Different?</h2>
          <p>
            Landing pages, automation systems, custom integrations and
            specialized website requirements are quoted separately.
          </p>

          <Link to="/#contact" className="btn btn-primary">
            Get a Custom Quote
          </Link>
        </section>

        <section className="pricing-notes container">
          <h2>Important Pricing Information</h2>

          <ul>
            <li>
              Prices are indicative starting ranges, not fixed quotations.
            </li>
            <li>
              Domain registration and hosting charges are separate unless
              specifically included in your quotation.
            </li>
            <li>
              Third-party services, paid APIs, plugins and payment gateway
              charges are not included by default.
            </li>
            <li>
              Additional features or changes outside the agreed scope may
              require additional charges.
            </li>
            <li>Maintenance and ongoing support are discussed separately.</li>
          </ul>

          <p>
            Every project receives a clear scope and quotation before
            development begins.
          </p>

          <Link to="/terms" className="text-link">
            Read Freelance Service Terms →
          </Link>
        </section>
      </main>
    </>
  );
}
export default Pricing;
