import { useEffect, useState } from "react";
import { API_BASE } from "../services/api";

function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const loadReviews = async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams({
        status,
        search,
        page: String(page),
        limit: "20",
      });

      const response = await fetch(`${API_BASE}/admin/feedback?${params}`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Unable to load reviews.");
      }

      const data = await response.json();

      setReviews(data.reviews || []);
      setPagination(data.pagination || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadReviews();
    }, 400);

    return () => clearTimeout(timer);
  }, [status, search, page]);

  const getCsrfToken = async () => {
    const response = await fetch(`${API_BASE}/csrf`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Unable to verify admin request.");
    }

    const data = await response.json();
    return data.csrf_token;
  };

  const updateStatus = async (review) => {
    const nextStatus = review.status === "hidden" ? "published" : "hidden";

    if (
      !window.confirm(
        nextStatus === "hidden"
          ? "Hide this review from the public website?"
          : "Publish this review again?",
      )
    )
      return;

    try {
      const csrfToken = await getCsrfToken();

      const response = await fetch(
        `${API_BASE}/admin/feedback/${review.id}/status`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
          },
          body: JSON.stringify({ status: nextStatus }),
        },
      );

     if (!response.ok) {
       const data = await response.json().catch(() => ({}));
       throw new Error(data.detail || "Unable to delete review.");
     }

      await loadReviews();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteReview = async (review) => {
    if (!window.confirm("Permanently delete this review?")) return;

    try {
      const csrfToken = await getCsrfToken();

      const response = await fetch(`${API_BASE}/admin/feedback/${review.id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "X-CSRF-Token": csrfToken,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Unable to delete review.");
      }

      await loadReviews();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="admin-management admin-reviews-page">
      <div className="admin-management-header">
        <div>
          <h3>Reviews & Comments</h3>
          <p>Manage public visitor feedback.</p>
        </div>

        <span>Total: {pagination?.total ?? 0}</span>
      </div>

      <div className="admin-review-controls">
        <input
          type="search"
          placeholder="Search reviews..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}>
          <option value="all">All reviews</option>
          <option value="published">Published</option>
          <option value="hidden">Hidden</option>
          <option value="legacy">Legacy pending/rejected</option>
        </select>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {loading ? (
        <p className="admin-message">Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="admin-message">No reviews found.</p>
      ) : (
        <div className="admin-review-list">
          {reviews.map((review) => (
            <article className="admin-review-item" key={review.id}>
              <div className="admin-review-item-top">
                <div>
                  <strong>Visitor</strong>
                  <span className="review-stars">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                </div>

                <span className={`admin-review-status ${review.status}`}>
                  {review.status}
                </span>
              </div>

              <p>{review.message}</p>

              <time>{new Date(review.created_at).toLocaleString("en-IN")}</time>

              <div className="admin-review-actions">
                {review.status !== "pending" &&
                  review.status !== "rejected" && (
                    <button type="button" onClick={() => updateStatus(review)}>
                      {review.status === "hidden" ? "Unhide" : "Hide"}
                    </button>
                  )}

                <button
                  type="button"
                  className="danger"
                  onClick={() => deleteReview(review)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {pagination?.total_pages > 1 && (
        <div className="admin-pagination">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => p - 1)}>
            Previous
          </button>

          <span>
            Page {pagination.page} of {pagination.total_pages}
          </span>

          <button
            type="button"
            disabled={page >= pagination.total_pages || loading}
            onClick={() => setPage((p) => p + 1)}>
            Next
          </button>
        </div>
      )}
    </section>
  );
}

export default AdminReviews;
