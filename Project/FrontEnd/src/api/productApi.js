import axiosClient from './axiosClient';

export const productApi = {
  // GET /api/products (supports ?seller=..., ?all=true, ?category=...)
  getProducts: async (params = {}) => {
    const response = await axiosClient.get('/api/products', { params });
    return response.data;
  },

  // GET /api/products/:id
  getProductById: async (id) => {
    const response = await axiosClient.get(`/api/products/${id}`);
    return response.data;
  },

  // POST /api/products (Seller only)
  createProduct: async (productData) => {
    const response = await axiosClient.post('/api/products', productData);
    return response.data;
  },

  // PUT /api/products/:id (Seller only)
  updateProduct: async (id, productData) => {
    const response = await axiosClient.put(`/api/products/${id}`, productData);
    return response.data;
  },

  // DELETE /api/products/:id (Seller only)
  deleteProduct: async (id) => {
    const response = await axiosClient.delete(`/api/products/${id}`);
    return response.data;
  },
};
