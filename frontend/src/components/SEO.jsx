import { useEffect } from "react";

const SITE_URL = "https://sunnysingh.is-a.dev";
const DEFAULT_IMAGE = `${SITE_URL}/sunny.webp`;

function SEO({ title, description, path = "/" }) {
  useEffect(() => {
    const previousTitle = document.title;

    const updates = [
      ["name", "description", description],
      ["name", "robots", "index, follow"],
      ["property", "og:type", "website"],
      ["property", "og:title", title],
      ["property", "og:description", description],
      ["property", "og:url", `${SITE_URL}${path}`],
      ["property", "og:image", DEFAULT_IMAGE],
      ["name", "twitter:card", "summary_large_image"],
      ["name", "twitter:title", title],
      ["name", "twitter:description", description],
      ["name", "twitter:image", DEFAULT_IMAGE],
    ];

    const previousValues = [];

    updates.forEach(([attribute, name, content]) => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);

      const existed = Boolean(element);

      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }

      previousValues.push({
        element,
        existed,
        previousContent: element.getAttribute("content"),
      });

      element.setAttribute("content", content);
    });

    let canonical = document.querySelector('link[rel="canonical"]');

    const canonicalExisted = Boolean(canonical);

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }

    const previousCanonical = canonical.getAttribute("href");

    canonical.href = `${SITE_URL}${path}`;

    document.title = title;

    return () => {
      document.title = previousTitle;

      previousValues.forEach((item) => {
        if (item.existed) {
          item.element.setAttribute("content", item.previousContent);
        } else {
          item.element.remove();
        }
      });

      if (canonicalExisted) {
        canonical.setAttribute("href", previousCanonical);
      } else {
        canonical.remove();
      }
    };
  }, [title, description, path]);

  return null;
}

export default SEO;
