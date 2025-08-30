import { Credit, User, Transaction } from '../models/index.js';
import { createAuditLog } from '../utils/auditLogger.js';

/**
 * @desc    Get all credits with filtering and pagination
 * @route   GET /api/credits
 * @access  Private
 */
export const getAllCredits = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      status, 
      producerId, 
      certifierId,
      search,
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      startDate,
      endDate
    } = req.query;
    
    // Build query
    const query = {};
    if (status) query.status = status;
    if (producerId) query.producerId = producerId;
    if (certifierId) query.certifierId = certifierId;
    if (search) {
      query.$or = [
        { 'productionDetails.facilityName': { $regex: search, $options: 'i' } },
        { 'productionDetails.location': { $regex: search, $options: 'i' } },
        { 'certificationDetails.certificationNumber': { $regex: search, $options: 'i' } }
      ];
    }
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const credits = await Credit.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('producerId', 'name email profile.company')
      .populate('certifierId', 'name email profile.company')
      .populate('buyerId', 'name email profile.company');

    // Get total count for pagination
    const total = await Credit.countDocuments(query);

    // Create audit log
    await createAuditLog({
      action: 'GET_ALL_CREDITS',
      userId: req.user?.userId,
      resource: 'Credit',
      details: { query, page, limit, total }
    });

    res.json({
      success: true,
      data: credits,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get all credits error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch credits',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Get credits by user ID
 * @route   GET /api/credits/user/:userId
 * @access  Private
 */
export const getCreditsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role, status, page = 1, limit = 10 } = req.query;

    // Check if user can access this data
    if (req.user.role !== 'admin' && req.user.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Build query based on user role
    let query = {};
    if (role === 'producer') {
      query.producerId = userId;
    } else if (role === 'certifier') {
      query.certifierId = userId;
    } else if (role === 'buyer') {
      query.buyerId = userId;
    } else {
      // If no specific role, get all credits related to the user
      query.$or = [
        { producerId: userId },
        { certifierId: userId },
        { buyerId: userId }
      ];
    }

    if (status) query.status = status;

    const credits = await Credit.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('producerId', 'name email profile.company')
      .populate('certifierId', 'name email profile.company')
      .populate('buyerId', 'name email profile.company');

    const total = await Credit.countDocuments(query);

    // Create audit log
    await createAuditLog({
      action: 'GET_CREDITS_BY_USER',
      userId: req.user?.userId,
      resource: 'Credit',
      resourceId: userId,
      details: { requestedUserId: userId, role, status, total }
    });

    res.json({
      success: true,
      data: credits,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get credits by user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user credits',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Get credits for current authenticated user
 * @route   GET /api/credits/user
 * @access  Private
 */
export const getCreditsByCurrentUser = async (req, res) => {
  try {
    const { role, status, page = 1, limit = 10 } = req.query;
    const userId = req.user.userId;

    // Build query based on user role
    let query = {};
    if (req.user.role === 'producer') {
      query.producerId = userId;
    } else if (req.user.role === 'certifier') {
      query.certifierId = userId;
    } else if (req.user.role === 'buyer') {
      query.buyerId = userId;
    } else {
      // If no specific role, get all credits related to the user
      query.$or = [
        { producerId: userId },
        { certifierId: userId },
        { buyerId: userId }
      ];
    }

    if (status) query.status = status;

    const credits = await Credit.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('producerId', 'name email profile.company')
      .populate('certifierId', 'name email profile.company')
      .populate('buyerId', 'name email profile.company');

    const total = await Credit.countDocuments(query);

    // Create audit log
    await createAuditLog({
      action: 'GET_CREDITS_BY_CURRENT_USER',
      userId: req.user?.userId,
      resource: 'Credit',
      details: { role, status, total }
    });

    res.json({
      success: true,
      data: credits,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get credits by current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user credits',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Get credits by status
 * @route   GET /api/credits/status/:status
 * @access  Private
 */
export const getCreditsByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const { page = 1, limit = 10, role } = req.query;

    // Build query
    const query = { status };
    if (role) {
      if (role === 'producer') {
        query.producerId = { $exists: true };
      } else if (role === 'certifier') {
        query.certifierId = { $exists: true };
      } else if (role === 'buyer') {
        query.buyerId = { $exists: true };
      }
    }

    const credits = await Credit.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('producerId', 'name email profile.company')
      .populate('certifierId', 'name email profile.company')
      .populate('buyerId', 'name email profile.company');

    const total = await Credit.countDocuments(query);

    // Create audit log
    await createAuditLog({
      action: 'GET_CREDITS_BY_STATUS',
      userId: req.user?.userId,
      resource: 'Credit',
      details: { status, role, total }
    });

    res.json({
      success: true,
      data: credits,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get credits by status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch credits by status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Retire credits
 * @route   POST /api/credits/retire
 * @access  Private
 */
export const retireCredits = async (req, res) => {
  try {
    const { creditIds, retirementReason, retirementDate, retirementLocation } = req.body;
    const userId = req.user.userId;

    if (!creditIds || !Array.isArray(creditIds) || creditIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Credit IDs are required'
      });
    }

    // Verify user owns these credits
    const credits = await Credit.find({
      _id: { $in: creditIds },
      buyerId: userId,
      status: 'active'
    });

    if (credits.length !== creditIds.length) {
      return res.status(403).json({
        success: false,
        message: 'Some credits cannot be retired or do not belong to you'
      });
    }

    // Update credits to retired status
    const updateResult = await Credit.updateMany(
      { _id: { $in: creditIds } },
      {
        $set: {
          status: 'retired',
          retiredAt: new Date(),
          retirementDetails: {
            reason: retirementReason,
            date: retirementDate || new Date(),
            location: retirementLocation,
            retiredBy: userId
          }
        }
      }
    );

    // Create audit log
    await createAuditLog({
      action: 'RETIRE_CREDITS',
      userId: req.user?.userId,
      resource: 'Credit',
      resourceId: creditIds.join(','),
      details: { 
        creditIds, 
        retirementReason, 
        retirementDate, 
        retirementLocation,
        count: credits.length
      }
    });

    res.json({
      success: true,
      message: `Successfully retired ${credits.length} credits`,
      data: {
        retiredCount: credits.length,
        retirementDate: new Date()
      }
    });

  } catch (error) {
    console.error('Retire credits error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retire credits',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Create credit request
 * @route   POST /api/credits/request
 * @access  Private/Producer
 */
export const createCreditRequest = async (req, res) => {
  try {
    const {
      productionDetails,
      environmentalData,
      documentation,
      estimatedCredits
    } = req.body;

    // Verify user is a producer
    if (req.user.role !== 'producer') {
      return res.status(403).json({
        success: false,
        message: 'Only producers can request credits'
      });
    }

    // Create new credit request
    const credit = new Credit({
      producerId: req.user.userId,
      status: 'pending',
      productionDetails: {
        ...productionDetails,
        requestDate: new Date()
      },
      environmentalData,
      documentation,
      estimatedCredits,
      auditTrail: [{
        action: 'CREDIT_REQUEST_CREATED',
        userId: req.user.userId,
        timestamp: new Date(),
        details: 'Initial credit request submitted'
      }]
    });

    await credit.save();

    // Create audit log
    await createAuditLog({
      action: 'CREATE_CREDIT_REQUEST',
      userId: req.user.userId,
      resource: 'Credit',
      resourceId: credit._id,
      details: { estimatedCredits, facilityName: productionDetails.facilityName }
    });

    res.status(201).json({
      success: true,
      message: 'Credit request created successfully',
      data: credit
    });

  } catch (error) {
    console.error('Create credit request error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create credit request',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Update credit status
 * @route   PUT /api/credits/:id/status
 * @access  Private/Certifier
 */
export const updateCreditStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason, certificationDetails, actualCredits } = req.body;

    // Verify user is a certifier or admin
    if (!['certifier', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Only certifiers can update credit status'
      });
    }

    const credit = await Credit.findById(id);
    if (!credit) {
      return res.status(404).json({
        success: false,
        message: 'Credit not found'
      });
    }

    // Validate status transition
    const validTransitions = {
      'pending': ['under_review', 'rejected'],
      'under_review': ['approved', 'rejected', 'pending'],
      'approved': ['issued', 'rejected'],
      'issued': ['transferred', 'retired'],
      'transferred': ['retired'],
      'rejected': ['pending']
    };

    if (!validTransitions[credit.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from ${credit.status} to ${status}`
      });
    }

    // Update credit
    const updateData = {
      status,
      updatedAt: new Date()
    };

    if (status === 'approved' || status === 'issued') {
      updateData.certifierId = req.user.userId;
      updateData.certificationDetails = {
        ...certificationDetails,
        certificationDate: new Date(),
        certifierId: req.user.userId
      };
      if (actualCredits) {
        updateData.actualCredits = actualCredits;
      }
    }

    if (status === 'rejected') {
      updateData.rejectionReason = reason;
    }

    // Add to audit trail
    updateData.auditTrail = [
      ...credit.auditTrail,
      {
        action: `STATUS_UPDATED_TO_${status.toUpperCase()}`,
        userId: req.user.userId,
        timestamp: new Date(),
        details: reason || `Status updated to ${status}`,
        previousStatus: credit.status
      }
    ];

    const updatedCredit = await Credit.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('producerId', 'name email profile.company')
     .populate('certifierId', 'name email profile.company');

    // Create audit log
    await createAuditLog({
      action: 'UPDATE_CREDIT_STATUS',
      userId: req.user.userId,
      resource: 'Credit',
      resourceId: id,
      details: { 
        status, 
        reason, 
        previousStatus: credit.status,
        actualCredits 
      }
    });

    res.json({
      success: true,
      message: 'Credit status updated successfully',
      data: updatedCredit
    });

  } catch (error) {
    console.error('Update credit status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update credit status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Get credit by ID
 * @route   GET /api/credits/:id
 * @access  Private
 */
export const getCreditById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const credit = await Credit.findById(id)
      .populate('producerId', 'name email profile.company')
      .populate('certifierId', 'name email profile.company')
      .populate('buyerId', 'name email profile.company');

    if (!credit) {
      return res.status(404).json({
        success: false,
        message: 'Credit not found'
      });
    }

    // Check if user can access this credit
    const canAccess = req.user.role === 'admin' ||
                     credit.producerId._id.toString() === req.user.userId ||
                     credit.certifierId?._id.toString() === req.user.userId ||
                     credit.buyerId?._id.toString() === req.user.userId;

    if (!canAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Create audit log
    await createAuditLog({
      action: 'GET_CREDIT_BY_ID',
      userId: req.user?.userId,
      resource: 'Credit',
      resourceId: id,
      details: { creditId: id }
    });

    res.json({
      success: true,
      data: credit
    });

  } catch (error) {
    console.error('Get credit by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch credit',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Transfer credits to buyer
 * @route   POST /api/credits/:id/transfer
 * @access  Private
 */
export const transferCredits = async (req, res) => {
  try {
    const { id } = req.params;
    const { buyerId, amount, transactionDetails } = req.body;

    // Verify user is the credit owner or admin
    const credit = await Credit.findById(id);
    if (!credit) {
      return res.status(404).json({
        success: false,
        message: 'Credit not found'
      });
    }

    if (req.user.role !== 'admin' && credit.producerId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Verify credit can be transferred
    if (credit.status !== 'issued') {
      return res.status(400).json({
        success: false,
        message: 'Only issued credits can be transferred'
      });
    }

    if (credit.actualCredits < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient credits available for transfer'
      });
    }

    // Verify buyer exists
    const buyer = await User.findById(buyerId);
    if (!buyer || buyer.role !== 'buyer') {
      return res.status(400).json({
        success: false,
        message: 'Invalid buyer'
      });
    }

    // Create transaction record
    const transaction = new Transaction({
      type: 'credit_transfer',
      amount,
      fromUserId: credit.producerId,
      toUserId: buyerId,
      creditId: credit._id,
      status: 'completed',
      transactionDetails,
      blockchainInfo: {
        transactionHash: transactionDetails.blockchainHash,
        blockNumber: transactionDetails.blockNumber
      }
    });

    await transaction.save();

    // Update credit
    credit.buyerId = buyerId;
    credit.transferredCredits = (credit.transferredCredits || 0) + amount;
    credit.availableCredits = credit.actualCredits - credit.transferredCredits;
    credit.auditTrail.push({
      action: 'CREDITS_TRANSFERRED',
      userId: req.user.userId,
      timestamp: new Date(),
      details: `Transferred ${amount} credits to ${buyer.name}`,
      transactionId: transaction._id
    });

    if (credit.availableCredits === 0) {
      credit.status = 'transferred';
    }

    await credit.save();

    // Create audit log
    await createAuditLog({
      action: 'TRANSFER_CREDITS',
      userId: req.user.userId,
      resource: 'Credit',
      resourceId: id,
      details: { 
        buyerId, 
        amount, 
        transactionId: transaction._id,
        remainingCredits: credit.availableCredits
      }
    });

    res.json({
      success: true,
      message: 'Credits transferred successfully',
      data: {
        credit,
        transaction
      }
    });

  } catch (error) {
    console.error('Transfer credits error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to transfer credits',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Get credit statistics
 * @route   GET /api/credits/stats
 * @access  Private
 */
export const getCreditStats = async (req, res) => {
  try {
    const stats = await Credit.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalCredits: { $sum: '$actualCredits' },
          totalEstimated: { $sum: '$estimatedCredits' }
        }
      }
    ]);

    const totalCredits = await Credit.countDocuments();
    const pendingCredits = await Credit.countDocuments({ status: 'pending' });
    const approvedCredits = await Credit.countDocuments({ status: 'approved' });
    const issuedCredits = await Credit.countDocuments({ status: 'issued' });

    // Create audit log
    await createAuditLog({
      action: 'GET_CREDIT_STATS',
      userId: req.user?.userId,
      resource: 'Credit',
      details: { totalCredits, pendingCredits, approvedCredits, issuedCredits }
    });

    res.json({
      success: true,
      data: {
        totalCredits,
        pendingCredits,
        approvedCredits,
        issuedCredits,
        byStatus: stats,
        recentCredits: await Credit.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .select('status estimatedCredits actualCredits createdAt')
          .populate('producerId', 'name')
      }
    });

  } catch (error) {
    console.error('Get credit stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch credit statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};




