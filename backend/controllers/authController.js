import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { createAuditLog } from '../utils/auditLogger.js';

// Generate JWT token
const generateToken = (userId, email, role) => {
  return jwt.sign(
    { 
      userId, 
      email, 
      role,
      iat: Math.floor(Date.now() / 1000)
    },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Set JWT cookie
const setTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

// User Registration
export const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const userData = {
      name,
      email,
      password,
      role: role || 'producer'
    };

    const user = new User(userData);
    await user.save();

    // Generate token
    const token = generateToken(user._id, user.email, user.role);
    setTokenCookie(res, token);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    // Log successful registration (temporarily simplified)
    try {
      await createAuditLog({
        userId: user._id,
        action: 'USER_REGISTRATION',
        resource: 'USER',
        details: {
          email: user.email,
          role: user.role,
          ip: req.ip,
          userAgent: req.get('User-Agent')
        },
        level: 'info'
      });
    } catch (auditError) {
      console.warn('Audit logging failed:', auditError);
      // Don't fail registration if audit logging fails
    }

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation error',
        errors
      });
    }

    // Check if it's a database connection error
    if (error.name === 'MongooseServerSelectionError' || error.message.includes('ECONNREFUSED')) {
      return res.status(503).json({
        message: 'Database service unavailable. Please try again later.',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Service unavailable'
      });
    }

    res.status(500).json({
      message: 'Internal server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal error'
    });
  }
};

// User Login
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Check if role matches (if specified)
    if (role && user.role !== role) {
      return res.status(401).json({
        message: 'Invalid role for this user'
      });
    }

    // Verify password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      // Log failed login attempt
      await createAuditLog({
        userId: user._id,
        action: 'LOGIN_FAILED',
        resource: 'USER',
        details: {
          email: user.email,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          reason: 'Invalid password'
        },
        level: 'warning'
      });

      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id, user.email, user.role);
    setTokenCookie(res, token);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    // Log successful login
    await createAuditLog({
      userId: user._id,
      action: 'LOGIN_SUCCESS',
      resource: 'USER',
      details: {
        email: user.email,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      },
      level: 'info'
    });

    res.json({
      message: 'Login successful',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: 'Internal server error during login'
    });
  }
};

// User Logout
export const logout = async (req, res) => {
  try {
    // Clear token cookie
    res.clearCookie('token');

    // Log logout if user is authenticated
    if (req.user) {
      await createAuditLog({
        userId: req.user._id,
        action: 'LOGOUT',
        resource: 'USER',
        details: {
          ip: req.ip,
          userAgent: req.get('User-Agent')
        },
        level: 'info'
      });
    }

    res.json({
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      message: 'Internal server error during logout'
    });
  }
};

// Get Current User
export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'No authenticated user'
      });
    }

    // Remove password from response
    const userResponse = req.user.toObject();
    delete userResponse.password;

    res.json({
      user: userResponse
    });

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

// Update User Profile
export const updateProfile = async (req, res) => {
  try {
    const {
      name
    } = req.body;

    // Update user profile
    const updateData = {};
    if (name) updateData.name = name;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    // Log profile update
    await createAuditLog({
      userId: req.user._id,
      action: 'PROFILE_UPDATE',
      resource: 'USER',
      details: {
        updatedFields: Object.keys(updateData),
        ip: req.ip
      },
      level: 'info'
    });

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Profile update error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      message: 'Internal server error during profile update'
    });
  }
};

