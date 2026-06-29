const SERVICE_FEATURES = [
  {
    title: '24/7 Free Support',
    description: 'Passage of Lorem Ipsum',
    icon: 'bi-headset',
  },
  {
    title: 'Secure Payment',
    description: 'Passage of Lorem Ipsum',
    icon: 'bi-shield-check',
  },
  {
    title: 'Special Gift Cards',
    description: 'Passage of Lorem Ipsum',
    icon: 'bi-gift',
  },
  {
    title: 'World Wide Shipping',
    description: 'Passage of Lorem Ipsum',
    icon: 'bi-truck',
  },
];

export default function ServiceFeatures() {
  return (
    <section className="service-features-section" aria-label="Customer services">
      <div className="service-features-wrapper">
        <div className="service-features-overlay" />
        <div className="service-features-grid">
          {SERVICE_FEATURES.map((feature) => (
            <div className="service-feature" key={feature.title}>
              <div className="service-feature-icon">
                <i className={`bi ${feature.icon}`} />
              </div>
              <div className="service-feature-copy">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
