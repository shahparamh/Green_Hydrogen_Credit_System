import { useState, useEffect } from 'react';
import { creditService, transactionService } from '../services';

export const useCertifierData = () => {
  const [data, setData] = useState({
    pendingRequests: [],
    approvedCredits: [],
    transactions: [],
    stats: {},
    analytics: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all certifier data
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data in parallel
      const [pendingRes, approvedRes, transactionsRes, statsRes] = await Promise.allSettled([
        creditService.getCreditsByStatus('pending'),
        creditService.getCreditsByStatus('approved'),
        transactionService.getTransactionsByCurrentUser(),
        creditService.getCreditStats()
      ]);

      // Process results
      const newData = {};

      if (pendingRes.status === 'fulfilled') {
        newData.pendingRequests = pendingRes.value.data || [];
      }

      if (approvedRes.status === 'fulfilled') {
        newData.approvedCredits = approvedRes.value.data || [];
      }

      if (transactionsRes.status === 'fulfilled') {
        newData.transactions = transactionsRes.value.data || [];
      }

      if (statsRes.status === 'fulfilled') {
        newData.stats = statsRes.value.data || {};
      }

      // Calculate analytics data
      newData.analytics = calculateAnalytics(newData);

      setData(newData);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate analytics from raw data
  const calculateAnalytics = (rawData) => {
    const { pendingRequests, approvedCredits, transactions } = rawData;

    // Request analytics
    const requestAnalytics = {
      totalPending: pendingRequests.length,
      totalApproved: approvedCredits.length,
      approvalRate: approvedCredits.length > 0 ? 
        (approvedCredits.length / (pendingRequests.length + approvedCredits.length)) * 100 : 0,
      monthlyRequests: getMonthlyData([...pendingRequests, ...approvedCredits], 'createdAt'),
      statusDistribution: getStatusDistribution([...pendingRequests, ...approvedCredits])
    };

    // Transaction analytics
    const transactionAnalytics = {
      totalTransactions: transactions.length,
      completedTransactions: transactions.filter(t => t.status === 'completed').length,
      pendingTransactions: transactions.filter(t => t.status === 'pending').length,
      totalVolume: transactions.reduce((sum, t) => sum + (t.amount || 0), 0),
      monthlyTransactions: getMonthlyData(transactions, 'createdAt')
    };

    return {
      requests: requestAnalytics,
      transactions: transactionAnalytics,
      overview: {
        totalProcessed: pendingRequests.length + approvedCredits.length,
        averageProcessingTime: calculateAverageProcessingTime(pendingRequests, approvedCredits),
        performanceScore: calculatePerformanceScore(requestAnalytics, transactionAnalytics)
      }
    };
  };

  // Helper function to get monthly data
  const getMonthlyData = (items, dateField) => {
    const months = {};
    const currentDate = new Date();
    
    // Initialize last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
      months[monthKey] = 0;
    }

    // Count items by month
    items.forEach(item => {
      const date = new Date(item[dateField]);
      const monthKey = date.toISOString().slice(0, 7);
      if (months[monthKey] !== undefined) {
        months[monthKey]++;
      }
    });

    return Object.entries(months).map(([month, count]) => ({ month, count }));
  };

  // Helper function to get status distribution
  const getStatusDistribution = (items) => {
    const distribution = {};
    items.forEach(item => {
      distribution[item.status] = (distribution[item.status] || 0) + 1;
    });
    return Object.entries(distribution).map(([status, count]) => ({ status, count }));
  };

  // Helper function to calculate average processing time
  const calculateAverageProcessingTime = (pending, approved) => {
    if (approved.length === 0) return 0;
    
    const totalTime = approved.reduce((sum, credit) => {
      const created = new Date(credit.createdAt);
      const updated = new Date(credit.updatedAt);
      return sum + (updated - created);
    }, 0);
    
    return Math.round(totalTime / approved.length / (1000 * 60 * 60 * 24)); // Days
  };

  // Helper function to calculate performance score
  const calculatePerformanceScore = (requestAnalytics, transactionAnalytics) => {
    let score = 0;
    
    // Approval rate (50% weight)
    score += (requestAnalytics.approvalRate / 100) * 50;
    
    // Transaction completion rate (30% weight)
    const completionRate = transactionAnalytics.totalTransactions > 0 ? 
      (transactionAnalytics.completedTransactions / transactionAnalytics.totalTransactions) * 100 : 0;
    score += (completionRate / 100) * 30;
    
    // Processing efficiency (20% weight)
    const efficiency = Math.max(0, 100 - (requestAnalytics.totalPending * 2));
    score += (efficiency / 100) * 20;
    
    return Math.round(score);
  };

  // Refresh specific data
  const refreshPendingRequests = async () => {
    try {
      const response = await creditService.getCreditsByStatus('pending');
      setData(prev => ({
        ...prev,
        pendingRequests: response.data || [],
        analytics: calculateAnalytics({ ...prev, pendingRequests: response.data || [] })
      }));
    } catch (err) {
      setError(err.message || 'Failed to refresh pending requests');
    }
  };

  const refreshApprovedCredits = async () => {
    try {
      const response = await creditService.getCreditsByStatus('approved');
      setData(prev => ({
        ...prev,
        approvedCredits: response.data || [],
        analytics: calculateAnalytics({ ...prev, approvedCredits: response.data || [] })
      }));
    } catch (err) {
      setError(err.message || 'Failed to refresh approved credits');
    }
  };

  // Approve credit request
  const approveCredit = async (creditId, approvalData) => {
    try {
      const response = await creditService.updateCreditStatus(creditId, 'approved', approvalData.notes);
      if (response.success) {
        await refreshPendingRequests();
        await refreshApprovedCredits();
        return { success: true, data: response.data };
      }
      return { success: false, error: response.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Reject credit request
  const rejectCredit = async (creditId, rejectionData) => {
    try {
      const response = await creditService.updateCreditStatus(creditId, 'rejected', rejectionData.notes);
      if (response.success) {
        await refreshPendingRequests();
        return { success: true, data: response.data };
      }
      return { success: false, error: response.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchAllData();
  }, []);

  return {
    data,
    loading,
    error,
    refreshAll: fetchAllData,
    refreshPendingRequests,
    refreshApprovedCredits,
    approveCredit,
    rejectCredit
  };
}; 