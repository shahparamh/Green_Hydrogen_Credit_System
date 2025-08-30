import api from './api.js';
import { formatApiResponse, handleApiError, createQueryString } from './api.js';

// Audit Service
class AuditService {
  // Get all audit logs with filters
  async getAuditLogs(filters = {}) {
    try {
      const queryString = createQueryString(filters);
      const response = await api.get(`/audit${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch audit logs'));
    }
  }

  // Get audit log by ID
  async getAuditLogById(logId) {
    try {
      const response = await api.get(`/audit/${logId}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch audit log'));
    }
  }

  // Get audit logs by user
  async getAuditLogsByUser(userId, filters = {}) {
    try {
      const queryString = createQueryString(filters);
      const response = await api.get(`/audit/user/${userId}${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch user audit logs'));
    }
  }

  // Get audit logs by action
  async getAuditLogsByAction(action, filters = {}) {
    try {
      const queryString = createQueryString(filters);
      const response = await api.get(`/audit/action/${action}${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch audit logs by action'));
    }
  }

  // Get audit logs by category
  async getAuditLogsByCategory(category, filters = {}) {
    try {
      const queryString = createQueryString(filters);
      const response = await api.get(`/audit/category/${category}${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch audit logs by category'));
    }
  }

  // Get audit logs by level
  async getAuditLogsByLevel(level, filters = {}) {
    try {
      const queryString = createQueryString(filters);
      const response = await api.get(`/audit/level/${level}${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch audit logs by level'));
    }
  }

  // Create audit log entry
  async createAuditLog(auditData) {
    try {
      const response = await api.post('/audit', auditData);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to create audit log'));
    }
  }

  // Update audit log
  async updateAuditLog(logId, updateData) {
    try {
      const response = await api.put(`/audit/${logId}`, updateData);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to update audit log'));
    }
  }

  // Get fraud detection alerts
  async getFraudAlerts(filters = {}) {
    try {
      const queryString = createQueryString(filters);
      const response = await api.get(`/audit/fraud-alerts${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch fraud alerts'));
    }
  }

  // Get flagged audit logs
  async getFlaggedLogs(filters = {}) {
    try {
      const queryString = createQueryString(filters);
      const response = await api.get(`/audit/flagged${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch flagged logs'));
    }
  }

  // Flag audit log
  async flagAuditLog(logId, flagData) {
    try {
      const response = await api.post(`/audit/${logId}/flag`, flagData);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to flag audit log'));
    }
  }

  // Unflag audit log
  async unflagAuditLog(logId, reason = '') {
    try {
      const response = await api.post(`/audit/${logId}/unflag`, { reason });
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to unflag audit log'));
    }
  }

  // Get audit statistics
  async getAuditStats(filters = {}) {
    try {
      const queryString = createQueryString(filters);
      const response = await api.get(`/audit/stats${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch audit statistics'));
    }
  }

  // Get audit analytics
  async getAuditAnalytics(timeRange = '30d', filters = {}) {
    try {
      const queryString = createQueryString({ timeRange, ...filters });
      const response = await api.get(`/audit/analytics${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch audit analytics'));
    }
  }

  // Get compliance statistics
  async getComplianceStats(filters = {}) {
    try {
      const queryString = createQueryString(filters);
      const response = await api.get(`/audit/compliance-stats${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch compliance statistics'));
    }
  }

  // Get audit logs by date range
  async getAuditLogsByDateRange(startDate, endDate, filters = {}) {
    try {
      const queryString = createQueryString({ startDate, endDate, ...filters });
      const response = await api.get(`/audit/date-range${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch audit logs by date range'));
    }
  }

  // Get audit logs by resource
  async getAuditLogsByResource(resourceType, resourceId, filters = {}) {
    try {
      const queryString = createQueryString(filters);
      const response = await api.get(`/audit/resource/${resourceType}/${resourceId}${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch resource audit logs'));
    }
  }

  // Get user activity summary
  async getUserActivitySummary(userId, timeRange = '30d') {
    try {
      const response = await api.get(`/audit/user/${userId}/activity-summary`, {
        params: { timeRange }
      });
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch user activity summary'));
    }
  }

  // Get system activity summary
  async getSystemActivitySummary(timeRange = '30d') {
    try {
      const response = await api.get(`/audit/system/activity-summary`, {
        params: { timeRange }
      });
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch system activity summary'));
    }
  }

  // Get risk assessment
  async getRiskAssessment(filters = {}) {
    try {
      const queryString = createQueryString(filters);
      const response = await api.get(`/audit/risk-assessment${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch risk assessment'));
    }
  }

  // Get compliance report
  async getComplianceReport(filters = {}) {
    try {
      const queryString = createQueryString(filters);
      const response = await api.get(`/audit/compliance-report${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch compliance report'));
    }
  }

  // Export audit data
  async exportAuditData(filters = {}, format = 'json') {
    try {
      const queryString = createQueryString({ ...filters, format });
      const response = await api.get(`/audit/export${queryString ? `?${queryString}` : ''}`, {
        responseType: format === 'csv' ? 'blob' : 'json'
      });
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to export audit data'));
    }
  }

  // Get audit recommendations
  async getAuditRecommendations(filters = {}) {
    try {
      const queryString = createQueryString(filters);
      const response = await api.get(`/audit/recommendations${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch audit recommendations'));
    }
  }

  // Get audit dashboard data
  async getAuditDashboardData(timeRange = '30d') {
    try {
      const response = await api.get(`/audit/dashboard`, {
        params: { timeRange }
      });
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch audit dashboard data'));
    }
  }

  // Get audit trends
  async getAuditTrends(timeRange = '30d', filters = {}) {
    try {
      const queryString = createQueryString({ timeRange, ...filters });
      const response = await api.get(`/audit/trends${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch audit trends'));
    }
  }

  // Get audit alerts
  async getAuditAlerts(filters = {}) {
    try {
      const queryString = createQueryString(filters);
      const response = await api.get(`/audit/alerts${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch audit alerts'));
    }
  }

  // Acknowledge audit alert
  async acknowledgeAlert(alertId, acknowledgmentData = {}) {
    try {
      const response = await api.post(`/audit/alerts/${alertId}/acknowledge`, acknowledgmentData);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to acknowledge alert'));
    }
  }

  // Get audit log retention policy
  async getRetentionPolicy() {
    try {
      const response = await api.get('/audit/retention-policy');
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch retention policy'));
    }
  }

  // Update audit log retention policy
  async updateRetentionPolicy(policyData) {
    try {
      const response = await api.put('/audit/retention-policy', policyData);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to update retention policy'));
    }
  }

  // Archive audit logs
  async archiveAuditLogs(archiveData) {
    try {
      const response = await api.post('/audit/archive', archiveData);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to archive audit logs'));
    }
  }

  // Get archived audit logs
  async getArchivedAuditLogs(filters = {}) {
    try {
      const queryString = createQueryString(filters);
      const response = await api.get(`/audit/archived${queryString ? `?${queryString}` : ''}`);
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch archived audit logs'));
    }
  }

  // Restore archived audit log
  async restoreArchivedLog(logId, reason = '') {
    try {
      const response = await api.post(`/audit/archived/${logId}/restore`, { reason });
      
      return formatApiResponse(response);
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to restore archived log'));
    }
  }
}

// Create and export a single instance
const auditService = new AuditService();
export default auditService;




