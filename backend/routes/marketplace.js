import express from 'express';
import {
  getAllListings,
  createListing,
  buyCredits,
  getListingById,
  updateListing,
  cancelListing,
  getMarketplaceStats,
  getUserListings
} from '../controllers/marketplaceController.js';
import { authenticateUser } from '../middleware/userMiddleware.js';

const router = express.Router();

// Get all marketplace listings
router.get('/', getAllListings);

// Get marketplace statistics
router.get('/stats', getMarketplaceStats);

// Get listings for current authenticated user
router.get('/user', authenticateUser, getUserListings);

// Create marketplace listing
router.post('/list', authenticateUser, createListing);

// Buy credits from marketplace
router.post('/buy/:listingId', authenticateUser, buyCredits);

// Get marketplace listing by ID
router.get('/:id', getListingById);

// Update marketplace listing
router.put('/:id', authenticateUser, updateListing);

// Cancel marketplace listing
router.delete('/:id', authenticateUser, cancelListing);

export default router;
