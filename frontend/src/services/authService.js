import api from './api.js';
import { formatApiResponse, handleApiError } from './api.js';

// Authentication Service
class AuthService {
  // User login
  async login(email, password, role) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
        role
      });
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Login failed'));
    }
  }

  // User registration
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Registration failed'));
    }
  }

  // User logout
  async logout() {
    try {
      const response = await api.post('/auth/logout');
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Logout failed'));
    }
  }

  // Get current user
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to get user data'));
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await api.put('/auth/profile', profileData);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Profile update failed'));
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await api.put('/auth/change-password', {
        currentPassword,
        newPassword
      });
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Password change failed'));
    }
  }

  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await api.post('/auth/forgot-password', { email });
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Password reset request failed'));
    }
  }

  // Reset password
  async resetPassword(token, newPassword) {
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        newPassword
      });
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Password reset failed'));
    }
  }

  // Verify email
  async verifyEmail(token) {
    try {
      const response = await api.post('/auth/verify-email', { token });
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Email verification failed'));
    }
  }

  // Resend verification email
  async resendVerificationEmail(email) {
    try {
      const response = await api.post('/auth/resend-verification', { email });
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Verification email resend failed'));
    }
  }

  // Refresh token
  async refreshToken() {
    try {
      const response = await api.post('/auth/refresh-token');
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Token refresh failed'));
    }
  }

  // Check if user is authenticated
  async isAuthenticated() {
    try {
      const response = await api.get('/auth/me');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  // Get user permissions
  async getUserPermissions() {
    try {
      const response = await api.get('/auth/permissions');
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to get user permissions'));
    }
  }

  // Update user preferences
  async updatePreferences(preferences) {
    try {
      const response = await api.put('/auth/preferences', preferences);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Preferences update failed'));
    }
  }

  // Get user activity log
  async getActivityLog(limit = 50, offset = 0) {
    try {
      const response = await api.get('/auth/activity-log', {
        params: { limit, offset }
      });
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to get activity log'));
    }
  }

  // Enable/disable 2FA
  async toggle2FA(enabled) {
    try {
      const response = await api.put('/auth/2fa', { enabled });
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, '2FA toggle failed'));
    }
  }

  // Verify 2FA code
  async verify2FA(code) {
    try {
      const response = await api.post('/auth/2fa/verify', { code });
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, '2FA verification failed'));
    }
  }

  // Get login history
  async getLoginHistory(limit = 20) {
    try {
      const response = await api.get('/auth/login-history', {
        params: { limit }
      });
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to get login history'));
    }
  }

  // Revoke all sessions
  async revokeAllSessions() {
    try {
      const response = await api.post('/auth/revoke-all-sessions');
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Session revocation failed'));
    }
  }

  // Get user statistics
  async getUserStats() {
    try {
      const response = await api.get('/auth/stats');
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to get user statistics'));
    }
  }
}

// Create and export a single instance
const authService = new AuthService();
export default authService;




