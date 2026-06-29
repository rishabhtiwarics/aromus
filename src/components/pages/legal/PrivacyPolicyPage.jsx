import Header from '../../common/Header';
import Footer from '../../common/Footer';

const POLICY_SECTIONS = [
  {
    title: 'Information we collect',
    body: 'We collect the details you share when creating an account, placing an order, contacting support, or subscribing to Aromus updates. This may include your name, email address, phone number, billing and shipping details, and order preferences.',
  },
  {
    title: 'How we use your information',
    body: 'Your information helps us process purchases, deliver products, improve the shopping experience, respond to service requests, prevent misuse, and send fragrance updates only when you choose to receive them.',
  },
  {
    title: 'Orders and payments',
    body: 'Payment details are handled through secure payment partners. Aromus does not store full card numbers in the application. Order information is retained only as needed for fulfilment, support, accounting, and legal obligations.',
  },
  {
    title: 'Cookies and site experience',
    body: 'We may use cookies or similar technologies to keep the site working, remember cart activity, measure performance, and understand how visitors explore Aromus collections.',
  },
  {
    title: 'Sharing information',
    body: 'We share information only with trusted service providers that support our store, such as delivery, payment, analytics, hosting, and customer-care partners. We do not sell personal information.',
  },
  {
    title: 'Your choices',
    body: 'You can request access, correction, or deletion of your personal information, and you may unsubscribe from marketing messages at any time. Some records may be kept where required for legal or security reasons.',
  },
];

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="legal-page">
        <section className="legal-hero">
          <div className="legal-hero-overlay" />
          <div className="legal-page-inner legal-hero-content">
            <p className="legal-eyebrow"><span /> Aromus Care</p>
            <h1>Privacy Policy</h1>
            <p>
              We treat your personal details with the same care we give every fragrance:
              intentionally, respectfully, and only for clear reasons.
            </p>
          </div>
        </section>

        <section className="legal-content-section">
          <div className="legal-page-inner">
            <div className="legal-intro">
              <span className="legal-intro-icon"><i className="bi bi-shield-check" /></span>
              <div>
                <small>Last updated: June 26, 2026</small>
                <h2>How Aromus protects your data</h2>
                <p>
                  This Privacy Policy explains what information Aromus Parfum collects,
                  how it is used, and the choices available to you when you shop with us.
                </p>
              </div>
            </div>

            <div className="legal-section-list">
              {POLICY_SECTIONS.map((section) => (
                <article className="legal-section-card" key={section.title}>
                  <h3>{section.title}</h3>
                  <p>{section.body}</p>
                </article>
              ))}
            </div>

            <div className="legal-contact-panel">
              <div>
                <small>Need help?</small>
                <h2>Questions about privacy</h2>
                <p>
                  Contact our support team for privacy requests or account-related
                  questions.
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
