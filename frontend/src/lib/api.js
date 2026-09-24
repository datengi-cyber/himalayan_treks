
import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  // ✅ Bug 4 fix — do NOT set Content-Type here
  // axios sets it automatically per request:
  //   JSON body    → application/json
  //   FormData     → multipart/form-data; boundary=...
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = Cookies.get('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // ✅ Bug 4 fix — if sending FormData, DELETE Content-Type
  // so axios sets it automatically with the correct boundary
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;