import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://drive-like-api.vercel.app',
  timeout: 60000, // Increased timeout to 60 seconds
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
  error => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => response,
  async error => {
    const { config } = error;

    if (!error.response && config && config.retry > 0) {
      config.retry -= 1;
      const backoffDelay = config.retryDelay * (3 - config.retry);
      await new Promise(resolve => setTimeout(resolve, backoffDelay));
      console.log(`Retrying request (${3 - config.retry}/3)...`);
      return api(config);
    }

    if (!error.response) {
      console.error('Network Error:', error);
      return Promise.reject(new Error('Network error - Please check your connection and try again'));
    }

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