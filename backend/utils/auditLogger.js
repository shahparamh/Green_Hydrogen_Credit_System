import { AuditLog } from '../models/index.js';

/**
 * Utility function to create audit logs consistently across the application
 * @param {Object} options - Audit log options
 * @param {string} options.action - The action being performed
 * @param {string} options.userId - ID of the user performing the action
 * @param {string} options.resource - The resource being acted upon
 * @param {string} [options.resourceId] - ID of the specific resource
 * @param {Object} [options.details] - Additional details about the action
 * @param {string} [options.level] - Log level (info, warning, error, critical)
 * @param {Object} [options.request] - Express request object for additional context
 * @returns {Promise<AuditLog>} The created audit log
 */
export const createAuditLog = async (options) => {
  try {
    const {
      action,
      userId,
      resource,
      resourceId,
      details = {},
      level = 'info',
      request = null
    } = options;

    // Validate required parameters
    if (!action || !userId || !resource) {
      console.warn('Missing required parameters for audit log:', options);
      return null;
    }

    // Determine log level based on action type
    let logLevel = level;
    if (action.includes('DELETE') || action.includes('SUSPEND') || action.includes('BLOCK')) {
      logLevel = 'warning';
    } else if (action.includes('LOGIN') || action.includes('LOGOUT') || action.includes('VIEW')) {
      logLevel = 'info';
    } else if (action.includes('CREATE') || action.includes('UPDATE') || action.includes('TRANSFER')) {
      logLevel = 'info';
    }

    // Calculate risk score based on action and context
    let riskScore = 1; // Default low risk
    if (action.includes('DELETE') || action.includes('SUSPEND')) {
      riskScore = 6; // Medium risk
    } else if (action.includes('ADMIN') || action.includes('SYSTEM')) {
      riskScore = 4; // Medium risk
    } else if (action.includes('LOGIN') || action.includes('AUTH')) {
      riskScore = 3; // Low-medium risk
    }

    // Extract user agent and IP from request if available
    let userInfo = {};
    if (request) {
      userInfo = {
        ipAddress: request.ip || request.connection?.remoteAddress || 'unknown',
        userAgent: request.get('User-Agent') || 'unknown',
        requestId: request.headers['x-request-id'] || null,
        method: request.method,
        url: request.originalUrl || request.url
      };
    }

    // Create the audit log entry
    const auditLog = new AuditLog({
      level: logLevel,
      action,
      userId,
      resource,
      resourceId,
      details,
      timestamp: new Date(),
      userInfo,
      securityInfo: {
        riskScore,
        threatLevel: riskScore >= 7 ? 'high' : riskScore >= 4 ? 'medium' : 'low'
      }
    });

    // Save the audit log
    await auditLog.save();

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[AUDIT] ${logLevel.toUpperCase()}: ${action} on ${resource} by user ${userId}`);
    }

    return auditLog;

  } catch (error) {
    // Don't let audit logging failures break the main application
    console.error('Failed to create audit log:', error);
    return null;
  }
};

/**
 * Create a high-priority audit log for security events
 * @param {Object} options - Audit log options
 * @returns {Promise<AuditLog>} The created audit log
 */
export const createSecurityAuditLog = async (options) => {
  return createAuditLog({
    ...options,
    level: 'high',
    details: {
      ...options.details,
      securityEvent: true,
      timestamp: new Date().toISOString()
    }
  });
};

/**
 * Create an audit log for financial transactions
 * @param {Object} options - Audit log options
 * @param {number} options.amount - Transaction amount
 * @param {string} options.currency - Transaction currency
 * @returns {Promise<AuditLog>} The created audit log
 */
export const createFinancialAuditLog = async (options) => {
  const { amount, currency, ...otherOptions } = options;
  
  return createAuditLog({
    ...otherOptions,
    level: 'warning', // Financial transactions are higher risk
    details: {
      ...otherOptions.details,
      financialTransaction: true,
      amount,
      currency,
      timestamp: new Date().toISOString()
    }
  });
};

/**
 * Create an audit log for system events
 * @param {Object} options - Audit log options
 * @returns {Promise<AuditLog>} The created audit log
 */
export const createSystemAuditLog = async (options) => {
  return createAuditLog({
    ...options,
    level: 'info',
    details: {
      ...options.details,
      systemEvent: true,
      timestamp: new Date().toISOString()
    }
  });
};

/**
 * Batch create multiple audit logs for performance
 * @param {Array} auditLogs - Array of audit log options
 * @returns {Promise<Array>} Array of created audit logs
 */
export const createBatchAuditLogs = async (auditLogs) => {
  try {
    const logsToCreate = auditLogs.map(options => {
      const {
        action,
        userId,
        resource,
        resourceId,
        details = {},
        level = 'info'
      } = options;

      return new AuditLog({
        level,
        action,
        userId,
        resource,
        resourceId,
        details,
        timestamp: new Date(),
        securityInfo: {
          riskScore: 1,
          threatLevel: 'low'
        }
      });
    });

    const createdLogs = await AuditLog.insertMany(logsToCreate);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[AUDIT] Created ${createdLogs.length} batch audit logs`);
    }

    return createdLogs;

  } catch (error) {
    console.error('Failed to create batch audit logs:', error);
    return [];
  }
};




