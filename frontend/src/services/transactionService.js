import api from './api.js';
import { formatApiResponse, handleApiError, createQueryString } from './api.js';

// Transaction Service
class TransactionService {
  // Get all transactions with filtering and pagination
  async getTransactions(filters = {}) {
    try {
      const queryString = createQueryString(filters);
      const response = await api.get(`/transactions${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch transactions'));
    }
  }

  // Get all transactions (alias for getTransactions)
  async getAllTransactions(filters = {}) {
    return this.getTransactions(filters);
  }

  // Get transaction by ID
  async getTransactionById(transactionId) {
    try {
      const response = await api.get(`/transactions/${transactionId}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch transaction'));
    }
  }

  // Get transactions by user
  async getTransactionsByUser(userId, filters = {}) {
    try {
      const queryString = createQueryString(filters);
      const response = await api.get(`/transactions/user/${userId}${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch user transactions'));
    }
  }

  // Get transactions for current authenticated user
  async getTransactionsByCurrentUser(filters = {}) {
    try {
      const queryString = createQueryString(filters);
      const response = await api.get(`/transactions/current-user${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch current user transactions'));
    }
  }

  // Get transactions by type
  async getTransactionsByType(type, filters = {}) {
    try {
      const queryString = createQueryString(filters);
      const response = await api.get(`/transactions/type/${type}${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch transactions by type'));
    }
  }

  // Get transactions by status
  async getTransactionsByStatus(status, filters = {}) {
    try {
      const queryString = createQueryString(filters);
      const response = await api.get(`/transactions/status/${status}${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch transactions by status'));
    }
  }

  // Create transaction
  async createTransaction(transactionData) {
    try {
      const response = await api.post('/transactions', transactionData);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to create transaction'));
    }
  }

  // Update transaction
  async updateTransaction(transactionId, updateData) {
    try {
      const response = await api.put(`/transactions/${transactionId}`, updateData);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to update transaction'));
    }
  }

  // Update transaction status
  async updateTransactionStatus(transactionId, status, notes = '') {
    try {
      const response = await api.patch(`/transactions/${transactionId}/status`, {
        status,
        notes
      });
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to update transaction status'));
    }
  }

  // Process transaction
  async processTransaction(transactionId, processData = {}) {
    try {
      const response = await api.post(`/transactions/${transactionId}/process`, processData);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to process transaction'));
    }
  }

  // Complete transaction
  async completeTransaction(transactionId, completionData = {}) {
    try {
      const response = await api.post(`/transactions/${transactionId}/complete`, completionData);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to complete transaction'));
    }
  }

  // Cancel transaction
  async cancelTransaction(transactionId, cancellationData = {}) {
    try {
      const response = await api.post(`/transactions/${transactionId}/cancel`, cancellationData);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to cancel transaction'));
    }
  }

  // Retry failed transaction
  async retryTransaction(transactionId, retryData = {}) {
    try {
      const response = await api.post(`/transactions/${transactionId}/retry`, retryData);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to retry transaction'));
    }
  }

  // Get transaction statistics
  async getTransactionStats(filters = {}) {
    try {
      const queryString = createQueryString(filters);
      const response = await api.get(`/transactions/stats${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch transaction statistics'));
    }
  }

  // Get transaction analytics
  async getTransactionAnalytics(timeRange = '30d', filters = {}) {
    try {
      const queryString = createQueryString({ timeRange, ...filters });
      const response = await api.get(`/transactions/analytics${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch transaction analytics'));
    }
  }

  // Get transaction history
  async getTransactionHistory(transactionId) {
    try {
      const response = await api.get(`/transactions/${transactionId}/history`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch transaction history'));
    }
  }

  // Get user transaction history
  async getUserTransactionHistory(userId, limit = 50, offset = 0) {
    try {
      const response = await api.get(`/transactions/user/${userId}/history`, {
        params: { limit, offset }
      });
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch user transaction history'));
    }
  }

  // Get pending transactions
  async getPendingTransactions(filters = {}) {
    try {
      const queryString = createQueryString({ status: 'pending', ...filters });
      const response = await api.get(`/transactions${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch pending transactions'));
    }
  }

  // Get failed transactions
  async getFailedTransactions(filters = {}) {
    try {
      const queryString = createQueryString({ status: 'failed', ...filters });
      const response = await api.get(`/transactions${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch failed transactions'));
    }
  }

  // Get transaction by blockchain hash
  async getTransactionByHash(transactionHash) {
    try {
      const response = await api.get(`/transactions/blockchain/${transactionHash}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch transaction by hash'));
    }
  }

  // Verify transaction on blockchain
  async verifyTransactionOnBlockchain(transactionId) {
    try {
      const response = await api.post(`/transactions/${transactionId}/verify-blockchain`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to verify transaction on blockchain'));
    }
  }

  // Get transaction compliance report
  async getTransactionComplianceReport(transactionId) {
    try {
      const response = await api.get(`/transactions/${transactionId}/compliance-report`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch compliance report'));
    }
  }

  // Get transaction audit trail
  async getTransactionAuditTrail(transactionId) {
    try {
      const response = await api.get(`/transactions/${transactionId}/audit-trail`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch audit trail'));
    }
  }

  // Add transaction note
  async addTransactionNote(transactionId, noteData) {
    try {
      const response = await api.post(`/transactions/${transactionId}/notes`, noteData);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to add transaction note'));
    }
  }

  // Get transaction notes
  async getTransactionNotes(transactionId) {
    try {
      const response = await api.get(`/transactions/${transactionId}/notes`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch transaction notes'));
    }
  }

  // Bulk transaction operations
  async bulkUpdateTransactions(transactionIds, updateData) {
    try {
      const response = await api.put('/transactions/bulk-update', {
        transactionIds,
        updateData
      });
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to bulk update transactions'));
    }
  }

  // Bulk process transactions
  async bulkProcessTransactions(transactionIds, processData = {}) {
    try {
      const response = await api.post('/transactions/bulk-process', {
        transactionIds,
        processData
      });
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to bulk process transactions'));
    }
  }

  // Export transactions data
  async exportTransactions(filters = {}, format = 'json') {
    try {
      const queryString = createQueryString({ ...filters, format });
      const response = await api.get(`/transactions/export${queryString ? `?${queryString}` : ''}`, {
        responseType: format === 'csv' ? 'blob' : 'json'
      });
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to export transactions'));
    }
  }

  // Get transaction performance metrics
  async getTransactionPerformanceMetrics(filters = {}) {
    try {
      const queryString = createQueryString(filters);
      const response = await api.get(`/transactions/performance${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch performance metrics'));
    }
  }

  // Get transaction risk assessment
  async getTransactionRiskAssessment(transactionId) {
    try {
      const response = await api.get(`/transactions/${transactionId}/risk-assessment`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch risk assessment'));
    }
  }

  // Get transaction recommendations
  async getTransactionRecommendations(userId, filters = {}) {
    try {
      const queryString = createQueryString(filters);
      const response = await api.get(`/transactions/recommendations/${userId}${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch transaction recommendations'));
    }
  }

  // Get transaction market data
  async getTransactionMarketData(filters = {}) {
    try {
      const queryString = createQueryString(filters);
      const response = await api.get(`/transactions/market-data${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch market data'));
    }
  }
}

// Create and export a single instance
const transactionService = new TransactionService();
export default transactionService;




