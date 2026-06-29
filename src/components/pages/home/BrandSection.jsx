import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../shop/ProductCard';
import { loadProducts } from '../../../store/productsSlice';

export default function BrandSection() {
  const dispatch = useDispatch();
  const { items: products, status } = useSelector((state) => state.products);
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (status === 'idle') dispatch(loadProducts());
  }, [dispatch, status]);

  const toggleVideo = () => {
    const video = videoRef.current;

    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <section className="brand-section">
      <div className="brand-video-container">
        <video
          ref={videoRef}
          className="brand-bg-video"
          autoPlay
          loop
          muted
          playsInline
          src="/img/bgvideo.mp4"
        />
      </div>

      <div className="brand-content-frame">
        <div className="brand-top-logo">
          <div className="logo-circle">
            <img src="/img/logo.png" alt="Aromus Logo" />
          </div>
        </div>

        {/* Main Content */}
        <div className="brand-main-content">
          <div className="brand-left">
            <p className="brand-eyebrow">
              <span className="brand-eyebrow-dot" />
              Discover Excellence
            </p>
            <h1 className="brand-title">
              timeless<br />fragrance
            </h1>
            <p className="brand-description">
              These exquisite fragrances will be an unforgettable gift
              that preserves wonderful memories and
              evokes deep feelings for many years.
            </p>
          </div>

          <div className="brand-right">
            <div className="vertical-marquee-container">
              <div className="vertical-marquee">
                {[...products, ...products].map((product, index) => (
                  <ProductCard
                    key={`${product.id}-${index}`}
                    product={product}
                    variant="marquee"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="brand-mobile-content">
          <div className="logo-circle">
            <img src="/img/logo.png" alt="Aromus Logo" />
          </div>

          <h1 className="brand-title">
            timeless<br />fragrance
          </h1>

          <button
            className="brand-mobile-video-btn"
            type="button"
            onClick={toggleVideo}
            aria-label={isPlaying ? 'Pause background video' : 'Play background video'}
          >
            <i className={`bi ${isPlaying ? 'bi-pause-fill' : 'bi-play-fill'}`} />
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
