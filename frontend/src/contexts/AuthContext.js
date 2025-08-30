import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure axios defaults
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';
  console.log('API URL:', apiUrl);
  axios.defaults.baseURL = apiUrl;
  axios.defaults.withCredentials = true;
  
  // Add request interceptor for debugging
  axios.interceptors.request.use(
    (config) => {
      console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
      return config;
    },
    (error) => {
      console.error('Request error:', error);
      return Promise.reject(error);
    }
  );
  
  // Add response interceptor for debugging
  axios.interceptors.response.use(
    (response) => {
      console.log('API Response:', response.status, response.data);
      return response;
    },
    (error) => {
      console.error('Response error:', error.response?.status, error.response?.data);
      return Promise.reject(error);
    }
  );

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get('/auth/me');
      setUser(response.data.user);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password, role) => {
    try {
      setError(null);
      const response = await axios.post('/auth/login', { email, password, role });
      setUser(response.data.user);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await axios.post('/auth/register', userData);  
      setUser(response.data.user);
      return { success: true };
    } catch (err) {
      console.error('Registration error details:', err.response?.data);
      
      let errorMessage = 'Registration failed';
      
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        errorMessage = err.response.data.errors.join(', ');
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 400) {
        errorMessage = 'Invalid registration data. Please check your input.';
      } else if (err.response?.status === 409) {
        errorMessage = 'User already exists with this email.';
      } else if (err.response?.status === 422) {
        errorMessage = 'Validation error. Please check your input.';
      } else if (err.response?.status >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await axios.post('/auth/logout');
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const response = await axios.put('/auth/profile', profileData);
      setUser(response.data.user);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Profile update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const hasRole = (requiredRole) => {
    if (!user) return false;
    return user.role === requiredRole || user.role === 'admin';
  };

  const hasAnyRole = (roles) => {
    if (!user) return false;
    return roles.includes(user.role) || user.role === 'admin';
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    hasRole,
    hasAnyRole,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
