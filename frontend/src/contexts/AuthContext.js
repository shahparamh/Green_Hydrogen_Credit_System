import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [authCheckInProgress, setAuthCheckInProgress] = useState(false);

  // Check if user is authenticated on mount (only once)
  useEffect(() => {
    if (!authChecked) {
      checkAuth();
    }
  }, [authChecked]);

  const checkAuth = async () => {
    // Prevent multiple simultaneous auth checks
    if (authCheckInProgress) {
      return;
    }
    
    try {
      setAuthCheckInProgress(true);
      setLoading(true);
      const response = await api.get('/auth/me');
      setUser(response.data.user);
      setError(null);
    } catch (err) {
      console.log('Not authenticated:', err.message);
      setUser(null);
      setError(null); // Don't show error for unauthenticated users
      
      // Clear any stale tokens
      if (err.response?.status === 401) {
        // Clear any stored user data
        localStorage.removeItem('user');
      }
      
      // Handle rate limiting - retry after a delay
      if (err.response?.status === 429) {
        console.log('Rate limited, retrying after delay...');
        setTimeout(() => {
          checkAuth();
        }, 2000); // Retry after 2 seconds
        return;
      }
    } finally {
      setLoading(false);
      setAuthChecked(true); // Mark as checked to prevent re-checking
      setAuthCheckInProgress(false);
    }
  };

  const login = async (email, password, role) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await api.post('/auth/login', { email, password, role });
      setUser(response.data.user);
      setError(null);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      setError(errorMessage);
      setUser(null);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      
      const response = await api.post('/auth/register', userData);
      setUser(response.data.user);
      setError(null);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      setError(errorMessage);
      setUser(null);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.log('Logout error:', err.message);
    } finally {
      setUser(null);
      setError(null);
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const response = await api.put('/auth/profile', profileData);
      setUser(response.data.user);
      setError(null);
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Profile update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    clearError,
    checkAuth,
    refreshAuth: () => {
      setAuthChecked(false);
      setAuthCheckInProgress(false);
      checkAuth();
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
