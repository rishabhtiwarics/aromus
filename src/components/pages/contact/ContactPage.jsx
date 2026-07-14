import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import { api } from '../../../api/client';

const CONTACT_ITEMS = [
  {
    icon: 'bi-telephone',
    label: 'Phone Number',
    value: '+33 1 42 86 00 00',
    href: 'tel:+33142860000',
  },
  {
    icon: 'bi-envelope',
    label: 'Email Address',
    value: 'hello@aromusparfum.com',
    href: 'mailto:hello@aromusparfum.com',
  },
  {
    icon: 'bi-whatsapp',
    label: 'Whatsapp',
    value: '+33 7 45 72 53 12',
    href: 'https://wa.me/33745725312',
  },
  {
    icon: 'bi-geo-alt',
    label: 'Our Office',
    value: '12 Rue de Parfum, Paris, France',
    href: 'https://maps.google.com/?q=12+Rue+de+Parfum+Paris+France',
  },
];

export default function ContactPage() {
  const [status, setStatus] = useState('');
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    try { await api.post('/contact', values); setStatus('Your message has been sent.'); form.reset(); }
    catch (error) { setStatus(error.message); }
  };

  return (
    <>
      <Header />
      <main className="contact-page">
        <section className="shop-hero contact-hero">
          <div className="shop-hero-overlay" />
          <div className="shop-page-inner shop-hero-content">
            <p className="shop-eyebrow"><span /> Contact Aromus</p>
            <h1>Get in touch<br /><span>with our fragrance house</span></h1>
            <p>Questions about an order, a scent, or your next signature fragrance? We are here to help.</p>
          </div>
        </section>

        <section className="contact-content-section">
          <div className="shop-page-inner contact-content-grid">
            <div className="contact-form-panel">
              <p className="contact-section-kicker"><span /> Write to us</p>
              <h2>Send a message</h2>
              <form className="contact-form" onSubmit={handleSubmit}>
                <label>
                  <span>Name</span>
                  <div className="contact-input-wrap">
                    <i className="bi bi-person" aria-hidden="true" />
                    <input type="text" name="name" placeholder="Your name" required />
                  </div>
                </label>
                <label>
                  <span>Email</span>
                  <div className="contact-input-wrap">
                    <i className="bi bi-envelope" aria-hidden="true" />
                    <input type="email" name="email" placeholder="example@email.com" required />
                  </div>
                </label>
                <label>
                  <span>Subject</span>
                  <div className="contact-input-wrap">
                    <i className="bi bi-chat-left-text" aria-hidden="true" />
                    <input type="text" name="subject" placeholder="Order, fragrance, or support" />
                  </div>
                </label>
                <label>
                  <span>Message</span>
                  <div className="contact-input-wrap contact-textarea-wrap">
                    <i className="bi bi-pencil" aria-hidden="true" />
                    <textarea name="message" rows="5" placeholder="Type your message" required />
                  </div>
                </label>
                <button type="submit">
                  Send Now
                  <i className="bi bi-arrow-right" aria-hidden="true" />
                </button>
                {status && <p className="contact-section-kicker">{status}</p>}
              </form>
            </div>

            <div className="contact-info-panel">
              <div className="contact-info-copy">
                <p className="contact-section-kicker"><span /> Visit & support</p>
                <h2>We would love to hear from you</h2>
                <p>
                  Our care team can help with product guidance, order questions, gift selection,
                  and fragrance recommendations.
                </p>
              </div>

              <div className="contact-info-grid">
                {CONTACT_ITEMS.map((item) => (
                  <a className="contact-info-card" href={item.href} key={item.label}>
                    <span className="contact-info-icon"><i className={`bi ${item.icon}`} /></span>
                    <span>
                      <strong>{item.label}</strong>
                      <small>{item.value}</small>
                    </span>
                  </a>
                ))}
              </div>

              <div className="contact-map-panel" aria-label="Aromus location map preview">
                <div className="contact-map-grid" />
                <div className="contact-map-pin">
                  <i className="bi bi-geo-alt-fill" />
                  <span>Aromus Parfum</span>
                </div>
                <div className="contact-map-note">
                  <strong>Paris Boutique</strong>
                  <small>12 Rue de Parfum</small>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="contact-cta-section">
          <div className="shop-page-inner">
            <div className="contact-cta-banner">
              <div className="contact-cta-overlay" />
              <div className="contact-cta-content">
                <p className="shop-eyebrow"><span /> Aromus Concierge</p>
                <h2>Ready to discover your perfect scent?</h2>
                <Link to="/shop">
                  Explore Collection
                  <i className="bi bi-arrow-right" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
