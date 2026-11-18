import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="main-navbar" aria-label="Main navigation">
      <Link
        to="/"
        className="navbar-brand"
        aria-label="Sunny Singh Rajput homepage"
        onClick={closeMenu}>
        <h2>My Portfolio</h2>
      </Link>

      <button
        type="button"
        className={`navbar-toggle ${menuOpen ? "active" : ""}`}
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        onClick={() => setMenuOpen(!menuOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div
        id="primary-navigation"
        className={`nav-links ${menuOpen ? "is-open" : ""}`}>
        <Link to="/#home" onClick={closeMenu}>
          Home
        </Link>
        <Link to="/#about" onClick={closeMenu}>
          About
        </Link>
        <Link to="/#projects" onClick={closeMenu}>
          Projects
        </Link>

        <Link to="/offers" className="offers-nav-link" onClick={closeMenu}>
          Offers <span>NEW</span>
        </Link>

        <NavLink to="/pricing" onClick={closeMenu}>
          Pricing
        </NavLink>
        <NavLink to="/terms" onClick={closeMenu}>
          Terms
        </NavLink>
        <Link to="/#contact" onClick={closeMenu}>
          Contact
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
