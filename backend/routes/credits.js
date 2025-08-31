import express from 'express';
import {
  getAllCredits,
  getCreditsByUser,
  createCreditRequest,
  updateCreditStatus,
  getCreditById,
  transferCredits,
  getCreditStats,
  getCreditsByCurrentUser,
  getCreditsByStatus,
  retireCredits
} from '../controllers/creditController.js';
import { authenticateUser } from '../middleware/userMiddleware.js';

const router = express.Router();

// Get all credits
router.get('/', authenticateUser, getAllCredits);

// Get credit statistics
router.get('/stats', authenticateUser, getCreditStats);

// Get credits for current authenticated user
router.get('/user', authenticateUser, getCreditsByCurrentUser);

// Get credits by status
router.get('/status/:status', authenticateUser, getCreditsByStatus);

// Get credits by user ID
router.get('/user/:userId', authenticateUser, getCreditsByUser);

// Create credit request
router.post('/request', authenticateUser, createCreditRequest);

// Create credit request (alias)
router.post('/', authenticateUser, createCreditRequest);

// Retire credits
router.post('/retire', authenticateUser, retireCredits);

// Update credit status
router.put('/:id/status', authenticateUser, updateCreditStatus);

// Transfer credits
router.post('/:id/transfer', authenticateUser, transferCredits);

// Get credit by ID
router.get('/:id', authenticateUser, getCreditById);

export default router;
