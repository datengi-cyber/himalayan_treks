'use client';
import Cookies from 'js-cookie';
import { useAuth } from '@/context/AuthContext'; 
import { useCallback, useEffect, useRef, useState } from 'react';



const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
const COMMENT_MAX = 1000;
const TITLE_MAX = 80;


function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function formatReviewDate(dateString) {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function truncateText(text = '', maxLength = 320) {
  if (text.length <= maxLength) return { shown: text, isTruncated: false };
  return { shown: `${text.slice(0, maxLength).trim()}…`, isTruncated: true };
}

/** Computes a 5..1 star distribution from the reviews currently loaded. */
function computeDistribution(reviews) {
  const total = reviews.length;
  return [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => Math.round(r.rating) === star).length;
    return { star, count, percent: total > 0 ? Math.round((count / total) * 100) : 0 };
  });
}

/** Read-only or interactive star row. One implementation shared everywhere. */
function Stars({ rating = 0, size = 'md', interactive = false, onChange }) {
  const [hovered, setHovered] = useState(0);
  const activeValue = interactive && hovered > 0 ? hovered : rating;
  const stars = [1, 2, 3, 4, 5];

  if (!interactive) {
    return (
      <span className={`td-stars td-stars-${size}`} role="img" aria-label={`Rated ${rating} out of 5`}>
        {stars.map((s) => (
          <span key={s} className={s <= Math.round(rating) ? 'td-star td-star-filled' : 'td-star'} aria-hidden="true">★</span>
        ))}
      </span>
    );
  }

  return (
    <div className={`td-stars td-stars-${size} td-stars-interactive`} role="radiogroup" aria-label="Select a star rating" onMouseLeave={() => setHovered(0)}>
      {stars.map((s) => (
        <button
          key={s}
          type="button"
          role="radio"
          aria-checked={rating === s}
          aria-label={`${s} star${s > 1 ? 's' : ''}`}
          className={s <= activeValue ? 'td-star td-star-btn td-star-filled' : 'td-star td-star-btn'}
          onMouseEnter={() => setHovered(s)}
          onFocus={() => setHovered(s)}
          onBlur={() => setHovered(0)}
          onClick={() => onChange?.(s)}
        >
          ★
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------

export default function TrekReviews({ trekId }) {
//   const { user, token, isAuthenticated, isLoading: authLoading } = useLocalAuth();
  const { user, loading: authLoading } = useAuth();
  const token = Cookies.get('token');
  const isAuthenticated = Boolean(user);

  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ total_reviews: 0, average_rating: '0.0' });
  const [status, setStatus] = useState('loading'); // loading | success | empty | error
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const fetchReviews = useCallback(
    async (signal) => {
      setStatus('loading');
      setErrorMessage('');
      try {
        const res = await fetch(`${API_URL}/reviews/trek/${trekId}`, { signal });
        const body = await res.json().catch(() => null);

        if (!res.ok || !body?.success) {
          throw new Error(body?.message || 'Unable to load reviews right now.');
        }

        const list = body.data?.reviews ?? [];
        setReviews(list);
        setStats(body.data?.stats ?? { total_reviews: list.length, average_rating: '0.0' });
        setStatus(list.length === 0 ? 'empty' : 'success');
      } catch (err) {
        if (err.name === 'AbortError') return;
        setErrorMessage(err.message || 'Something went wrong loading reviews.');
        setStatus('error');
      }
    },
    [trekId]
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchReviews(controller.signal);
    return () => controller.abort();
  }, [fetchReviews]);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  function showToast(message, tone = 'success') {
    setToast({ message, tone });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3500);
  }

  async function handleSubmitReview(formPayload) {
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ trek_id: trekId, ...formPayload }),
      });
      const body = await res.json().catch(() => null);

      if (!res.ok || body?.success === false) {
        throw new Error(body?.message || 'Could not submit your review.');
      }

      const created = body?.data ?? {};
      const newReview = {
        id: created.id ?? `temp-${Date.now()}`,
        rating: formPayload.rating,
        title: formPayload.title,
        comment: formPayload.comment,
        created_at: created.created_at ?? new Date().toISOString(),
        user_id: user?.id ?? created.user_id,
        user_name: user?.name ?? created.user_name ?? 'You',
        ...created,
      };

      setReviews((prev) => [newReview, ...prev]);
      setStats((prev) => {
        const total = (prev.total_reviews || 0) + 1;
        const prevAvg = parseFloat(prev.average_rating) || 0;
        const nextAvg = ((prevAvg * (total - 1)) + formPayload.rating) / total;
        return { total_reviews: total, average_rating: nextAvg.toFixed(1) };
      });
      setStatus('success');
      showToast('Thanks — your review has been posted!');
      return true;
    } catch (err) {
      showToast(err.message || 'Could not submit your review.', 'error');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  const distribution = computeDistribution(reviews);
  const averageRating = parseFloat(stats.average_rating) || 0;
  const totalReviews = stats.total_reviews ?? reviews.length;

  return (
    <div className="td-section td-review-section">
      <style>{`
        .td-review-section { position: relative; }

        .td-review-summary {
          display: grid;
          grid-template-columns: 200px 1fr;
          gap: 2.5rem;
          align-items: center;
          padding: 2rem;
        }
        .td-review-summary-main {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          border-right: 1px solid var(--border);
          padding-right: 2rem;
        }
        .td-review-summary-score {
          font-family: var(--font-display);
          font-size: 3rem;
          font-weight: 600;
          color: var(--navy);
          line-height: 1;
        }
        .td-review-summary-count {
          font-size: 0.82rem;
          color: var(--text-muted);
          margin-top: 0.5rem;
        }
        .td-review-progress-list { display: grid; gap: 0.55rem; }
        .td-review-progress-row {
          display: grid;
          grid-template-columns: 34px 1fr 38px 34px;
          align-items: center;
          gap: 0.75rem;
        }
        .td-review-progress-label { font-size: 0.78rem; color: var(--text-muted); font-weight: 600; }
        .td-review-progress-track { height: 7px; border-radius: 999px; background: var(--accent-green-bg); overflow: hidden; }
        .td-review-progress-fill { height: 100%; border-radius: 999px; background: var(--accent-green); transition: width 0.6s ease; }
        .td-review-progress-percent { font-size: 0.78rem; color: var(--text-dark); text-align: right; }
        .td-review-progress-count { font-size: 0.72rem; color: var(--text-muted); }

        .td-stars { display: inline-flex; gap: 2px; }
        .td-star { color: #e5e3da; font-size: 1rem; line-height: 1; }
        .td-star-filled { color: var(--accent-green); }
        .td-stars-sm .td-star { font-size: 0.85rem; }
        .td-stars-lg .td-star { font-size: 1.6rem; }
        .td-star-btn { background: none; border: none; padding: 2px; cursor: pointer; transition: transform 0.15s ease; }
        .td-star-btn:hover, .td-star-btn:focus-visible { transform: scale(1.18); }
        .td-star-btn:focus-visible { outline: 2px solid var(--accent-blue); outline-offset: 2px; border-radius: 4px; }

        .td-review-card {
          background: #fff;
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 1.5rem;
          margin-bottom: 1rem;
          box-shadow: 0 1px 2px rgba(25,40,81,0.03);
          transition: box-shadow 0.25s ease, transform 0.25s ease, border-color 0.25s ease;
          animation: tdFadeIn 0.45s ease both;
        }
        .td-review-card:hover { box-shadow: 0 10px 28px rgba(25,40,81,0.08); transform: translateY(-2px); border-color: #d8d4ca; }
        @keyframes tdFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

        .td-review-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; }
        .td-review-identity { display: flex; gap: 0.85rem; align-items: center; }
        .td-review-avatar {
          width: 44px; height: 44px; border-radius: 50%;
          background: var(--accent-green-bg); color: var(--accent-green);
          font-family: var(--font-display); font-weight: 600; font-size: 0.9rem;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        .td-review-name { font-weight: 600; color: var(--navy); }
        .td-review-date { font-size: 0.75rem; color: var(--text-muted); margin-top: 0.15rem; }
        .td-review-title { margin-top: 0.9rem; font-weight: 600; color: var(--navy); font-size: 1rem; }
        .td-review-comment { margin-top: 0.4rem; color: var(--text-muted); line-height: 1.7; font-size: 0.92rem; }
        .td-review-readmore {
          background: none; border: none; padding: 0; margin-left: 0.35rem;
          color: var(--accent-blue); font-weight: 600; font-size: 0.88rem; cursor: pointer;
        }
        .td-review-readmore:hover { color: var(--accent-blue-deep); }

        .td-review-footer {
          display: flex; gap: 0.75rem; margin-top: 1.1rem; padding-top: 0.9rem;
          border-top: 1px solid var(--border);
        }
        .td-review-action {
          font-size: 0.82rem; color: var(--text-muted); background: none;
          border: 1px solid var(--border); border-radius: 999px; padding: 0.35rem 0.85rem;
          cursor: pointer; transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
        }
        .td-review-action:hover:not(:disabled) { background: var(--card); border-color: #d8d4ca; }
        .td-review-action-active { color: var(--accent-green); border-color: transparent; background: var(--accent-green-bg); }
        .td-review-action:disabled { opacity: 0.6; cursor: default; }

        .td-review-empty, .td-review-login-gate {
          text-align: center; padding: 3rem 1.5rem;
          border: 1px dashed var(--border); border-radius: 14px; background: var(--card);
        }
        .td-review-empty-icon { font-size: 2.25rem; margin-bottom: 0.75rem; }
        .td-review-empty-title { font-family: var(--font-display); font-size: 1.25rem; font-weight: 600; color: var(--navy); }
        .td-review-empty-sub { color: var(--text-muted); font-size: 0.92rem; margin: 0.4rem 0 1.25rem; }

        .td-review-error {
          text-align: center; padding: 2rem 1.5rem;
          border: 1px solid var(--border); border-radius: 14px; color: var(--text-muted);
        }
        .td-review-error button { margin-top: 0.75rem; }

        .td-review-button {
          position: relative; overflow: hidden;
          background: var(--accent-blue); color: #fff; border: none;
          font-weight: 600; font-size: 0.92rem; padding: 0.85rem 1.75rem;
          border-radius: 10px; cursor: pointer; transition: background 0.2s ease, transform 0.15s ease;
        }
        .td-review-button:hover:not(:disabled) { background: var(--accent-blue-deep); }
        .td-review-button:active:not(:disabled) { transform: scale(0.98); }
        .td-review-button:disabled { opacity: 0.65; cursor: default; }
        .td-review-button:focus-visible, .td-review-action:focus-visible, .td-review-readmore:focus-visible {
          outline: 2px solid var(--accent-blue); outline-offset: 2px;
        }

        .td-review-form {
          background: var(--card); border: 1px solid var(--border); border-radius: 14px;
          padding: 1.75rem; display: grid; gap: 1.35rem;
        }
        .td-review-form-field { display: grid; gap: 0.4rem; }
        .td-review-form-label { font-size: 0.82rem; font-weight: 600; color: var(--navy); }
        .td-review-form-subrow { display: flex; justify-content: space-between; align-items: center; min-height: 1rem; }
        .td-review-form-error { font-size: 0.78rem; color: #9c3b3b; }
        .td-review-char-counter { font-size: 0.72rem; color: var(--text-muted); margin-left: auto; }

        .td-review-floating-label { position: relative; }
        .td-review-floating-label input,
        .td-review-floating-label textarea {
          width: 100%; font-family: var(--font-body); font-size: 0.95rem; color: var(--text-dark);
          background: #fff; border: 1px solid var(--border); border-radius: 10px;
          padding: 1.1rem 0.9rem 0.5rem; resize: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .td-review-floating-label textarea { min-height: 110px; }
        .td-review-floating-label input:focus,
        .td-review-floating-label textarea:focus {
          outline: none; border-color: var(--accent-blue); box-shadow: 0 0 0 3px rgba(47,93,208,0.12);
        }
        .td-review-floating-label label {
          position: absolute; left: 0.9rem; top: 0.85rem; font-size: 0.95rem; color: var(--text-muted);
          pointer-events: none; transform-origin: left top;
          transition: transform 0.18s ease, color 0.18s ease, top 0.18s ease;
        }
        .td-review-floating-label input:focus + label,
        .td-review-floating-label input:not(:placeholder-shown) + label,
        .td-review-floating-label textarea:focus + label,
        .td-review-floating-label textarea:not(:placeholder-shown) + label {
          top: 0.4rem; transform: scale(0.72); color: var(--accent-blue);
        }

        .td-review-skeleton { pointer-events: none; }
        .td-skeleton-block {
          background: linear-gradient(90deg, #ece9e2 25%, #f4f2ec 37%, #ece9e2 63%);
          background-size: 400% 100%; animation: tdShimmer 1.4s ease infinite; border-radius: 6px;
        }
        .td-skeleton-circle { width: 44px; height: 44px; border-radius: 50%; }
        @keyframes tdShimmer { 0% { background-position: 100% 0; } 100% { background-position: 0 0; } }

        .td-review-toast {
          position: sticky; bottom: 1.5rem; margin: 0 0 1rem auto; width: fit-content; max-width: 100%;
          background: var(--navy-deep); color: #fff; font-size: 0.88rem; padding: 0.8rem 1.25rem;
          border-radius: 10px; box-shadow: 0 10px 30px rgba(16,26,56,0.25);
          animation: tdFadeIn 0.3s ease both; z-index: 5;
        }
        .td-review-toast-error { background: #7a2e2e; }

        @media (max-width: 980px) {
          .td-review-summary { grid-template-columns: 1fr; gap: 1.5rem; }
          .td-review-summary-main {
            border-right: none; border-bottom: 1px solid var(--border);
            padding-right: 0; padding-bottom: 1.25rem; align-items: center; width: 100%; text-align: center;
          }
        }
      `}</style>

      <div className="td-eyebrow">Traveler Voices</div>
      <div className="td-section-title">Reviews</div>

      {status === 'loading' && (
        <>
          <div className="td-card td-review-skeleton td-review-summary">
            <div className="td-review-summary-main">
              <div className="td-skeleton-block" style={{ width: 64, height: 48 }} />
              <div className="td-skeleton-block" style={{ width: 120, height: 18, marginTop: 10 }} />
              <div className="td-skeleton-block" style={{ width: 100, height: 12, marginTop: 8 }} />
            </div>
            <div className="td-review-progress-list">
              {[5, 4, 3, 2, 1].map((s) => (
                <div className="td-review-progress-row" key={s}>
                  <div className="td-skeleton-block" style={{ width: 24, height: 10 }} />
                  <div className="td-skeleton-block" style={{ height: 8 }} />
                  <div className="td-skeleton-block" style={{ width: 30, height: 10 }} />
                  <div />
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            {[1, 2, 3].map((i) => (
              <div className="td-review-card td-review-skeleton" key={i}>
                <div className="td-review-top">
                  <div className="td-review-identity">
                    <div className="td-skeleton-block td-skeleton-circle" />
                    <div>
                      <div className="td-skeleton-block" style={{ width: 120, height: 14 }} />
                      <div className="td-skeleton-block" style={{ width: 80, height: 10, marginTop: 8 }} />
                    </div>
                  </div>
                  <div className="td-skeleton-block" style={{ width: 90, height: 14 }} />
                </div>
                <div className="td-skeleton-block" style={{ width: '60%', height: 16, marginTop: 16 }} />
                <div className="td-skeleton-block" style={{ width: '100%', height: 12, marginTop: 12 }} />
                <div className="td-skeleton-block" style={{ width: '80%', height: 12, marginTop: 8 }} />
              </div>
            ))}
          </div>
        </>
      )}

      {status === 'error' && (
        <div className="td-review-error">
          <p>{errorMessage}</p>
          <button type="button" className="td-review-button" onClick={() => fetchReviews()}>
            Try Again
          </button>
        </div>
      )}

      {status === 'empty' && (
        <div className="td-review-empty">
          <div className="td-review-empty-icon" aria-hidden="true">🏔️</div>
          <div className="td-review-empty-title">No one has reviewed this trek yet.</div>
          <p className="td-review-empty-sub">Be the first explorer to share your journey.</p>
          <a href="#write-review" className="td-review-button">Write Review</a>
        </div>
      )}

      {status === 'success' && (
        <>
          <div className="td-card td-review-summary">
            <div className="td-review-summary-main">
              <div className="td-review-summary-score">{averageRating.toFixed(1)}</div>
              <Stars rating={averageRating} size="lg" />
              <div className="td-review-summary-count">
                Based on {totalReviews} review{totalReviews === 1 ? '' : 's'}
              </div>
            </div>
            <div className="td-review-progress-list">
              {distribution.map(({ star, percent, count }) => (
                <div className="td-review-progress-row" key={star}>
                  <span className="td-review-progress-label">{star} ★</span>
                  <div className="td-review-progress-track" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100}>
                    <div className="td-review-progress-fill" style={{ width: `${percent}%` }} />
                  </div>
                  <span className="td-review-progress-percent">{percent}%</span>
                  <span className="td-review-progress-count">({count})</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </>
      )}

      <div id="write-review" style={{ marginTop: '2rem' }}>
        <div className="td-section-title" style={{ fontSize: '1.15rem' }}>Share Your Experience</div>

        {authLoading ? (
          <div className="td-review-form td-review-skeleton" style={{ minHeight: 220 }} />
        ) : isAuthenticated ? (
          <ReviewForm onSubmit={handleSubmitReview} isSubmitting={isSubmitting} />
        ) : (
          <div className="td-review-login-gate">
            <p className="td-review-empty-sub" style={{ marginBottom: '1rem' }}>
              Sign in to share your trekking experience.
            </p>
            <a href="/login" className="td-review-button">Login</a>
          </div>
        )}
      </div>

      {toast && (
        <div className={toast.tone === 'error' ? 'td-review-toast td-review-toast-error' : 'td-review-toast'}>
          {toast.message}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------
// Sub-renders (kept as local components in this same file, not exported)
// ---------------------------------------------------------------------

function ReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(0);
  const [markedHelpful, setMarkedHelpful] = useState(false);
  const [reported, setReported] = useState(false);

  const { shown, isTruncated } = truncateText(review.comment || '', 320);

  function toggleHelpful() {
    setMarkedHelpful((prev) => {
      const next = !prev;
      setHelpfulCount((c) => (next ? c + 1 : Math.max(0, c - 1)));
      return next;
    });
  }

  return (
    <div className="td-review-card">
      <div className="td-review-top">
        <div className="td-review-identity">
          <div className="td-review-avatar" aria-hidden="true">{getInitials(review.user_name)}</div>
          <div>
            <div className="td-review-name">{review.user_name}</div>
            <div className="td-review-date">{formatReviewDate(review.created_at)}</div>
          </div>
        </div>
        <Stars rating={review.rating} size="sm" />
      </div>

      {review.title && <div className="td-review-title">{review.title}</div>}

      <div className="td-review-comment">
        {expanded ? review.comment : shown}
        {isTruncated && (
          <button type="button" className="td-review-readmore" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded}>
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      <div className="td-review-footer">
        <button
          type="button"
          className={markedHelpful ? 'td-review-action td-review-action-active' : 'td-review-action'}
          onClick={toggleHelpful}
          aria-pressed={markedHelpful}
        >
          👍 Helpful{helpfulCount > 0 ? ` (${helpfulCount})` : ''}
        </button>
        <button type="button" className="td-review-action" onClick={() => setReported(true)} disabled={reported}>
          {reported ? 'Reported' : 'Report'}
        </button>
      </div>
    </div>
  );
}

function ReviewForm({ onSubmit, isSubmitting }) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [errors, setErrors] = useState({});
  const textareaRef = useRef(null);

  function autoResize(e) {
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }

  function validate() {
    const next = {};
    if (!rating) next.rating = 'Please select a star rating.';
    if (!title.trim()) next.title = 'Please add a short title.';
    if (comment.trim().length < 20) next.comment = 'Please write at least 20 characters about your trip.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    const success = await onSubmit({ rating, title: title.trim(), comment: comment.trim() });
    if (success) {
      setRating(0);
      setTitle('');
      setComment('');
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  }

  return (
    <form className="td-review-form" onSubmit={handleSubmit} noValidate>
      <div className="td-review-form-field">
        <span className="td-review-form-label">Your Rating</span>
        <Stars rating={rating} interactive size="lg" onChange={setRating} />
        {errors.rating && <span className="td-review-form-error">{errors.rating}</span>}
      </div>

      <div className="td-review-form-field">
        <div className="td-review-floating-label">
          <input
            id="review-title"
            type="text"
            value={title}
            maxLength={TITLE_MAX}
            placeholder=" "
            onChange={(e) => { setTitle(e.target.value); setErrors((p) => ({ ...p, title: undefined })); }}
            aria-invalid={Boolean(errors.title)}
          />
          <label htmlFor="review-title">Review Title</label>
        </div>
        <div className="td-review-form-subrow">
          {errors.title && <span className="td-review-form-error">{errors.title}</span>}
          <span className="td-review-char-counter">{title.length}/{TITLE_MAX}</span>
        </div>
      </div>

      <div className="td-review-form-field">
        <div className="td-review-floating-label">
          <textarea
            id="review-comment"
            ref={textareaRef}
            value={comment}
            maxLength={COMMENT_MAX}
            placeholder=" "
            rows={4}
            onChange={(e) => { setComment(e.target.value); setErrors((p) => ({ ...p, comment: undefined })); autoResize(e); }}
            aria-invalid={Boolean(errors.comment)}
          />
          <label htmlFor="review-comment">Tell us about your trek</label>
        </div>
        <div className="td-review-form-subrow">
          {errors.comment && <span className="td-review-form-error">{errors.comment}</span>}
          <span className="td-review-char-counter">{comment.length}/{COMMENT_MAX}</span>
        </div>
      </div>

      <button type="submit" className="td-review-button" disabled={isSubmitting}>
        {isSubmitting ? 'Posting…' : 'Submit Review'}
      </button>
    </form>
  );
}