import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  // Transaction Information
  transactionId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Transaction type is required'],
    enum: ['issue', 'transfer', 'retire', 'burn', 'mint', 'approve', 'reject', 'expire'],
    default: 'transfer'
  },
  
  // Credit Information
  credit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Credit',
    required: [true, 'Credit reference is required']
  },
  amount: {
    type: Number,
    required: [true, 'Transaction amount is required'],
    min: [0.01, 'Amount must be greater than 0']
  },
  
  // Parties Involved
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender is required']
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recipient is required']
  },
  
  // Transaction Details
  status: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  
  // Financial Information
  financial: {
    price: {
      type: Number,
      min: [0, 'Price must be positive']
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD']
    },
    totalValue: {
      type: Number,
      min: [0, 'Total value must be positive']
    },
    fees: {
      type: Number,
      default: 0,
      min: [0, 'Fees cannot be negative']
    },
    tax: {
      type: Number,
      default: 0,
      min: [0, 'Tax cannot be negative']
    }
  },
  
  // Blockchain Information
  blockchain: {
    transactionHash: {
      type: String,
      trim: true,
      match: [/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash format']
    },
    blockNumber: Number,
    gasUsed: Number,
    gasPrice: Number,
    contractAddress: {
      type: String,
      trim: true,
      match: [/^0x[a-fA-F0-9]{40}$/, 'Invalid contract address format']
    },
    network: {
      type: String,
      default: 'localhost',
      enum: ['localhost', 'sepolia', 'mainnet', 'polygon', 'arbitrum']
    },
    confirmations: {
      type: Number,
      default: 0,
      min: [0, 'Confirmations cannot be negative']
    }
  },
  
  // Marketplace Information (if applicable)
  marketplace: {
    listingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MarketplaceListing'
    },
    orderId: String,
    paymentMethod: {
      type: String,
      enum: ['crypto', 'fiat', 'hybrid', 'credit'],
      default: 'crypto'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
      default: 'pending'
    }
  },
  
  // Environmental Impact
  environmentalImpact: {
    co2Reduction: {
      type: Number,
      min: [0, 'CO2 reduction must be positive']
    },
    carbonOffset: {
      type: Number,
      min: [0, 'Carbon offset must be positive']
    },
    sustainabilityScore: {
      type: Number,
      min: [0, 'Sustainability score must be positive'],
      max: [100, 'Sustainability score cannot exceed 100']
    }
  },
  
  // Compliance and Verification
  compliance: {
    verified: {
      type: Boolean,
      default: false
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedAt: Date,
    complianceScore: {
      type: Number,
      min: [0, 'Compliance score must be positive'],
      max: [100, 'Compliance score cannot exceed 100']
    },
    regulatoryRequirements: [{
      requirement: String,
      status: {
        type: String,
        enum: ['pending', 'met', 'failed', 'exempt'],
        default: 'pending'
      },
      verifiedAt: Date,
      verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    }]
  },
  
  // Metadata and Notes
  metadata: {
    tags: [{
      type: String,
      trim: true,
      maxlength: [50, 'Tag cannot exceed 50 characters']
    }],
    category: {
      type: String,
      enum: ['production', 'trading', 'retirement', 'verification', 'compliance', 'other'],
      default: 'trading'
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    }
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  
  // Timestamps and Lifecycle
  processedAt: Date,
  completedAt: Date,
  failedAt: Date,
  cancelledAt: Date,
  
  // Audit Trail
  auditTrail: [{
    action: {
      type: String,
      required: true,
      enum: ['created', 'submitted', 'processed', 'completed', 'failed', 'cancelled', 'verified', 'audited']
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    details: String,
    metadata: mongoose.Schema.Types.Mixed
  }],
  
  // Error Information
  error: {
    code: String,
    message: String,
    details: mongoose.Schema.Types.Mixed,
    occurredAt: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for transaction duration
transactionSchema.virtual('duration').get(function() {
  if (this.createdAt && this.completedAt) {
    return Math.floor((this.completedAt - this.createdAt) / (1000 * 60 * 60 * 24));
  }
  return null;
});

// Virtual for transaction age
transactionSchema.virtual('age').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for total cost including fees
transactionSchema.virtual('totalCost').get(function() {
  if (this.financial) {
    const base = this.financial.totalValue || 0;
    const fees = this.financial.fees || 0;
    const tax = this.financial.tax || 0;
    return base + fees + tax;
  }
  return 0;
});

// Indexes for better query performance
transactionSchema.index({ from: 1 });
transactionSchema.index({ to: 1 });
transactionSchema.index({ credit: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ status: 1 });
transactionSchema.index({ createdAt: 1 });
transactionSchema.index({ 'blockchain.transactionHash': 1 });
transactionSchema.index({ 'blockchain.network': 1 });
transactionSchema.index({ 'marketplace.paymentStatus': 1 });

// Pre-save middleware to generate transaction ID
transactionSchema.pre('save', function(next) {
  if (this.isNew && !this.transactionId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.transactionId = `TXN-${timestamp}-${random}`.toUpperCase();
  }
  next();
});

// Pre-save middleware to update timestamps based on status
transactionSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    const now = new Date();
    
    switch (this.status) {
      case 'processing':
        this.processedAt = now;
        break;
      case 'completed':
        this.completedAt = now;
        break;
      case 'failed':
        this.failedAt = now;
        break;
      case 'cancelled':
        this.cancelledAt = now;
        break;
    }
  }
  next();
});

// Static method to find transactions by user
transactionSchema.statics.findByUser = function(userId) {
  return this.find({
    $or: [{ from: userId }, { to: userId }]
  }).populate('from', 'name email company')
    .populate('to', 'name email company')
    .populate('credit', 'creditId amount status');
};

// Static method to find transactions by type
transactionSchema.statics.findByType = function(type) {
  return this.find({ type }).populate('from', 'name email company')
    .populate('to', 'name email company')
    .populate('credit', 'creditId amount status');
};

// Static method to find transactions by status
transactionSchema.statics.findByStatus = function(status) {
  return this.find({ status }).populate('from', 'name email company')
    .populate('to', 'name email company')
    .populate('credit', 'creditId amount status');
};

// Static method to get transaction statistics
transactionSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$type',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        totalValue: { $sum: '$financial.totalValue' }
      }
    }
  ]);
  return stats;
};

// Static method to get user transaction history
transactionSchema.statics.getUserHistory = function(userId, limit = 50) {
  return this.find({
    $or: [{ from: userId }, { to: userId }]
  })
  .sort({ createdAt: -1 })
  .limit(limit)
  .populate('from', 'name email company')
  .populate('to', 'name email company')
  .populate('credit', 'creditId amount status');
};

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;




