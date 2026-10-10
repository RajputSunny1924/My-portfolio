import { useEffect, useState } from "react";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/admin/dashboard-stats",
          {
            method: "GET",
            credentials: "include",
          },
        );

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error("Admin access denied. Please login as admin.");
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

  const cards = stats
    ? [
        { title: "Total Users", value: stats.total_users },
        { title: "Verified Users", value: stats.verified_users },
        { title: "Unverified Users", value: stats.unverified_users },
        { title: "Admin Users", value: stats.admin_users },
      ]
    : [];

  return (
    <div className="admin-dashboard">
      {" "}
      <h1>Admin Dashboard</h1>{" "}
      <p className="admin-subtitle">Website overview and user statistics</p>
      {loading && <p>Loading dashboard...</p>}
      {error && <p className="admin-error">{error}</p>}
      {stats && !loading && (
        <div className="admin-stats-grid">
          {cards.map((card) => (
            <div className="admin-stat-card" key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
