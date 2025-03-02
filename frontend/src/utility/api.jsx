import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 30000, // Increased timeout to 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  // Add retry configuration
  retry: 3,
  retryDelay: 1000
});

// Add request interceptor with retry logic
api.interceptors.request.use(
  config => {
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

// Add response interceptor with enhanced error handling
api.interceptors.response.use(
  response => response,
  async error => {
    const { config } = error;

    // If has no response, attempt retry
    if (!error.response && config && config.retry > 0) {
      config.retry -= 1;
      
      // Exponential backoff
      const backoffDelay = config.retryDelay * (3 - config.retry);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
      
      console.log(`Retrying request (${3 - config.retry}/3)...`);
      return api(config);
    }

    if (!error.response) {
      console.error('Network Error:', error);
      return Promise.reject(new Error('Network error - Please check your connection and try again'));
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
        return Promise.reject(new Error('Session expired. Please login again'));
      default:
        console.error('API Error:', error.response.data);
        return Promise.reject(error.response.data?.error || 'An error occurred');
    }
  }
);

export default api;