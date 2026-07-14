import { useEffect, useState } from 'react';
import { api, getToken } from '../../../api/client';

export default function ProductComments({ productId, productName }) {
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [error, setError] = useState('');

  const loadReviews = async () => {
    try { setReviews((await api.get(`/review/product/${productId}`)).data); }
    catch (requestError) { setError(requestError.message); }
  };
  useEffect(() => {
    let active = true;
    api.get(`/review/product/${productId}`)
      .then((response) => { if (active) setReviews(response.data); })
      .catch((requestError) => { if (active) setError(requestError.message); });
    return () => { active = false; };
  }, [productId]);

  const submitComment = async (event) => {
    event.preventDefault();
    if (!getToken()) { setError('Please sign in to review this fragrance.'); return; }
    try {
      await api.post('/review', { product: productId, rating: Number(rating), comment: comment.trim() });
      setComment(''); setRating(5); setError(''); await loadReviews();
    } catch (requestError) { setError(requestError.message); }
  };

  return (
    <aside className="product-comments">
      <div className="product-comments-heading"><span><i className="bi bi-chat-quote" /></span><div><small>Verified API reviews</small><h2>Community comments</h2></div></div>
      <form className="product-comment-form" onSubmit={submitComment}>
        <label htmlFor="product-comment">Share your experience with {productName}</label>
        <div>
          <select value={rating} onChange={(event) => setRating(event.target.value)} aria-label="Rating">{[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} stars</option>)}</select>
          <input id="product-comment" type="text" value={comment} onChange={(event) => setComment(event.target.value)} placeholder="Write a comment..." minLength="3" required />
          <button type="submit" aria-label="Post review"><i className="bi bi-send-fill" /></button>
        </div>
      </form>
      {error && <p className="shop-error">{error}</p>}
      <div className="product-comment-list">
        {reviews.slice(0, 3).map((review) => {
          const name = [review.user?.firstName, review.user?.lastName].filter(Boolean).join(' ') || 'Customer';
          return <article className="product-comment" key={review._id}><span className="product-comment-avatar">{name.charAt(0)}</span><div><div><strong>{name}</strong><small>{review.rating}/5 · {new Date(review.createdAt).toLocaleDateString()}</small></div><p>{review.comment}</p></div></article>;
        })}
        {!reviews.length && !error && <p>No reviews yet. Be the first to review this fragrance.</p>}
      </div>
    </aside>
  );
}
