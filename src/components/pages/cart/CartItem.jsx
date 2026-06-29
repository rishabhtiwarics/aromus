import { useDispatch } from 'react-redux';
import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from '../../../store/cartSlice';

const formatPrice = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);

export default function CartItem({ item, compact = false }) {
  const dispatch = useDispatch();

  return (
    <article className={`cart-item${compact ? ' cart-item-compact' : ''}`}>
      <img
        className="cart-item-image"
        src={item.image}
        alt={item.name}
        style={{ objectPosition: item.imagePosition || 'center' }}
      />

      <div className="cart-item-content">
        <div className="cart-item-heading">
          <div>
            <span>{item.category}</span>
            <h3>{item.name}</h3>
          </div>
          <button
            className="cart-item-remove"
            type="button"
            aria-label={`Remove ${item.name} from cart`}
            onClick={() => dispatch(removeFromCart(item.id))}
          >
            <i className="bi bi-trash3" aria-hidden="true" />
          </button>
        </div>

        <div className="cart-item-bottom">
          <div className="cart-quantity" aria-label={`${item.name} quantity`}>
            <button
              type="button"
              aria-label={`Decrease ${item.name} quantity`}
              onClick={() => dispatch(decreaseQuantity(item.id))}
            >
              <i className="bi bi-dash" />
            </button>
            <span>{item.quantity}</span>
            <button
              type="button"
              aria-label={`Increase ${item.name} quantity`}
              onClick={() => dispatch(increaseQuantity(item.id))}
            >
              <i className="bi bi-plus" />
            </button>
          </div>
          <strong>{formatPrice(item.price * item.quantity)}</strong>
        </div>
      </div>
    </article>
  );
}
