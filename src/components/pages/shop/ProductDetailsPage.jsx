import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import CommerceHero from '../../common/CommerceHero';
import ServiceFeatures from '../home/ServiceFeatures';
import ProductGallery from './ProductGallery';
import ProductComments from './ProductComments';
import { loadProduct } from '../../../store/productsSlice';
import { addToCart, selectIsInCart } from '../../../store/cartSlice';

const formatPrice = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

export default function ProductDetailsPage() {
  const { productSlug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selected: product, detailStatus: status, error } = useSelector((state) => state.products);
  const isInCart = useSelector(selectIsInCart(product?._id));
  const [quantity, setQuantity] = useState(1);
  const [selectedSku, setSelectedSku] = useState('');

  useEffect(() => {
    dispatch(loadProduct(productSlug));
  }, [dispatch, productSlug]);

  if ((status === 'loading' || status === 'idle') && !product) {
    return (
      <>
        <Header />
        <main className="shop-page">
          <CommerceHero
            eyebrow="Aromus Fragrance"
            title="Discover the"
            accent="details"
            description="Preparing your fragrance experience."
          />
          <div className="product-details-loading">
            <span />
            <span />
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (status === 'failed') return <Navigate to="/shop" replace state={{ error }} />;
  if (!product || !product.variants?.length) return null;

  const selectedSize = product.variants.find((variant) => variant.sku === selectedSku)
    || product.variants.find((variant) => variant.label === '50 ml')
    || product.variants[0];

  const selectedPrice = selectedSize.price;
  const selectedOriginalPrice = selectedSize.originalPrice || null;

  const addSelectedProduct = () => {
    if (isInCart) return;
    dispatch(addToCart({
      ...product,
      price: selectedPrice,
      originalPrice: selectedOriginalPrice,
      selectedSize: selectedSize.label,
      variantId: selectedSize._id,
      sku: selectedSize.sku,
      quantity,
    }));
  };

  const checkoutNow = () => {
    addSelectedProduct();
    navigate('/checkout');
  };

  return (
    <>
      <Header />
      <main className="shop-page product-details-page">
        <CommerceHero
          eyebrow={`${product.category} · Product Details`}
          title={product.name}
          accent="Aromus fragrance"
          description="Explore every detail, choose your bottle, and make this fragrance part of your story."
        />

        <section className="product-details-section">
          <div className="shop-page-inner">
            <div className="product-details-breadcrumb">
              <Link className="product-detail-pill product-detail-back-pill" to="/shop">
                <i className="bi bi-arrow-left" />
                Back to fragrances
              </Link>
              <span className="product-detail-pill product-detail-category-pill">
                <i className="bi bi-stars" />
                {product.category}
              </span>
            </div>

            <ProductGallery product={product} />

            <div className="product-details-layout">
              <section className="product-purchase-panel">
                <div className="product-purchase-heading">
                  <div>
                    <p className="shop-products-eyebrow"><span /> Aromus Selection</p>
                    <h1>{product.name}</h1>
                    <span>{product.category} · {product.gender}</span>
                  </div>
                  <div className="product-details-rating">
                    <i className="bi bi-star-fill" />
                    <strong>{product.rating}</strong>
                    <small>Customer rating</small>
                  </div>
                </div>

                <p className="product-details-description">
                  A refined fragrance composed to move from a radiant opening into a deep,
                  memorable trail. Designed for daily rituals and the moments worth remembering.
                </p>

                <div className="product-details-price">
                  <strong>{formatPrice(selectedPrice)}</strong>
                  {selectedOriginalPrice && <del>{formatPrice(selectedOriginalPrice)}</del>}
                  {product.badge && <span>{product.badge}</span>}
                </div>

                <div className="product-option-block">
                  <div className="product-option-heading">
                    <strong>Bottle size</strong>
                    <span>{selectedSize.label} selected</span>
                  </div>
                  <div className="product-size-options">
                    {product.variants.map((size) => (
                      <button
                        key={size.label}
                        type="button"
                        className={selectedSize.label === size.label ? 'is-active' : ''}
                        onClick={() => setSelectedSku(size.sku)}
                        disabled={isInCart}
                      >
                        <span className="product-size-bottle">
                          <i className="bi bi-droplet-fill" />
                        </span>
                        <span className="product-size-copy">
                          <strong>{size.label}</strong>
                          <small>{formatPrice(size.price)}</small>
                        </span>
                        <i className="bi bi-check-circle-fill product-size-check" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="product-buy-row">
                  <div className="product-details-quantity">
                    <span>Quantity</span>
                    <div>
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                        disabled={isInCart}
                      >
                        <i className="bi bi-dash" />
                      </button>
                      <strong>{quantity}</strong>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => setQuantity((value) => value + 1)}
                        disabled={isInCart}
                      >
                        <i className="bi bi-plus" />
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`product-details-add${isInCart ? ' is-added' : ''}`}
                    onClick={addSelectedProduct}
                    disabled={isInCart}
                  >
                    <i className={`bi ${isInCart ? 'bi-bag-check-fill' : 'bi-bag-plus'}`} />
                    {isInCart ? 'Added to cart' : 'Add to cart'}
                  </button>

                  <button type="button" className="product-details-checkout" onClick={checkoutNow}>
                    Go to checkout
                    <i className="bi bi-arrow-right" />
                  </button>
                </div>

                <div className="product-details-benefits">
                  <span><i className="bi bi-truck" /> Free shipping</span>
                  <span><i className="bi bi-shield-check" /> Secure purchase</span>
                  <span><i className="bi bi-arrow-counterclockwise" /> Easy returns</span>
                </div>
              </section>

              <ProductComments productId={product._id} productName={product.name} />
            </div>
          </div>
        </section>

        <div className="product-details-service-features">
          <ServiceFeatures />
        </div>
      </main>
      <Footer />
    </>
  );
}
