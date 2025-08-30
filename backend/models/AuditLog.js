import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  // Log Information
  logId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  level: {
    type: String,
    required: true,
    enum: ['info', 'warning', 'error', 'critical', 'debug'],
    default: 'info'
  },
  
  // Action Information
  action: {
    type: String,
    required: [true, 'Action is required'],
    trim: true,
    maxlength: [100, 'Action cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['authentication', 'authorization', 'credit', 'transaction', 'marketplace', 'user', 'system', 'compliance', 'fraud', 'other'],
    default: 'other'
  },
  subcategory: {
    type: String,
    trim: true,
    maxlength: [100, 'Subcategory cannot exceed 100 characters']
  },
  
  // User Information
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  userRole: {
    type: String,
    required: true,
    enum: ['producer', 'certifier', 'buyer', 'auditor', 'admin', 'system']
  },
  userIp: {
    type: String,
    trim: true,
    match: [/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/, 'Invalid IP address format']
  },
  userAgent: {
    type: String,
    trim: true,
    maxlength: [500, 'User agent cannot exceed 500 characters']
  },
  
  // Resource Information
  resource: {
    type: {
      type: String,
      enum: ['user', 'credit', 'transaction', 'marketplace', 'system', 'other']
    },
    id: mongoose.Schema.Types.ObjectId,
    name: String,
    url: String
  },
  
  // Request Information
  request: {
    method: {
      type: String,
      enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD']
    },
    url: String,
    params: mongoose.Schema.Types.Mixed,
    query: mongoose.Schema.Types.Mixed,
    body: mongoose.Schema.Types.Mixed,
    headers: mongoose.Schema.Types.Mixed
  },
  
  // Response Information
  response: {
    statusCode: Number,
    statusMessage: String,
    responseTime: Number, // in milliseconds
    responseSize: Number, // in bytes
    error: {
      code: String,
      message: String,
      stack: String
    }
  },
  
  // Context Information
  context: {
    sessionId: String,
    requestId: String,
    correlationId: String,
    environment: {
      type: String,
      enum: ['development', 'staging', 'production', 'test'],
      default: 'development'
    },
    version: String,
    module: String,
    function: String
  },
  
  // Security Information
  security: {
    isAuthenticated: {
      type: Boolean,
      default: false
    },
    isAuthorized: {
      type: Boolean,
      default: false
    },
    permissions: [String],
    roles: [String],
    tokenInfo: {
      issuer: String,
      issuedAt: Date,
      expiresAt: Date,
      tokenType: String
    }
  },
  
  // Compliance Information
  compliance: {
    regulatoryFramework: [String],
    complianceStatus: {
      type: String,
      enum: ['compliant', 'non-compliant', 'pending', 'exempt', 'unknown'],
      default: 'unknown'
    },
    auditTrail: [{
      requirement: String,
      status: {
        type: String,
        enum: ['met', 'not_met', 'pending', 'exempt'],
        default: 'pending'
      },
      verifiedAt: Date,
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      notes: String
    }]
  },
  
  // Fraud Detection
  fraud: {
    riskScore: {
      type: Number,
      min: [0, 'Risk score must be positive'],
      max: [100, 'Risk score cannot exceed 100'],
      default: 0
    },
    riskFactors: [{
      factor: String,
      weight: {
        type: Number,
        min: [0, 'Weight must be positive'],
        max: [1, 'Weight cannot exceed 1']
      },
      description: String
    }],
    flagged: {
      type: Boolean,
      default: false
    },
    flaggedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    flaggedAt: Date,
    flagReason: String
  },
  
  // Performance Metrics
  performance: {
    executionTime: Number, // in milliseconds
    memoryUsage: Number, // in bytes
    cpuUsage: Number, // percentage
    databaseQueries: Number,
    cacheHits: Number,
    cacheMisses: Number
  },
  
  // Business Logic
  business: {
    impact: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'low'
    },
    value: {
      type: Number,
      min: [0, 'Value must be positive']
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD']
    },
    tags: [String]
  },
  
  // Metadata
  metadata: {
    tags: [{
      type: String,
      trim: true,
      maxlength: [50, 'Tag cannot exceed 50 characters']
    }],
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    source: {
      type: String,
      enum: ['api', 'web', 'mobile', 'system', 'batch', 'other'],
      default: 'api'
    }
  },
  
  // Additional Data
  data: mongoose.Schema.Types.Mixed,
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  
  // Related Logs
  relatedLogs: [{
    logId: String,
    relationship: {
      type: String,
      enum: ['parent', 'child', 'related', 'duplicate', 'superseded'],
      default: 'related'
    }
  }],
  
  // Retention and Archival
  retention: {
    policy: {
      type: String,
      enum: ['short_term', 'medium_term', 'long_term', 'permanent'],
      default: 'medium_term'
    },
    expiresAt: Date,
    archived: {
      type: Boolean,
      default: false
    },
    archivedAt: Date,
    archiveLocation: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for log age
auditLogSchema.virtual('age').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for is expired
auditLogSchema.virtual('isExpired').get(function() {
  if (this.retention && this.retention.expiresAt) {
    return Date.now() > this.retention.expiresAt;
  }
  return false;
});

// Virtual for formatted risk level
auditLogSchema.virtual('riskLevel').get(function() {
  if (this.fraud && this.fraud.riskScore) {
    if (this.fraud.riskScore >= 80) return 'critical';
    if (this.fraud.riskScore >= 60) return 'high';
    if (this.fraud.riskScore >= 40) return 'medium';
    if (this.fraud.riskScore >= 20) return 'low';
    return 'minimal';
  }
  return 'unknown';
});

// Indexes for better query performance
auditLogSchema.index({ user: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ category: 1 });
auditLogSchema.index({ level: 1 });
auditLogSchema.index({ createdAt: 1 });
auditLogSchema.index({ 'security.isAuthenticated': 1 });
auditLogSchema.index({ 'fraud.flagged': 1 });
auditLogSchema.index({ 'compliance.complianceStatus': 1 });
auditLogSchema.index({ 'business.impact': 1 });

// Pre-save middleware to generate log ID
auditLogSchema.pre('save', function(next) {
  if (this.isNew && !this.logId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.logId = `AUD-${timestamp}-${random}`.toUpperCase();
  }
  next();
});

// Pre-save middleware to set retention expiry
auditLogSchema.pre('save', function(next) {
  if (this.isNew && this.retention && this.retention.policy) {
    const now = new Date();
    switch (this.retention.policy) {
      case 'short_term':
        this.retention.expiresAt = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days
        break;
      case 'medium_term':
        this.retention.expiresAt = new Date(now.getTime() + (365 * 24 * 60 * 60 * 1000)); // 1 year
        break;
      case 'long_term':
        this.retention.expiresAt = new Date(now.getTime() + (7 * 365 * 24 * 60 * 60 * 1000)); // 7 years
        break;
      case 'permanent':
        this.retention.expiresAt = null;
        break;
    }
  }
  next();
});

// Static method to find logs by user
auditLogSchema.statics.findByUser = function(userId, limit = 100) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'name email role');
};

