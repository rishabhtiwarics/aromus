// Photos duplicated inside CSS for seamless marquee loop
const PHOTOS = [
  '/img/homehero.png',
  '/img/one.png',
  '/img/homehero2.png',
  '/img/Gemini_Generated_Image_26ntcw26ntcw26nt (1).png',
  '/img/Gemini_Generated_Image_t68tfpt68tfpt68t.png',
  '/img/homehero.png',
  '/img/homehero2.png',
];

export default function InstaFollow() {
  return (
    <section className="insta-section">
      {/* Header — centred, same max-width as the rest of the site */}
      <div className="insta-header">
        <p className="insta-eyebrow">
          <span className="insta-eyebrow-dot" />
          Instagram
        </p>
        <h2 className="insta-title">Follow Our World</h2>
        <a
          href="https://instagram.com/aromusparfum"
          target="_blank"
          rel="noopener noreferrer"
          className="insta-handle"
        >
          @aromusparfum
        </a>
      </div>

      {/* Marquee wrapper — clips overflow */}
      <div className="insta-marquee-outer">
        <div className="insta-marquee-track">
          {/* Original set + duplicate for seamless infinite loop */}
          {[...PHOTOS, ...PHOTOS].map((src, i) => (
            <div key={i} className="insta-photo">
              <img src={src} alt={`Aromus Instagram ${(i % PHOTOS.length) + 1}`} />
              <div className="insta-photo-overlay">
                <i className="bi bi-instagram" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
