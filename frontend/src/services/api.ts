import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    // Inject auth token here if needed
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for global error handling and retries
api.interceptors.response.use(
  (response) => response.data, // Unwrap API response
  (error) => {
    // Global Error Handler
    if (error.response) {
      console.error('API Error:', error.response.data);
      if (error.response.status === 401) {
        // Handle unauthorized
      }
    } else if (error.request) {
      console.error('Network Error:', error.request);
    } else {
      console.error('Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