// Change Password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Verify current password
    const isValidPassword = await req.user.comparePassword(currentPassword);
    if (!isValidPassword) {
      return res.status(400).json({
        message: 'Current password is incorrect'
      });
    }

    // Update password
    req.user.password = newPassword;
    await req.user.save();

    // Log password change
    await createAuditLog({
      userId: req.user._id,
      action: 'PASSWORD_CHANGE',
      resource: 'USER',
      details: {
        ip: req.ip,
        userAgent: req.get('User-Agent')
      },
      level: 'warning'
    });

    res.json({
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Password change error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      message: 'Internal server error during password change'
    });
  }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      // Don't reveal if user exists or not
      return res.json({
        message: 'If an account with that email exists, a password reset link has been sent'
      });
    }

    // Generate reset token (in a real app, you'd send an email)
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '1h' }
    );

    // Log password reset request
    await createAuditLog({
      userId: user._id,
      action: 'PASSWORD_RESET_REQUEST',
      resource: 'USER',
      details: {
        email: user.email,
        ip: req.ip
      },
      level: 'warning'
    });

    res.json({
      message: 'If an account with that email exists, a password reset link has been sent'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

// Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    // Verify reset token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(400).json({
        message: 'Invalid or expired reset token'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Log password reset
    await createAuditLog({
      userId: user._id,
      action: 'PASSWORD_RESET',
      resource: 'USER',
      details: {
        ip: req.ip
      },
      level: 'warning'
    });

    res.json({
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(400).json({
        message: 'Invalid or expired reset token'
      });
    }

    res.status(500).json({
      message: 'Internal server error during password reset'
    });
  }
};

// Verify Email
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    // Verify email verification token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(400).json({
        message: 'Invalid verification token'
      });
    }

    // Mark email as verified
    user.emailVerified = true;
    await user.save();

    // Log email verification
    await createAuditLog({
      userId: user._id,
      action: 'EMAIL_VERIFICATION',
      resource: 'USER',
      details: {
        ip: req.ip
      },
      level: 'info'
    });

    res.json({
      message: 'Email verified successfully'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(400).json({
        message: 'Invalid or expired verification token'
      });
    }

    res.status(500).json({
      message: 'Internal server error during email verification'
    });
  }
};

// Get User Permissions
export const getUserPermissions = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'Authentication required'
      });
    }

    // Define permissions based on role
    const permissions = {
      producer: ['create_credits', 'view_own_credits', 'transfer_credits'],
      certifier: ['approve_credits', 'reject_credits', 'view_pending_credits'],
      buyer: ['buy_credits', 'retire_credits', 'view_marketplace'],
      auditor: ['view_all_transactions', 'generate_reports', 'view_audit_logs'],
      admin: ['all_permissions']
    };

    const userPermissions = permissions[req.user.role] || [];

    res.json({
      permissions: userPermissions,
      role: req.user.role
    });

  } catch (error) {
    console.error('Get permissions error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};



// Get User Activity Log
export const getActivityLog = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    // This would typically fetch from an activity log collection
    // For now, we'll return a placeholder
    res.json({
      message: 'Activity log feature coming soon',
      activities: [],
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: 0
      }
    });

  } catch (error) {
    console.error('Get activity log error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

// Toggle 2FA
export const toggle2FA = async (req, res) => {
  try {
    const { enabled } = req.body;

    // This would implement actual 2FA logic
    // For now, we'll return a placeholder
    res.json({
      message: '2FA feature coming soon',
      enabled: enabled
    });

  } catch (error) {
    console.error('Toggle 2FA error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

// Verify 2FA Code
export const verify2FA = async (req, res) => {
  try {
    const { code } = req.body;

    // This would implement actual 2FA verification
    // For now, we'll return a placeholder
    res.json({
      message: '2FA verification feature coming soon',
      verified: false
    });

  } catch (error) {
    console.error('Verify 2FA error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

// Get Login History
export const getLoginHistory = async (req, res) => {
  try {
    const { limit = 20 } = req.query;

    // This would fetch from login history collection
    // For now, we'll return a placeholder
    res.json({
      message: 'Login history feature coming soon',
      logins: [],
      total: 0
    });

  } catch (error) {
    console.error('Get login history error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

// Revoke All Sessions
export const revokeAllSessions = async (req, res) => {
  try {
    // This would implement session revocation logic
    // For now, we'll return a placeholder
    res.json({
      message: 'Session revocation feature coming soon'
    });

  } catch (error) {
    console.error('Revoke sessions error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

// Get User Statistics
export const getUserStats = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: 'Authentication required'
      });
    }

    // Get basic user statistics
    const stats = {
      totalUsers: await User.countDocuments(),
      usersByRole: await User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ]),
      activeUsers: await User.countDocuments({ isActive: true }),
      verifiedUsers: await User.countDocuments({ emailVerified: true })
    };

    res.json({
      stats
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      message: 'Internal server error'
    });
  }
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getUserPermissions,
  getActivityLog,
  toggle2FA,
  verify2FA,
  getLoginHistory,
  revokeAllSessions,
  getUserStats
};
