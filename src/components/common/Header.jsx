import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import ProductCard from '../pages/shop/ProductCard';
import CartItem from '../pages/cart/CartItem';
import CartItemSkeleton from '../pages/cart/CartItemSkeleton';
import { loadProducts } from '../../store/productsSlice';
import {
  selectCartCount,
  selectCartItems,
  selectCartSubtotal,
} from '../../store/cartSlice';

const SHOP_CATEGORIES = [
  { id: 'male', label: 'Male', subtitle: 'Bold & Powerful', img: '/img/homehero2.png' },
  { id: 'female', label: 'Female', subtitle: 'Soft & Floral', img: '/img/one.png' },
  { id: 'unisex', label: 'Unisex', subtitle: 'Free & Balanced', img: '/img/Gemini_Generated_Image_26ntcw26ntcw26nt (1).png' },
  { id: 'signature', label: 'Signature', subtitle: 'Rare & Exclusive', img: '/img/Gemini_Generated_Image_t68tfpt68tfpt68t.png' },
];

const formatPrice = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

function getStoredUser() {
  for (const key of ['user', 'currentUser', 'authUser']) {
    try {
      const value = localStorage.getItem(key);
      if (value) return JSON.parse(value);
    } catch {
      // Ignore malformed or unavailable local storage values.
    }
  }
  return null;
}

