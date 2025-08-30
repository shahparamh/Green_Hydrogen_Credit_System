import api from './api.js';
import { formatApiResponse, handleApiError, createQueryString } from './api.js';

// Marketplace Service
class MarketplaceService {
  // Get all marketplace listings with filters
  async getListings(filters = {}) {
    try {
      const queryString = createQueryString(filters);
      const response = await api.get(`/marketplace${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch marketplace listings'));
    }
  }

  // Get all listings (alias for getListings)
  async getAllListings(filters = {}) {
    return this.getListings(filters);
  }

  // Get listing by ID
  async getListingById(listingId) {
    try {
      const response = await api.get(`/marketplace/${listingId}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch listing'));
    }
  }

  // Get listings by seller
  async getListingsBySeller(sellerId, filters = {}) {
    try {
      const queryString = createQueryString(filters);
      const response = await api.get(`/marketplace/seller/${sellerId}${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch seller listings'));
    }
  }

  // Get listings for the current authenticated user
  async getUserListings() {
    try {
      const response = await api.get('/marketplace/user');
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch user listings'));
    }
  }

  // Get active listings
  async getActiveListings(filters = {}) {
    try {
      const queryString = createQueryString({ status: 'active', ...filters });
      const response = await api.get(`/marketplace${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch active listings'));
    }
  }

  // Create new listing
  async createListing(listingData) {
    try {
      const response = await api.post('/marketplace', listingData);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to create listing'));
    }
  }

  // Update listing
  async updateListing(listingId, updateData) {
    try {
      const response = await api.put(`/marketplace/${listingId}`, updateData);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to update listing'));
    }
  }

  // Update listing status
  async updateListingStatus(listingId, status, notes = '') {
    try {
      const response = await api.patch(`/marketplace/${listingId}/status`, {
        status,
        notes
      });
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to update listing status'));
    }
  }

  // Pause listing
  async pauseListing(listingId, reason = '') {
    try {
      const response = await api.post(`/marketplace/${listingId}/pause`, { reason });
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to pause listing'));
    }
  }

  // Resume listing
  async resumeListing(listingId) {
    try {
      const response = await api.post(`/marketplace/${listingId}/resume`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to resume listing'));
    }
  }

  // Delete listing
  async deleteListing(listingId) {
    try {
      const response = await api.delete(`/marketplace/${listingId}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to delete listing'));
    }
  }

  // Buy credits from listing
  async buyCredits(listingId, purchaseData) {
    try {
      const response = await api.post(`/marketplace/${listingId}/buy`, purchaseData);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to buy credits'));
    }
  }

  // Make offer on listing
  async makeOffer(listingId, offerData) {
    try {
      const response = await api.post(`/marketplace/${listingId}/offer`, offerData);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to make offer'));
    }
  }

  // Accept offer
  async acceptOffer(listingId, offerId) {
    try {
      const response = await api.post(`/marketplace/${listingId}/offers/${offerId}/accept`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to accept offer'));
    }
  }

  // Reject offer
  async rejectOffer(listingId, offerId, reason = '') {
    try {
      const response = await api.post(`/marketplace/${listingId}/offers/${offerId}/reject`, { reason });
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to reject offer'));
    }
  }

  // Get listing offers
  async getListingOffers(listingId) {
    try {
      const response = await api.get(`/marketplace/${listingId}/offers`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch listing offers'));
    }
  }

  // Get user offers
  async getUserOffers(userId, filters = {}) {
    try {
      const queryString = createQueryString(filters);
      const response = await api.get(`/marketplace/offers/user/${userId}${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch user offers'));
    }
  }

  // Search listings
  async searchListings(searchQuery, filters = {}) {
    try {
      const queryString = createQueryString({ q: searchQuery, ...filters });
      const response = await api.get(`/marketplace/search${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to search listings'));
    }
  }

  // Get listings by category
  async getListingsByCategory(category, filters = {}) {
    try {
      const queryString = createQueryString({ category, ...filters });
      const response = await api.get(`/marketplace/category/${category}${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch category listings'));
    }
  }

  // Get listings by price range
  async getListingsByPriceRange(minPrice, maxPrice, filters = {}) {
    try {
      const queryString = createQueryString({ minPrice, maxPrice, ...filters });
      const response = await api.get(`/marketplace/price-range${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch price range listings'));
    }
  }

  // Get listings by energy source
  async getListingsByEnergySource(energySource, filters = {}) {
    try {
      const queryString = createQueryString({ energySource, ...filters });
      const response = await api.get(`/marketplace/energy-source/${energySource}${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch energy source listings'));
    }
  }

  // Get marketplace statistics
  async getMarketplaceStats(filters = {}) {
    try {
      const queryString = createQueryString(filters);
      const response = await api.get(`/marketplace/stats${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch marketplace statistics'));
    }
  }

  // Get marketplace analytics
  async getMarketplaceAnalytics(timeRange = '30d', filters = {}) {
    try {
      const queryString = createQueryString({ timeRange, ...filters });
      const response = await api.get(`/marketplace/analytics${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch marketplace analytics'));
    }
  }

  // Get trending listings
  async getTrendingListings(limit = 10, filters = {}) {
    try {
      const queryString = createQueryString({ limit, ...filters });
      const response = await api.get(`/marketplace/trending${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch trending listings'));
    }
  }

  // Get featured listings
  async getFeaturedListings(limit = 10) {
    try {
      const response = await api.get(`/marketplace/featured?limit=${limit}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch featured listings'));
    }
  }

  // Add listing to favorites
  async addToFavorites(listingId) {
    try {
      const response = await api.post(`/marketplace/${listingId}/favorite`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to add to favorites'));
    }
  }

  // Remove listing from favorites
  async removeFromFavorites(listingId) {
    try {
      const response = await api.delete(`/marketplace/${listingId}/favorite`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to remove from favorites'));
    }
  }

  // Get user favorites
  async getUserFavorites(userId, filters = {}) {
    try {
      const queryString = createQueryString(filters);
      const response = await api.get(`/marketplace/favorites/${userId}${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch user favorites'));
    }
  }

  // Get listing history
  async getListingHistory(listingId) {
    try {
      const response = await api.get(`/marketplace/${listingId}/history`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch listing history'));
    }
  }

  // Report listing
  async reportListing(listingId, reportData) {
    try {
      const response = await api.post(`/marketplace/${listingId}/report`, reportData);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to report listing'));
    }
  }

  // Get listing reviews
  async getListingReviews(listingId, filters = {}) {
    try {
      const queryString = createQueryString(filters);
      const response = await api.get(`/marketplace/${listingId}/reviews${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch listing reviews'));
    }
  }

  // Add listing review
  async addListingReview(listingId, reviewData) {
    try {
      const response = await api.post(`/marketplace/${listingId}/reviews`, reviewData);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to add review'));
    }
  }

  // Export marketplace data
  async exportMarketplaceData(filters = {}, format = 'json') {
    try {
      const queryString = createQueryString({ ...filters, format });
      const response = await api.get(`/marketplace/export${queryString ? `?${queryString}` : ''}`, {
        responseType: format === 'csv' ? 'blob' : 'json'
      });
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to export marketplace data'));
    }
  }
}

// Create and export a single instance
const marketplaceService = new MarketplaceService();
export default marketplaceService;




