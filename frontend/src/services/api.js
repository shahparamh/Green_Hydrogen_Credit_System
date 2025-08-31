import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api',
  timeout: 30000, // 30 seconds
  withCredentials: true, // Include cookies for JWT authentication
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token and logging
api.interceptors.request.use(
  (config) => {
    // Log request in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params,
        headers: config.headers,
      });
    }

    // Add timestamp for caching
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }

    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle common responses and errors
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data,
        headers: response.headers,
      });
    }

    return response;
  },
  (error) => {
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }

    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - only redirect if not on auth pages
          const currentPath = window.location.pathname;
          const isAuthPage = currentPath.includes('/auth/') || currentPath === '/login' || currentPath === '/register';
          
          if (!isAuthPage) {
            toast.error('Session expired. Please login again.');
            // Clear user data and redirect to login
            localStorage.removeItem('user');
            window.location.href = '/auth/login';
          }
          break;
          
        case 403:
          // Forbidden - insufficient permissions
          toast.error('Access denied. Insufficient permissions.');
          break;
          
        case 404:
          // Not found
          toast.error('Resource not found.');
          break;
          
        case 422:
          // Validation error
          const validationErrors = data.errors || data.message;
          if (Array.isArray(validationErrors)) {
            validationErrors.forEach(err => toast.error(err.msg || err));
          } else {
            toast.error(validationErrors || 'Validation failed');
          }
          break;
          
        case 429:
          // Rate limited - more lenient in development
          if (process.env.NODE_ENV === 'development') {
            console.warn('Rate limited in development - this should not happen with current settings');
          }
          toast.error('Too many requests. Please try again later.');
          break;
          
        case 500:
          // Internal server error
          toast.error('Server error. Please try again later.');
          break;
          
        default:
          // Other error statuses
          toast.error(data?.message || `Error ${status}: ${data?.error || 'Unknown error'}`);
      }
    } else if (error.request) {
      // Request was made but no response received
      toast.error('Network error. Please check your connection.');
    } else {
      // Something else happened
      toast.error('An unexpected error occurred.');
    }

    return Promise.reject(error);
  }
);

// Helper function to handle API errors
export const handleApiError = (error, customMessage = null) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return customMessage || 'An error occurred';
};

// Helper function to create query string from object
export const createQueryString = (params) => {
  if (!params || Object.keys(params).length === 0) return '';
  
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(item => searchParams.append(key, item));
      } else {
        searchParams.append(key, value);
      }
    }
  });
  
  return searchParams.toString();
};

// Helper function to format API response
export const formatApiResponse = (response) => {
  if (response?.data) {
    return {
      success: true,
      data: response.data,
      message: response.data.message || 'Success',
      status: response.status,
    };
  }
  return {
    success: false,
    data: null,
    message: 'Invalid response format',
    status: 0,
  };
};

// Export the configured axios instance
export default api;




