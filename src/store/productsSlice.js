import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchCategories, fetchProduct, fetchProducts } from '../api/storefront';

export const loadProducts = createAsyncThunk('products/loadProducts', async (params = {}) => fetchProducts(params));
export const loadProduct = createAsyncThunk('products/loadProduct', async (slug) => fetchProduct(slug));
export const loadCategories = createAsyncThunk('products/loadCategories', fetchCategories);

const productsSlice = createSlice({
  name: 'products',
  initialState: { items: [], selected: null, categories: [], status: 'idle', detailStatus: 'idle', categoriesStatus: 'idle', error: null },
  reducers: { clearSelectedProduct: (state) => { state.selected = null; state.detailStatus = 'idle'; } },
  extraReducers: (builder) => builder
    .addCase(loadProducts.pending, (state) => { state.status = 'loading'; state.error = null; })
    .addCase(loadProducts.fulfilled, (state, action) => { state.status = 'succeeded'; state.items = action.payload.products; })
    .addCase(loadProducts.rejected, (state, action) => { state.status = 'failed'; state.error = action.error.message; })
    .addCase(loadProduct.pending, (state) => { state.detailStatus = 'loading'; state.selected = null; state.error = null; })
    .addCase(loadProduct.fulfilled, (state, action) => { state.detailStatus = 'succeeded'; state.selected = action.payload; })
    .addCase(loadProduct.rejected, (state, action) => { state.detailStatus = 'failed'; state.error = action.error.message; })
    .addCase(loadCategories.pending, (state) => { state.categoriesStatus = 'loading'; })
    .addCase(loadCategories.fulfilled, (state, action) => { state.categoriesStatus = 'succeeded'; state.categories = action.payload; })
    .addCase(loadCategories.rejected, (state, action) => { state.categoriesStatus = 'failed'; state.error = action.error.message; }),
});

export const { clearSelectedProduct } = productsSlice.actions;
export default productsSlice.reducer;
