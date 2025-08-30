// Services Index - Export all API services
export { default as api } from './api.js';
export { default as authService } from './authService.js';
export { default as creditService } from './creditService.js';
export { default as marketplaceService } from './marketplaceService.js';
export { default as transactionService } from './transactionService.js';
export { default as auditService } from './auditService.js';

// Re-export helper functions
export { 
  handleApiError, 
  createQueryString, 
  formatApiResponse 
} from './api.js';

// Re-export for convenience
export const Services = {
  api: 'api',
  authService: 'authService',
  creditService: 'creditService',
  marketplaceService: 'marketplaceService',
  transactionService: 'transactionService',
  auditService: 'auditService'
};




