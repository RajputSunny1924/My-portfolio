import { useState } from "react";

function Navbar({ isAdmin, onOpenAdminDashboard, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

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
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenAdminDashboard) {
                      onOpenAdminDashboard();
                    }
                    setMenuOpen(false);
                  }}>
                  ⚙️ Admin Dashboard
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  if (onLogout) {
                    onLogout();
                  }
                }}>
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
