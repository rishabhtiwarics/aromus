export default function ProductCardSkeleton() {
  return (
    <div className="product-card-skeleton" aria-hidden="true">
      <div className="skeleton-block product-card-skeleton-image" />
      <div className="product-card-skeleton-content">
        <div className="skeleton-block skeleton-line skeleton-line-small" />
        <div className="skeleton-block skeleton-line skeleton-line-title" />
        <div className="skeleton-block skeleton-line skeleton-line-price" />
      </div>
    </div>
  );
}
