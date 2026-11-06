import { useEffect, useState } from "react";
import { API_BASE } from "../services/api";

const emptyForm = {
  rating: 0,
  message: "",
  website: "",
};

function PortfolioInsights() {
  const [reviews, setReviews] = useState([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [averageRating, setAverageRating] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [hoverRating, setHoverRating] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [editToken, setEditToken] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState("");

  const loadReviews = async () => {
    try {
      const response = await fetch(`${API_BASE}/feedback/public`, {
        cache: "no-store",
      });

      if (!response.ok) throw new Error("Unable to load reviews.");

      const data = await response.json();

      setReviews(data.reviews || []);
      setReviewCount(data.total_reviews || 0);
      setAverageRating(data.average_rating);
    } catch (error) {
      console.error("Review loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleEdit = (review) => {
    const savedToken = localStorage.getItem(
      `portfolio-review-token-${review.id}`,
    );

    if (!savedToken) {
      setNotice("Edit access is unavailable on this browser.");
      return;
    }

    setEditingId(review.id);
    setEditToken(savedToken);

    setForm({
      rating: review.rating,
      message: review.message,
      website: "",
    });

    setNotice("Editing your review.");

    document
      .querySelector(".visitor-review-form")
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditToken("");
    setForm(emptyForm);
    setHoverRating(0);
    setNotice("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.rating < 1 || form.rating > 5) {
      setNotice("Please select your star rating.");
      return;
    }

    if (form.message.trim().length < 10) {
      setNotice("Please write at least 10 characters.");
      return;
    }

    setSubmitting(true);
    setNotice("");

    try {
      const isEditing = Boolean(editingId);

      const payload = isEditing
        ? {
            edit_token: editToken,
            rating: form.rating,
            message: form.message.trim(),
            name: null,
            service_category: null,
          }
        : {
            rating: form.rating,
            message: form.message.trim(),
            website: form.website,
          };

      const response = await fetch(
        isEditing
          ? `${API_BASE}/feedback/${editingId}`
          : `${API_BASE}/feedback`,
        {
          method: isEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Unable to save review.");
      }

      setForm(emptyForm);
      setEditingId(null);
      setEditToken("");
      setHoverRating(0);

      setNotice(
        isEditing
          ? "Your review has been updated."
          : "Thank you! Your review is published.",
      );

      await loadReviews();
    } catch (error) {
      setNotice(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="portfolio-insights" id="visitor-reviews">
      <div className="insights-container">
        <div className="reviews-heading">
          <span className="section-eyebrow">VISITOR REVIEWS</span>
          <h2>Words from visitors.</h2>
          <p>Share your experience exploring my work.</p>

          {reviewCount > 0 && (
            <div className="review-summary">
              <strong>{averageRating ?? "—"}/5</strong>
              <span>
                {reviewCount} published{" "}
                {reviewCount === 1 ? "review" : "reviews"}
              </span>
            </div>
          )}
        </div>

        {loading ? (
          <p className="reviews-loading">Loading reviews...</p>
        ) : reviews.length > 0 ? (
          <div className="public-reviews">
            {reviews.map((review) => (
              <article className="public-review" key={review.id}>
                <div className="review-top">
                  <strong>{review.name || "Visitor"}</strong>

                  <span
                    className="review-stars"
                    aria-label={`${review.rating} out of 5 stars`}>
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                </div>

                {review.service_category && (
                  <span className="review-category">
                    {review.service_category}
                  </span>
                )}

                <p>{review.message}</p>

                <div className="review-bottom">
                  <time>
                    {new Date(
                      review.updated_at || review.created_at,
                    ).toLocaleDateString("en-IN")}
                    {review.updated_at ? " · Edited" : ""}
                  </time>

                  {localStorage.getItem(
                    `portfolio-review-token-${review.id}`,
                  ) && (
                    <button
                      type="button"
                      className="review-edit-button"
                      onClick={() => handleEdit(review)}>
                      Edit review
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="reviews-empty">
            No reviews yet. Be the first to share your experience.
          </p>
        )}

        <form className="visitor-review-form" onSubmit={handleSubmit}>
          <h3>{editingId ? "Edit your review" : "Leave a review"}</h3>
          <p className="review-form-subtitle">
            Select your rating and share your experience.
          </p>

          <label>Your rating</label>

          <div
            className="interactive-review-stars"
            onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                aria-label={`${star} star rating`}
                aria-pressed={form.rating === star}
                className={star <= (hoverRating || form.rating) ? "active" : ""}
                onMouseEnter={() => setHoverRating(star)}
                onFocus={() => setHoverRating(star)}
                onBlur={() => setHoverRating(0)}
                onClick={() => {
                  setForm({ ...form, rating: star });
                  setHoverRating(0);
                }}>
                ★
              </button>
            ))}
            <span className="rating-value">
              {form.rating > 0 ? `${form.rating}/5` : "Select rating"}
            </span>
          </div>

          <textarea
            placeholder="Write your experience..."
            minLength={10}
            maxLength={1000}
            required
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />

          <input
            type="text"
            name="website"
            className="review-honeypot"
            aria-hidden="true"
            aria-label="Leave this field empty"
            tabIndex="-1"
            autoComplete="off"
            value={form.website}
            onChange={(e) => setForm({ ...form, website: e.target.value })}
          />

          <div className="review-form-actions">
            <button type="submit" disabled={submitting}>
              {submitting
                ? "Saving..."
                : editingId
                  ? "Update Review"
                  : "Publish Review"}
            </button>

            {editingId && (
              <button type="button" onClick={cancelEdit}>
                Cancel
              </button>
            )}
          </div>

          {notice && (
            <p className="review-form-message" role="status">
              {notice}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

export default PortfolioInsights;
