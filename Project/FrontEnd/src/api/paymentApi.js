import axiosClient from './axiosClient';

export const paymentApi = {
  // POST /api/payments (Buyer only)
  createPayment: async (orderId, method = 'TEST') => {
    const response = await axiosClient.post('/api/payments', { orderId, method });
    return response.data;
  },

  // POST /api/payments/verify (Buyer only)
  verifyPayment: async (paymentId, success = true) => {
    const response = await axiosClient.post('/api/payments/verify', { paymentId, success });
    return response.data;
  },

  // GET /api/payments (Buyer only)
  getMyPayments: async () => {
    const response = await axiosClient.get('/api/payments');
    return response.data;
  },
};
