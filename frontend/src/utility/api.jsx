import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://drive-like.vercel.app',
  timeout: 30000, // Increase timeout to 30 seconds
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Enable credentials
});

// Add request interceptor
api.interceptors.request.use(
  config => {
    // Add retry mechanism
    config.retry = 3;
    config.retryDelay = 1000;
    return config;
  },
  error => Promise.reject(error)
);

// Add response interceptor with retry logic
api.interceptors.response.use(
  response => response,
  async error => {
    const { config } = error;
    if (!config || !config.retry) {
      return Promise.reject(error);
    }
    
    config.retry -= 1;
    if (config.retry === 0) {
      return Promise.reject(new Error('Server is not responding. Please try again later.'));
    }

    // Delay before retrying
    await new Promise(resolve => setTimeout(resolve, config.retryDelay));
    
    // Retry the request
    return api(config);
  }
);

export default api;