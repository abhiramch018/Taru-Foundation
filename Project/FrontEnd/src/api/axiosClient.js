import axios from 'axios';

// In dev, use Vite's /api proxy (vite.config.js → localhost:5000).
// In production, default to Render unless VITE_API_URL is set.
const baseURL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? '' : 'https://taru-foundation.onrender.com');

const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach Bearer token
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('taru_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle token expiration / 401
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear invalid credentials if expired
      const hadToken = localStorage.getItem('taru_token');
      if (hadToken && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('taru_token');
        localStorage.removeItem('taru_user');
        window.dispatchEvent(new Event('taru_auth_expired'));
      }
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
