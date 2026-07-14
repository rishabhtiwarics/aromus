import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// ── Background slides ──
const BG_IMAGES = [
  '/img/homehero2.png',
  '/img/homehero.png',
];

const SLIDE_LABELS = ['Woody Amber', 'Signature Oud'];

const INTERVAL = 5000; // 5s per slide

export default function HeroSection() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const progressRef = useRef(null);

  const startTimer = () => {
    clearInterval(timerRef.current);
    clearInterval(progressRef.current);
    setProgress(0);

    let elapsed = 0;
    progressRef.current = setInterval(() => {
      elapsed += 50;
      setProgress(Math.min((elapsed / INTERVAL) * 100, 100));
    }, 50);

    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % BG_IMAGES.length);
      elapsed = 0;
      setProgress(0);
    }, INTERVAL);
  };

  const goTo = (index) => {
    setActive(index);
    startTimer();
  };

  useEffect(() => {
    const start = setTimeout(startTimer, 0);
    return () => {
      clearTimeout(start);
      clearInterval(timerRef.current);
      clearInterval(progressRef.current);
    };
  }, []);

  return (
    <section className="hero">

      {/* BG SLIDES */}
      {BG_IMAGES.map((src, i) => (
        <div
          key={i}
          className={`hero-bg-slide${i === active ? ' active' : ''}`}
          style={{ backgroundImage: `url('${src}')` }}
        />
      ))}

      {/* DARK OVERLAY */}
      <div className="hero-overlay" />

      {/* CONTENT */}
      <div className="hero-content-layer">
        <div className="hero-container">
          <div className="hero-grid">

            {/* TOP-LEFT */}
            <div className="hero-top-left">
              <div className="hero-eyebrow">
                <span className="eyebrow-dot" />
                New Arrival 2025
              </div>
              <h1 className="hero-title">
                Wild Stone<br />
                Eau de<br />
                <span className="gold">Perfume</span>
                Woody Amber
              </h1>
              <p className="hero-subtitle-line">Essence of Elegance</p>
            </div>

            {/* MIDDLE SPACER */}
            <div className="hero-middle" />

            {/* BOTTOM-LEFT — Pagination */}
            <div className="hero-bottom-left">
              <div className="hero-pagination">
                {BG_IMAGES.map((_, i) => (
                  <button
                    key={i}
                    className={`pag-item${i === active ? ' active' : ''}`}
                    onClick={() => goTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                  >
                    <span className="pag-number">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span className="pag-label">{SLIDE_LABELS[i]}</span>
                    <span className="pag-track">
                      <span
                        className="pag-fill"
                        style={{ width: i === active ? `${progress}%` : '0%' }}
                      />
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* BOTTOM-RIGHT */}
            <div className="hero-bottom-right">
              <p className="hero-desc">
                A warm, woody scent with an amber core.<br />
                Think <strong>dry driftwood</strong>, a touch of spice and
                smooth sandalwood.
              </p>
              <div className="hero-cta-group">
                <Link to="/shop" className="btn-buy">Shop Now</Link>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div className="hero-mobile-content">
        <div className="hero-eyebrow">
          <span className="eyebrow-dot" />
          New Arrival 2025
        </div>
        <h1 className="hero-title">
          Wild Stone<br />
          Eau de<br />
          <span className="gold">Perfume</span>
          Woody Amber
        </h1>
        <p className="hero-subtitle-line">Essence of Elegance</p>
        <Link to="/shop" className="hero-mobile-shop">Shop Now</Link>
      </div>

    </section>
  );
}
