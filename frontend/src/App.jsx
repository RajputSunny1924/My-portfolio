import { useEffect, useState } from "react";
import AdminDashboard from "./AdminDashboard";
import AuthPage from "./auth/AuthPage";
import {
  checkAdminStatus,
  checkAuthProfile,
  getCsrfToken,
  logoutUser,
} from "./auth/authService";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";

function App() {
  // -------------------------
  // Authentication & App states
  // -------------------------
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  // -------------------------
  // Check authentication
  // -------------------------
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await checkAuthProfile();

        if (response.ok) {
          setIsLoggedIn(true);

          const adminResponse = await checkAdminStatus();
          setIsAdmin(adminResponse.ok);
        } else {
          setIsLoggedIn(false);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsLoggedIn(false);
        setIsAdmin(false);
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  // -------------------------
  // Scroll reveal observer
  // -------------------------
  useEffect(() => {
    if (!isLoggedIn) return undefined;

    const revealItems = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -42px" },
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [isLoggedIn]);

  // -------------------------
  // Logout
  // -------------------------
  const handleLogout = async () => {
    try {
      // Get CSRF token from backend
      const csrfResponse = await getCsrfToken();

      if (!csrfResponse.ok) {
        console.error("CSRF fetch failed:", csrfResponse.status);
        return;
      }

      const csrfData = await csrfResponse.json();

      // Logout request
      const response = await logoutUser(csrfData.csrf_token);

      if (!response.ok) {
        console.error("Logout failed:", response.status);
        return;
      }

      setIsLoggedIn(false);
      setIsAdmin(false);
      setShowAdminDashboard(false);

      console.log("Logout successful");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleLoginSuccess = ({ isAdmin: adminStatus }) => {
    setIsLoggedIn(true);
    setIsAdmin(adminStatus);
  };

  // -------------------------
  // Loading screen
  // -------------------------
  if (checkingAuth) {
    return (
      <div className="auth-loader">
        <div className="loader-spinner"></div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  // -------------------------
  // Admin dashboard view
  // -------------------------
  if (isAdmin && showAdminDashboard) {
    return (
      <AdminDashboard onBackToPortfolio={() => setShowAdminDashboard(false)} />
    );
  }

  // -------------------------
  // Login / Register screen
  // -------------------------
  if (!isLoggedIn) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  // -------------------------
  // Home page
  // -------------------------
  return (
    <div className="portfolio-shell">
      <Navbar
        isAdmin={isAdmin}
        onOpenAdminDashboard={() => setShowAdminDashboard(true)}
        onLogout={handleLogout}
      />
      <Hero />
      <About />
      <Projects />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
