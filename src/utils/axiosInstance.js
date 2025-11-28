import axios from 'axios';
import config from '../config';

// Create axios instance with interceptors
const axiosInstance = axios.create({
  baseURL: config.baseURL,
  timeout: 10000,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('🚀 Axios Request - URL:', config.url);
    
    // Get token from multiple sources
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (token) {
      console.log('🔐 Adding token to request for:', config.url);
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('⚠️ No token found for request:', config.url);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ Response success:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message
    });

    if (error.response?.status === 401) {
      console.log('🔐 401 Unauthorized - clearing tokens');
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userInfo');
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;