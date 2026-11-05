import { useEffect, useState } from "react";
import { API_BASE } from "./services/api";
import AdminReviews from "./components/AdminReviews";

const MENU_ITEMS = [
  { id: "overview", label: "Overview", icon: "◫" },
  { id: "analytics", label: "Visitor Analytics", icon: "◷" },
  { id: "users", label: "User Management", icon: "♙" },
  { id: "reviews", label: "Reviews & Comments", icon: "☆" },
];

function AdminDashboard({ onBackToPortfolio }) {
  const [activePage, setActivePage] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  // Dashboard stats
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Visitor analytics
  const [visitorAnalytics, setVisitorAnalytics] = useState(null);
  const [popularPages, setPopularPages] = useState([]);
  const [recentVisits, setRecentVisits] = useState([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState("");

  // User management
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const limit = 10;

  // Dashboard statistics: fetch only when Overview is opened
  useEffect(() => {
    if (activePage !== "overview" || stats !== null) return;

    let cancelled = false;

    const fetchStats = async () => {
      setLoading(true);
      setError("");

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

        if (!cancelled) setStats(data);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchStats();

    return () => {
      cancelled = true;
    };
  }, [activePage, stats]);

  // Visitor analytics: fetch only when Analytics is opened
  useEffect(() => {
    if (activePage !== "analytics" || visitorAnalytics !== null) return;

    let cancelled = false;

    const fetchVisitorAnalytics = async () => {
      setAnalyticsLoading(true);
      setAnalyticsError("");

      try {
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

        const [overviewData, pagesData, visitsData] = await Promise.all([
          overviewResponse.json(),
          pagesResponse.json(),
          visitsResponse.json(),
        ]);

        if (!cancelled) {
          setVisitorAnalytics(overviewData);
          setPopularPages(pagesData.popular_pages || []);
          setRecentVisits(visitsData.visits || []);
        }
      } catch (err) {
        if (!cancelled) {
          setAnalyticsError(err.message || "Unable to load visitor analytics.");
        }
      } finally {
        if (!cancelled) setAnalyticsLoading(false);
      }
    };

    fetchVisitorAnalytics();

    return () => {
      cancelled = true;
    };
  }, [activePage, visitorAnalytics]);

  // Users: fetch only when User Management is opened
  useEffect(() => {
    if (activePage !== "users") return;

    let cancelled = false;

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

        if (!cancelled) {
          setUsers(data.users || []);
          setPagination(data.pagination || null);
        }
      } catch (err) {
        if (!cancelled) {
          setUsersError(err.message || "Something went wrong.");
        }
      } finally {
        if (!cancelled) setUsersLoading(false);
      }
    };

    fetchUsers();

    return () => {
      cancelled = true;
    };
  }, [activePage, search, page]);

  // Logout
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

  const dashboardCards = stats
    ? [
        {
          title: "Total Users",
          value: stats.total_users,
          icon: "♙",
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

  const currentPage = MENU_ITEMS.find((item) => item.id === activePage);

  const navigateTo = (pageId) => {
    setActivePage(pageId);
    setSidebarOpen(false);
    setMenuOpen(false);
  };

  return (
    <main className="admin-dashboard admin-layout">
      {/* HEADER */}
      <header className="admin-header">
        <div className="admin-brand">
          <button
            type="button"
            className="admin-sidebar-toggle"
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label="Toggle sidebar"
            aria-expanded={sidebarOpen}>
            ☰
          </button>

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
                Back to Portfolio
              </button>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}>
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          )}
        </div>
      </header>

      {/* DASHBOARD BODY */}
      <div className="admin-body">
        {/* SIDEBAR */}
        <aside className={`admin-sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
          <div className="admin-sidebar-heading">MAIN MENU</div>

          <nav className="admin-sidebar-nav" aria-label="Admin navigation">
            {MENU_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`admin-sidebar-item ${
                  activePage === item.id ? "active" : ""
                }`}
                onClick={() => navigateTo(item.id)}
                aria-current={activePage === item.id ? "page" : undefined}>
                <span className="admin-sidebar-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="admin-sidebar-bottom">
            <button type="button" onClick={handleLogout} disabled={loggingOut}>
              <span className="admin-sidebar-icon">↪</span>
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <section className="admin-main-content">
          <div className="admin-page-heading">
            <div>
              <p className="admin-eyebrow">ADMIN CONSOLE</p>
              <h2>{currentPage?.label || "Overview"}</h2>
              <p className="admin-subtitle">
                {activePage === "overview" &&
                  "Monitor your website account activity."}
                {activePage === "analytics" &&
                  "Track your portfolio website traffic and visitors."}
                {activePage === "users" &&
                  "Manage registered accounts and verification status."}
                {activePage === "reviews" &&
                  "Manage visitor reviews and public feedback."}
              </p>
            </div>
          </div>

          {/* OVERVIEW PAGE */}
          {activePage === "overview" && (
            <section className="admin-page-section">
              {error && (
                <div className="admin-error" role="alert">
                  {error}
                </div>
              )}

              {loading && <p className="admin-message">Loading dashboard...</p>}

              {!loading && stats && (
                <>
                  <div className="admin-section-heading">
                    <div>
                      <h3>Account Overview</h3>
                      <p>Summary of registered accounts.</p>
                    </div>
                  </div>

                  <div className="admin-stats-grid">
                    {dashboardCards.map((card) => (
                      <article className="admin-stat-card" key={card.title}>
                        <div className="admin-card-top">
                          <span className="admin-card-title">{card.title}</span>
                          <span className="admin-card-icon">{card.icon}</span>
                        </div>

                        <h3 className="admin-card-value">{card.value ?? 0}</h3>

                        <p className="admin-card-description">
                          {card.description}
                        </p>
                      </article>
                    ))}
                  </div>
                </>
              )}
            </section>
          )}

          {/* VISITOR ANALYTICS PAGE */}
          {activePage === "analytics" && (
            <section className="admin-page-section">
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

                  <div className="admin-data-section">
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
                      <p className="admin-message">
                        No page visits recorded yet.
                      </p>
                    )}
                  </div>

                  <div className="admin-data-section">
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
                                    ? new Date(
                                        visit.visited_at,
                                      ).toLocaleString()
                                    : "N/A"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="admin-message">
                        No recent visits available.
                      </p>
                    )}
                  </div>
                </>
              )}
            </section>
          )}

          {/* USER MANAGEMENT PAGE */}
          {activePage === "users" && (
            <section className="admin-page-section">
              <div className="admin-section-heading">
                <div>
                  <h3>Registered Users</h3>
                  <p>View and manage registered accounts.</p>
                </div>

                <span>Total Users: {pagination?.total ?? 0}</span>
              </div>

              <input
                type="search"
                className="admin-search-input"
                placeholder="Search by name or email..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
              />

              {usersLoading && (
                <p className="admin-message">Loading users...</p>
              )}

              {usersError && (
                <div className="admin-error" role="alert">
                  {usersError}
                </div>
              )}

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

              {pagination && pagination.total_pages > 1 && (
                <div className="admin-pagination">
                  <button
                    type="button"
                    onClick={() => setPage((previousPage) => previousPage - 1)}
                    disabled={page === 1 || usersLoading}>
                    Previous
                  </button>

                  <span>
                    Page {pagination.page} of {pagination.total_pages}
                  </span>

                  <button
                    type="button"
                    onClick={() => setPage((previousPage) => previousPage + 1)}
                    disabled={page === pagination.total_pages || usersLoading}>
                    Next
                  </button>
                </div>
              )}
            </section>
          )}

          {/* REVIEWS PAGE */}
          {activePage === "reviews" && (
            <section className="admin-page-section">
              <AdminReviews />
            </section>
          )}

          <footer className="admin-footer">
            <span>ADMIN CONSOLE</span>
            <span>Portfolio Management System</span>
          </footer>
        </section>
      </div>
    </main>
  );
}

export default AdminDashboard;
