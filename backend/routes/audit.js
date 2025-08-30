import express from 'express';
import {
  getAllAuditLogs,
  getAuditLogsByUser,
  getFraudAlerts,
  createAuditLog,
  getComplianceReport,
  getAuditAnalytics,
  exportAuditLogs
} from '../controllers/auditController.js';

const router = express.Router();

// Get all audit logs
router.get('/', getAllAuditLogs);

// Get fraud detection alerts
router.get('/fraud', getFraudAlerts);

// Get compliance report
router.get('/compliance', getComplianceReport);

// Get audit analytics
router.get('/analytics', getAuditAnalytics);

// Export audit logs
router.get('/export', exportAuditLogs);

// Get audit logs by user ID
router.get('/user/:userId', getAuditLogsByUser);

// Create audit log entry
router.post('/', createAuditLog);

export default router;
