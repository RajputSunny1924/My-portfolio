import { useEffect, useState } from "react";
import { API_BASE } from "./services/api";

function AdminDashboard({ onBackToPortfolio }) {
  // UI States
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Dashboard Stats
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Visitor Analytics
  const [visitorAnalytics, setVisitorAnalytics] = useState(null);
  const [popularPages, setPopularPages] = useState([]);
  const [recentVisits, setRecentVisits] = useState([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [analyticsError, setAnalyticsError] = useState("");

  // User Management
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const limit = 10;

  // 1. Fetch Dashboard Stats
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

        const data = await response.json();
        setStats(data);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // 2. Fetch Visitor Analytics
  useEffect(() => {
    const fetchVisitorAnalytics = async () => {
      try {
        setAnalyticsLoading(true);
        setAnalyticsError("");

        const [overviewResponse, pagesResponse, visitsResponse] =
          await Promise.all([
            fetch(`${API_BASE}/admin/analytics/overview`, {
              method: "GET",
              credentials: "include",
            }),

            fetch(`${API_BASE}/admin/analytics/popular-pages`, {
              method: "GET",
              credentials: "include",
            }),

            fetch(`${API_BASE}/admin/analytics/recent-visits`, {
              method: "GET",
              credentials: "include",
            }),
          ]);

        if (!overviewResponse.ok || !pagesResponse.ok || !visitsResponse.ok) {
          throw new Error("Failed to load visitor analytics.");
        }

        const overviewData = await overviewResponse.json();
        const pagesData = await pagesResponse.json();
        const visitsData = await visitsResponse.json();

        setVisitorAnalytics(overviewData);
        setPopularPages(pagesData.popular_pages || []);
        setRecentVisits(visitsData.visits || []);
      } catch (err) {
        setAnalyticsError(err.message || "Unable to load visitor analytics.");
      } finally {
        setAnalyticsLoading(false);
      }
    };

    fetchVisitorAnalytics();
  }, []);

  // 3. Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        setUsersError("");

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

        setUsers(data.users || []);
        setPagination(data.pagination || null);
      } catch (err) {
        setUsersError(err.message || "Something went wrong.");
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, [search, page]);

  // 4. Logout
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

      window.location.reload();
    } catch (err) {
      setError(err.message || "Logout failed.");
      setLoggingOut(false);
    }
  };

  // 5. Dashboard Cards
  const dashboardCards = stats
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

  // 6. Analytics Cards
  const analyticsCards = visitorAnalytics
    ? [
        ["Total Page Views", visitorAnalytics.total_page_views],
        ["Unique Visitors", visitorAnalytics.unique_visitors],
        ["Total Sessions", visitorAnalytics.total_sessions],
        ["Today's Page Views", visitorAnalytics.today_page_views],
        ["Today's Visitors", visitorAnalytics.today_visitors],
        ["Returning Visitors", visitorAnalytics.returning_visitors],
      ]
    : [];

  return (
    <main className="admin-dashboard">
      {/* HEADER */}
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
        {/* PAGE HEADING */}
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

        {/* GENERAL ERROR */}
        {error && (
          <div className="admin-error" role="alert">
            {error}
          </div>
        )}

        {/* DASHBOARD OVERVIEW */}
        <section className="admin-management">
          <div className="admin-management-header">
            <div>
              <h3>Account Overview</h3>
              <p>Summary of registered accounts.</p>
            </div>
          </div>

          {loading && <p className="admin-message">Loading dashboard...</p>}

          {!loading && !error && stats && (
            <div className="admin-stats-grid">
              {dashboardCards.map((card) => (
                <article className="admin-stat-card" key={card.title}>
                  <div className="admin-card-top">
                    <span className="admin-card-title">{card.title}</span>

                    <span className="admin-card-icon">{card.icon}</span>
                  </div>

                  <h3 className="admin-card-value">{card.value ?? 0}</h3>

                  <p className="admin-card-description">{card.description}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* VISITOR ANALYTICS */}
        <section className="admin-management">
          <div className="admin-management-header">
            <div>
              <h3>Visitor Analytics</h3>
              <p>Track your portfolio website traffic and visitor activity.</p>
            </div>
          </div>

          {analyticsLoading && (
            <p className="admin-message">Loading visitor analytics...</p>
          )}

          {analyticsError && (
            <div className="admin-error" role="alert">
              {analyticsError}
            </div>
          )}

          {!analyticsLoading && visitorAnalytics && (
            <>
              {/* ANALYTICS CARDS */}
              <div className="admin-stats-grid">
                {analyticsCards.map(([title, value]) => (
                  <article className="admin-stat-card" key={title}>
                    <div className="admin-card-top">
                      <span className="admin-card-title">{title}</span>
                    </div>

                    <h3 className="admin-card-value">{value ?? 0}</h3>
                  </article>
                ))}
              </div>

              {/* POPULAR PAGES */}
              <h3>Popular Pages</h3>

              {popularPages.length > 0 ? (
                <div className="admin-table-wrapper">
                  <table className="admin-users-table">
                    <thead>
                      <tr>
                        <th>Page</th>
                        <th>Total Views</th>
                      </tr>
                    </thead>

                    <tbody>
                      {popularPages.map((item) => (
                        <tr key={item.page}>
                          <td>{item.page}</td>
                          <td>{item.views}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No page visits recorded yet.</p>
              )}

              {/* RECENT VISITS */}
              <h3>Recent Visitor Activity</h3>

              {recentVisits.length > 0 ? (
                <div className="admin-table-wrapper">
                  <table className="admin-users-table">
                    <thead>
                      <tr>
                        <th>Visitor ID</th>
                        <th>Page</th>
                        <th>Session ID</th>
                        <th>Visited At</th>
                      </tr>
                    </thead>

                    <tbody>
                      {recentVisits.map((visit, index) => (
                        <tr
                          key={`${visit.visitor}-${visit.visited_at}-${index}`}>
                          <td>{visit.visitor}</td>
                          <td>{visit.page}</td>
                          <td>{visit.session}</td>
                          <td>
                            {visit.visited_at
                              ? new Date(visit.visited_at).toLocaleString()
                              : "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No recent visits available.</p>
              )}
            </>
          )}
        </section>

        {/* USER MANAGEMENT */}
        <section className="admin-management">
          <div className="admin-management-header">
            <div>
              <h3>User Management</h3>
              <p>Manage registered accounts and verification status.</p>
            </div>

            <span>Total Users: {pagination?.total ?? 0}</span>
          </div>

          {/* SEARCH */}
          <input
            type="search"
            placeholder="Search by name or email..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
          />

          {/* LOADING AND ERRORS */}
          {usersLoading && <p className="admin-message">Loading users...</p>}

          {usersError && (
            <div className="admin-error" role="alert">
              {usersError}
            </div>
          )}

          {/* USERS TABLE */}
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
                              user.is_verified ? "is-verified" : "is-unverified"
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

          {/* PAGINATION */}
          {pagination && pagination.total_pages > 1 && (
            <div className="admin-pagination">
              <button
                type="button"
                onClick={() => setPage((previousPage) => previousPage - 1)}
                disabled={page === 1 || usersLoading}>
                ← Previous
              </button>

              <span>
                Page {pagination.page} of {pagination.total_pages}
              </span>

              <button
                type="button"
                onClick={() => setPage((previousPage) => previousPage + 1)}
                disabled={page === pagination.total_pages || usersLoading}>
                Next →
              </button>
            </div>
          )}
        </section>

        {/* FOOTER */}
        <footer className="admin-footer">
          <span>ADMIN CONSOLE</span>
          <span>Portfolio Management System</span>
        </footer>
      </section>
    </main>
  );
}

export default AdminDashboard;
