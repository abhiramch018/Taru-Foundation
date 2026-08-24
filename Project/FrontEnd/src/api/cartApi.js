import axiosClient from './axiosClient';

export const cartApi = {
  // GET /api/cart (Buyer only)
  getCart: async () => {
    const response = await axiosClient.get('/api/cart');
    return response.data;
  },

  // POST /api/cart (Buyer only)
  addToCart: async (productId, quantity = 1) => {
    const response = await axiosClient.post('/api/cart', { productId, quantity });
    return response.data;
  },

  // PUT /api/cart/:productId (Buyer only)
  updateCartItem: async (productId, quantity) => {
    const response = await axiosClient.put(`/api/cart/${productId}`, { quantity });
    return response.data;
  },

  // DELETE /api/cart/:productId (Buyer only)
  removeFromCart: async (productId) => {
    const response = await axiosClient.delete(`/api/cart/${productId}`);
    return response.data;
  },
};
