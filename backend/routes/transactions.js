import express from 'express';
import {
  getAllTransactions,
  getTransactionsByUser,
  getTransactionById,
  updateTransactionStatus,
  createTransaction,
  getTransactionStats,
  retireCredits,
  getTransactionsByCurrentUser
} from '../controllers/transactionController.js';
import { authenticateUser } from '../middleware/userMiddleware.js';

const router = express.Router();

// Get all transactions
router.get('/', authenticateUser, getAllTransactions);

// Get transaction statistics
router.get('/stats', authenticateUser, getTransactionStats);

// Get transactions for current authenticated user
router.get('/current-user', authenticateUser, getTransactionsByCurrentUser);

// Get transactions by user ID
router.get('/user/:userId', authenticateUser, getTransactionsByUser);

// Get transaction by ID
router.get('/:id', authenticateUser, getTransactionById);

// Update transaction status (admin only)
router.put('/:id/status', authenticateUser, updateTransactionStatus);

// Retire credits
router.post('/:id/retire', authenticateUser, retireCredits);

// Create manual transaction (admin only)
router.post('/', authenticateUser, createTransaction);

export default router;




