import { Link } from 'react-router-dom';

export default function ComboOfferSection() {
  return (
    <section className="combo-offer-section">
      <div className="combo-offer-inner">
        <div className="combo-offer-banner">
          <img
            className="combo-offer-background"
            src="/img/Gemini_Generated_Image_26ntcw26ntcw26nt (1).png"
            alt=""
            aria-hidden="true"
          />
          <div className="combo-offer-overlay" />

          <div className="combo-offer-content">
            <p className="combo-offer-eyebrow">
              <span />
              Exclusive Combo
            </p>
            <h2>
              Two signatures.
              <br />
              <span>One irresistible offer.</span>
            </h2>
            <p className="combo-offer-description">
              Pair two of our most-loved fragrances and save more with the
              Aromus signature duo.
            </p>

            <div className="combo-offer-price">
              <strong>₹3,999</strong>
              <del>₹5,998</del>
              <span>Save 33%</span>
            </div>

            <Link className="combo-offer-button" to="/shop">
              Shop the Combo
              <i className="bi bi-arrow-right" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
