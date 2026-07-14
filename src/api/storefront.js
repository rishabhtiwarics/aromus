import { api } from './client';

export const normalizeProduct = (product) => {
  const images = (product.images || []).map((image) => image.url);
  const defaultVariant = product.variants?.find((variant) => variant.label === '50 ml') || product.variants?.[0];
  return {
    ...product,
    id: product._id,
    name: product.title,
    category: product.category?.name || '',
    categorySlug: product.category?.slug,
    price: defaultVariant?.price ?? product.salePrice ?? product.price,
    originalPrice: defaultVariant?.originalPrice ?? (product.salePrice ? product.price : null),
    rating: Number(product.ratingAverage || 0).toFixed(1),
    image: images[0],
    hoverImage: images[1] || images[0],
    images,
    imagePosition: product.images?.[0]?.position || 'center',
    hoverImagePosition: product.images?.[1]?.position || 'center',
    variantId: defaultVariant?._id,
    sku: defaultVariant?.sku,
    selectedSize: defaultVariant?.label,
  };
};

export async function fetchProducts(params = {}) {
  const query = new URLSearchParams({ limit: '100', ...params });
  const response = await api.get(`/product?${query}`);
  return { products: response.data.map(normalizeProduct), meta: response };
}

export async function fetchProduct(slug) {
  const response = await api.get(`/product/slug/${encodeURIComponent(slug)}`);
  return normalizeProduct(response.data);
}

export const fetchCategories = async () => (await api.get('/category')).data;
