import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
  },
});

store.subscribe(() => {
  try {
    localStorage.setItem('aromus-cart', JSON.stringify(store.getState().cart.items));
  } catch {
    // Cart still works in memory when storage is unavailable.
  }
});
