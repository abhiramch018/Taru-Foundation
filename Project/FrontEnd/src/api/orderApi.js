import axiosClient from './axiosClient';

export const orderApi = {
  // POST /api/orders (Buyer only)
  createOrder: async (shippingAddress) => {
    const response = await axiosClient.post('/api/orders', { shippingAddress });
    return response.data;
  },

  // GET /api/orders (Buyer only)
  getMyOrders: async () => {
    const response = await axiosClient.get('/api/orders');
    return response.data;
  },

  // GET /api/orders/:id (Buyer only)
  getOrderById: async (id) => {
    const response = await axiosClient.get(`/api/orders/${id}`);
    return response.data;
  },

  // PUT /api/orders/:id/cancel (Buyer only — PLACED or CONFIRMED only)
  cancelOrder: async (id) => {
    const response = await axiosClient.put(`/api/orders/${id}/cancel`);
    return response.data;
  },
};
