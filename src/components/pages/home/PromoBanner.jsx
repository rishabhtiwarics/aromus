import { Link } from 'react-router-dom';

export default function PromoBanner() {
  return (
    <section className="promo-banner">

      {/* Full-width background image */}
      <div className="promo-banner-bg" />

      {/* Centered content — aligned same max-width as header */}
      <div className="promo-banner-inner">
        <div className="promo-banner-content">
          <p className="promo-eyebrow">
            <span className="promo-eyebrow-dot" />
            Exclusive Offer
          </p>
          <h2 className="promo-title">
            Up to <span className="promo-gold">40% Off</span> — New Season
          </h2>
          <p className="promo-subtitle">
            Discover rare fragrances crafted for the discerning soul
          </p>
          <Link to="/shop" className="promo-cta">Shop Now</Link>
        </div>
      </div>

    </section>
  );
}
