import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use(
  config => {
    // Add auth token if exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      console.error('Network Error:', error);
      return Promise.reject(new Error('Network error - Is the server running?'));
    }

    // Handle specific error cases
    switch (error.response.status) {
      case 404:
        console.error('404 Error:', error.response.data);
        return Promise.reject(new Error('Resource not found'));
      case 504:
        console.error('504 Error:', error.response.data);
        return Promise.reject(new Error('Server timeout - Please try again'));
      case 401:
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(new Error('Session expired. Please login again.'));
      default:
        console.error('API Error:', error.response.data);
        return Promise.reject(error.response.data?.error || 'An error occurred');
    }
  }
);

export default api;