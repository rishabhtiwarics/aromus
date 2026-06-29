import Header from '../../common/Header';
import Footer from '../../common/Footer';

const TERMS_SECTIONS = [
  {
    title: 'Using the Aromus website',
    body: 'By browsing or purchasing from Aromus Parfum, you agree to use the website for lawful personal shopping purposes and to provide accurate information when creating an account or placing an order.',
  },
  {
    title: 'Products and availability',
    body: 'We make every effort to show fragrance details, pricing, and availability accurately. Product images, packaging, notes, and offers may vary slightly due to updates, lighting, or limited-edition availability.',
  },
  {
    title: 'Pricing and payments',
    body: 'Prices are displayed in the currency shown at checkout. Orders are confirmed only after payment authorization. Aromus may correct obvious pricing or product errors before accepting an order.',
  },
  {
    title: 'Shipping and delivery',
    body: 'Delivery timelines are estimates and may change due to courier delays, address issues, customs checks, or events outside our control. Customers are responsible for sharing complete delivery details.',
  },
  {
    title: 'Returns and cancellations',
    body: 'Return or cancellation requests are reviewed according to the condition of the product, order status, hygiene requirements, and any policy displayed during purchase.',
  },
  {
    title: 'Intellectual property',
    body: 'The Aromus name, logo, product photography, fragrance descriptions, design elements, and website content belong to Aromus Parfum or its licensors and may not be copied without permission.',
  },
];

export default function TermsConditionsPage() {
  return (
    <>
      <Header />
      <main className="legal-page">
        <section className="legal-hero terms-hero">
          <div className="legal-hero-overlay" />
          <div className="legal-page-inner legal-hero-content">
            <p className="legal-eyebrow"><span /> Aromus Promise</p>
            <h1>Terms &amp; Conditions</h1>
            <p>
              Clear terms for a refined shopping experience, from browsing our
              collection to receiving your chosen scent.
            </p>
          </div>
        </section>

        <section className="legal-content-section">
          <div className="legal-page-inner">
            <div className="legal-intro">
              <span className="legal-intro-icon"><i className="bi bi-file-earmark-text" /></span>
              <div>
                <small>Last updated: June 26, 2026</small>
                <h2>Terms for shopping with Aromus</h2>
                <p>
                  These Terms &amp; Conditions explain the rules that apply when you
                  visit our website, create an account, place an order, or interact
                  with Aromus Parfum services.
                </p>
              </div>
            </div>

            <div className="legal-section-list">
              {TERMS_SECTIONS.map((section) => (
                <article className="legal-section-card" key={section.title}>
                  <h3>{section.title}</h3>
                  <p>{section.body}</p>
                </article>
              ))}
            </div>

            <div className="legal-contact-panel">
              <div>
                <small>Service support</small>
                <h2>Questions about these terms</h2>
                <p>
                  Reach out before placing an order if you need clarification on
                  policies, delivery, or returns.
                </p>
              </div>
              <a href="mailto:hello@aromusparfum.com">
                hello@aromusparfum.com
                <i className="bi bi-envelope" />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
