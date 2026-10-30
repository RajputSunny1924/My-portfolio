import { useEffect, useState } from "react";
import { API_BASE } from "./services/api";

function AdminDashboard({ onBackToPortfolio }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [loggingOut, setLoggingOut] = useState(false);

  // User Management States
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const limit = 10;

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

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      setUsersLoading(true);
      setUsersError("");

      try {
        const params = new URLSearchParams({
          search: search.trim(),
          page: String(page),
          limit: String(limit),
        });

        const response = await fetch(
          `${API_BASE}/admin/users?${params.toString()}`,
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error("Admin access denied. Please login again.");
          }

          throw new Error("Failed to load users.");
        }

        const data = await response.json();

        setUsers(data.users);
        setPagination(data.pagination);
      } catch (err) {
        setUsersError(err.message || "Something went wrong.");
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, [search, page]);

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
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onBackToPortfolio();
                }}>
                🏠 Back to Portfolio
              </button>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}>
                🚪 {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          )}
        </div>
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

            <section className="admin-management">
              <div className="admin-management-header">
                <div>
                  <h3>User Management</h3>
                  <p>Manage registered accounts and verification status.</p>
                </div>

                <span>Total Users: {pagination?.total ?? 0}</span>
              </div>

              {/* Search Box */}
              <input
                type="search"
                placeholder="Search by name or email..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
              />

              {/* Loading and Error */}
              {usersLoading && <p>Loading users...</p>}

              {usersError && <p role="alert">{usersError}</p>}

              {/* Users Table */}
              {!usersLoading && !usersError && (
                <div className="admin-table-wrapper">
                  <table className="admin-users-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Verification</th>
                        <th>Role</th>
                      </tr>
                    </thead>

                    <tbody>
                      {users.length > 0 ? (
                        users.map((user) => (
                          <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>

                            <td>
                              <span
                                className={`admin-user-badge ${
                                  user.is_verified
                                    ? "is-verified"
                                    : "is-unverified"
                                }`}>
                                {user.is_verified ? "Verified" : "Unverified"}
                              </span>
                            </td>

                            <td>
                              <span
                                className={`admin-user-badge ${
                                  user.is_admin ? "is-admin" : "is-user"
                                }`}>
                                {user.is_admin ? "Admin" : "User"}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5">No users found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
              {/* Pagination */}
              {pagination && pagination.total_pages > 1 && (
                <div className="admin-pagination">
                  <button
                    onClick={() => setPage((previousPage) => previousPage - 1)}
                    disabled={page === 1 || usersLoading}>
                    ← Previous
                  </button>

                  <span>
                    Page {pagination.page} of {pagination.total_pages}
                  </span>

                  <button
                    onClick={() => setPage((previousPage) => previousPage + 1)}
                    disabled={page === pagination.total_pages || usersLoading}>
                    Next →
                  </button>
                </div>
              )}
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
