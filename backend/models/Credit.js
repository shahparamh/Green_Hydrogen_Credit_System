import mongoose from 'mongoose';

const creditSchema = new mongoose.Schema({
  // Credit Identification
  creditId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  tokenId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  
  // Credit Details
  amount: {
    type: Number,
    required: [true, 'Credit amount is required'],
    min: [0.01, 'Amount must be greater than 0'],
    validate: {
      validator: function(value) {
        return value > 0 && Number.isFinite(value);
      },
      message: 'Amount must be a positive finite number'
    }
  },
  unit: {
    type: String,
    required: true,
    default: 'kg',
    enum: ['kg', 'ton', 'm3', 'kWh']
  },
  
  // Status and Lifecycle
  status: {
    type: String,
    required: true,
    enum: ['pending', 'issued', 'verified', 'traded', 'retired', 'expired', 'suspended'],
    default: 'pending',
    index: true
  },
  lifecycle: {
    issuedAt: Date,
    verifiedAt: Date,
    tradedAt: Date,
    retiredAt: Date,
    expiredAt: Date
  },
  
  // Production Information
  productionDetails: {
    facilityName: {
      type: String,
      required: [true, 'Facility name is required'],
      trim: true,
      maxlength: [200, 'Facility name cannot exceed 200 characters']
    },
    facilityType: {
      type: String,
      required: true,
      enum: ['electrolysis', 'steam_methane_reforming', 'biomass_gasification', 'photoelectrochemical', 'thermochemical', 'other']
    },
    location: {
      country: {
        type: String,
        required: [true, 'Country is required'],
        trim: true
      },
      state: {
        type: String,
        trim: true
      },
      city: {
        type: String,
        trim: true
      },
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    productionMethod: {
      type: String,
      required: true,
      enum: ['green', 'blue', 'grey', 'turquoise', 'yellow', 'pink']
    },
    energySource: {
      type: String,
      required: true,
      enum: ['renewable', 'nuclear', 'fossil_fuel', 'biomass', 'geothermal', 'hydroelectric', 'solar', 'wind']
    },
    productionDate: {
      type: Date,
      required: [true, 'Production date is required']
    },
    carbonIntensity: {
      type: Number,
      min: [0, 'Carbon intensity cannot be negative'],
      unit: 'gCO2e/kWh'
    },
    energyEfficiency: {
      type: Number,
      min: [0, 'Energy efficiency cannot be negative'],
      max: [100, 'Energy efficiency cannot exceed 100%'],
      unit: '%'
    }
  },
  
  // Certification Information
  certificationDetails: {
    certificationNumber: {
      type: String,
      required: [true, 'Certification number is required'],
      unique: true,
      trim: true
    },
    certificationStandard: {
      type: String,
      required: true,
      enum: ['ISO14064', 'GHG_Protocol', 'PAS2060', 'ISO14067', 'ISO14040', 'custom']
    },
    certifierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Certifier is required']
    },
    certificationDate: {
      type: Date,
      required: [true, 'Certification date is required']
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required']
    },
    verificationMethod: {
      type: String,
      required: true,
      enum: ['onsite_audit', 'document_review', 'remote_audit', 'continuous_monitoring', 'third_party_verification']
    },
    verificationFrequency: {
      type: String,
      enum: ['monthly', 'quarterly', 'semi_annually', 'annually', 'continuous']
    }
  },
  
  // Verification and Quality
  verificationDetails: {
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verificationDate: Date,
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'under_review'],
      default: 'pending'
    },
    verificationNotes: String,
    qualityScore: {
      type: Number,
      min: [0, 'Quality score cannot be negative'],
      max: [100, 'Quality score cannot exceed 100']
    },
    complianceStatus: {
      type: String,
      enum: ['compliant', 'non_compliant', 'under_investigation', 'waiver_granted'],
      default: 'compliant'
    }
  },
  
  // Ownership and Trading
  producerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Producer is required'],
    index: true
  },
  currentOwnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Current owner is required'],
    index: true
  },
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Financial Information
  financial: {
    issuePrice: {
      type: Number,
      min: [0, 'Issue price cannot be negative']
    },
    currentPrice: {
      type: Number,
      min: [0, 'Current price cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD']
    },
    marketValue: {
      type: Number,
      min: [0, 'Market value cannot be negative']
    },
    premium: {
      type: Number,
      default: 0,
      min: [0, 'Premium cannot be negative']
    }
  },
  
  // Blockchain Information
  blockchain: {
    contractAddress: {
      type: String,
      required: true,
      trim: true,
      match: [/^0x[a-fA-F0-9]{40}$/, 'Invalid contract address format']
    },
    network: {
      type: String,
      default: 'localhost',
      enum: ['localhost', 'sepolia', 'mainnet', 'polygon', 'arbitrum', 'optimism']
    },
    transactionHash: {
      type: String,
      trim: true,
      match: [/^0x[a-fA-F0-9]{64}$/, 'Invalid transaction hash format']
    },
    blockNumber: Number,
    gasUsed: Number,
    gasPrice: Number,
    tokenURI: String
  },
  
  // Environmental Impact
  environmentalImpact: {
    co2Reduction: {
      type: Number,
      min: [0, 'CO2 reduction cannot be negative'],
      unit: 'kgCO2e'
    },
    waterSaved: {
      type: Number,
      min: [0, 'Water saved cannot be negative'],
      unit: 'liters'
    },
    renewableEnergyUsed: {
      type: Number,
      min: [0, 'Renewable energy used cannot be negative'],
      unit: 'kWh'
    },
    sustainabilityScore: {
      type: Number,
      min: [0, 'Sustainability score cannot be negative'],
      max: [100, 'Sustainability score cannot exceed 100']
    }
  },
  
  // Metadata and Documentation
  metadata: {
    description: {
      type: String,
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    tags: [{
      type: String,
      trim: true,
      maxlength: [50, 'Tag cannot exceed 50 characters']
    }],
    attachments: [{
      filename: String,
      fileType: String,
      fileSize: Number,
      uploadDate: Date,
      url: String
    }],
    externalReferences: [{
      title: String,
      url: String,
      type: String
    }]
  },
  
  // Audit and Compliance
  audit: {
    lastAuditDate: Date,
    nextAuditDate: Date,
    auditStatus: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'overdue'],
      default: 'pending'
    },
    complianceChecks: [{
      checkType: String,
      status: String,
      date: Date,
      notes: String
    }]
  },
  
  // Timestamps and Versioning
  version: {
    type: Number,
    default: 1,
    min: [1, 'Version must be at least 1']
  },
  previousVersions: [{
    version: Number,
    changes: String,
    date: Date,
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for credit age
creditSchema.virtual('creditAge').get(function() {
  if (!this.productionDetails?.productionDate) return null;
  const now = new Date();
  const productionDate = new Date(this.productionDetails.productionDate);
  return Math.floor((now - productionDate) / (1000 * 60 * 60 * 24)); // days
});

// Virtual for days until expiry
creditSchema.virtual('daysUntilExpiry').get(function() {
  if (!this.certificationDetails?.expiryDate) return null;
  const now = new Date();
  const expiryDate = new Date(this.certificationDetails.expiryDate);
  const diff = expiryDate - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24)); // days
});

