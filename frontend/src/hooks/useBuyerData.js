import { useState, useEffect } from 'react';
import { creditService, transactionService, marketplaceService } from '../services';

export const useBuyerData = () => {
  const [data, setData] = useState({
    purchasedCredits: [],
    transactions: [],
    marketplaceListings: [],
    stats: {},
    analytics: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all buyer data
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data in parallel
      const [creditsRes, transactionsRes, marketplaceRes, statsRes] = await Promise.allSettled([
        creditService.getCreditsByUser(),
        transactionService.getTransactionsByCurrentUser(),
        marketplaceService.getUserListings(),
        creditService.getCreditStats()
      ]);

      // Process results
      const newData = {};

      if (creditsRes.status === 'fulfilled') {
        newData.purchasedCredits = creditsRes.value.data || [];
      }

      if (transactionsRes.status === 'fulfilled') {
        newData.transactions = transactionsRes.value.data || [];
      }

      if (marketplaceRes.status === 'fulfilled') {
        newData.marketplaceListings = marketplaceRes.value.data || [];
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
    const { purchasedCredits, transactions, marketplaceListings } = rawData;

    // Safety checks: ensure all data is arrays
    const safePurchasedCredits = Array.isArray(purchasedCredits) ? purchasedCredits : [];
    const safeTransactions = Array.isArray(transactions) ? transactions : [];
    const safeMarketplaceListings = Array.isArray(marketplaceListings) ? marketplaceListings : [];

    // Credit analytics
    const creditAnalytics = {
      totalCredits: safePurchasedCredits.length,
      activeCredits: safePurchasedCredits.filter(c => c.status === 'active').length,
      expiredCredits: safePurchasedCredits.filter(c => c.status === 'expired').length,
      totalValue: safePurchasedCredits.reduce((sum, c) => sum + (c.value || 0), 0),
      monthlyPurchases: getMonthlyData(safePurchasedCredits, 'createdAt'),
      statusDistribution: getStatusDistribution(safePurchasedCredits)
    };

    // Transaction analytics
    const transactionAnalytics = {
      totalTransactions: safeTransactions.length,
      completedTransactions: safeTransactions.filter(t => t.status === 'completed').length,
      pendingTransactions: safeTransactions.filter(t => t.status === 'pending').length,
      totalVolume: safeTransactions.reduce((sum, t) => sum + (t.amount || 0), 0),
      monthlyTransactions: getMonthlyData(safeTransactions, 'createdAt'),
      transactionTypes: getTransactionTypeDistribution(safeTransactions)
    };

    // Marketplace analytics
    const marketplaceAnalytics = {
      totalListings: safeMarketplaceListings.length,
      activeListings: safeMarketplaceListings.filter(l => l.status === 'active').length,
      soldListings: safeMarketplaceListings.filter(l => l.status === 'sold').length,
      totalRevenue: safeMarketplaceListings
        .filter(l => l.status === 'sold')
        .reduce((sum, l) => sum + (l.price || 0), 0),
      monthlyListings: getMonthlyData(safeMarketplaceListings, 'createdAt')
    };

    return {
      credits: creditAnalytics,
      transactions: transactionAnalytics,
      marketplace: marketplaceAnalytics,
      overview: {
        totalPortfolioValue: creditAnalytics.totalValue + marketplaceAnalytics.totalRevenue,
        monthlyGrowth: calculateMonthlyGrowth(safePurchasedCredits, safeTransactions),
        performanceScore: calculatePerformanceScore(creditAnalytics, transactionAnalytics)
      }
    };
  };

  // Helper function to get monthly data
  const getMonthlyData = (items, dateField) => {
    // Safety check: ensure items is an array
    if (!Array.isArray(items)) {
      console.warn('getMonthlyData: items is not an array:', items);
      return [];
    }
    
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
    // Safety check: ensure items is an array
    if (!Array.isArray(items)) {
      console.warn('getStatusDistribution: items is not an array:', items);
      return [];
    }
    
    const distribution = {};
    items.forEach(item => {
      distribution[item.status] = (distribution[item.status] || 0) + 1;
    });
    return Object.entries(distribution).map(([status, count]) => ({ status, count }));
  };

  // Helper function to get transaction type distribution
  const getTransactionTypeDistribution = (transactions) => {
    // Safety check: ensure transactions is an array
    if (!Array.isArray(transactions)) {
      console.warn('getTransactionTypeDistribution: transactions is not an array:', transactions);
      return [];
    }
    
    const distribution = {};
    transactions.forEach(transaction => {
      distribution[transaction.type] = (distribution[transaction.type] || 0) + 1;
    });
    return Object.entries(distribution).map(([type, count]) => ({ type, count }));
  };

  // Helper function to calculate monthly growth
  const calculateMonthlyGrowth = (credits, transactions) => {
    // Safety check: ensure credits is an array
    if (!Array.isArray(credits)) {
      console.warn('calculateMonthlyGrowth: credits is not an array:', credits);
      return 0;
    }
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const currentMonthCredits = credits.filter(c => {
      const date = new Date(c.createdAt);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length;
    
    const previousMonthCredits = credits.filter(c => {
      const date = new Date(c.createdAt);
      return date.getMonth() === (currentMonth - 1) && date.getFullYear() === currentYear;
    }).length;

    if (previousMonthCredits === 0) return currentMonthCredits > 0 ? 100 : 0;
    return ((currentMonthCredits - previousMonthCredits) / previousMonthCredits) * 100;
  };

  // Helper function to calculate performance score
  const calculatePerformanceScore = (creditAnalytics, transactionAnalytics) => {
    let score = 0;
    
    // Credit portfolio value (40% weight)
    const portfolioScore = Math.min(100, Math.max(0, creditAnalytics.totalValue / 1000));
    score += (portfolioScore / 100) * 40;
    
    // Transaction completion rate (30% weight)
    const completionRate = transactionAnalytics.totalTransactions > 0 ? 
      (transactionAnalytics.completedTransactions / transactionAnalytics.totalTransactions) * 100 : 0;
    score += (completionRate / 100) * 30;
    
    // Credit diversity (30% weight)
    const diversityScore = Math.min(100, creditAnalytics.totalCredits * 10);
    score += (diversityScore / 100) * 30;
    
    return Math.round(score);
  };

  // Refresh specific data
  const refreshCredits = async () => {
    try {
      const response = await creditService.getCreditsByUser();
      setData(prev => ({
        ...prev,
        purchasedCredits: response.data || [],
        analytics: calculateAnalytics({ ...prev, purchasedCredits: response.data || [] })
      }));
    } catch (err) {
      setError(err.message || 'Failed to refresh credits');
    }
  };

  const refreshTransactions = async () => {
    try {
      const response = await transactionService.getTransactionsByCurrentUser();
      setData(prev => ({
        ...prev,
        transactions: response.data || [],
        analytics: calculateAnalytics({ ...prev, transactions: response.data || [] })
      }));
    } catch (err) {
      setError(err.message || 'Failed to refresh transactions');
    }
  };

  const refreshMarketplace = async () => {
    try {
      const response = await marketplaceService.getUserListings();
      setData(prev => ({
        ...prev,
        marketplaceListings: response.data || [],
        analytics: calculateAnalytics({ ...prev, marketplaceListings: response.data || [] })
      }));
    } catch (err) {
      setError(err.message || 'Failed to refresh marketplace');
    }
  };

  // Purchase credits from marketplace
  const purchaseCredits = async (listingId, purchaseData) => {
    try {
      const response = await marketplaceService.buyCredits(listingId, purchaseData);
      if (response.success) {
        await refreshCredits();
        await refreshTransactions();
        return { success: true, data: response.data };
      }
      return { success: false, error: response.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Retire credits
  const retireCredits = async (creditIds, retirementData) => {
    try {
      const response = await creditService.retireCredits(creditIds, retirementData);
      if (response.success) {
        await refreshCredits();
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
    refreshCredits,
    refreshTransactions,
    refreshMarketplace,
    purchaseCredits,
    retireCredits
  };
}; 