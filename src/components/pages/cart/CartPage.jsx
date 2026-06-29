import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import CommerceHero from '../../common/CommerceHero';
import CartItem from './CartItem';
import CartItemSkeleton from './CartItemSkeleton';
import {
  selectCartCount,
  selectCartItems,
  selectCartSubtotal,
} from '../../../store/cartSlice';

const formatPrice = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

export default function CartPage() {
  const [isLoading, setIsLoading] = useState(true);
  const items = useSelector(selectCartItems);
  const itemCount = useSelector(selectCartCount);
  const subtotal = useSelector(selectCartSubtotal);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 450);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <>
      <Header />
      <main className="shop-page cart-page">
        <CommerceHero
          eyebrow="Your Aromus Selection"
          title="Your shopping"
          accent="bag"
          description="Review your fragrances, adjust quantities, and continue to secure checkout."
        />

        <section className="cart-page-section">
          <div className="shop-page-inner">
            {items.length ? (
              <div className="cart-page-layout">
                <div className="cart-page-products">
                  <div className="commerce-section-heading">
                    <div>
                      <p className="shop-products-eyebrow"><span /> Selected Scents</p>
                      <h2>Your fragrances</h2>
                    </div>
                    <div className="cart-heading-actions">
                      <span>{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
                      <Link className="cart-continue-shopping" to="/shop">
                        <i className="bi bi-arrow-left" aria-hidden="true" />
                        Continue shopping
                      </Link>
                    </div>
                  </div>

                  <div className="cart-page-list">
                    {isLoading
                      ? Array.from({ length: Math.max(2, items.length) }, (_, index) => (
                        <CartItemSkeleton key={index} />
                      ))
                      : items.map((item) => <CartItem key={item.id} item={item} />)}
                  </div>
                </div>

                <aside className="order-summary cart-order-summary">
                  <div className="cart-order-summary-header">
                    <div className="cart-order-summary-overlay" />
                    <div className="cart-order-summary-header-content">
                      <span className="order-summary-eyebrow">Order details</span>
                      <h2>Your summary</h2>
                      <p>{itemCount} {itemCount === 1 ? 'fragrance' : 'fragrances'} selected</p>
                    </div>
                  </div>

                  <div className="cart-order-summary-main">
                    <div className="order-summary-lines">
                      <div><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
                      <div><span>Shipping</span><strong>Free</strong></div>
                    </div>
                    <div className="order-summary-total">
                      <span>Total</span>
                      <strong>{formatPrice(subtotal)}</strong>
                    </div>
                    <div className="cart-order-assurance">
                      <i className="bi bi-shield-check" aria-hidden="true" />
                      <span>Secure checkout and carefully packed delivery</span>
                    </div>
                  </div>

                  <div className="cart-order-summary-footer">
                    <div className="cart-order-summary-overlay" />
                    <div className="cart-order-summary-footer-content">
                      <span>Ready to make it yours?</span>
                      <Link className="commerce-primary-button" to="/checkout">
                        Proceed to checkout
                        <i className="bi bi-arrow-right" />
                      </Link>
                    </div>
                  </div>
                </aside>
              </div>
            ) : (
              <div className="commerce-empty-state">
                <span><i className="bi bi-bag" /></span>
                <p className="shop-products-eyebrow"><span /> Your Selection</p>
                <h2>Your shopping bag is empty</h2>
                <p>Explore our collection and find a scent that feels unmistakably yours.</p>
                <Link className="commerce-primary-button" to="/shop">Explore fragrances</Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
