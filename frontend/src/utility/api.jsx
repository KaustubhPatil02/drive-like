import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Remove withCredentials: true since we're using Bearer token

// Add request interceptor with auth token and retry configuration
api.interceptors.request.use(
  config => {
    // Add auth token if exists
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add retry configuration
    config.retry = 3;
    config.retryDelay = 1000;
    return config;
  },
  error => Promise.reject(error)
);

// Add response interceptor with enhanced error handling and retry logic
api.interceptors.response.use(
  response => response,
  async error => {
    const { config, response } = error;

    // Retry logic for network errors or 5xx errors
    if ((!response || response.status >= 500) && config && config.retry > 0) {
      config.retry -= 1;
      
      // Exponential backoff
      const delayTime = config.retryDelay * (3 - config.retry);
      await new Promise(resolve => setTimeout(resolve, delayTime));
      
      return api(config);
    }

    // Handle specific error cases
    if (!response) {
      console.error('Network Error:', error);
      return Promise.reject(new Error('Network error - Is your backend server running?'));
    }

    switch (response.status) {
      case 400:
        return Promise.reject(new Error(response.data?.error || 'Bad Request'));
      case 401:
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(new Error('Session expired. Please login again.'));
      case 403:
        return Promise.reject(new Error('Access denied'));
      case 404:
        return Promise.reject(new Error('Resource not found'));
      case 429:
        return Promise.reject(new Error('Too many requests. Please try again later.'));
      default:
        console.error('API Error:', response.data);
        return Promise.reject(new Error(response.data?.error || 'An unexpected error occurred'));
    }
  }
);

export default api;