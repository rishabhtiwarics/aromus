import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import productsData from '../data/products.json';

export const loadProducts = createAsyncThunk('products/loadProducts', async () => {
  await new Promise((resolve) => setTimeout(resolve, 650));
  return productsData;
});

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loadProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(loadProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Unable to load products.';
      });
  },
});

export default productsSlice.reducer;
