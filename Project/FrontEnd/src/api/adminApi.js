import axiosClient from './axiosClient';

export const adminApi = {
  // PUT /api/admin/products/:id/approve
  approveProduct: async (id) => {
    const response = await axiosClient.put(`/api/admin/products/${id}/approve`);
    return response.data;
  },

  // PUT /api/admin/products/:id/reject
  rejectProduct: async (id) => {
    const response = await axiosClient.put(`/api/admin/products/${id}/reject`);
    return response.data;
  },

  // PUT /api/admin/orders/:orderId/status
  updateOrderStatus: async (orderId, status) => {
    const response = await axiosClient.put(`/api/admin/orders/${orderId}/status`, { status });
    return response.data;
  },

  // GET /api/admin/sellers/pending
  getPendingSellers: async () => {
    const response = await axiosClient.get('/api/admin/sellers/pending');
    return response.data;
  },

  // PUT /api/admin/sellers/:id/approve
  approveSeller: async (id) => {
    const response = await axiosClient.put(`/api/admin/sellers/${id}/approve`);
    return response.data;
  },

  // PUT /api/admin/sellers/:id/reject
  rejectSeller: async (id) => {
    const response = await axiosClient.put(`/api/admin/sellers/${id}/reject`);
    return response.data;
  },
};

