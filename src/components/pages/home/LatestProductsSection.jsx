import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ProductCard from '../shop/ProductCard';
import ProductCardSkeleton from '../shop/ProductCardSkeleton';
import { loadProducts } from '../../../store/productsSlice';

export default function LatestProductsSection() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.products);
  const products = items.filter((product) => product.isNewArrival).slice(0, 3);

  useEffect(() => {
    if (status === 'idle') dispatch(loadProducts());
  }, [dispatch, status]);

  return (
    <section className="latest-products-section">
      <div className="latest-products-inner">
        <div className="latest-products-layout">
          <aside className="latest-products-offer">
            <img src="/img/homehero2.png" alt="Aromus fragrance special offer" className="latest-products-offer-image" />
            <div className="latest-products-offer-overlay" />
            <div className="latest-products-offer-content">
              <span className="latest-products-offer-label">Limited time</span>
              <strong>New season,<br />new signature</strong>
              <p>Enjoy 20% off selected new arrivals.</p>
              <Link to="/shop">Shop New Arrivals <i className="bi bi-arrow-right" aria-hidden="true" /></Link>
            </div>
          </aside>

          <div className="latest-products-content">
            <div className="latest-products-heading">
              <p className="latest-products-eyebrow">
                <span className="latest-products-eyebrow-dot" />
                Just Arrived
              </p>
              <h2 className="latest-products-title">Explore our <span>latest scents</span></h2>
              <p className="latest-products-description">Freshly crafted fragrances, ready to become your next signature.</p>
            </div>

            <div className="latest-products-grid">
              {status === 'loading' || status === 'idle'
                ? Array.from({ length: 3 }, (_, index) => <ProductCardSkeleton key={index} />)
                : products.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
