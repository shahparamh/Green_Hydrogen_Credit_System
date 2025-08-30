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

const router = express.Router();

// Get all transactions
router.get('/', getAllTransactions);

// Get transaction statistics
router.get('/stats', getTransactionStats);

// Get transactions for current authenticated user
router.get('/current-user', getTransactionsByCurrentUser);

// Get transactions by user ID
router.get('/user/:userId', getTransactionsByUser);

// Get transaction by ID
router.get('/:id', getTransactionById);

// Update transaction status (admin only)
router.put('/:id/status', updateTransactionStatus);

// Retire credits
router.post('/:id/retire', retireCredits);

// Create manual transaction (admin only)
router.post('/', createTransaction);

export default router;




