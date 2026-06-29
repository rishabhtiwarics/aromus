import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import { loadProducts } from '../../../store/productsSlice';

const FILTERS = [
  { id: 'all', label: 'All', icon: 'bi-grid' },
  { id: 'male', label: 'Male', icon: 'bi-gender-male' },
  { id: 'female', label: 'Female', icon: 'bi-gender-female' },
  { id: 'unisex', label: 'Unisex', icon: 'bi-people' },
  { id: 'signature', label: 'Signature', icon: 'bi-stars' },
];

export default function ShopPage() {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.products);
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const requestedCategory = searchParams.get('category')?.toLowerCase() || 'all';
  const activeCategory = FILTERS.some((filter) => filter.id === requestedCategory)
    ? requestedCategory
    : 'all';

  useEffect(() => {
    if (status === 'idle') dispatch(loadProducts());
  }, [dispatch, status]);

  const products = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return items.filter((product) => {
      const matchesCategory =
        activeCategory === 'all' || product.collections?.includes(activeCategory);
      const searchableText =
        `${product.name} ${product.category} ${product.gender} ${product.collections?.join(' ')}`;
      const matchesQuery =
        !normalizedQuery || searchableText.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, items, query]);

  const setCategory = (category) => {
    const nextParams = new URLSearchParams(searchParams);
    if (category === 'all') nextParams.delete('category');
    else nextParams.set('category', category);
    setSearchParams(nextParams);
  };

  const activeLabel = FILTERS.find((filter) => filter.id === activeCategory)?.label;
  const signatureProduct = items.find((product) => product.collections?.includes('signature'));

  return (
    <>
      <Header />
      <main className="shop-page">
        <section className="shop-hero">
          <div className="shop-hero-overlay" />
          <div className="shop-page-inner shop-hero-content">
            <p className="shop-eyebrow"><span /> Aromus Collection</p>
            <h1>Find your<br /><span>signature scent</span></h1>
            <p>Explore fragrances crafted for every mood, memory, and moment.</p>
          </div>
        </section>

        <section className="shop-products-section">
          <div className="shop-page-inner">
            <div className="shop-products-toolbar">
              <div>
                <p className="shop-products-eyebrow">
                  <span />
                  Our Collection
                </p>
                <h2>{activeCategory === 'all' ? 'All fragrances' : `${activeLabel} fragrances`}</h2>
              </div>
              <label className="shop-search-field">
                <i className="bi bi-search" aria-hidden="true" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search fragrances"
                />
              </label>
            </div>

            {signatureProduct && (
              <div className="shop-signature-highlight">
                <ProductCard product={signatureProduct} variant="signature-feature" />
              </div>
            )}

            <div className="shop-filter-panel" aria-label="Filter fragrances">
              <div className="shop-filter-heading">
                <span className="shop-filter-icon"><i className="bi bi-sliders" /></span>
                <div>
                  <strong>Shop by category</strong>
                  <small>Find a fragrance made for you</small>
                </div>
              </div>

              <div className="shop-filter-options">
                {FILTERS.map((filter) => {
                  const count = filter.id === 'all'
                    ? items.length
                    : items.filter((product) => product.collections?.includes(filter.id)).length;

                  return (
                    <button
                      key={filter.id}
                      type="button"
                      className={`shop-filter-button${activeCategory === filter.id ? ' is-active' : ''}`}
                      onClick={() => setCategory(filter.id)}
                      aria-pressed={activeCategory === filter.id}
                    >
                      <i className={`bi ${filter.icon}`} aria-hidden="true" />
                      <span>{filter.label}</span>
                      <small>{count}</small>
                    </button>
                  );
                })}
              </div>

              <div className="shop-filter-result">
                <span><strong>{products.length}</strong> fragrances found</span>
                {(activeCategory !== 'all' || query) && (
                  <button
                    type="button"
                    onClick={() => {
                      setCategory('all');
                      setQuery('');
                    }}
                  >
                    Clear filters
                    <i className="bi bi-x" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>

            {status === 'failed' && <p className="shop-error">{error}</p>}

            {status === 'loading' || status === 'idle' ? (
              <div className="shop-products-grid">
                {Array.from({ length: 6 }, (_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            ) : products.length ? (
              <div className="shop-products-grid">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="shop-empty">
                <i className="bi bi-search" aria-hidden="true" />
                <h3>No fragrance found</h3>
                <p>Try another product name or category.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
