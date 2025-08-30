import { MarketplaceListing, Credit, User, Transaction } from '../models/index.js';
import { createAuditLog } from '../utils/auditLogger.js';

/**
 * @desc    Get all marketplace listings with filtering and pagination
 * @route   GET /api/marketplace
 * @access  Private
 */
export const getAllListings = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      sellerId, 
      creditType,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      location
    } = req.query;
    
    // Build query
    const query = { status: 'active' }; // Only show active listings
    if (status) query.status = status;
    if (sellerId) query.sellerId = sellerId;
    if (creditType) query.creditType = creditType;
    if (location) {
      query.$or = [
        { 'productionDetails.location': { $regex: location, $options: 'i' } },
        { 'seller.profile.company.address': { $regex: location, $options: 'i' } }
      ];
    }
    if (search) {
      query.$or = [
        { 'productionDetails.facilityName': { $regex: search, $options: 'i' } },
        { 'productionDetails.location': { $regex: search, $options: 'i' } },
        { 'seller.profile.company.name': { $regex: search, $options: 'i' } }
      ];
    }
    if (minPrice || maxPrice) {
      query.pricePerCredit = {};
      if (minPrice) query.pricePerCredit.$gte = parseFloat(minPrice);
      if (maxPrice) query.pricePerCredit.$lte = parseFloat(maxPrice);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const listings = await MarketplaceListing.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('sellerId', 'name email profile.company')
      .populate('creditId', 'productionDetails environmentalData certificationDetails');

    // Get total count for pagination
    const total = await MarketplaceListing.countDocuments(query);

    // Create audit log
    await createAuditLog({
      action: 'GET_MARKETPLACE_LISTINGS',
      userId: req.user?.userId,
      resource: 'MarketplaceListing',
      details: { query, page, limit, total }
    });

    res.json({
      success: true,
      data: listings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get marketplace listings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch marketplace listings',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Get marketplace listings for current authenticated user
 * @route   GET /api/marketplace/user
 * @access  Private
 */
export const getUserListings = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const userId = req.user.userId;

    // Build query for current user's listings
    const query = { sellerId: userId };
    if (status) query.status = status;

    // Build sort object
    const sort = { createdAt: -1 };

    // Execute query with pagination
    const listings = await MarketplaceListing.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('sellerId', 'name email profile.company')
      .populate('creditId', 'productionDetails environmentalData certificationDetails');

    // Get total count for pagination
    const total = await MarketplaceListing.countDocuments(query);

    // Create audit log
    await createAuditLog({
      action: 'GET_USER_MARKETPLACE_LISTINGS',
      userId: req.user?.userId,
      resource: 'MarketplaceListing',
      details: { page, limit, total }
    });

    res.json({
      success: true,
      data: listings,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get user marketplace listings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user marketplace listings',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Create marketplace listing
 * @route   POST /api/marketplace/list
 * @access  Private/Producer
 */
export const createListing = async (req, res) => {
  try {
    const {
      creditId,
      pricePerCredit,
      availableCredits,
      listingType,
      description,
      terms,
      expiryDate
    } = req.body;

    // Verify user is a producer
    if (req.user.role !== 'producer') {
      return res.status(403).json({
        success: false,
        message: 'Only producers can create marketplace listings'
      });
    }

    // Verify credit exists and belongs to the user
    const credit = await Credit.findById(creditId);
    if (!credit) {
      return res.status(404).json({
        success: false,
        message: 'Credit not found'
      });
    }

    if (credit.producerId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only list your own credits'
      });
    }

    // Verify credit can be listed
    if (credit.status !== 'issued') {
      return res.status(400).json({
        success: false,
        message: 'Only issued credits can be listed on marketplace'
      });
    }

    if (credit.availableCredits < availableCredits) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient credits available for listing'
      });
    }

    // Check if listing already exists for this credit
    const existingListing = await MarketplaceListing.findOne({
      creditId,
      sellerId: req.user.userId,
      status: { $in: ['active', 'pending'] }
    });

    if (existingListing) {
      return res.status(400).json({
        success: false,
        message: 'A listing already exists for this credit'
      });
    }

    // Create new listing
    const listing = new MarketplaceListing({
      sellerId: req.user.userId,
      creditId,
      pricePerCredit,
      availableCredits,
      listingType: listingType || 'sale',
      description,
      terms,
      expiryDate: expiryDate ? new Date(expiryDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days
      status: 'active'
    });

    await listing.save();

    // Create audit log
    await createAuditLog({
      action: 'CREATE_MARKETPLACE_LISTING',
      userId: req.user.userId,
      resource: 'MarketplaceListing',
      resourceId: listing._id,
      details: { 
        creditId, 
        pricePerCredit, 
        availableCredits,
        listingType 
      }
    });

    res.status(201).json({
      success: true,
      message: 'Marketplace listing created successfully',
      data: listing
    });

  } catch (error) {
    console.error('Create marketplace listing error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create marketplace listing',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Buy credits from marketplace
 * @route   POST /api/marketplace/buy/:listingId
 * @access  Private/Buyer
 */
export const buyCredits = async (req, res) => {
  try {
    const { listingId } = req.params;
    const { amount, paymentMethod, transactionDetails } = req.body;

    // Verify user is a buyer
    if (req.user.role !== 'buyer') {
      return res.status(403).json({
        success: false,
        message: 'Only buyers can purchase credits'
      });
    }

    // Find the listing
    const listing = await MarketplaceListing.findById(listingId)
      .populate('sellerId', 'name email profile.company')
      .populate('creditId', 'productionDetails environmentalData');

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    if (listing.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Listing is not active'
      });
    }

    if (listing.availableCredits < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient credits available in this listing'
      });
    }

    // Calculate total cost
    const totalCost = amount * listing.pricePerCredit;

    // Create transaction record
    const transaction = new Transaction({
      type: 'marketplace_purchase',
      amount,
      fromUserId: listing.sellerId._id,
      toUserId: req.user.userId,
      creditId: listing.creditId._id,
      status: 'pending',
      financialDetails: {
        amount: totalCost,
        currency: 'USD',
        paymentMethod,
        transactionFee: totalCost * 0.02 // 2% platform fee
      },
      transactionDetails,
      marketplaceInfo: {
        listingId: listing._id,
        pricePerCredit: listing.pricePerCredit
      }
    });

    await transaction.save();

    // Update listing
    listing.availableCredits -= amount;
    listing.soldCredits = (listing.soldCredits || 0) + amount;
    listing.totalRevenue = (listing.totalRevenue || 0) + totalCost;
    
    if (listing.availableCredits === 0) {
      listing.status = 'sold_out';
    }

    await listing.save();

    // Update credit record
    const credit = await Credit.findById(listing.creditId._id);
    credit.buyerId = req.user.userId;
    credit.transferredCredits = (credit.transferredCredits || 0) + amount;
    credit.availableCredits = credit.actualCredits - credit.transferredCredits;
    
    if (credit.availableCredits === 0) {
      credit.status = 'transferred';
    }

    credit.auditTrail.push({
      action: 'CREDITS_PURCHASED_FROM_MARKETPLACE',
      userId: req.user.userId,
      timestamp: new Date(),
      details: `Purchased ${amount} credits from marketplace listing`,
      transactionId: transaction._id
    });

    await credit.save();

    // Create audit log
    await createAuditLog({
      action: 'BUY_CREDITS_FROM_MARKETPLACE',
      userId: req.user.userId,
      resource: 'MarketplaceListing',
      resourceId: listingId,
      details: { 
        amount, 
        totalCost, 
        transactionId: transaction._id,
        sellerId: listing.sellerId._id
      }
    });

    res.json({
      success: true,
      message: 'Credits purchased successfully',
      data: {
        listing,
        transaction,
        credit
      }
    });

  } catch (error) {
    console.error('Buy credits error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to purchase credits',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Get marketplace listing by ID
 * @route   GET /api/marketplace/:id
 * @access  Private
 */
export const getListingById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const listing = await MarketplaceListing.findById(id)
      .populate('sellerId', 'name email profile.company')
      .populate('creditId', 'productionDetails environmentalData certificationDetails');

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Create audit log
    await createAuditLog({
      action: 'GET_MARKETPLACE_LISTING',
      userId: req.user?.userId,
      resource: 'MarketplaceListing',
      resourceId: id,
      details: { listingId: id }
    });

    res.json({
      success: true,
      data: listing
    });

  } catch (error) {
    console.error('Get marketplace listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch marketplace listing',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Update marketplace listing
 * @route   PUT /api/marketplace/:id
 * @access  Private/Seller
 */
export const updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const listing = await MarketplaceListing.findById(id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Check if user can update this listing
    if (req.user.role !== 'admin' && listing.sellerId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Remove fields that shouldn't be updated
    delete updateData.sellerId;
    delete updateData.creditId;
    delete updateData.status;
    delete updateData.soldCredits;
    delete updateData.totalRevenue;

    // Update listing
    const updatedListing = await MarketplaceListing.findByIdAndUpdate(
      id,
      { 
        ...updateData,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).populate('sellerId', 'name email profile.company')
     .populate('creditId', 'productionDetails environmentalData');

    // Create audit log
    await createAuditLog({
      action: 'UPDATE_MARKETPLACE_LISTING',
      userId: req.user.userId,
      resource: 'MarketplaceListing',
      resourceId: id,
      details: { updatedFields: Object.keys(updateData) }
    });

    res.json({
      success: true,
      message: 'Listing updated successfully',
      data: updatedListing
    });

  } catch (error) {
    console.error('Update marketplace listing error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update listing',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Cancel marketplace listing
 * @route   DELETE /api/marketplace/:id
 * @access  Private/Seller
 */
export const cancelListing = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await MarketplaceListing.findById(id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    // Check if user can cancel this listing
    if (req.user.role !== 'admin' && listing.sellerId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (listing.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Only active listings can be cancelled'
      });
    }

    // Update listing status
    listing.status = 'cancelled';
    listing.updatedAt = new Date();
    await listing.save();

    // Create audit log
    await createAuditLog({
      action: 'CANCEL_MARKETPLACE_LISTING',
      userId: req.user.userId,
      resource: 'MarketplaceListing',
      resourceId: id,
      details: { 
        previousStatus: 'active',
        reason: 'Seller cancelled listing'
      }
    });

    res.json({
      success: true,
      message: 'Listing cancelled successfully',
      data: listing
    });

  } catch (error) {
    console.error('Cancel marketplace listing error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel listing',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Get marketplace statistics
 * @route   GET /api/marketplace/stats
 * @access  Private
 */
export const getMarketplaceStats = async (req, res) => {
  try {
    const stats = await MarketplaceListing.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalCredits: { $sum: '$availableCredits' },
          totalRevenue: { $sum: '$totalRevenue' }
        }
      }
    ]);

    const totalListings = await MarketplaceListing.countDocuments();
    const activeListings = await MarketplaceListing.countDocuments({ status: 'active' });
    const totalCredits = await MarketplaceListing.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, total: { $sum: '$availableCredits' } } }
    ]);

    // Create audit log
    await createAuditLog({
      action: 'GET_MARKETPLACE_STATS',
      userId: req.user?.userId,
      resource: 'MarketplaceListing',
      details: { totalListings, activeListings }
    });

    res.json({
      success: true,
      data: {
        totalListings,
        activeListings,
        totalCreditsAvailable: totalCredits[0]?.total || 0,
        byStatus: stats,
        recentListings: await MarketplaceListing.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .select('status pricePerCredit availableCredits createdAt')
          .populate('sellerId', 'name')
      }
    });

  } catch (error) {
    console.error('Get marketplace stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch marketplace statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};




