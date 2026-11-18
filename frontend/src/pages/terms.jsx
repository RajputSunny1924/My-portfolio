import { Link } from "react-router-dom";
import SEO from "../components/SEO";

const termsSections = [
  {
    title: "01. Project Scope & Agreement",
    content: [
      "Before starting a project, we will discuss the client's requirements, expected features, design preferences, functionality, budget and estimated delivery timeline.",
      "The agreed project scope, features, pricing and deliverables will be confirmed through a written quotation, proposal or other written communication.",
      "Only the features and services included in the approved scope are covered by the agreed price. Any additional features or major changes may require additional charges and time.",
    ],
  },
  {
    title: "02. Pricing & Project Costs",
    content: [
      "All prices displayed on this portfolio are indicative starting prices. The final project cost depends on the complexity, features, integrations and specific requirements.",
      "A final quotation will be shared before the project begins. Work will start only after the client approves the quotation and agrees to the payment terms.",
      "Domain registration, hosting, premium themes, plugins, APIs, payment gateway charges, third-party subscriptions and other external services are not included unless specifically mentioned in the quotation.",
      "Any applicable additional costs will be communicated to the client before they are incurred.",
    ],
  },
  {
    title: "03. Payment Terms",
    content: [
      "A project advance is required before development begins. The payment structure depends on the size and scope of the project.",
      "For smaller projects, the standard payment structure is 50% advance before work begins and the remaining 50% before final handover.",
      "For larger projects, the payment structure is generally 40% advance, 30% after the agreed milestone or demonstration, and the final 30% before handover.",
      "The exact payment schedule will be mentioned in the project quotation. Different arrangements may be agreed upon in writing.",
      "Final source code, credentials and project handover will be provided after all outstanding payments have been cleared.",
      "If a payment is delayed, development or delivery may be paused until the pending amount is received.",
    ],
  },
  {
    title: "04. Revisions & Additional Changes",
    content: [
      "Reasonable revisions within the originally approved project scope will be handled according to the revision terms mentioned in the quotation.",
      "A revision means adjusting an existing agreed feature or design. It does not include adding entirely new functionality or changing the original project requirements.",
      "New features, major design changes or requests outside the approved scope may involve additional charges and an updated delivery timeline.",
      "Any additional cost will be discussed and approved by the client before the extra work begins.",
    ],
  },
  {
    title: "05. Project Timeline & Delivery",
    content: [
      "An estimated delivery timeline will be shared before the project begins, based on the agreed scope and complexity.",
      "The timeline may change if the client delays providing content, images, approvals, feedback, required information or payments.",
      "Delays caused by third-party services, hosting providers, domain providers, payment gateways or other external systems may also affect delivery.",
      "The client will be informed about significant changes to the expected timeline.",
    ],
  },
  {
    title: "06. Client Responsibilities",
    content: [
      "The client is responsible for providing accurate content, business information, images, logos, product details and other materials required for the project.",
      "The client must ensure that they have the legal right to use all content, images, logos, videos and other materials supplied to us.",
      "The client is responsible for reviewing the website, checking the provided information and approving the final work before launch or handover.",
      "Delays in providing required materials or approvals may affect the project timeline.",
    ],
  },
  {
    title: "07. Domain, Hosting & Third-Party Services",
    content: [
      "Domain registration, hosting plans, SSL certificates, premium plugins, paid APIs, email services and other third-party services are separate expenses unless included in the approved quotation.",
      "The client is responsible for recurring renewal fees and subscription charges for services purchased in their name.",
      "Third-party services are governed by their own terms, policies, availability and pricing. We cannot guarantee uninterrupted operation or control changes made by those providers.",
      "Where possible, domain and hosting accounts should be registered using the client's own details so the client retains control over them.",
    ],
  },
  {
    title: "08. Testing, Approval & Handover",
    content: [
      "The website will be reviewed and tested against the agreed project requirements before final handover.",
      "The client should review the website and report any issues related to the agreed scope before approving the final delivery.",
      "After final payment, the agreed deliverables, source code and access details will be handed over as specified in the quotation.",
      "Any training, documentation, deployment assistance or additional handover support will be provided only if included in the agreed scope.",
    ],
  },
  {
    title: "09. Ownership & Intellectual Property",
    content: [
      "After full payment, ownership of the custom project work created specifically for the client will be transferred as agreed in the project quotation.",
      "Pre-existing code, reusable components, development tools, frameworks, libraries and third-party assets remain subject to their respective ownership and licence terms.",
      "Third-party software, plugins, fonts, images and other licensed materials are not transferred beyond the rights permitted by their licences.",
      "The client is responsible for ensuring that materials they provide do not violate another person's intellectual property rights.",
    ],
  },
  {
    title: "10. Cancellation & Refund Policy",
    content: [
      "If a client decides to cancel a project, they should communicate the cancellation request in writing.",
      "The amount refundable, if any, will depend on the work already completed, project milestones achieved, time spent and any approved non-refundable third-party expenses.",
      "Payments for completed work and expenses already incurred may be deducted from the amount paid.",
      "If the amount paid is less than the value of completed work and approved expenses, the remaining balance may become payable.",
      "Any eligible refund will be discussed with the client and processed after the cancellation amount has been calculated.",
    ],
  },
  {
    title: "11. Maintenance & Post-Launch Support",
    content: [
      "Website development does not automatically include ongoing maintenance, content updates, hosting management or future feature development.",
      "Maintenance and support services can be discussed separately and may involve additional charges.",
      "Any post-launch support period, included bug fixes or maintenance commitments will be mentioned in the project quotation.",
      "Issues caused by unauthorised modifications, third-party services, hosting problems or changes made by others may fall outside the original project scope.",
    ],
  },
  {
    title: "12. SEO & Performance",
    content: [
      "Basic on-page SEO and technical optimisation will be provided only to the extent included in the agreed project scope.",
      "Search engine rankings, traffic, leads, sales or specific performance scores cannot be guaranteed because they depend on several factors outside our control.",
      "Search engines may take time to index website pages and may change their ranking systems without notice.",
    ],
  },
  {
    title: "13. Limitation of Responsibility",
    content: [
      "We will make reasonable efforts to develop and deliver the project according to the approved requirements.",
      "We are not responsible for business losses, lost revenue, data loss or service interruptions caused by third-party providers, client actions or circumstances beyond our reasonable control.",
      "The client is responsible for maintaining appropriate backups, protecting account credentials and managing their business operations after handover, unless these services are separately included.",
    ],
  },
  {
    title: "14. Portfolio & Project Showcase",
    content: [
      "We may display completed projects in our portfolio to demonstrate our work and experience.",
      "If a project is confidential or the client does not want it publicly displayed, this must be communicated and agreed upon before the project begins.",
      "We will not intentionally publish confidential business information, private credentials or sensitive client data as part of a portfolio showcase.",
    ],
  },
  {
    title: "15. Changes to These Terms",
    content: [
      "These terms may be updated when our services or working process changes.",
      "The terms agreed upon in the approved quotation or written project agreement will apply to that specific project.",
      "Any important project-specific changes must be mutually agreed upon in writing.",
    ],
  },
];
function Terms() {
  return (
    <>
      <SEO
        title="Terms & Conditions | Sunny Singh Rajput"
        description="Read the terms and conditions for freelance website development services, including project scope, payments, revisions, delivery, ownership and support."
        path="/terms"
      />

      <main className="service-page terms-page">
        <div className="container">
          <header className="terms-header">
            <span className="section-eyebrow">IMPORTANT INFORMATION</span>

            <h1>Terms & Conditions</h1>

            <p>
              Clear expectations. Transparent pricing. A professional working
              relationship.
            </p>

            <span className="terms-updated">
              Last updated: 18 November 2026
            </span>
          </header>

          <div className="terms-intro">
            These terms explain how projects are planned, priced, developed and
            delivered. By approving a quotation or starting a project, the
            client agrees to the applicable terms described here and any
            additional conditions confirmed in writing.
          </div>

          <div className="terms-document">
            {termsSections.map((section) => (
              <section className="terms-section" key={section.title}>
                <h2>{section.title}</h2>

                {section.content.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </section>
            ))}
          </div>

          <div className="terms-contact">
            <h2>Have questions before starting a project?</h2>

            <p>
              If anything is unclear, feel free to discuss it before approving
              your project quotation.
            </p>

            <Link to="/#contact" className="terms-contact-link">
              Contact Me
            </Link>

            <Link to="/pricing" className="terms-secondary-link">
              View Pricing
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

export default Terms;
