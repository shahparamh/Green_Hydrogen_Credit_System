import { Transaction, Credit, User } from '../models/index.js';
import { createAuditLog } from '../utils/auditLogger.js';

/**
 * @desc    Get all transactions with filtering and pagination
 * @route   GET /api/transactions
 * @access  Private
 */
export const getAllTransactions = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      type, 
      status, 
      fromUserId, 
      toUserId,
      creditId,
      startDate,
      endDate,
      minAmount,
      maxAmount,
      sortBy = 'createdAt', 
      sortOrder = 'desc'
    } = req.query;
    
    // Build query
    const query = {};
    if (type) query.type = type;
    if (status) query.status = status;
    if (fromUserId) query.fromUserId = fromUserId;
    if (toUserId) query.toUserId = toUserId;
    if (creditId) query.creditId = creditId;
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = parseFloat(minAmount);
      if (maxAmount) query.amount.$lte = parseFloat(maxAmount);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const transactions = await Transaction.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('fromUserId', 'name email profile.company')
      .populate('toUserId', 'name email profile.company')
      .populate('creditId', 'productionDetails environmentalData');

    // Get total count for pagination
    const total = await Transaction.countDocuments(query);

    // Create audit log
    await createAuditLog({
      action: 'GET_ALL_TRANSACTIONS',
      userId: req.user?.userId,
      resource: 'Transaction',
      details: { query, page, limit, total }
    });

    res.json({
      success: true,
      data: transactions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get all transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Get transactions by user ID
 * @route   GET /api/transactions/user/:userId
 * @access  Private
 */
export const getTransactionsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { type, status, page = 1, limit = 10 } = req.query;

    // Check if user can access this data
    if (req.user.role !== 'admin' && req.user.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Build query
    const query = {
      $or: [
        { fromUserId: userId },
        { toUserId: userId }
      ]
    };
    if (type) query.type = type;
    if (status) query.status = status;

    // Build sort object
    const sort = { createdAt: -1 };

    // Execute query with pagination
    const transactions = await Transaction.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('fromUserId', 'name email profile.company')
      .populate('toUserId', 'name email profile.company')
      .populate('creditId', 'productionDetails environmentalData');

    // Get total count for pagination
    const total = await Transaction.countDocuments(query);

    // Create audit log
    await createAuditLog({
      action: 'GET_TRANSACTIONS_BY_USER',
      userId: req.user?.userId,
      resource: 'Transaction',
      resourceId: userId,
      details: { requestedUserId: userId, type, status, total }
    });

    res.json({
      success: true,
      data: transactions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get transactions by user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user transactions',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Get transactions for current authenticated user
 * @route   GET /api/transactions/current-user
 * @access  Private
 */
export const getTransactionsByCurrentUser = async (req, res) => {
  try {
    const { type, status, page = 1, limit = 10 } = req.query;
    const userId = req.user.userId;

    // Build query for current user's transactions
    const query = {
      $or: [
        { fromUserId: userId },
        { toUserId: userId }
      ]
    };
    if (type) query.type = type;
    if (status) query.status = status;

    // Build sort object
    const sort = { createdAt: -1 };

    // Execute query with pagination
    const transactions = await Transaction.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('fromUserId', 'name email profile.company')
      .populate('toUserId', 'name email profile.company')
      .populate('creditId', 'productionDetails environmentalData');

    // Get total count for pagination
    const total = await Transaction.countDocuments(query);

    // Create audit log
    await createAuditLog({
      action: 'GET_TRANSACTIONS_BY_CURRENT_USER',
      userId: req.user?.userId,
      resource: 'Transaction',
      details: { type, status, total }
    });

    res.json({
      success: true,
      data: transactions,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get transactions by current user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch current user transactions',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Get transaction by ID
 * @route   GET /api/transactions/:id
 * @access  Private
 */
export const getTransactionById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const transaction = await Transaction.findById(id)
      .populate('fromUserId', 'name email profile.company')
      .populate('toUserId', 'name email profile.company')
      .populate('creditId', 'productionDetails environmentalData certificationDetails');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Check if user can access this transaction
    const canAccess = req.user.role === 'admin' ||
                     transaction.fromUserId._id.toString() === req.user.userId ||
                     transaction.toUserId._id.toString() === req.user.userId;

    if (!canAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Create audit log
    await createAuditLog({
      action: 'GET_TRANSACTION_BY_ID',
      userId: req.user?.userId,
      resource: 'Transaction',
      resourceId: id,
      details: { transactionId: id }
    });

    res.json({
      success: true,
      data: transaction
    });

  } catch (error) {
    console.error('Get transaction by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Update transaction status
 * @route   PUT /api/transactions/:id/status
 * @access  Private/Admin
 */
export const updateTransactionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    // Verify user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can update transaction status'
      });
    }

    if (!['pending', 'processing', 'completed', 'failed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Validate status transition
    const validTransitions = {
      'pending': ['processing', 'cancelled'],
      'processing': ['completed', 'failed', 'cancelled'],
      'completed': ['failed'], // Can only fail after completion (e.g., chargeback)
      'failed': ['pending'], // Can retry
      'cancelled': ['pending'] // Can retry
    };

    if (!validTransitions[transaction.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from ${transaction.status} to ${status}`
      });
    }

    // Update transaction
    const updateData = {
      status,
      updatedAt: new Date()
    };

    if (status === 'failed' || status === 'cancelled') {
      updateData.failureReason = reason;
    }

    if (status === 'completed') {
      updateData.completedAt = new Date();
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('fromUserId', 'name email profile.company')
     .populate('toUserId', 'name email profile.company')
     .populate('creditId', 'productionDetails environmentalData');

    // Create audit log
    await createAuditLog({
      action: 'UPDATE_TRANSACTION_STATUS',
      userId: req.user.userId,
      resource: 'Transaction',
      resourceId: id,
      details: { 
        status, 
        reason, 
        previousStatus: transaction.status 
      }
    });

    res.json({
      success: true,
      message: 'Transaction status updated successfully',
      data: updatedTransaction
    });

  } catch (error) {
    console.error('Update transaction status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update transaction status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Create manual transaction
 * @route   POST /api/transactions
 * @access  Private/Admin
 */
export const createTransaction = async (req, res) => {
  try {
    const {
      type,
      amount,
      fromUserId,
      toUserId,
      creditId,
      status,
      financialDetails,
      transactionDetails,
      blockchainInfo
    } = req.body;

    // Verify user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only admins can create manual transactions'
      });
    }

    // Validate required fields
    if (!type || !amount || !fromUserId || !toUserId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Verify users exist
    const fromUser = await User.findById(fromUserId);
    const toUser = await User.findById(toUserId);
    
    if (!fromUser || !toUser) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user IDs'
      });
    }

    // Verify credit exists if provided
    if (creditId) {
      const credit = await Credit.findById(creditId);
      if (!credit) {
        return res.status(400).json({
          success: false,
          message: 'Invalid credit ID'
        });
      }
    }

    // Create transaction
    const transaction = new Transaction({
      type,
      amount,
      fromUserId,
      toUserId,
      creditId,
      status: status || 'pending',
      financialDetails,
      transactionDetails,
      blockchainInfo,
      createdBy: req.user.userId
    });

    await transaction.save();

    // Create audit log
    await createAuditLog({
      action: 'CREATE_MANUAL_TRANSACTION',
      userId: req.user.userId,
      resource: 'Transaction',
      resourceId: transaction._id,
      details: { 
        type, 
        amount, 
        fromUserId, 
        toUserId,
        creditId 
      }
    });

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: transaction
    });

  } catch (error) {
    console.error('Create transaction error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create transaction',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Get transaction statistics
 * @route   GET /api/transactions/stats
 * @access  Private
 */
export const getTransactionStats = async (req, res) => {
  try {
    const stats = await Transaction.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    const typeStats = await Transaction.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    const totalTransactions = await Transaction.countDocuments();
    const pendingTransactions = await Transaction.countDocuments({ status: 'pending' });
    const completedTransactions = await Transaction.countDocuments({ status: 'completed' });
    const totalVolume = await Transaction.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Create audit log
    await createAuditLog({
      action: 'GET_TRANSACTION_STATS',
      userId: req.user?.userId,
      resource: 'Transaction',
      details: { totalTransactions, pendingTransactions, completedTransactions }
    });

    res.json({
      success: true,
      data: {
        totalTransactions,
        pendingTransactions,
        completedTransactions,
        totalVolume: totalVolume[0]?.total || 0,
        byStatus: stats,
        byType: typeStats,
        recentTransactions: await Transaction.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .select('type amount status createdAt')
          .populate('fromUserId', 'name')
          .populate('toUserId', 'name')
      }
    });

  } catch (error) {
    console.error('Get transaction stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Retire credits (mark as permanently used)
 * @route   POST /api/transactions/:id/retire
 * @access  Private/Buyer
 */
export const retireCredits = async (req, res) => {
  try {
    const { id } = req.params;
    const { retirementReason, environmentalImpact } = req.body;

    // Verify user is a buyer or admin
    if (!['buyer', 'admin'].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Only buyers can retire credits'
      });
    }

    const transaction = await Transaction.findById(id);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Check if user can retire these credits
    if (req.user.role !== 'admin' && transaction.toUserId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    if (transaction.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Only completed transactions can have credits retired'
      });
    }

    // Update transaction with retirement info
    transaction.retirementDetails = {
      retiredAt: new Date(),
      retiredBy: req.user.userId,
      reason: retirementReason,
      environmentalImpact
    };
    transaction.status = 'retired';
    transaction.updatedAt = new Date();

    await transaction.save();

    // Update credit status if this is a credit transaction
    if (transaction.creditId) {
      const credit = await Credit.findById(transaction.creditId);
      if (credit) {
        credit.status = 'retired';
        credit.retiredCredits = (credit.retiredCredits || 0) + transaction.amount;
        credit.auditTrail.push({
          action: 'CREDITS_RETIRED',
          userId: req.user.userId,
          timestamp: new Date(),
          details: `Credits retired: ${retirementReason}`,
          transactionId: transaction._id
        });
        await credit.save();
      }
    }

    // Create audit log
    await createAuditLog({
      action: 'RETIRE_CREDITS',
      userId: req.user.userId,
      resource: 'Transaction',
      resourceId: id,
      details: { 
        retirementReason, 
        environmentalImpact,
        amount: transaction.amount
      }
    });

    res.json({
      success: true,
      message: 'Credits retired successfully',
      data: transaction
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




