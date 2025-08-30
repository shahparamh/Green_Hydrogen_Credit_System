import { useState, useEffect } from 'react';
import { creditService, transactionService, marketplaceService } from '../services';

export const useProducerData = () => {
  const [data, setData] = useState({
    credits: [],
    transactions: [],
    marketplaceListings: [],
    stats: {},
    analytics: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all producer data
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
        newData.credits = creditsRes.value.data || [];
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
    const { credits, transactions, marketplaceListings } = rawData;

    // Credit analytics
    const creditAnalytics = {
      totalCredits: credits.length,
      pendingCredits: credits.filter(c => c.status === 'pending').length,
      approvedCredits: credits.filter(c => c.status === 'approved').length,
      rejectedCredits: credits.filter(c => c.status === 'rejected').length,
      totalValue: credits.reduce((sum, c) => sum + (c.value || 0), 0),
      monthlyCredits: getMonthlyData(credits, 'createdAt'),
      statusDistribution: getStatusDistribution(credits)
    };

    // Transaction analytics
    const transactionAnalytics = {
      totalTransactions: transactions.length,
      completedTransactions: transactions.filter(t => t.status === 'completed').length,
      pendingTransactions: transactions.filter(t => t.status === 'pending').length,
      totalVolume: transactions.reduce((sum, t) => sum + (t.amount || 0), 0),
      monthlyTransactions: getMonthlyData(transactions, 'createdAt'),
      transactionTypes: getTransactionTypeDistribution(transactions)
    };

    // Marketplace analytics
    const marketplaceAnalytics = {
      totalListings: marketplaceListings.length,
      activeListings: marketplaceListings.filter(l => l.status === 'active').length,
      soldListings: marketplaceListings.filter(l => l.status === 'sold').length,
      totalRevenue: marketplaceListings
        .filter(l => l.status === 'sold')
        .reduce((sum, l) => sum + (l.price || 0), 0),
      monthlyListings: getMonthlyData(marketplaceListings, 'createdAt'),
      priceDistribution: getPriceDistribution(marketplaceListings)
    };

    return {
      credits: creditAnalytics,
      transactions: transactionAnalytics,
      marketplace: marketplaceAnalytics,
      overview: {
        totalAssets: creditAnalytics.totalValue + marketplaceAnalytics.totalRevenue,
        monthlyGrowth: calculateMonthlyGrowth(credits, transactions),
        performanceScore: calculatePerformanceScore(creditAnalytics, transactionAnalytics)
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

  // Helper function to get transaction type distribution
  const getTransactionTypeDistribution = (transactions) => {
    const distribution = {};
    transactions.forEach(transaction => {
      distribution[transaction.type] = (distribution[transaction.type] || 0) + 1;
    });
    return Object.entries(distribution).map(([type, count]) => ({ type, count }));
  };

  // Helper function to get price distribution
  const getPriceDistribution = (listings) => {
    const prices = listings.map(l => l.price).filter(p => p > 0);
    if (prices.length === 0) return [];

    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min;
    const bucketSize = range / 5;

    const buckets = Array(5).fill(0);
    prices.forEach(price => {
      const bucketIndex = Math.min(Math.floor((price - min) / bucketSize), 4);
      buckets[bucketIndex]++;
    });

    return buckets.map((count, index) => ({
      range: `${(min + index * bucketSize).toFixed(2)} - ${(min + (index + 1) * bucketSize).toFixed(2)}`,
      count
    }));
  };

  // Helper function to calculate monthly growth
  const calculateMonthlyGrowth = (credits, transactions) => {
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
    
    // Credit approval rate (40% weight)
    const approvalRate = creditAnalytics.totalCredits > 0 
      ? (creditAnalytics.approvedCredits / creditAnalytics.totalCredits) * 100 
      : 0;
    score += (approvalRate / 100) * 40;
    
    // Transaction completion rate (30% weight)
    const completionRate = transactionAnalytics.totalTransactions > 0 
      ? (transactionAnalytics.completedTransactions / transactionAnalytics.totalTransactions) * 100 
      : 0;
    score += (completionRate / 100) * 30;
    
    // Volume growth (30% weight)
    const volumeGrowth = Math.min(100, Math.max(0, 50 + (creditAnalytics.totalValue / 1000)));
    score += (volumeGrowth / 100) * 30;
    
    return Math.round(score);
  };

  // Refresh specific data
  const refreshCredits = async () => {
    try {
      const response = await creditService.getCreditsByUser();
      setData(prev => ({
        ...prev,
        credits: response.data || [],
        analytics: calculateAnalytics({ ...prev, credits: response.data || [] })
      }));
    } catch (err) {
      setError(err.message || 'Failed to refresh credits');
    }
  };

  const refreshTransactions = async () => {
    try {
      const response = await transactionService.getTransactionsByUser();
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

  // Create new credit request
  const createCreditRequest = async (creditData) => {
    try {
      const response = await creditService.createCreditRequest(creditData);
      if (response.success) {
        await refreshCredits();
        return { success: true, data: response.data };
      }
      return { success: false, error: response.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Create marketplace listing
  const createListing = async (listingData) => {
    try {
      const response = await marketplaceService.createListing(listingData);
      if (response.success) {
        await refreshMarketplace();
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
    createCreditRequest,
    createListing
  };
};




