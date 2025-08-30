import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserProfile,
  deleteUser,
  getUserStats,
  updateUserStatus
} from '../controllers/userController.js';

const router = express.Router();

// Get all users (admin only)
router.get('/', getAllUsers);

// Get user statistics (admin only)
router.get('/stats', getUserStats);

// Get user by ID
router.get('/:id', getUserById);

// Update user profile
router.put('/:id', updateUserProfile);

// Update user status (admin only)
router.patch('/:id/status', updateUserStatus);

// Delete user (admin only)
router.delete('/:id', deleteUser);

export default router;
