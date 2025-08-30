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

const router = express.Router();

// Get all credits
router.get('/', getAllCredits);

// Get credit statistics
router.get('/stats', getCreditStats);

// Get credits for current authenticated user
router.get('/user', getCreditsByCurrentUser);

// Get credits by status
router.get('/status/:status', getCreditsByStatus);

// Get credits by user ID
router.get('/user/:userId', getCreditsByUser);

// Create credit request
router.post('/request', createCreditRequest);

// Retire credits
router.post('/retire', retireCredits);

// Update credit status
router.put('/:id/status', updateCreditStatus);

// Transfer credits
router.post('/:id/transfer', transferCredits);

// Get credit by ID
router.get('/:id', getCreditById);

export default router;
