import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../../common/Header';
import Footer from '../../common/Footer';
import ProductCard from '../shop/ProductCard';
import PromoBanner from './PromoBanner';
import InstaFollow from './InstaFollow';
import HeroSection from './HeroSection';
import TrustBar from './TrustBar';
import BrandSection from './BrandSection';
import CategoriesSection from './CategoriesSection';
import BestSellerSection from './BestSellerSection';
import LatestProductsSection from './LatestProductsSection';
import ComboOfferSection from './ComboOfferSection';
import { loadProducts } from '../../../store/productsSlice';

export default function HomePage() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.products);
  const signatureProduct = items.find((product) => product.collections?.includes('signature'));

  useEffect(() => {
    if (status === 'idle') dispatch(loadProducts());
  }, [dispatch, status]);

  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <TrustBar />
        {signatureProduct && (
          <section className="home-signature-section">
            <div className="shop-page-inner">
              <div className="shop-signature-highlight">
                <ProductCard product={signatureProduct} variant="signature-feature" />
              </div>
            </div>
          </section>
        )}
        <CategoriesSection />
        <BrandSection />
        <BestSellerSection />
        <ComboOfferSection />
        <LatestProductsSection />
      </main>
      <PromoBanner />
      <InstaFollow />
      <Footer />
    </>
  );
}
