import { AuditLog, User, Transaction, Credit } from '../models/index.js';

/**
 * @desc    Get all audit logs with filtering and pagination
 * @route   GET /api/audit
 * @access  Private/Admin
 */
export const getAllAuditLogs = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      level, 
      action, 
      userId, 
      resource,
      resourceId,
      startDate,
      endDate,
      search,
      sortBy = 'timestamp', 
      sortOrder = 'desc'
    } = req.query;
    
    // Build query
    const query = {};
    if (level) query.level = level;
    if (action) query.action = action;
    if (userId) query.userId = userId;
    if (resource) query.resource = resource;
    if (resourceId) query.resourceId = resourceId;
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }
    if (search) {
      query.$or = [
        { action: { $regex: search, $options: 'i' } },
        { details: { $regex: search, $options: 'i' } },
        { 'userInfo.name': { $regex: search, $options: 'i' } },
        { 'userInfo.email': { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const logs = await AuditLog.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('userId', 'name email role');

    // Get total count for pagination
    const total = await AuditLog.countDocuments(query);

    res.json({
      success: true,
      data: logs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get all audit logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch audit logs',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Get audit logs by user ID
 * @route   GET /api/audit/user/:userId
 * @access  Private
 */
export const getAuditLogsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { level, action, resource, page = 1, limit = 10 } = req.query;

    // Check if user can access this data
    if (req.user.role !== 'admin' && req.user.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Build query
    const query = { userId };
    if (level) query.level = level;
    if (action) query.action = action;
    if (resource) query.resource = resource;

    const logs = await AuditLog.find(query)
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('userId', 'name email role');

    const total = await AuditLog.countDocuments(query);

    res.json({
      success: true,
      data: logs,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get audit logs by user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user audit logs',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Get fraud detection alerts
 * @route   GET /api/audit/fraud
 * @access  Private/Admin
 */
export const getFraudAlerts = async (req, res) => {
  try {
    const { page = 1, limit = 10, severity, status } = req.query;

    // Build query for fraud-related logs
    const query = {
      $or: [
        { level: 'high' },
        { action: { $regex: /fraud|suspicious|anomaly|breach/i } },
        { 'securityInfo.riskScore': { $gte: 7 } }
      ]
    };

    if (severity) query.level = severity;
    if (status) query.status = status;

    const fraudLogs = await AuditLog.find(query)
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('userId', 'name email role');

    const total = await AuditLog.countDocuments(query);

    // Get fraud statistics
    const fraudStats = await AuditLog.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$level',
          count: { $sum: 1 },
          avgRiskScore: { $avg: '$securityInfo.riskScore' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        alerts: fraudLogs,
        statistics: fraudStats,
        totalAlerts: total
      },
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get fraud alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch fraud alerts',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Create audit log entry
 * @route   POST /api/audit
 * @access  Private
 */
export const createAuditLog = async (req, res) => {
  try {
    const {
      level,
      action,
      userId,
      resource,
      resourceId,
      details,
      ipAddress,
      userAgent,
      requestId
    } = req.body;

    // Validate required fields
    if (!level || !action || !userId || !resource) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Create audit log
    const auditLog = new AuditLog({
      level: level || 'info',
      action,
      userId,
      resource,
      resourceId,
      details,
      timestamp: new Date(),
      userInfo: {
        ipAddress: ipAddress || req.ip,
        userAgent: userAgent || req.get('User-Agent'),
        requestId
      }
    });

    await auditLog.save();

    res.status(201).json({
      success: true,
      message: 'Audit log created successfully',
      data: auditLog
    });

  } catch (error) {
    console.error('Create audit log error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create audit log',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Get compliance report
 * @route   GET /api/audit/compliance
 * @access  Private/Admin
 */
export const getComplianceReport = async (req, res) => {
  try {
    const { startDate, endDate, resource } = req.query;

    // Build date range query
    const dateQuery = {};
    if (startDate || endDate) {
      dateQuery.timestamp = {};
      if (startDate) dateQuery.timestamp.$gte = new Date(startDate);
      if (endDate) dateQuery.timestamp.$lte = new Date(endDate);
    }

    if (resource) dateQuery.resource = resource;

    // Get compliance statistics
    const complianceStats = await AuditLog.aggregate([
      { $match: dateQuery },
      {
        $group: {
          _id: {
            resource: '$resource',
            action: '$action',
            level: '$level'
          },
          count: { $sum: 1 },
          lastOccurrence: { $max: '$timestamp' }
        }
      },
      {
        $group: {
          _id: '$_id.resource',
          actions: {
            $push: {
              action: '$_id.action',
              level: '$_id.level',
              count: '$count',
              lastOccurrence: '$lastOccurrence'
            }
          },
          totalActions: { $sum: '$count' }
        }
      }
    ]);

    // Get user activity summary
    const userActivity = await AuditLog.aggregate([
      { $match: dateQuery },
      {
        $group: {
          _id: '$userId',
          totalActions: { $sum: 1 },
          lastActivity: { $max: '$timestamp' },
          riskActions: {
            $sum: {
              $cond: [
                { $in: ['$level', ['high', 'critical']] },
                1,
                0
              ]
            }
          }
        }
      },
      { $sort: { totalActions: -1 } },
      { $limit: 10 }
    ]);

    // Get system health metrics
    const systemHealth = await AuditLog.aggregate([
      { $match: dateQuery },
      {
        $group: {
          _id: null,
          totalLogs: { $sum: 1 },
          highRiskLogs: {
            $sum: {
              $cond: [
                { $in: ['$level', ['high', 'critical']] },
                1,
                0
              ]
            }
          },
          avgResponseTime: { $avg: '$performanceInfo.responseTime' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        complianceStats,
        userActivity,
        systemHealth: systemHealth[0] || {},
        reportPeriod: {
          startDate: startDate || 'all',
          endDate: endDate || 'all'
        }
      }
    });

  } catch (error) {
    console.error('Get compliance report error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch compliance report',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Get audit analytics
 * @route   GET /api/audit/analytics
 * @access  Private/Admin
 */
export const getAuditAnalytics = async (req, res) => {
  try {
    const { period = '30d' } = req.query;

    // Calculate date range based on period
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get daily activity trends
    const dailyTrends = await AuditLog.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$timestamp' },
            month: { $month: '$timestamp' },
            day: { $dayOfMonth: '$timestamp' }
          },
          count: { $sum: 1 },
          highRiskCount: {
            $sum: {
              $cond: [
                { $in: ['$level', ['high', 'critical']] },
                1,
                0
              ]
            }
          }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Get resource activity breakdown
    const resourceBreakdown = await AuditLog.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$resource',
          count: { $sum: 1 },
          uniqueUsers: { $addToSet: '$userId' }
        }
      },
      {
        $project: {
          resource: '$_id',
          count: 1,
          uniqueUsers: { $size: '$uniqueUsers' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get user activity ranking
    const userRanking = await AuditLog.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$userId',
          totalActions: { $sum: 1 },
          highRiskActions: {
            $sum: {
              $cond: [
                { $in: ['$level', ['high', 'critical']] },
                1,
                0
              ]
            }
          }
        }
      },
      { $sort: { totalActions: -1 } },
      { $limit: 20 }
    ]);

    // Get action type distribution
    const actionDistribution = await AuditLog.aggregate([
      {
        $match: {
          timestamp: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$action',
          count: { $sum: 1 },
          avgRiskScore: { $avg: '$securityInfo.riskScore' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 15 }
    ]);

    res.json({
      success: true,
      data: {
        period,
        startDate,
        endDate: now,
        dailyTrends,
        resourceBreakdown,
        userRanking,
        actionDistribution,
        summary: {
          totalLogs: dailyTrends.reduce((sum, day) => sum + day.count, 0),
          totalHighRisk: dailyTrends.reduce((sum, day) => sum + day.highRiskCount, 0),
          uniqueResources: resourceBreakdown.length,
          activeUsers: userRanking.length
        }
      }
    });

  } catch (error) {
    console.error('Get audit analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch audit analytics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Export audit logs
 * @route   GET /api/audit/export
 * @access  Private/Admin
 */
export const exportAuditLogs = async (req, res) => {
  try {
    const { format = 'json', startDate, endDate, resource } = req.query;

    // Build query
    const query = {};
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }
    if (resource) query.resource = resource;

    // Get logs
    const logs = await AuditLog.find(query)
      .sort({ timestamp: -1 })
      .populate('userId', 'name email role');

    if (format === 'csv') {
      // Convert to CSV format
      const csvData = logs.map(log => ({
        timestamp: log.timestamp,
        level: log.level,
        action: log.action,
        resource: log.resource,
        resourceId: log.resourceId || '',
        userId: log.userId?.email || '',
        userName: log.userId?.name || '',
        userRole: log.userId?.role || '',
        details: JSON.stringify(log.details),
        ipAddress: log.userInfo?.ipAddress || '',
        userAgent: log.userInfo?.userAgent || ''
      }));

      // Set headers for CSV download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=audit-logs-${new Date().toISOString().split('T')[0]}.csv`);

      // Convert to CSV string
      const csvString = [
        Object.keys(csvData[0]).join(','),
        ...csvData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
      ].join('\n');

      res.send(csvString);
    } else {
      // Return JSON
      res.json({
        success: true,
        data: logs,
        exportInfo: {
          format,
          totalRecords: logs.length,
          exportDate: new Date(),
          query
        }
      });
    }

  } catch (error) {
    console.error('Export audit logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export audit logs',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};




