export default function CartItemSkeleton({ compact = false }) {
  return (
    <div
      className={`cart-item cart-item-skeleton${compact ? ' cart-item-compact' : ''}`}
      aria-hidden="true"
    >
      <div className="cart-skeleton-block cart-item-image" />
      <div className="cart-item-content">
        <div>
          <div className="cart-skeleton-line cart-skeleton-category" />
          <div className="cart-skeleton-line cart-skeleton-title" />
        </div>
        <div className="cart-item-bottom">
          <div className="cart-skeleton-block cart-skeleton-quantity" />
          <div className="cart-skeleton-line cart-skeleton-price" />
        </div>
      </div>
    </div>
  );
}