// Static method to find logs by action
auditLogSchema.statics.findByAction = function(action, limit = 100) {
  return this.find({ action })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'name email role');
};

// Static method to find logs by category
auditLogSchema.statics.findByCategory = function(category, limit = 100) {
  return this.find({ category })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'name email role');
};

// Static method to find logs by level
auditLogSchema.statics.findByLevel = function(level, limit = 100) {
  return this.find({ level })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'name email role');
};

// Static method to find flagged logs
auditLogSchema.statics.findFlagged = function(limit = 100) {
  return this.find({ 'fraud.flagged': true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'name email role');
};

// Static method to find logs by date range
auditLogSchema.statics.findByDateRange = function(startDate, endDate, limit = 100) {
  return this.find({
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'name email role');
};

// Static method to get audit statistics
auditLogSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$level',
        count: { $sum: 1 },
        avgRiskScore: { $avg: '$fraud.riskScore' },
        flaggedCount: {
          $sum: { $cond: ['$fraud.flagged', 1, 0] }
        }
      }
    }
  ]);
  return stats;
};

// Static method to get compliance statistics
auditLogSchema.statics.getComplianceStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$compliance.complianceStatus',
        count: { $sum: 1 },
        avgRiskScore: { $avg: '$fraud.riskScore' }
      }
    }
  ]);
  return stats;
};

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;




