export const offers = [
  {
    id: "launch-2026",
    title: "Portfolio Launch Offer",
    label: "LAUNCH SPECIAL",
    type: "launch",
    discount: "50% OFF",
    description:
      "Get your website developed at 50% off the agreed development fee. This introductory offer is available for the first five clients.",
    applicableServices: [
      "Portfolio Websites",
      "Landing Pages",
      "Catalogue Websites",
      "Custom Web Development",
    ],
    terms: [
      "Available for the first five confirmed clients.",
      "Discount applies only to the agreed development fee.",
      "Domain, hosting and third-party service charges are excluded.",
      "Project scope and final quotation must be approved before work begins.",
      "Cannot be combined with other offers.",
    ],
    startDate: "2026-11-18",
    endDate: null,
    active: true,
  },
];

// Returns only manually active offers within their validity dates.
export function getActiveOffers() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return offers.filter((offer) => {
    if (!offer.active) return false;

    const start = offer.startDate
      ? new Date(`${offer.startDate}T00:00:00`)
      : null;
    const end = offer.endDate ? new Date(`${offer.endDate}T23:59:59`) : null;

    if (start && today < start) return false;
    if (end && today > end) return false;

    return true;
  });
}
