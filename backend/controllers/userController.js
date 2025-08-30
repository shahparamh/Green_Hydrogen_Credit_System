import { User } from '../models/index.js';
import { createAuditLog } from '../utils/auditLogger.js';

/**
 * @desc    Get all users (admin only)
 * @route   GET /api/users
 * @access  Private/Admin
 */
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Build query
    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'profile.company': { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const users = await User.find(query)
      .select('-password -twoFactorSecret')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('profile.company', 'name industry');

    // Get total count for pagination
    const total = await User.countDocuments(query);

    // Create audit log
    await createAuditLog({
      action: 'GET_ALL_USERS',
      userId: req.user?.userId,
      resource: 'User',
      details: { query, page, limit, total }
    });

    res.json({
      success: true,
      data: users,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Private
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id)
      .select('-password -twoFactorSecret')
      .populate('profile.company', 'name industry address');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user can access this profile (own profile or admin)
    if (req.user.role !== 'admin' && req.user.userId !== id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Create audit log
    await createAuditLog({
      action: 'GET_USER_BY_ID',
      userId: req.user?.userId,
      resource: 'User',
      resourceId: id,
      details: { requestedUserId: id }
    });

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/:id
 * @access  Private
 */
export const updateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Check if user can update this profile
    if (req.user.role !== 'admin' && req.user.userId !== id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Remove sensitive fields that shouldn't be updated directly
    delete updateData.password;
    delete updateData.role;
    delete updateData.email;
    delete updateData.twoFactorSecret;
    delete updateData.blockchainWallet;

    // If updating profile, handle nested updates
    if (updateData.profile) {
      updateData.profile = {
        ...updateData.profile,
        updatedAt: new Date()
      };
    }

    const user = await User.findByIdAndUpdate(
      id,
      { 
        ...updateData,
        updatedAt: new Date()
      },
      { 
        new: true, 
        runValidators: true 
      }
    ).select('-password -twoFactorSecret');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create audit log
    await createAuditLog({
      action: 'UPDATE_USER_PROFILE',
      userId: req.user?.userId,
      resource: 'User',
      resourceId: id,
      details: { updatedFields: Object.keys(updateData) }
    });

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });

  } catch (error) {
    console.error('Update user profile error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Delete user (admin only)
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deletion of admin users
    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete admin users'
      });
    }

    // Soft delete - mark as inactive instead of removing
    await User.findByIdAndUpdate(id, {
      status: 'inactive',
      deletedAt: new Date(),
      updatedAt: new Date()
    });

    // Create audit log
    await createAuditLog({
      action: 'DELETE_USER',
      userId: req.user?.userId,
      resource: 'User',
      resourceId: id,
      details: { deletedUser: { id, email: user.email, role: user.role } }
    });

    res.json({
      success: true,
      message: 'User deactivated successfully'
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Get user statistics
 * @route   GET /api/users/stats
 * @access  Private/Admin
 */
export const getUserStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
          activeUsers: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          verifiedUsers: {
            $sum: { $cond: [{ $eq: ['$isVerified', true] }, 1, 0] }
          }
        }
      }
    ]);

    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const verifiedUsers = await User.countDocuments({ isVerified: true });

    // Create audit log
    await createAuditLog({
      action: 'GET_USER_STATS',
      userId: req.user?.userId,
      resource: 'User',
      details: { totalUsers, activeUsers, verifiedUsers }
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        verifiedUsers,
        byRole: stats,
        recentRegistrations: await User.find()
          .sort({ createdAt: -1 })
          .limit(5)
          .select('name email role createdAt')
      }
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

/**
 * @desc    Update user status
 * @route   PATCH /api/users/:id/status
 * @access  Private/Admin
 */
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason } = req.body;

    if (!['active', 'inactive', 'suspended', 'pending'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { 
        status,
        statusReason: reason,
        updatedAt: new Date()
      },
      { new: true }
    ).select('-password -twoFactorSecret');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Create audit log
    await createAuditLog({
      action: 'UPDATE_USER_STATUS',
      userId: req.user?.userId,
      resource: 'User',
      resourceId: id,
      details: { status, reason, previousStatus: user.status }
    });

    res.json({
      success: true,
      message: 'User status updated successfully',
      data: user
    });

  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update user status',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};




