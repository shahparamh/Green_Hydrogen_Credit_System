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

const router = express.Router();

// Get all marketplace listings
router.get('/', getAllListings);

// Get marketplace statistics
router.get('/stats', getMarketplaceStats);

// Get listings for current authenticated user
router.get('/user', getUserListings);

// Create marketplace listing
router.post('/list', createListing);

// Buy credits from marketplace
router.post('/buy/:listingId', buyCredits);

// Get marketplace listing by ID
router.get('/:id', getListingById);

// Update marketplace listing
router.put('/:id', updateListing);

// Cancel marketplace listing
router.delete('/:id', cancelListing);

export default router;
