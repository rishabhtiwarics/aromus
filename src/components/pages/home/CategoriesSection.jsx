import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { loadCategories } from '../../../store/productsSlice';

export default function CategoriesSection() {
  const dispatch = useDispatch();
  const { categories, categoriesStatus, error } = useSelector((state) => state.products);
  useEffect(() => { if (categoriesStatus === 'idle') dispatch(loadCategories()); }, [categoriesStatus, dispatch]);

  return (
    <div className="cat-section-wrapper">
      <section className="cat-section">
        <div className="cat-left">
          <p className="cat-eyebrow"><span className="cat-eyebrow-dot" />Shop by Category</p>
          <h2 className="cat-title">Find your<br />perfect<br /><span className="cat-title-gold">scent</span></h2>
          <p className="cat-desc">From bold masculines to delicate florals — discover the fragrance that tells your story.</p>
          <Link to="/shop" className="cat-view-all">View All Fragrances <i className="bi bi-arrow-right" /></Link>
        </div>
        <div className="cat-grid">
          {categoriesStatus === 'failed' && <p className="shop-error">{error}</p>}
          {categories.map((category) => (
            <Link key={category._id} to={`/shop?category=${category.slug}`} className="cat-card" aria-label={`Shop ${category.name} fragrances`}>
              <img src={category.image} alt={category.name} className="cat-card-img" />
              <div className="cat-card-overlay" />
              <div className="cat-card-tag">Explore collection</div>
              <div className="cat-card-footer"><div><p className="cat-card-subtitle">{category.description}</p><h3 className="cat-card-label">{category.name}</h3></div><span className="cat-card-btn"><i className="bi bi-arrow-right" /></span></div>
            </Link>
          ))}
        </div>
        <Link to="/shop" className="cat-view-all cat-view-all-mobile">View All Fragrances <i className="bi bi-arrow-right" /></Link>
      </section>
    </div>
  );
}
