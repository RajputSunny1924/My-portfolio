import { useEffect, useState, useRef } from "react";
import AdminDashboard from "./AdminDashboard";
import {
  checkAdminStatus,
  checkAuthProfile,
  getCsrfToken,
  logoutUser,
} from "./auth/authService";
import Services from "./components/services";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import AuthPage from "./auth/AuthPage";
import { trackPageView } from "./services/analyticsService";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Restore dashboard state after page refresh
  const [showAdminDashboard, setShowAdminDashboard] = useState(
    () => sessionStorage.getItem("admin-dashboard-open") === "true",
  );

  const [showAuthPage, setShowAuthPage] = useState(false);

  const hasTrackedPageView = useRef(false);

  const [analyticsConsent, setAnalyticsConsent] = useState(() => {
    return localStorage.getItem("analytics-consent");
  });

  // Visitor Analytics
  useEffect(() => {
    if (analyticsConsent === "accepted" && !hasTrackedPageView.current) {
      hasTrackedPageView.current = true;

      trackPageView().then((success) => {
        if (!success) {
          hasTrackedPageView.current = false;
        }
      });
    }
  }, [analyticsConsent]);

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await checkAuthProfile();

        if (response.ok) {
          setIsLoggedIn(true);

          const adminResponse = await checkAdminStatus();
          const adminAuthenticated = adminResponse.ok;

          setIsAdmin(adminAuthenticated);

          // Restore dashboard only if the session is still an admin session
          if (adminAuthenticated) {
            setShowAdminDashboard(
              sessionStorage.getItem("admin-dashboard-open") === "true",
            );
          } else {
            setShowAdminDashboard(false);
            sessionStorage.removeItem("admin-dashboard-open");
          }
        } else {
          setIsLoggedIn(false);
          setIsAdmin(false);
          setShowAdminDashboard(false);
          sessionStorage.removeItem("admin-dashboard-open");
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsLoggedIn(false);
        setIsAdmin(false);
        setShowAdminDashboard(false);
        sessionStorage.removeItem("admin-dashboard-open");
      }
    };

    checkAuth();
  }, []);

  // Repeatable Scroll Reveal Observer
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
  }, [showAdminDashboard, showAuthPage]);

  // Logout
  const handleLogout = async () => {
    try {
      const csrfResponse = await getCsrfToken();

      if (!csrfResponse.ok) {
        console.error("CSRF fetch failed:", csrfResponse.status);
        return;
      }

      const csrfData = await csrfResponse.json();
      const response = await logoutUser(csrfData.csrf_token);

      if (!response.ok) {
        console.error("Logout failed:", response.status);
        return;
      }

      setIsLoggedIn(false);
      setIsAdmin(false);
      setShowAdminDashboard(false);

      sessionStorage.removeItem("admin-dashboard-open");

      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Login success callback
  const handleLoginSuccess = ({ isAdmin: adminStatus }) => {
    setIsLoggedIn(true);
    setIsAdmin(adminStatus);
    setShowAuthPage(false);
  };

  // Open Admin Dashboard
  const handleOpenAdminDashboard = () => {
    sessionStorage.setItem("admin-dashboard-open", "true");
    setShowAdminDashboard(true);
  };

  // Back to Portfolio
  const handleBackToPortfolio = () => {
    sessionStorage.removeItem("admin-dashboard-open");
    setShowAdminDashboard(false);
  };

  if (showAuthPage) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setShowAuthPage(false)}
          style={{
            position: "fixed",
            top: "20px",
            right: "25px",
            zIndex: 9999,
            padding: "10px 18px",
            cursor: "pointer",
          }}>
          ← Back to Portfolio{" "}
        </button>

        <AuthPage onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  // Admin Dashboard
  if (isAdmin && showAdminDashboard) {
    return <AdminDashboard onBackToPortfolio={handleBackToPortfolio} />;
  }

  // Public Portfolio
  return (
    <div className="portfolio-shell">
      <Navbar
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        onOpenAdminDashboard={handleOpenAdminDashboard}
        onLogout={handleLogout}
        onOpenAuth={() => setShowAuthPage(true)}
      />

      <Hero />
      <About />
      <Services />
      <Projects />
      <Contact />
      <Footer />

      {analyticsConsent === null && (
        <div className="analytics-consent-banner">
          <div>
            <strong>Privacy & Analytics</strong>
            <p>
              We use anonymous analytics to understand website visits and
              improve your experience. No personal identity is collected.
            </p>
          </div>

          <div className="analytics-consent-actions">
            <button
              onClick={() => {
                localStorage.setItem("analytics-consent", "accepted");
                setAnalyticsConsent("accepted");
              }}>
              Accept
            </button>

            <button
              onClick={() => {
                localStorage.setItem("analytics-consent", "declined");
                setAnalyticsConsent("declined");
              }}>
              Decline
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
