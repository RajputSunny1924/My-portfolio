import { Link } from "react-router-dom";
import { getActiveOffers } from "../data/offer";
import SEO from "../components/SEO";
function Offers() {
  const activeOffers = getActiveOffers();

  return (
    <>
      <SEO
        title="Web Development Offers & Discounts | Sunny Singh Rajput"
        description="Explore current freelance web development offers and seasonal discounts from Sunny Singh Rajput. Find website development offers for portfolios, landing pages and custom websites."
        path="/offers"
      />

      <main id="main-content" className="offers-page">
        <section className="offers-hero">
          <div className="container">
            <p className="section-eyebrow">SPECIAL OFFERS</p>

            <h1>
              Web Development <span className="accent-text">Offers</span>
            </h1>

            <p className="offers-intro">
              Explore current launch promotions and special discounts on website
              development services. Every project is quoted according to its
              requirements and agreed scope.
            </p>
          </div>
        </section>

        <section className="offers-list-section">
          <div className="container">
            <div className="offers-section-heading">
              <div>
                <p className="section-eyebrow">CURRENT PROMOTIONS</p>
                <h2>Available Offers</h2>
              </div>

              <span className="offers-count">
                {activeOffers.length}{" "}
                {activeOffers.length === 1 ? "OFFER" : "OFFERS"} AVAILABLE
              </span>
            </div>

            {activeOffers.length > 0 ? (
              <div className="offers-grid">
                {activeOffers.map((offer) => (
                  <article className="offer-card" key={offer.id}>
                    <div className="offer-card-top">
                      <span className="offer-label">{offer.label}</span>
                      <span className="offer-discount">{offer.discount}</span>
                    </div>

                    <h3>{offer.title}</h3>
                    <p className="offer-description">{offer.description}</p>

                    <div className="offer-details">
                      <h4>Applicable Services</h4>
                      <ul>
                        {offer.applicableServices.map((service) => (
                          <li key={service}>{service}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="offer-details offer-terms">
                      <h4>Offer Terms</h4>
                      <ul>
                        {offer.terms.map((term) => (
                          <li key={term}>{term}</li>
                        ))}
                      </ul>
                    </div>

                    <Link
                      to="/#contact"
                      className="btn btn-primary offer-cta"
                      aria-label={`Enquire about ${offer.title}`}>
                      Enquire About This Offer <span aria-hidden="true">↗</span>
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className="offers-empty">
                <h3>No active offers right now</h3>
                <p>
                  New seasonal promotions and special discounts may be announced
                  here. You can still contact me for a project quotation.
                </p>
                <Link to="/#contact" className="btn btn-primary">
                  Discuss Your Project
                </Link>
              </div>
            )}
          </div>
        </section>

        <section className="offers-note-section">
          <div className="container">
            <h2>Looking for a custom website?</h2>
            <p>
              Not every project fits a fixed offer. Share your requirements to
              receive a quotation based on your features, design and
              functionality needs.
            </p>
            <Link to="/#contact" className="btn btn-outline">
              Start a Project
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
export default Offers;