// Virtual for credit value
creditSchema.virtual('totalValue').get(function() {
  if (!this.financial?.currentPrice || !this.amount) return 0;
  return this.financial.currentPrice * this.amount;
});

// Virtual for credit status
creditSchema.virtual('isExpired').get(function() {
  if (!this.certificationDetails?.expiryDate) return false;
  return new Date() > new Date(this.certificationDetails.expiryDate);
});

creditSchema.virtual('isActive').get(function() {
  return this.status === 'issued' || this.status === 'verified' || this.status === 'traded';
});

// Indexes for better query performance
creditSchema.index({ status: 1, 'productionDetails.productionDate': -1 });
creditSchema.index({ 'certificationDetails.expiryDate': 1 });
creditSchema.index({ 'productionDetails.location.country': 1 });
creditSchema.index({ 'productionDetails.productionMethod': 1 });
creditSchema.index({ 'productionDetails.energySource': 1 });
creditSchema.index({ 'verificationDetails.verificationStatus': 1 });
creditSchema.index({ 'financial.currentPrice': 1 });
creditSchema.index({ 'environmentalImpact.sustainabilityScore': -1 });
creditSchema.index({ createdAt: -1 });
creditSchema.index({ updatedAt: -1 });

// Compound indexes for common queries
creditSchema.index({ 
  status: 1, 
  'productionDetails.productionMethod': 1, 
  'certificationDetails.expiryDate': 1 
});

