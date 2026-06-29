import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import ProductCard from '../shop/ProductCard';
import ProductCardSkeleton from '../shop/ProductCardSkeleton';
import { loadProducts } from '../../../store/productsSlice';
import 'swiper/css';
import 'swiper/css/navigation';

export default function BestSellerSection() {
  const dispatch = useDispatch();
  const { items, status } = useSelector((state) => state.products);
  const products = items.slice(0, 7);

  useEffect(() => {
    if (status === 'idle') dispatch(loadProducts());
  }, [dispatch, status]);

  const slides = status === 'loading' || status === 'idle'
    ? Array.from({ length: 7 }, (_, index) => ({ id: `skeleton-${index}`, skeleton: true }))
    : products;

  return (
    <section className="best-seller-section" id="shop">
      <div className="best-seller-inner">
        <div className="best-seller-heading">
          <p className="best-seller-eyebrow">
            <span className="best-seller-eyebrow-dot" />
            Most Loved
          </p>
          <h2 className="best-seller-title">Our <span>best sellers</span></h2>
          <p className="best-seller-description">Signature scents our customers love most.</p>
        </div>

        <Swiper
          className="best-seller-swiper"
          modules={[Autoplay, Navigation]}
          spaceBetween={12}
          slidesPerView={2}
          loop={slides.length > 5}
          speed={850}
          autoplay={{ delay: 2200, disableOnInteraction: false, pauseOnMouseEnter: true }}
          navigation={{ prevEl: '.best-seller-prev', nextEl: '.best-seller-next' }}
          breakpoints={{
            577: { slidesPerView: 3, spaceBetween: 18 },
            992: { slidesPerView: 5, spaceBetween: 20 },
          }}
        >
          {slides.map((product) => (
            <SwiperSlide key={product.id}>
              {product.skeleton ? <ProductCardSkeleton /> : <ProductCard product={product} />}
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="best-seller-navigation" aria-label="Best seller navigation">
          <button type="button" className="best-seller-nav-button best-seller-prev" aria-label="Previous products">
            <i className="bi bi-arrow-left" aria-hidden="true" />
          </button>
          <button type="button" className="best-seller-nav-button best-seller-next" aria-label="Next products">
            <i className="bi bi-arrow-right" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