export default function Header() {
  const dispatch = useDispatch();
  const { items: products, status: productsStatus } = useSelector((state) => state.products);
  const cartItems = useSelector(selectCartItems);
  const cartCount = useSelector(selectCartCount);
  const cartSubtotal = useSelector(selectCartSubtotal);
  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(() => getStoredUser());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (productsStatus === 'idle') dispatch(loadProducts());
  }, [dispatch, productsStatus]);

  useEffect(() => {
    document.body.classList.toggle('sidebar-open', sidebarOpen);

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setSidebarOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.classList.remove('sidebar-open');
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [sidebarOpen]);

  useEffect(() => {
    document.body.classList.toggle('search-open', searchOpen);

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setSearchOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.classList.remove('search-open');
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [searchOpen]);

  useEffect(() => {
    document.body.classList.toggle('cart-open', cartOpen);

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setCartOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.classList.remove('cart-open');
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [cartOpen]);

  const closeSidebar = () => {
    setSidebarOpen(false);
    setShopOpen(false);
  };

  const openSidebar = () => {
    setSearchOpen(false);
    setCartOpen(false);
    setUser(getStoredUser());
    setSidebarOpen(true);
  };

  const openSearch = () => {
    closeSidebar();
    setCartOpen(false);
    setSearchOpen(true);
  };

  const openCart = () => {
    closeSidebar();
    setSearchOpen(false);
    setCartLoading(true);
    setCartOpen(true);
    window.setTimeout(() => setCartLoading(false), 350);
  };

  const handleLogout = () => {
    ['user', 'currentUser', 'authUser'].forEach((key) => localStorage.removeItem(key));
    setUser(null);
    closeSidebar();
  };

  const userName = user?.name || user?.username || user?.displayName || user?.email;
  const userImage = user?.image || user?.photo || user?.avatar || user?.photoURL;
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const searchResults = products.filter((product) =>
    `${product.name} ${product.category} ${product.gender} ${product.collections?.join(' ')}`
      .toLowerCase()
      .includes(normalizedQuery),
  );

  return (
    <>
      <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
        <div className="header-inner">
          <Link to="/" className="logo-wrap" aria-label="Aromus home">
            <div className="logo-circle">
              <img src="/img/logo.png" alt="Aromus Logo" />
            </div>
            <div className="logo-text">
              <span className="logo-aromus">AROMUS</span>
              <span className="logo-divider">
                <span className="logo-divider-line" />
                <span className="logo-divider-gem">✦</span>
                <span className="logo-divider-line" />
              </span>
              <span className="logo-parfum">PARFUM</span>
              <span className="logo-essence">Essence of Elegance</span>
            </div>
          </Link>

          <div className="header-icons">
            <button
              className="hdr-icon icon-only header-search"
              type="button"
              title="Search"
              aria-label="Open search"
              aria-expanded={searchOpen}
              aria-controls="header-search-panel"
              onClick={openSearch}
            >
              <i className="bi bi-search" />
            </button>
            <button
              className="hdr-icon"
              type="button"
              title="Cart"
              aria-label={`Open cart with ${cartCount} items`}
              aria-expanded={cartOpen}
              aria-controls="cart-sidebar"
              onClick={openCart}
            >
              <i className="bi bi-bag" />
              <span className="pill-label">Cart</span>
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </button>
            <div className="header-account-wrap">
              <button className="hdr-icon header-account" type="button" title="Account" aria-label="Account">
                <i className="bi bi-person" />
                <span className="pill-label">Account</span>
              </button>

              <div className="header-account-dropdown">
                {user ? (
                  <>
                    <div className="header-account-user">
                      {userImage ? (
                        <img src={userImage} alt={userName || 'User'} />
                      ) : (
                        <span className="header-account-avatar">
                          {(userName || 'U').charAt(0).toUpperCase()}
                        </span>
                      )}
                      <div>
                        <small>Welcome back</small>
                        <strong>{userName || 'Aromus Member'}</strong>
                        {user?.email && <span>{user.email}</span>}
                      </div>
                    </div>
                    <button className="header-account-logout" type="button" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right" />
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="header-account-guest">
                    <span>Member Access</span>
                    <h3>Welcome to Aromus</h3>
                    <p>Sign in to save favourites and discover your signature scent.</p>
                    <Link to="/login">
                      <i className="bi bi-person" />
                      Login
                    </Link>
                  </div>
                )}
              </div>
            </div>
            <button
              className="hdr-icon icon-only header-menu"
              type="button"
              title="Menu"
              aria-label="Open menu"
              aria-expanded={sidebarOpen}
              aria-controls="site-sidebar"
              onClick={openSidebar}
            >
              <i className="bi bi-list" />
            </button>
          </div>
        </div>
      </header>

      <button
        className={`search-panel-backdrop${searchOpen ? ' is-open' : ''}`}
        type="button"
        aria-label="Close search"
        tabIndex={searchOpen ? 0 : -1}
        onClick={() => setSearchOpen(false)}
      />

      <section
        id="header-search-panel"
        className={`header-search-panel${searchOpen ? ' is-open' : ''}`}
        aria-hidden={!searchOpen}
      >
        <div className="header-search-panel-inner">
          <div className="header-search-panel-top">
            <div>
              <span>Discover Aromus</span>
              <h2>Search fragrances</h2>
            </div>
            <button
              className="header-search-close"
              type="button"
              aria-label="Close search"
              onClick={() => setSearchOpen(false)}
            >
              <i className="bi bi-x-lg" />
            </button>
          </div>

          <div className="header-search-form">
            <label className="header-search-field">
              <i className="bi bi-search" aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by perfume name or category"
                autoComplete="off"
              />
            </label>
          </div>

          <div className="header-search-results">
            <div className="header-search-results-title">
              <span>{searchQuery.trim() ? `Results for “${searchQuery.trim()}”` : 'Popular fragrances'}</span>
              <small>{searchResults.length} products</small>
            </div>

            {searchResults.length > 0 ? (
              <div className="header-search-results-grid">
                {searchResults.map((product) => (
                  <ProductCard key={product.id} product={product} variant="horizontal" />
                ))}
              </div>
            ) : (
              <div className="header-search-empty">
                <i className="bi bi-search" aria-hidden="true" />
                <p>No fragrance found. Try another name or category.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <button
        className={`cart-sidebar-backdrop${cartOpen ? ' is-open' : ''}`}
        type="button"
        aria-label="Close cart"
        tabIndex={cartOpen ? 0 : -1}
        onClick={() => setCartOpen(false)}
      />

      <aside
        id="cart-sidebar"
        className={`cart-sidebar${cartOpen ? ' is-open' : ''}`}
        aria-hidden={!cartOpen}
      >
        <div className="cart-sidebar-top">
          <div>
            <span>Your selection</span>
            <h2>Shopping bag</h2>
          </div>
          <button
            className="sidebar-close"
            type="button"
            aria-label="Close cart"
            onClick={() => setCartOpen(false)}
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="cart-sidebar-content">
          {cartLoading ? (
            Array.from({ length: Math.max(2, cartItems.length) }, (_, index) => (
              <CartItemSkeleton key={index} compact />
            ))
          ) : cartItems.length ? (
            cartItems.map((item) => <CartItem key={item.id} item={item} compact />)
          ) : (
            <div className="cart-sidebar-empty">
              <span><i className="bi bi-bag" /></span>
              <h3>Your bag is empty</h3>
              <p>Discover a fragrance and begin your Aromus collection.</p>
              <Link to="/shop" onClick={() => setCartOpen(false)}>Explore fragrances</Link>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-sidebar-summary">
            <div>
              <span>Subtotal</span>
              <strong>{formatPrice(cartSubtotal)}</strong>
            </div>
            <small>Shipping and taxes calculated at checkout.</small>
            <Link className="cart-sidebar-checkout" to="/checkout" onClick={() => setCartOpen(false)}>
              Checkout
              <i className="bi bi-arrow-right" />
            </Link>
            <Link className="cart-sidebar-view" to="/cart" onClick={() => setCartOpen(false)}>
              View shopping bag
            </Link>
          </div>
        )}
      </aside>

      <button
        className={`sidebar-backdrop${sidebarOpen ? ' is-open' : ''}`}
        type="button"
        aria-label="Close menu"
        tabIndex={sidebarOpen ? 0 : -1}
        onClick={closeSidebar}
      />

      <aside
        id="site-sidebar"
        className={`site-sidebar${sidebarOpen ? ' is-open' : ''}`}
        aria-hidden={!sidebarOpen}
      >
        <div className="sidebar-top">
          <div className="sidebar-section-overlay" />
          <div className="sidebar-top-content">
            <Link to="/" className="sidebar-brand" onClick={closeSidebar}>
              <img src="/img/logo.png" alt="" />
              <span>
                <strong>AROMUS</strong>
                <small>Essence of Elegance</small>
              </span>
            </Link>
            <button className="sidebar-close" type="button" aria-label="Close menu" onClick={closeSidebar}>
              <i className="bi bi-x-lg" />
            </button>
          </div>
        </div>

        <div className="sidebar-main">
          <div className="sidebar-content">
            <nav className="sidebar-nav" aria-label="Mobile navigation">
              <Link to="/" onClick={closeSidebar}>
                <span>Home</span>
                <i className="bi bi-arrow-right" />
              </Link>
              <a href="#about" onClick={closeSidebar}>
                <span>About</span>
                <i className="bi bi-arrow-right" />
              </a>
              <Link to="/contact" onClick={closeSidebar}>
                <span>Contact</span>
                <i className="bi bi-arrow-right" />
              </Link>
              <button
                className={`sidebar-shop-toggle${shopOpen ? ' is-open' : ''}`}
                type="button"
                aria-expanded={shopOpen}
                onClick={() => setShopOpen((open) => !open)}
              >
                <span>Shop</span>
                <i className="bi bi-chevron-down" />
              </button>
            </nav>

            <div className={`sidebar-categories${shopOpen ? ' is-open' : ''}`}>
              <div className="sidebar-category-grid">
                {SHOP_CATEGORIES.map((category) => (
                  <Link
                    key={category.label}
                    className="sidebar-category"
                    to={`/shop?category=${category.id}`}
                    onClick={closeSidebar}
                  >
                    <img src={category.img} alt="" />
                    <span className="sidebar-category-shade" />
                    <span className="sidebar-category-copy">
                      <small>{category.subtitle}</small>
                      <strong>{category.label}</strong>
                    </span>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-section-overlay" />
          <div className="sidebar-footer-content">
            <div className="sidebar-auth">
              {user ? (
                <>
                  <div className="sidebar-user">
                    {userImage ? (
                      <img src={userImage} alt={userName || 'User'} />
                    ) : (
                      <span className="sidebar-user-fallback">
                        {(userName || 'U').charAt(0).toUpperCase()}
                      </span>
                    )}
                    <div>
                      <small>Welcome back</small>
                      <strong>{userName || 'Aromus Member'}</strong>
                    </div>
                  </div>
                  <button className="sidebar-auth-btn sidebar-logout" type="button" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="sidebar-auth-actions">
                  <Link className="sidebar-auth-btn sidebar-login" to="/login" onClick={closeSidebar}>Login</Link>
                  <Link className="sidebar-auth-btn sidebar-register" to="/register" onClick={closeSidebar}>Registration</Link>
                </div>
              )}
            </div>

            <div className="sidebar-desktop-offer">
              <div className="sidebar-offer-copy">
                <span>Exclusive Online Offer</span>
                <strong>Discover your signature scent</strong>
                <small>Enjoy special savings on selected fragrances.</small>
              </div>
              <Link to="/shop" className="sidebar-offer-btn" onClick={closeSidebar}>
                Shop Now
                <i className="bi bi-arrow-right" />
              </Link>
            </div>

            <div className="sidebar-socials" aria-label="Social media links">
              <a href="#instagram" aria-label="Instagram"><i className="bi bi-instagram" /></a>
              <a href="#facebook" aria-label="Facebook"><i className="bi bi-facebook" /></a>
              <a href="#twitter" aria-label="Twitter"><i className="bi bi-twitter-x" /></a>
              <a href="#youtube" aria-label="YouTube"><i className="bi bi-youtube" /></a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
