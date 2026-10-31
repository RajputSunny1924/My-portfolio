import { useState } from "react";

function Navbar({
  isLoggedIn,
  isAdmin,
  onOpenAdminDashboard,
  onOpenAuth,
  onLogout,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleAuthClick = () => {
    setMenuOpen(false);

    if (onOpenAuth) {
      onOpenAuth();
    }
  };

  return (
    <nav>
      <h2>My Portfolio</h2>

      <div className="nav-links">
        <a href="#home">Home</a>
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
        <a href="#contact">Contact</a>

        <div className="menu-container">
          <button
            type="button"
            className="menu-toggle"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Open account menu"
            aria-expanded={menuOpen}>
            ⋮
          </button>

          {menuOpen && (
            <div className="dropdown-menu">
              {!isLoggedIn && (
                <>
                  <button type="button" onClick={handleAuthClick}>
                    Login / Register
                  </button>
                </>
              )}

              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    onOpenAdminDashboard?.();
                    setMenuOpen(false);
                  }}>
                  ⚙️ Admin Dashboard
                </button>
              )}

              {isLoggedIn && (
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onLogout?.();
                  }}>
                  🚪 Logout
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
