import mongoose from 'mongoose';

const marketplaceListingSchema = new mongoose.Schema({
  // Listing Information
  listingId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Listing title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Listing description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  
  // Credit Information
  credit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Credit',
    required: [true, 'Credit reference is required']
  },
  availableAmount: {
    type: Number,
    required: [true, 'Available amount is required'],
    min: [0.01, 'Available amount must be greater than 0']
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0.01, 'Total amount must be greater than 0']
  },
  minimumPurchase: {
    type: Number,
    min: [0.01, 'Minimum purchase must be greater than 0']
  },
  
  // Seller Information
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Seller is required']
  },
  
  // Pricing Information
  pricing: {
    pricePerUnit: {
      type: Number,
      required: [true, 'Price per unit is required'],
      min: [0.01, 'Price per unit must be greater than 0']
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'],
      required: true
    },
    discount: {
      type: Number,
      min: [0, 'Discount cannot be negative'],
      max: [100, 'Discount cannot exceed 100%'],
      default: 0
    },
    bulkDiscount: [{
      quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1']
      },
      discountPercentage: {
        type: Number,
        required: true,
        min: [0, 'Discount percentage cannot be negative'],
        max: [100, 'Discount percentage cannot exceed 100%']
      }
    }]
  },
  
  // Listing Status and Visibility
  status: {
    type: String,
    required: true,
    enum: ['draft', 'active', 'paused', 'sold', 'expired', 'cancelled', 'suspended'],
    default: 'draft'
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'invite-only'],
    default: 'public'
  },
  
  // Listing Period
  listingPeriod: {
    startDate: {
      type: Date,
      required: [true, 'Start date is required']
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required']
    },
    autoRenew: {
      type: Boolean,
      default: false
    }
  },
  
  // Environmental and Quality Information
  environmental: {
    co2Reduction: {
      type: Number,
      min: [0, 'CO2 reduction must be positive']
    },
    energySource: {
      type: String,
      enum: ['solar', 'wind', 'hydro', 'nuclear', 'geothermal', 'biomass', 'hybrid']
    },
    sustainabilityScore: {
      type: Number,
      min: [0, 'Sustainability score must be positive'],
      max: [100, 'Sustainability score cannot exceed 100']
    },
    certification: [{
      standard: String,
      issuer: String,
      validUntil: Date,
      verified: {
        type: Boolean,
        default: false
      }
    }]
  },
  
  // Location and Delivery
  location: {
    country: String,
    state: String,
    city: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  delivery: {
    method: {
      type: String,
      enum: ['digital', 'physical', 'hybrid'],
      default: 'digital'
    },
    estimatedDays: {
      type: Number,
      min: [0, 'Estimated days cannot be negative'],
      default: 1
    },
    deliveryFee: {
      type: Number,
      min: [0, 'Delivery fee cannot be negative'],
      default: 0
    }
  },
  
  // Payment and Terms
  payment: {
    acceptedMethods: [{
      type: String,
      enum: ['crypto', 'fiat', 'credit', 'bank_transfer', 'paypal']
    }],
    paymentTerms: {
      type: String,
      enum: ['immediate', 'net_30', 'net_60', 'net_90'],
      default: 'immediate'
    },
    escrow: {
      type: Boolean,
      default: false
    },
    escrowFee: {
      type: Number,
      min: [0, 'Escrow fee cannot be negative'],
      default: 0
    }
  },
  
  // Blockchain Integration
  blockchain: {
    listingHash: {
      type: String,
      trim: true,
      match: [/^0x[a-fA-F0-9]{64}$/, 'Invalid listing hash format']
    },
    contractAddress: {
      type: String,
      trim: true,
      match: [/^0x[a-fA-F0-9]{40}$/, 'Invalid contract address format']
    },
    tokenId: String,
    network: {
      type: String,
      default: 'localhost',
      enum: ['localhost', 'sepolia', 'mainnet', 'polygon', 'arbitrum']
    }
  },
  
  // Analytics and Performance
  analytics: {
    views: {
      type: Number,
      default: 0,
      min: [0, 'Views cannot be negative']
    },
    favorites: {
      type: Number,
      default: 0,
      min: [0, 'Favorites cannot be negative']
    },
    inquiries: {
      type: Number,
      default: 0,
      min: [0, 'Inquiries cannot be negative']
    },
    conversionRate: {
      type: Number,
      min: [0, 'Conversion rate cannot be negative'],
      max: [100, 'Conversion rate cannot exceed 100%']
    }
  },
  
  // Metadata and Tags
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
      enum: ['low', 'medium', 'high', 'featured'],
      default: 'medium'
    }
  },
  
  // Notes and Additional Information
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  
  // Audit Trail
  auditTrail: [{
    action: {
      type: String,
      required: true,
      enum: ['created', 'published', 'updated', 'paused', 'resumed', 'sold', 'expired', 'cancelled', 'suspended']
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
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for discounted price
marketplaceListingSchema.virtual('discountedPrice').get(function() {
  if (this.pricing && this.pricing.pricePerUnit && this.pricing.discount) {
    return this.pricing.pricePerUnit * (1 - this.pricing.discount / 100);
  }
  return this.pricing?.pricePerUnit || 0;
});

// Virtual for total value
marketplaceListingSchema.virtual('totalValue').get(function() {
  if (this.pricing && this.pricing.pricePerUnit && this.totalAmount) {
    return this.pricing.pricePerUnit * this.totalAmount;
  }
  return 0;
});

// Virtual for listing age
marketplaceListingSchema.virtual('age').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Virtual for days remaining
marketplaceListingSchema.virtual('daysRemaining').get(function() {
  if (this.listingPeriod && this.listingPeriod.endDate) {
    const remaining = Math.ceil((this.listingPeriod.endDate - Date.now()) / (1000 * 60 * 60 * 24));
    return remaining > 0 ? remaining : 0;
  }
  return null;
});

// Virtual for is expired
marketplaceListingSchema.virtual('isExpired').get(function() {
  if (this.listingPeriod && this.listingPeriod.endDate) {
    return Date.now() > this.listingPeriod.endDate;
  }
  return false;
});

// Indexes for better query performance
marketplaceListingSchema.index({ seller: 1 });
marketplaceListingSchema.index({ credit: 1 });
marketplaceListingSchema.index({ status: 1 });
marketplaceListingSchema.index({ 'pricing.pricePerUnit': 1 });
marketplaceListingSchema.index({ 'listingPeriod.endDate': 1 });
marketplaceListingSchema.index({ 'environmental.energySource': 1 });
marketplaceListingSchema.index({ 'blockchain.network': 1 });
marketplaceListingSchema.index({ createdAt: 1 });

// Pre-save middleware to generate listing ID
marketplaceListingSchema.pre('save', function(next) {
  if (this.isNew && !this.listingId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    this.listingId = `LST-${timestamp}-${random}`.toUpperCase();
  }
  next();
});

// Pre-save middleware to validate dates
marketplaceListingSchema.pre('save', function(next) {
  if (this.listingPeriod && this.listingPeriod.startDate && this.listingPeriod.endDate) {
    if (this.listingPeriod.startDate >= this.listingPeriod.endDate) {
      return next(new Error('End date must be after start date'));
    }
  }
  next();
});

// Pre-save middleware to update status based on dates
marketplaceListingSchema.pre('save', function(next) {
  if (this.listingPeriod && this.listingPeriod.endDate && this.status === 'active') {
    if (Date.now() > this.listingPeriod.endDate) {
      this.status = 'expired';
    }
  }
  next();
});

// Static method to find active listings
marketplaceListingSchema.statics.findActive = function() {
  return this.find({ 
    status: 'active',
    'listingPeriod.endDate': { $gt: new Date() }
  }).populate('seller', 'name email company')
    .populate('credit', 'creditId amount status environmentalData');
};

// Static method to find listings by seller
marketplaceListingSchema.statics.findBySeller = function(sellerId) {
  return this.find({ seller: sellerId }).populate('credit', 'creditId amount status');
};

// Static method to find listings by price range
marketplaceListingSchema.statics.findByPriceRange = function(minPrice, maxPrice) {
  return this.find({
    'pricing.pricePerUnit': { $gte: minPrice, $lte: maxPrice },
    status: 'active'
  }).populate('seller', 'name email company')
    .populate('credit', 'creditId amount status environmentalData');
};

// Static method to find listings by energy source
marketplaceListingSchema.statics.findByEnergySource = function(energySource) {
  return this.find({
    'environmental.energySource': energySource,
    status: 'active'
  }).populate('seller', 'name email company')
    .populate('credit', 'creditId amount status environmentalData');
};

// Static method to get marketplace statistics
marketplaceListingSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$totalAmount' },
        totalValue: { $sum: { $multiply: ['$pricing.pricePerUnit', '$totalAmount'] } }
      }
    }
  ]);
  return stats;
};

const MarketplaceListing = mongoose.model('MarketplaceListing', marketplaceListingSchema);

export default MarketplaceListing;




