import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import CommerceHero from '../../common/CommerceHero';
import {
  clearCart,
  selectCartItems,
  selectCartSubtotal,
} from '../../../store/cartSlice';

const formatPrice = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);
  const formRef = useRef(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    paymentMethod: 'razorpay',
  });

  const steps = [
    { id: 1, label: 'Identity', icon: 'bi-person' },
    { id: 2, label: 'Shipping', icon: 'bi-geo-alt' },
    { id: 3, label: 'Payment', icon: 'bi-credit-card' },
  ];

  const updateField = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const goToNextStep = () => {
    const currentPanel = formRef.current?.querySelector(`[data-checkout-step="${activeStep}"]`);
    const fields = Array.from(currentPanel?.querySelectorAll('input') || []);
    const invalidField = fields.find((field) => !field.checkValidity());

    if (invalidField) {
      invalidField.reportValidity();
      return;
    }

    setActiveStep((step) => Math.min(step + 1, 3));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (activeStep < 3) {
      goToNextStep();
      return;
    }
    dispatch(clearCart());
    setOrderPlaced(true);
  };

  return (
    <>
      <Header />
      <main className="shop-page checkout-page">
        <CommerceHero
          eyebrow="Secure Checkout"
          title="Complete your"
          accent="order"
          description="Add your delivery details and confirm your Aromus fragrance selection."
        />

        <section className="checkout-page-section">
          <div className="shop-page-inner">
            {orderPlaced ? (
              <div className="checkout-success">
                <span><i className="bi bi-check-lg" /></span>
                <p className="shop-products-eyebrow"><span /> Order Confirmed</p>
                <h2>Thank you for your order</h2>
                <p>Your fragrance journey has begun. We’ll prepare your Aromus selection with care.</p>
                <Link className="commerce-primary-button" to="/shop">Continue shopping</Link>
              </div>
            ) : items.length ? (
              <form ref={formRef} className="checkout-layout" onSubmit={handleSubmit}>
                <div className="checkout-form-card">
                  <div className="checkout-stepper" aria-label="Checkout progress">
                    {steps.map((step) => (
                      <button
                        key={step.id}
                        type="button"
                        className={`checkout-step${activeStep === step.id ? ' is-active' : ''}${activeStep > step.id ? ' is-complete' : ''}`}
                        onClick={() => {
                          if (step.id < activeStep) setActiveStep(step.id);
                        }}
                        disabled={step.id > activeStep}
                      >
                        <span><i className={`bi ${activeStep > step.id ? 'bi-check-lg' : step.icon}`} /></span>
                        <small>Step 0{step.id}</small>
                        <strong>{step.label}</strong>
                      </button>
                    ))}
                  </div>

                  {activeStep === 1 && (
                    <div className="checkout-step-panel" data-checkout-step="1">
                      <div className="checkout-panel-heading">
                        <span><i className="bi bi-person-badge" /></span>
                        <div>
                          <p className="shop-products-eyebrow"><span /> Step One</p>
                          <h2>Identify yourself</h2>
                          <small>Tell us who will receive this Aromus order.</small>
                        </div>
                      </div>

                      <div className="checkout-fields">
                        <label className="checkout-field-wide">
                          <span>Full name</span>
                          <div className="checkout-input-wrap">
                            <i className="bi bi-person" aria-hidden="true" />
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={updateField}
                              placeholder="Your full name"
                              autoComplete="name"
                              required
                            />
                          </div>
                        </label>
                        <label>
                          <span>Email address</span>
                          <div className="checkout-input-wrap">
                            <i className="bi bi-envelope" aria-hidden="true" />
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={updateField}
                              placeholder="you@example.com"
                              autoComplete="email"
                              required
                            />
                          </div>
                        </label>
                        <label>
                          <span>Phone number</span>
                          <div className="checkout-input-wrap">
                            <i className="bi bi-telephone" aria-hidden="true" />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={updateField}
                              placeholder="+91 98765 43210"
                              autoComplete="tel"
                              required
                            />
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  {activeStep === 2 && (
                    <div className="checkout-step-panel" data-checkout-step="2">
                      <div className="checkout-panel-heading">
                        <span><i className="bi bi-geo-alt" /></span>
                        <div>
                          <p className="shop-products-eyebrow"><span /> Step Two</p>
                          <h2>Shipping address</h2>
                          <small>Where should we deliver your fragrance selection?</small>
                        </div>
                      </div>

                      <div className="checkout-fields">
                        <label className="checkout-field-wide">
                          <span>Address</span>
                          <div className="checkout-input-wrap">
                            <i className="bi bi-house-door" aria-hidden="true" />
                            <input
                              type="text"
                              name="address"
                              value={formData.address}
                              onChange={updateField}
                              placeholder="House number and street"
                              autoComplete="street-address"
                              required
                            />
                          </div>
                        </label>
                        <label>
                          <span>City</span>
                          <div className="checkout-input-wrap">
                            <i className="bi bi-buildings" aria-hidden="true" />
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={updateField}
                              placeholder="City"
                              autoComplete="address-level2"
                              required
                            />
                          </div>
                        </label>
                        <label>
                          <span>State</span>
                          <div className="checkout-input-wrap">
                            <i className="bi bi-map" aria-hidden="true" />
                            <input
                              type="text"
                              name="state"
                              value={formData.state}
                              onChange={updateField}
                              placeholder="State"
                              autoComplete="address-level1"
                              required
                            />
                          </div>
                        </label>
                        <label>
                          <span>Postal code</span>
                          <div className="checkout-input-wrap">
                            <i className="bi bi-mailbox" aria-hidden="true" />
                            <input
                              type="text"
                              name="postalCode"
                              value={formData.postalCode}
                              onChange={updateField}
                              placeholder="Postal code"
                              autoComplete="postal-code"
                              required
                            />
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  {activeStep === 3 && (
                    <div className="checkout-step-panel" data-checkout-step="3">
                      <div className="checkout-panel-heading">
                        <span><i className="bi bi-wallet2" /></span>
                        <div>
                          <p className="shop-products-eyebrow"><span /> Step Three</p>
                          <h2>Payment method</h2>
                          <small>Choose how you would like to complete your payment.</small>
                        </div>
                      </div>

                      <div className="checkout-payment-options">
                        <label className={`checkout-payment-option${formData.paymentMethod === 'razorpay' ? ' is-selected' : ''}`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="razorpay"
                            checked={formData.paymentMethod === 'razorpay'}
                            onChange={updateField}
                          />
                          <span className="checkout-payment-option-icon">
                            <i className="bi bi-credit-card-2-front" />
                          </span>
                          <span className="checkout-payment-option-copy">
                            <strong>Pay securely with Razorpay</strong>
                            <small>UPI, cards, net banking and supported wallets</small>
                            <b>Online payment</b>
                          </span>
                          <i className="bi bi-check-circle-fill checkout-payment-check" />
                        </label>

                        <label className={`checkout-payment-option${formData.paymentMethod === 'cod' ? ' is-selected' : ''}`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="cod"
                            checked={formData.paymentMethod === 'cod'}
                            onChange={updateField}
                          />
                          <span className="checkout-payment-option-icon">
                            <i className="bi bi-cash-stack" />
                          </span>
                          <span className="checkout-payment-option-copy">
                            <strong>Cash on delivery</strong>
                            <small>Pay when your carefully packed order arrives</small>
                            <b>Pay at delivery</b>
                          </span>
                          <i className="bi bi-check-circle-fill checkout-payment-check" />
                        </label>
                      </div>

                      <div className="checkout-security-note">
                        <i className="bi bi-shield-lock" />
                        <div>
                          <strong>Protected checkout</strong>
                          <small>Your personal and payment information stays secure.</small>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="checkout-form-navigation">
                    {activeStep > 1 ? (
                      <button type="button" className="checkout-back-button" onClick={() => setActiveStep((step) => step - 1)}>
                        <i className="bi bi-arrow-left" />
                        Back
                      </button>
                    ) : (
                      <Link className="checkout-back-button" to="/cart">
                        <i className="bi bi-arrow-left" />
                        Return to bag
                      </Link>
                    )}

                    {activeStep < 3 && (
                      <button type="button" className="checkout-next-button" onClick={goToNextStep}>
                        Continue
                        <i className="bi bi-arrow-right" />
                      </button>
                    )}
                  </div>
                </div>

                <aside className="order-summary cart-order-summary checkout-summary">
                  <div className="cart-order-summary-header checkout-order-header">
                    <div className="cart-order-summary-overlay" />
                    <div className="cart-order-summary-header-content">
                      <span className="order-summary-eyebrow">Your order</span>
                      <h2>Order summary</h2>
                      <p>{items.length} {items.length === 1 ? 'fragrance' : 'fragrances'} ready for checkout</p>
                    </div>
                  </div>

                  <div className="cart-order-summary-main checkout-order-main">
                    <div className="checkout-summary-items">
                      {items.map((item) => (
                        <div className="checkout-summary-item" key={item.id}>
                          <img src={item.image} alt={item.name} />
                          <div>
                            <span>{item.category}</span>
                            <strong>{item.name}</strong>
                            <small>Quantity: {item.quantity}</small>
                          </div>
                          <b>{formatPrice(item.price * item.quantity)}</b>
                        </div>
                      ))}
                    </div>
                    <div className="order-summary-lines">
                      <div><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
                      <div><span>Shipping</span><strong>Free</strong></div>
                    </div>
                    <div className="order-summary-total">
                      <span>Total</span>
                      <strong>{formatPrice(subtotal)}</strong>
                    </div>
                    <div className="cart-order-assurance">
                      <i className="bi bi-shield-lock" aria-hidden="true" />
                      <span>Your details and order are protected with secure checkout.</span>
                    </div>
                  </div>

                  <div className="cart-order-summary-footer checkout-order-footer">
                    <div className="cart-order-summary-overlay" />
                    <div className="cart-order-summary-footer-content">
                      <span>Complete your Aromus order</span>
                      <button
                        className="commerce-primary-button"
                        type={activeStep === 3 ? 'submit' : 'button'}
                        onClick={activeStep < 3 ? goToNextStep : undefined}
                      >
                        {activeStep === 3
                          ? (formData.paymentMethod === 'razorpay' ? 'Pay with Razorpay' : 'Place COD order')
                          : 'Continue checkout'}
                        <i className={`bi ${activeStep === 3 ? 'bi-lock' : 'bi-arrow-right'}`} />
                      </button>
                      <Link className="checkout-return-link" to="/cart">
                        <i className="bi bi-arrow-left" />
                        Return to bag
                      </Link>
                    </div>
                  </div>
                </aside>
              </form>
            ) : (
              <div className="commerce-empty-state">
                <span><i className="bi bi-bag-x" /></span>
                <p className="shop-products-eyebrow"><span /> Checkout</p>
                <h2>No items to checkout</h2>
                <p>Add a fragrance to your bag before continuing to checkout.</p>
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
