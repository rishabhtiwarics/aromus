import { Link } from 'react-router-dom';

export default function AuthPageLayout({ eyebrow, title, description, children }) {
  return (
    <main className="auth-page">
      <div className="auth-page-visual">
        <div className="auth-page-visual-overlay" />
        <Link className="auth-page-brand" to="/">
          <img src="/img/logo.png" alt="Aromus" />
          <span>
            <strong>AROMUS</strong>
            <small>Essence of Elegance</small>
          </span>
        </Link>
        <div className="auth-page-quote">
          <span>Crafted for the discerning soul</span>
          <h2>Your signature begins with a single note.</h2>
        </div>
      </div>

      <div className="auth-page-panel">
        <div className="auth-page-card">
          <p className="auth-page-eyebrow"><span /> {eyebrow}</p>
          <h1>{title}</h1>
          <p className="auth-page-description">{description}</p>
          {children}
        </div>
      </div>
    </main>
  );
}