creditSchema.index({ 
  'productionDetails.location.country': 1, 
  'productionDetails.energySource': 1, 
  status: 1 
});

// Pre-save middleware to generate creditId if not provided
creditSchema.pre('save', function(next) {
  if (!this.creditId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.creditId = `HGC-${timestamp}-${random}`.toUpperCase();
  }
  
  if (!this.tokenId) {
    this.tokenId = this.creditId;
  }
  
  next();
});

// Pre-save middleware to update lifecycle dates
creditSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    const now = new Date();
    
    switch (this.status) {
      case 'issued':
        this.lifecycle.issuedAt = now;
        break;
      case 'verified':
        this.lifecycle.verifiedAt = now;
        break;
      case 'traded':
        this.lifecycle.tradedAt = now;
        break;
      case 'retired':
        this.lifecycle.retiredAt = now;
        break;
      case 'expired':
        this.lifecycle.expiredAt = now;
        break;
    }
  }
  
  next();
});

// Pre-save middleware to update version
creditSchema.pre('save', function(next) {
  if (this.isModified() && !this.isNew) {
    this.version += 1;
  }
  next();
});

// Instance method to check if credit can be traded
creditSchema.methods.canBeTraded = function() {
  return this.status === 'verified' && 
         !this.isExpired && 
         this.verificationDetails.verificationStatus === 'approved';
};

// Instance method to check if credit can be retired
creditSchema.methods.canBeRetired = function() {
  return this.status === 'verified' || this.status === 'traded';
};

// Instance method to get credit summary
creditSchema.methods.getSummary = function() {
  return {
    creditId: this.creditId,
    amount: this.amount,
    unit: this.unit,
    status: this.status,
    productionMethod: this.productionDetails.productionMethod,
    energySource: this.productionDetails.energySource,
    location: this.productionDetails.location.country,
    issueDate: this.lifecycle.issuedAt,
    expiryDate: this.certificationDetails.expiryDate,
    currentPrice: this.financial.currentPrice,
    sustainabilityScore: this.environmentalImpact.sustainabilityScore
  };
};

// Static method to find credits by production method
creditSchema.statics.findByProductionMethod = function(method) {
  return this.find({ 'productionDetails.productionMethod': method });
};

// Static method to find credits by energy source
creditSchema.statics.findByEnergySource = function(source) {
  return this.find({ 'productionDetails.energySource': source });
};

// Static method to find credits by location
creditSchema.statics.findByLocation = function(country, state = null, city = null) {
  const query = { 'productionDetails.location.country': country };
  if (state) query['productionDetails.location.state'] = state;
  if (city) query['productionDetails.location.city'] = city;
  return this.find(query);
};

// Static method to find credits by price range
creditSchema.statics.findByPriceRange = function(minPrice, maxPrice) {
  return this.find({
    'financial.currentPrice': {
      $gte: minPrice,
      $lte: maxPrice
    }
  });
};

// Static method to find expiring credits
creditSchema.statics.findExpiringCredits = function(daysThreshold = 30) {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
  
  return this.find({
    'certificationDetails.expiryDate': {
      $lte: thresholdDate,
      $gte: new Date()
    },
    status: { $in: ['issued', 'verified', 'traded'] }
  });
};

// Static method to get credit statistics
creditSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalCredits: { $sum: '$amount' },
        totalValue: { $sum: { $multiply: ['$amount', '$financial.currentPrice'] } },
        averagePrice: { $avg: '$financial.currentPrice' },
        count: { $sum: 1 }
      }
    }
  ]);
  
  return stats[0] || {
    totalCredits: 0,
    totalValue: 0,
    averagePrice: 0,
    count: 0
  };
};

// Static method to get credits by status
creditSchema.statics.getCreditsByStatus = async function() {
  return await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
        averagePrice: { $avg: '$financial.currentPrice' }
      }
    },
    { $sort: { count: -1 } }
  ]);
};

const Credit = mongoose.model('Credit', creditSchema);

export default Credit;

