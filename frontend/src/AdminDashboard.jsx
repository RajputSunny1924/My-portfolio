import { useEffect, useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`${API_BASE}/admin/dashboard-stats`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error("Admin access denied. Please login again.");
          }

          throw new Error("Failed to load dashboard statistics.");
        }

        setStats(await response.json());
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    setError("");

    try {
      const csrfResponse = await fetch(`${API_BASE}/csrf`, {
        method: "GET",
        credentials: "include",
      });

      if (!csrfResponse.ok) {
        throw new Error("Unable to get CSRF token.");
      }

      const csrfData = await csrfResponse.json();

      const logoutResponse = await fetch(`${API_BASE}/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "X-CSRF-Token": csrfData.csrf_token,
        },
      });

      if (!logoutResponse.ok) {
        throw new Error("Logout failed. Please try again.");
      }

      // Reset the application authentication state.
      window.location.reload();
    } catch (err) {
      setError(err.message || "Logout failed.");
      setLoggingOut(false);
    }
  };

  const cards = stats
    ? [
        {
          title: "Total Users",
          value: stats.total_users,
          icon: "👥",
          description: "Registered accounts",
        },
        {
          title: "Verified Users",
          value: stats.verified_users,
          icon: "✓",
          description: "Verified accounts",
        },
        {
          title: "Unverified Users",
          value: stats.unverified_users,
          icon: "◷",
          description: "Awaiting verification",
        },
        {
          title: "Admin Users",
          value: stats.admin_users,
          icon: "⚙",
          description: "Privileged accounts",
        },
      ]
    : [];

  return (
    <main className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-brand">
          <div className="admin-brand-icon">A</div>

          <div>
            <h1>Admin Dashboard</h1>
            <p>Portfolio Management</p>
          </div>
        </div>

        <button
          className="admin-logout-btn"
          onClick={handleLogout}
          disabled={loggingOut}>
          {loggingOut ? "Logging out..." : "Logout ↗"}
        </button>
      </header>

      <section className="admin-content">
        <div className="admin-page-heading">
          <div>
            <p className="admin-eyebrow">OVERVIEW</p>
            <h2>Dashboard</h2>
            <p className="admin-subtitle">
              Monitor your website users and account activity.
            </p>
          </div>

          <span className="admin-status-badge">
            <span className="admin-status-dot"></span>
            System Overview
          </span>
        </div>

        {loading && <p className="admin-message">Loading dashboard...</p>}

        {error && (
          <div className="admin-error" role="alert">
            {error}
          </div>
        )}

        {stats && !loading && (
          <>
            <div className="admin-stats-grid">
              {cards.map((card) => (
                <article className="admin-stat-card" key={card.title}>
                  <div className="admin-card-top">
                    <span className="admin-card-title">{card.title}</span>

                    <span className="admin-card-icon">{card.icon}</span>
                  </div>

                  <h3 className="admin-card-value">{card.value}</h3>

                  <p className="admin-card-description">{card.description}</p>
                </article>
              ))}
            </div>

            <section className="admin-management-placeholder">
              <div>
                <h3>User Management</h3>
                <p>Manage registered accounts and verification status.</p>
              </div>

              <span className="admin-coming-soon">Coming next</span>
            </section>

            <footer className="admin-footer">
              <span>ADMIN CONSOLE</span>
              <span>Portfolio Management System</span>
            </footer>
          </>
        )}
      </section>
    </main>
  );
}

export default AdminDashboard;
