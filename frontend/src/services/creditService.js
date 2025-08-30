import api from './api.js';
import { formatApiResponse, handleApiError, createQueryString } from './api.js';

// Credit Service
class CreditService {
  // Get all credits with filters
  async getCredits(filters = {}) {
    try {
      const queryString = createQueryString(filters);
      const response = await api.get(`/credits${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch credits'));
    }
  }

  // Get all credits (alias for getCredits)
  async getAllCredits(filters = {}) {
    return this.getCredits(filters);
  }

  // Get credit by ID
  async getCreditById(creditId) {
    try {
      const response = await api.get(`/credits/${creditId}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch credit'));
    }
  }

  // Get credits by user (current authenticated user)
  async getCreditsByUser() {
    try {
      const response = await api.get('/credits/user');
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch user credits'));
    }
  }

  // Get credit statistics for the current user
  async getCreditStats() {
    try {
      const response = await api.get('/credits/stats');
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch credit statistics'));
    }
  }

  // Get credits by producer
  async getCreditsByProducer(producerId, filters = {}) {
    try {
      const queryString = createQueryString(filters);
      const response = await api.get(`/credits/producer/${producerId}${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch producer credits'));
    }
  }

  // Get credits by certifier
  async getCreditsByCertifier(certifierId, filters = {}) {
    try {
      const queryString = createQueryString(filters);
      const response = await api.get(`/credits/certifier/${certifierId}${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch certifier credits'));
    }
  }

  // Get credits by status
  async getCreditsByStatus(status, filters = {}) {
    try {
      const queryString = createQueryString(filters);
      const response = await api.get(`/credits/status/${status}${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch credits by status'));
    }
  }

  // Create credit request
  async createCreditRequest(creditData) {
    try {
      const response = await api.post('/credits', creditData);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to create credit request'));
    }
  }

  // Update credit
  async updateCredit(creditId, updateData) {
    try {
      const response = await api.put(`/credits/${creditId}`, updateData);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to update credit'));
    }
  }

  // Update credit status
  async updateCreditStatus(creditId, status, notes = '') {
    try {
      const response = await api.patch(`/credits/${creditId}/status`, {
        status,
        notes
      });
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to update credit status'));
    }
  }

  // Approve credit
  async approveCredit(creditId, approvalData) {
    try {
      const response = await api.post(`/credits/${creditId}/approve`, approvalData);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to approve credit'));
    }
  }

  // Reject credit
  async rejectCredit(creditId, rejectionData) {
    try {
      const response = await api.post(`/credits/${creditId}/reject`, rejectionData);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to reject credit'));
    }
  }

  // Issue credit
  async issueCredit(creditId, issueData) {
    try {
      const response = await api.post(`/credits/${creditId}/issue`, issueData);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to issue credit'));
    }
  }

  // Transfer credit
  async transferCredit(creditId, transferData) {
    try {
      const response = await api.post(`/credits/${creditId}/transfer`, transferData);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to transfer credit'));
    }
  }

  // Retire credit
  async retireCredit(creditId, retirementData) {
    try {
      const response = await api.post(`/credits/${creditId}/retire`, retirementData);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to retire credit'));
    }
  }

  // Delete credit
  async deleteCredit(creditId) {
    try {
      const response = await api.delete(`/credits/${creditId}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to delete credit'));
    }
  }

  // Get credit statistics
  async getCreditStats(filters = {}) {
    try {
      const queryString = createQueryString(filters);
      const response = await api.get(`/credits/stats${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch credit statistics'));
    }
  }

  // Get credit analytics
  async getCreditAnalytics(timeRange = '30d', filters = {}) {
    try {
      const queryString = createQueryString({ timeRange, ...filters });
      const response = await api.get(`/credits/analytics${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch credit analytics'));
    }
  }

  // Get credit history
  async getCreditHistory(creditId) {
    try {
      const response = await api.get(`/credits/${creditId}/history`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch credit history'));
    }
  }

  // Add document to credit
  async addDocument(creditId, documentData) {
    try {
      const response = await api.post(`/credits/${creditId}/documents`, documentData);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to add document'));
    }
  }

  // Remove document from credit
  async removeDocument(creditId, documentId) {
    try {
      const response = await api.delete(`/credits/${creditId}/documents/${documentId}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to remove document'));
    }
  }

  // Verify document
  async verifyDocument(creditId, documentId, verificationData) {
    try {
      const response = await api.post(`/credits/${creditId}/documents/${documentId}/verify`, verificationData);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to verify document'));
    }
  }

  // Get credit verification status
  async getVerificationStatus(creditId) {
    try {
      const response = await api.get(`/credits/${creditId}/verification-status`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch verification status'));
    }
  }

  // Request credit verification
  async requestVerification(creditId, verificationRequest) {
    try {
      const response = await api.post(`/credits/${creditId}/request-verification`, verificationRequest);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to request verification'));
    }
  }

  // Get credit compliance report
  async getComplianceReport(creditId) {
    try {
      const response = await api.get(`/credits/${creditId}/compliance-report`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch compliance report'));
    }
  }

  // Export credits data
  async exportCredits(filters = {}, format = 'json') {
    try {
      const queryString = createQueryString({ ...filters, format });
      const response = await api.get(`/credits/export${queryString ? `?${queryString}` : ''}`, {
        responseType: format === 'csv' ? 'blob' : 'json'
      });
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to export credits'));
    }
  }

  // Bulk credit operations
  async bulkUpdateCredits(creditIds, updateData) {
    try {
      const response = await api.put('/credits/bulk-update', {
        creditIds,
        updateData
      });
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to bulk update credits'));
    }
  }

  // Get credit recommendations
  async getCreditRecommendations(userId, filters = {}) {
    try {
      const queryString = createQueryString(filters);
      const response = await api.get(`/credits/recommendations/${userId}${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch credit recommendations'));
    }
  }

  // Get credit market data
  async getCreditMarketData(filters = {}) {
    try {
      const queryString = createQueryString(filters);
      const response = await api.get(`/credits/market-data${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch market data'));
    }
  }

  // Retire credits
  async retireCredits(creditIds, retirementData) {
    try {
      const response = await api.post('/credits/retire', {
        creditIds,
        ...retirementData
      });
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to retire credits'));
    }
  }
}

// Create and export a single instance
const creditService = new CreditService();
export default creditService;




