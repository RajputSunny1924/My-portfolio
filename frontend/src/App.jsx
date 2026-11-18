import SEO from "./components/SEO";

import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Services from "./components/services";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";

// services
import Offers from "./pages/offers";
import Pricing from "./pages/pricing";
import Terms from "./pages/terms";

function HomePage() {
  useEffect(() => {
    const revealItems = document.querySelectorAll("[data-reveal]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          } else {
            entry.target.classList.remove("is-visible");
          }
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -42px 0px",
      },
    );

    revealItems.forEach((item) => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <SEO
        title="Sunny Singh Rajput | Full Stack Developer & Freelance Web Developer"
        description="Sunny Singh Rajput is a Full Stack and Freelance Web Developer in Mumbai, India. Explore my web development projects, skills and services."
        path="/"
      />

      <main id="main-content">
        <Hero />
        <About />
        <Services />
        <Projects />
        <Contact />
      </main>
    </>
  );
}

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));

      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }

    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname, hash]);

  return null;
}

function App() {
  return (
    <div className="portfolio-shell">
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/terms" element={<Terms />} />
        <Route
          path="*"
          element={
            <main className="container offers-empty">
              <h1>Page Not Found</h1>
              <p>The page you are looking for does not exist.</p>
              <a href="/" className="btn btn-primary">
                Return to Homepage
              </a>
            </main>
          }
        />
      </Routes>

      <Footer />
    </div>
  );
}

export default App;
