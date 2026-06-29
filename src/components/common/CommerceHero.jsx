export default function CommerceHero({ eyebrow, title, accent, description }) {
  return (
    <section className="shop-hero commerce-hero">
      <div className="shop-hero-overlay" />
      <div className="shop-page-inner shop-hero-content">
        <p className="shop-eyebrow"><span /> {eyebrow}</p>
        <h1>{title}<br /><span>{accent}</span></h1>
        <p>{description}</p>
      </div>
    </section>
  );
}
