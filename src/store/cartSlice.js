import { createSlice } from '@reduxjs/toolkit';

const getStoredCart = () => {
  try {
    const storedCart = localStorage.getItem('aromus-cart');
    return storedCart ? JSON.parse(storedCart) : [];
  } catch {
    return [];
  }
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: getStoredCart(),
  },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);

      if (!existingItem) {
        state.items.push({ ...product, quantity: product.quantity || 1 });
      }
    },
    increaseQuantity: (state, action) => {
      const item = state.items.find((product) => product.id === action.payload);
      if (item) item.quantity += 1;
    },
    decreaseQuantity: (state, action) => {
      const item = state.items.find((product) => product.id === action.payload);
      if (!item) return;

      if (item.quantity > 1) item.quantity -= 1;
      else state.items = state.items.filter((product) => product.id !== action.payload);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((product) => product.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartSubtotal = (state) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
export const selectIsInCart = (productId) => (state) =>
  state.cart.items.some((item) => item.id === productId);

export default cartSlice.reducer;
