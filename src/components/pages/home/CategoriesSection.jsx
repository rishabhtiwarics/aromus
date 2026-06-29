import { Link } from 'react-router-dom';

const CATEGORIES = [
  {
    id: 'male',
    label: 'Male',
    subtitle: 'Bold & Powerful',
    img: '/img/homehero2.png',
    tag: '2 Fragrances',
  },
  {
    id: 'female',
    label: 'Female',
    subtitle: 'Soft & Floral',
    img: '/img/one.png',
    tag: '2 Fragrances',
  },
  {
    id: 'unisex',
    label: 'Unisex',
    subtitle: 'Free & Balanced',
    img: '/img/Gemini_Generated_Image_26ntcw26ntcw26nt (1).png',
    tag: '2 Fragrances',
  },
  {
    id: 'signature',
    label: 'Signature',
    subtitle: 'Rare & Exclusive',
    img: '/img/Gemini_Generated_Image_t68tfpt68tfpt68t.png',
    tag: '2 Fragrances',
  },
];

export default function CategoriesSection() {
  return (
    <div className="cat-section-wrapper">
    <section className="cat-section">
      {/* Left Panel */}
      <div className="cat-left">
        <p className="cat-eyebrow">
          <span className="cat-eyebrow-dot" />
          Shop by Category
        </p>
        <h2 className="cat-title">
          Find your<br />
          perfect<br />
          <span className="cat-title-gold">scent</span>
        </h2>
        <p className="cat-desc">
          From bold masculines to delicate florals — discover the fragrance that tells your story.
        </p>
        <Link to="/shop" className="cat-view-all">
          View All Fragrances
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Right Cards */}
      <div className="cat-grid">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            to={`/shop?category=${cat.id}`}
            className="cat-card"
            aria-label={`Shop ${cat.label} fragrances`}
          >
            <img src={cat.img} alt={cat.label} className="cat-card-img" />
            <div className="cat-card-overlay" />
            <div className="cat-card-tag">{cat.tag}</div>
            <div className="cat-card-footer">
              <div>
                <p className="cat-card-subtitle">{cat.subtitle}</p>
                <h3 className="cat-card-label">{cat.label}</h3>
              </div>
              <span className="cat-card-btn" aria-hidden="true">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>

      <Link to="/shop" className="cat-view-all cat-view-all-mobile">
        View All Fragrances
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </Link>
    </section>
    </div>
  );
}
