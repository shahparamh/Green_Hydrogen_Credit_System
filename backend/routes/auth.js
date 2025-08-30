import express from 'express';
import {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getUserPermissions,
  getActivityLog,
  toggle2FA,
  verify2FA,
  getLoginHistory,
  revokeAllSessions,
  getUserStats
} from '../controllers/authController.js';
import { authenticateUser, rateLimit } from '../middleware/userMiddleware.js';

const router = express.Router();

// Public routes (no authentication required)
router.post('/register', rateLimit(3, 15 * 60 * 1000), register); // 3 attempts per 15 minutes
router.post('/login', rateLimit(5, 15 * 60 * 1000), login); // 5 attempts per 15 minutes
router.post('/forgot-password', rateLimit(3, 60 * 60 * 1000), forgotPassword); // 3 attempts per hour
router.post('/reset-password', resetPassword);
router.post('/verify-email', verifyEmail);

// Protected routes (authentication required)
router.use(authenticateUser); // Apply authentication middleware to all routes below

router.post('/logout', logout);
router.get('/me', getCurrentUser);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.get('/permissions', getUserPermissions);

router.get('/activity-log', getActivityLog);
router.put('/2fa', toggle2FA);
router.post('/2fa/verify', verify2FA);
router.get('/login-history', getLoginHistory);
router.post('/revoke-all-sessions', revokeAllSessions);
router.get('/stats', getUserStats);

export default router;
