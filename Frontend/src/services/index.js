import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/me', data),
  updatePassword: (data) => api.put('/auth/me/password', data),
  addAddress: (data) => api.post('/auth/me/addresses', data),
  updateAddress: (addressId, data) => api.put(`/auth/me/addresses/${addressId}`, data),
  deleteAddress: (addressId) => api.delete(`/auth/me/addresses/${addressId}`),
};

export const productService = {
  getProducts: (params) => api.get('/products', { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post('/products', data),
  updateProduct: (id, data) => api.put(`/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/${id}`),
};

export const cartService = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart', data),
  updateCartItem: (itemId, data) => api.put(`/cart/${itemId}`, data),
  removeFromCart: (itemId) => api.delete(`/cart/${itemId}`),
  clearCart: () => api.delete('/cart'),
};

export const wishlistService = {
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (data) => api.post('/wishlist', data),
  removeFromWishlist: (itemId) => api.delete(`/wishlist/${itemId}`),
};

export const orderService = {
  getOrders: (params) => api.get('/orders', { params }),
  getOrderById: (id) => api.get(`/orders/${id}`),
  createOrder: (data) => api.post('/orders', data),
  updateOrder: (id, data) => api.put(`/orders/${id}`, data),
  cancelOrder: (id) => api.put(`/orders/${id}/cancel`),
};

export const paymentService = {
  createPaymentIntent: (data) => api.post('/payments/create-intent', data),
  confirmPayment: (data) => api.post('/payments/confirm', data),
};

export const reviewService = {
  getReviews: (params) => api.get('/reviews', { params }),
  createReview: (data) => api.post('/reviews', data),
  updateReview: (id, data) => api.put(`/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
};
