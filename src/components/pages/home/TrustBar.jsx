const TRUST_ITEMS = [
  {
    title: 'Long Lasting',
    subtitle: 'Up to 12 Hours Wear',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
    )
  },
  {
    title: 'Premium Quality',
    subtitle: 'Finest Ingredients',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
      </svg>
    )
  },
  {
    title: 'Cruelty Free',
    subtitle: '100% Vegan & Plant-based',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
      </svg>
    )
  }
];

// We make a block of 12 items to ensure it's naturally wider than any large screen,
// so we don't have to force min-width: 100% which causes gaps.
const BASE_SET = [...TRUST_ITEMS, ...TRUST_ITEMS, ...TRUST_ITEMS, ...TRUST_ITEMS];

export default function TrustBar() {
  return (
    <section className="trust-bar-section">
      <div className="trust-bar-wrapper">
        <div className="trust-bar-marquee">
          <div className="marquee-group">
            {BASE_SET.map((item, idx) => (
              <div className="trust-pill" key={`g1-${idx}`}>
                <div className="trust-icon">{item.icon}</div>
                <div className="trust-text">
                  <span className="trust-title">{item.title}</span>
                  <span className="trust-subtitle">{item.subtitle}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="marquee-group" aria-hidden="true">
            {BASE_SET.map((item, idx) => (
              <div className="trust-pill" key={`g2-${idx}`}>
                <div className="trust-icon">{item.icon}</div>
                <div className="trust-text">
                  <span className="trust-title">{item.title}</span>
                  <span className="trust-subtitle">{item.subtitle}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
