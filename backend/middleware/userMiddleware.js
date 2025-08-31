import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { createAuditLog } from '../utils/auditLogger.js';

// Authentication middleware - verifies JWT token and attaches user to req.user
export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        message: 'Access denied. No token provided.' 
      });
    }

    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔐 Authentication attempt:', {
        hasCookieToken: !!req.cookies.token,
        hasAuthHeader: !!req.headers.authorization,
        tokenLength: token ? token.length : 0,
        endpoint: req.originalUrl,
        cookies: Object.keys(req.cookies),
        headers: Object.keys(req.headers).filter(h => h.toLowerCase().includes('auth'))
      });
    }

    // Verify JWT token
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret';
    if (!jwtSecret || jwtSecret === 'your-super-secret-jwt-key-here-change-this-in-production') {
      console.error('JWT_SECRET not properly configured');
      return res.status(500).json({ 
        message: 'Server configuration error. Please contact administrator.' 
      });
    }
    
    const decoded = jwt.verify(token, jwtSecret);
    
    // Check if user still exists
    let user;
    try {
      user = await User.findById(decoded.userId).select('-password');
    } catch (dbError) {
      console.error('Database error during authentication:', dbError);
      return res.status(500).json({ 
        message: 'Database connection error. Please try again later.' 
      });
    }
    
    if (!user) {
      return res.status(401).json({ 
        message: 'User no longer exists.' 
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ 
        message: 'User account is deactivated.' 
      });
    }

    // Check if password was changed after token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({ 
        message: 'User recently changed password. Please log in again.' 
      });
    }

    // Attach user to request object
    req.user = user;
    
    // Log successful authentication
    await createAuditLog({
      userId: user._id,
      action: 'AUTHENTICATION_SUCCESS',
      details: {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        endpoint: req.originalUrl
      },
      riskLevel: 'LOW'
    });

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token.' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired. Please log in again.' 
      });
    }
    
    console.error('Authentication middleware error:', error);
    return res.status(500).json({ 
      message: 'Internal server error during authentication.' 
    });
  }
};

// Authorization middleware - checks if user has required role(s)
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Authentication required.' 
      });
    }

    if (!roles.includes(req.user.role)) {
      // Log unauthorized access attempt
      createAuditLog({
        userId: req.user._id,
        action: 'UNAUTHORIZED_ACCESS_ATTEMPT',
        details: {
          requiredRoles: roles,
          userRole: req.user.role,
          endpoint: req.originalUrl,
          ip: req.ip
        },
        riskLevel: 'HIGH'
      }).catch(console.error);

      return res.status(403).json({ 
        message: 'Access denied. Insufficient permissions.' 
      });
    }

    next();
  };
};

// Specific role middlewares for convenience
export const requireProducer = authorizeRoles('producer');
export const requireCertifier = authorizeRoles('certifier');
export const requireBuyer = authorizeRoles('buyer');
export const requireAuditor = authorizeRoles('auditor');
export const requireAdmin = authorizeRoles('admin');

// Middleware to check if user owns the resource or is admin
export const checkOwnership = (modelName, idParam = 'id') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          message: 'Authentication required.' 
        });
      }

      // Admin can access everything
      if (req.user.role === 'admin') {
        return next();
      }

      const resourceId = req.params[idParam];
      if (!resourceId) {
        return res.status(400).json({ 
          message: 'Resource ID is required.' 
        });
      }

      // Import the model dynamically
      const Model = await import(`../models/${modelName}.js`).then(m => m.default);
      const resource = await Model.findById(resourceId);
      
      if (!resource) {
        return res.status(404).json({ 
          message: 'Resource not found.' 
        });
      }

      // Check if user owns the resource
      if (resource.userId && resource.userId.toString() === req.user._id.toString()) {
        return next();
      }

      // Check if user is the creator
      if (resource.createdBy && resource.createdBy.toString() === req.user._id.toString()) {
        return next();
      }

      // Check if user is the owner
      if (resource.owner && resource.owner.toString() === req.user._id.toString()) {
        return next();
      }

      // Log unauthorized access attempt
      await createAuditLog({
        userId: req.user._id,
        action: 'UNAUTHORIZED_RESOURCE_ACCESS',
        details: {
          resourceId,
          resourceType: modelName,
          endpoint: req.originalUrl,
          ip: req.ip
        },
        riskLevel: 'MEDIUM'
      });

      return res.status(403).json({ 
        message: 'Access denied. You do not own this resource.' 
      });
    } catch (error) {
      console.error('Ownership check error:', error);
      return res.status(500).json({ 
        message: 'Internal server error during ownership verification.' 
      });
    }
  };
};

// Rate limiting middleware for sensitive operations
export const rateLimit = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  const attempts = new Map();
  
  return (req, res, next) => {
    const key = req.ip;
    const now = Date.now();
    
    if (!attempts.has(key)) {
      attempts.set(key, { count: 1, resetTime: now + windowMs });
    } else {
      const attempt = attempts.get(key);
      
      if (now > attempt.resetTime) {
        attempt.count = 1;
        attempt.resetTime = now + windowMs;
      } else {
        attempt.count++;
      }
      
      if (attempt.count > maxAttempts) {
        // Log potential brute force attempt
        createAuditLog({
          userId: req.user?._id,
          action: 'RATE_LIMIT_EXCEEDED',
          details: {
            ip: req.ip,
            endpoint: req.originalUrl,
            attempts: attempt.count,
            windowMs
          },
          riskLevel: 'HIGH'
        }).catch(console.error);

        return res.status(429).json({ 
          message: 'Too many requests. Please try again later.' 
        });
      }
    }
    
    next();
  };
};

// Middleware to log all requests for audit purposes
export const auditLogger = async (req, res, next) => {
  const startTime = Date.now();
  
  // Override res.json to capture response data
  const originalJson = res.json;
  res.json = function(data) {
    res.locals.responseData = data;
    return originalJson.call(this, data);
  };
  
  res.on('finish', async () => {
    try {
      const duration = Date.now() - startTime;
      
      await createAuditLog({
        userId: req.user?._id,
        action: 'API_REQUEST',
        details: {
          method: req.method,
          endpoint: req.originalUrl,
          statusCode: res.statusCode,
          duration,
          ip: req.ip,
          userAgent: req.get('User-Agent'),
          requestBody: req.body,
          responseData: res.locals.responseData
        },
        riskLevel: res.statusCode >= 400 ? 'MEDIUM' : 'LOW'
      });
    } catch (error) {
      console.error('Audit logging error:', error);
    }
  });
  
  next();
};

// Middleware to validate request data
export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const { error } = schema.validate(req.body);
      if (error) {
        return res.status(400).json({ 
          message: 'Validation error', 
          errors: error.details.map(detail => detail.message) 
        });
      }
      next();
    } catch (error) {
      console.error('Validation error:', error);
      return res.status(500).json({ 
        message: 'Internal server error during validation.' 
      });
    }
  };
};

export default {
  authenticateUser,
  authorizeRoles,
  requireProducer,
  requireCertifier,
  requireBuyer,
  requireAuditor,
  requireAdmin,
  checkOwnership,
  rateLimit,
  auditLogger,
  validateRequest
};




