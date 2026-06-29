import { useState } from 'react';

const INITIAL_COMMENTS = [
  { id: 1, name: 'Aarav', text: 'Elegant, warm, and beautifully long lasting.', date: 'Today' },
  { id: 2, name: 'Meera', text: 'The dry-down feels luxurious without becoming heavy.', date: '2 days ago' },
  { id: 3, name: 'Kabir', text: 'Beautiful presentation and a very memorable fragrance.', date: '1 week ago' },
];

export default function ProductComments({ productName }) {
  const [comments, setComments] = useState(INITIAL_COMMENTS);
  const [comment, setComment] = useState('');

  const submitComment = (event) => {
    event.preventDefault();
    const trimmedComment = comment.trim();
    if (!trimmedComment) return;

    setComments((current) => [
      { id: Date.now(), name: 'You', text: trimmedComment, date: 'Just now' },
      ...current,
    ]);
    setComment('');
  };

  return (
    <aside className="product-comments">
      <div className="product-comments-heading">
        <span><i className="bi bi-chat-quote" /></span>
        <div>
          <small>Fragrance notes</small>
          <h2>Community comments</h2>
        </div>
      </div>

      <form className="product-comment-form" onSubmit={submitComment}>
        <label htmlFor="product-comment">Share your experience with {productName}</label>
        <div>
          <input
            id="product-comment"
            type="text"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Write a comment..."
          />
          <button type="submit" aria-label="Post comment">
            <i className="bi bi-send-fill" />
          </button>
        </div>
      </form>

      <div className="product-comment-list">
        {comments.slice(0, 3).map((item) => (
          <article className="product-comment" key={item.id}>
            <span className="product-comment-avatar">{item.name.charAt(0)}</span>
            <div>
              <div>
                <strong>{item.name}</strong>
                <small>{item.date}</small>
              </div>
              <p>{item.text}</p>
            </div>
          </article>
        ))}
      </div>
    </aside>
  );
}
