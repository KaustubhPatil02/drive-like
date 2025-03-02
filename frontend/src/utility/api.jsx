import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://drive-like.vercel.app';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000, // 15 second timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor for error handling
api.interceptors.request.use(
  config => {
    // Add any auth tokens if needed
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Add response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timed out');
      return Promise.reject(new Error('Request timed out. Please try again.'));
    }
    
    if (error.response?.status === 504) {
      console.error('Gateway timeout');
      return Promise.reject(new Error('Server is taking too long to respond. Please try again.'));
    }

    if (error.response?.status === 404) {
      console.error('Resource not found');
      return Promise.reject(new Error('The requested resource was not found.'));
    }

    return Promise.reject(error);
  }
);

export default api;