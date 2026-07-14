import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart, selectIsInCart } from '../../../store/cartSlice';

const formatPrice = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

export default function ProductCard({ product, variant = 'default' }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isInCart = useSelector(selectIsInCart(product.id));
  const {
    name,
    category,
    price,
    originalPrice,
    rating,
    image,
    hoverImage,
    imagePosition = 'center',
    hoverImagePosition = 'center',
    badge,
  } = product;

  const openProductDetails = () => navigate(`/shop/product/${product.slug}`);

  const handleCardKeyDown = (event) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProductDetails();
    }
  };

  const handleAddToCart = (event) => {
    event?.stopPropagation();
    if (!isInCart) dispatch(addToCart(product));
  };

  if (variant === 'marquee') {
    return (
      <article
        className="brand-marquee-card"
        role="link"
        tabIndex={0}
        onClick={openProductDetails}
        onKeyDown={handleCardKeyDown}
      >
        <img
          src={image}
          alt={name}
          className="marquee-img"
          style={{ objectPosition: imagePosition }}
        />
        <div className="brand-marquee-card-overlay">
          <span>{name}</span>
          <button
            type="button"
            className={isInCart ? 'is-added' : ''}
            aria-label={isInCart ? `${name} is already in cart` : `Add ${name} to cart`}
            onClick={handleAddToCart}
            disabled={isInCart}
          >
            <i className={`bi ${isInCart ? 'bi-bag-check-fill' : 'bi-bag-plus'}`} aria-hidden="true" />
          </button>
        </div>
      </article>
    );
  }

  if (variant === 'signature-feature') {
    return (
      <article
        className="signature-feature-card"
        role="link"
        tabIndex={0}
        onClick={openProductDetails}
        onKeyDown={handleCardKeyDown}
      >
        <img
          className="signature-feature-background"
          src={image}
          alt=""
          aria-hidden="true"
          style={{ objectPosition: imagePosition }}
        />
        <div className="signature-feature-overlay" />

        <div className="signature-feature-content">
          <p className="signature-feature-eyebrow">
            <span />
            Aromus Signature
          </p>
          <div className="signature-feature-meta">
            <span>{category}</span>
            <span><i className="bi bi-star-fill" /> {rating}</span>
          </div>
          <h3>{name}</h3>
          <p className="signature-feature-description">
            Our defining fragrance—crafted with depth, character, and an unforgettable Aromus trail.
          </p>
          <div className="signature-feature-bottom">
            <div className="signature-feature-price">
              <strong>{formatPrice(price)}</strong>
              {originalPrice && <del>{formatPrice(originalPrice)}</del>}
            </div>
            <button
              type="button"
              className={`signature-feature-button${isInCart ? ' is-added' : ''}`}
              aria-label={isInCart ? `${name} is already in cart` : `Add ${name} to cart`}
              onClick={handleAddToCart}
              disabled={isInCart}
            >
              <i className={`bi ${isInCart ? 'bi-bag-check-fill' : 'bi-bag-plus'}`} />
              {isInCart ? 'Added to cart' : 'Add signature to cart'}
            </button>
          </div>
        </div>

        <div className="signature-feature-seal" aria-hidden="true">
          <i className="bi bi-stars" />
          <span>Our main<br />signature</span>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`product-card${variant === 'horizontal' ? ' product-card-horizontal' : ''}`}
      role="link"
      tabIndex={0}
      onClick={openProductDetails}
      onKeyDown={handleCardKeyDown}
    >
      <div className="product-card-media">
        {badge && variant !== 'horizontal' && (
          <span className="product-card-badge">{badge}</span>
        )}

        <img
          className="product-card-image product-card-image-primary"
          src={image}
          alt={name}
          style={{ objectPosition: imagePosition }}
        />
        <img
          className="product-card-image product-card-image-hover"
          src={hoverImage}
          alt=""
          aria-hidden="true"
          style={{ objectPosition: hoverImagePosition }}
        />

      </div>

      <div className="product-card-content">
        <div className="product-card-meta">
          <span>{category}</span>
          <span className="product-card-rating">
            <i className="bi bi-star-fill" aria-hidden="true" />
            {rating}
          </span>
        </div>

        <div className="product-card-details-row">
          <div className="product-card-details">
            <h3 className="product-card-name">{name}</h3>

            <div className="product-card-price">
              <span>{formatPrice(price)}</span>
              {originalPrice && <del>{formatPrice(originalPrice)}</del>}
            </div>
          </div>

          {variant !== 'horizontal' && (
            <button
              type="button"
              className={`product-card-inline-cart${isInCart ? ' is-added' : ''}`}
              aria-label={isInCart ? `${name} is already in cart` : `Add ${name} to cart`}
              onClick={handleAddToCart}
              disabled={isInCart}
            >
              <i className={`bi ${isInCart ? 'bi-bag-check-fill' : 'bi-bag-plus'}`} aria-hidden="true" />
            </button>
          )}
        </div>

        {variant === 'horizontal' && (
          <button
            type="button"
            className={`product-card-horizontal-cart${isInCart ? ' is-added' : ''}`}
            aria-label={isInCart ? `${name} is already in cart` : `Add ${name} to cart`}
            onClick={handleAddToCart}
            disabled={isInCart}
          >
            <i className={`bi ${isInCart ? 'bi-bag-check-fill' : 'bi-bag-plus'}`} aria-hidden="true" />
            {isInCart ? 'Added' : 'Add to Cart'}
          </button>
        )}
      </div>
    </article>
  );
}
