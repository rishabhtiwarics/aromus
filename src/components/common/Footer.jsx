import { Link } from 'react-router-dom';

const FOOTER_COLLECTIONS = [
  { id: 'male', label: 'Male', img: '/img/homehero2.png' },
  { id: 'female', label: 'Female', img: '/img/one.png' },
  { id: 'unisex', label: 'Unisex', img: '/img/Gemini_Generated_Image_26ntcw26ntcw26nt (1).png' },
  { id: 'signature', label: 'Signature', img: '/img/Gemini_Generated_Image_t68tfpt68tfpt68t.png' },
];

export default function Footer() {
  return (
    <footer className="footer">

      {/* ── PART 1: FOOTER TOP ── */}
      <div className="footer-top">

        {/* BG image — absolutely fills right half via CSS */}
        <div
          className="footer-top-right"
          style={{ backgroundImage: "url('/img/homehero2.png')" }}
        >
          <div className="footer-top-right-overlay" />
          <p className="footer-top-tagline">Crafted for the Discerning Soul</p>
        </div>

        {/* Logo — aligned with footer-main container */}
        <div className="footer-top-container">
          <div className="footer-logo-wrap">
            <div className="footer-logo-circle">
              <img src="/img/logo.png" alt="Aromus Logo" />
            </div>
            <img className="footer-logo-wordmark" src="/img/logotext.png" alt="Aromus Parfum" />
          </div>
        </div>

      </div>

      {/* ── PART 2: FOOTER MAIN ── */}
      <div className="footer-main">
        <div className="footer-main-inner">

          {/* About */}
          <div className="footer-col footer-col-about">
            <h4 className="footer-col-title">About Us</h4>
            <p className="footer-about-text">
              Aromus Parfum is a luxury fragrance house dedicated to the art of
              scent. Each bottle carries a story — of rare ingredients, timeless
              craftsmanship, and the essence of elegance.
            </p>
            <div className="footer-socials">
              <a href="#" className="footer-social-icon" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="footer-social-icon" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="footer-social-icon" aria-label="Pinterest">
                <i className="bi bi-pinterest"></i>
              </a>
              <a href="#" className="footer-social-icon" aria-label="Twitter">
                <i className="bi bi-twitter-x"></i>
              </a>
            </div>
          </div>

          {/* Collection */}
          <div className="footer-col footer-col-collection">
            <h4 className="footer-col-title">Collection</h4>
            <div className="footer-collection-grid">
              {FOOTER_COLLECTIONS.map((collection) => (
                <Link
                  key={collection.id}
                  className="footer-collection-item"
                  to={`/shop?category=${collection.id}`}
                  aria-label={`Shop ${collection.label} fragrances`}
                >
                  <img src={collection.img} alt="" />
                  <span>{collection.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col footer-col-links">
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links-list">
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/terms-and-conditions">Terms &amp; Conditions</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col footer-col-contact">
            <h4 className="footer-col-title">Contact</h4>
            <ul className="footer-contact-list">
              <li>
                <div className="footer-contact-icon">
                  <i className="bi bi-geo-alt"></i>
                </div>
                <span>12 Rue de Parfum, Paris, France</span>
              </li>
              <li>
                <div className="footer-contact-icon">
                  <i className="bi bi-telephone"></i>
                </div>
                <span>+33 1 42 86 00 00</span>
              </li>
              <li>
                <div className="footer-contact-icon">
                  <i className="bi bi-envelope"></i>
                </div>
                <span>hello@aromusparfum.com</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* ── PART 3: COPYRIGHT ── */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p className="footer-copyright">
            © {new Date().getFullYear()} Aromus Parfum. All rights reserved.
          </p>
          <div className="footer-bottom-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <span className="footer-bottom-sep">·</span>
            <Link to="/terms-and-conditions">Terms of Use</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}
