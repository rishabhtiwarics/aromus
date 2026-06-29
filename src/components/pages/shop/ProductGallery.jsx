export default function ProductGallery({ product }) {
  const images = (product.images?.length ? product.images : [product.image, product.hoverImage])
    .filter(Boolean)
    .slice(0, 5);

  return (
    <div className={`product-gallery product-gallery-count-${images.length}`}>
      {images.map((image, index) => (
        <figure className={`product-gallery-item product-gallery-item-${index + 1}`} key={`${image}-${index}`}>
          <img
            src={image}
            alt={`${product.name} view ${index + 1}`}
            style={{ objectPosition: index === 0 ? product.imagePosition : product.hoverImagePosition }}
          />
          {index === 0 && (
            <figcaption>
              <span>Featured fragrance</span>
              <strong>{product.name}</strong>
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
