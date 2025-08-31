import { useState, useEffect } from 'react';
import { creditService, transactionService, marketplaceService } from '../services';

export const useAuditorData = () => {
  const [data, setData] = useState({
    allCredits: [],
    allTransactions: [],
    allListings: [],
    fraudAlerts: [],
    stats: {},
    analytics: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all auditor data
  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data in parallel
      const [creditsRes, transactionsRes, marketplaceRes, statsRes] = await Promise.allSettled([
        creditService.getCredits(),
        transactionService.getAllTransactions(),
        marketplaceService.getListings(),
        creditService.getCreditStats()
      ]);

      // Process results with fallback arrays
      const newData = {
        allCredits: [],
        allTransactions: [],
        allListings: [],
        stats: {},
        fraudAlerts: [],
        analytics: {}
      };

      if (creditsRes.status === 'fulfilled' && creditsRes.value?.data) {
        newData.allCredits = Array.isArray(creditsRes.value.data) ? creditsRes.value.data : [];
      } else {
        console.warn('Credits API failed or returned invalid data:', creditsRes);
      }

      if (transactionsRes.status === 'fulfilled' && transactionsRes.value?.data) {
        newData.allTransactions = Array.isArray(transactionsRes.value.data) ? transactionsRes.value.data : [];
      } else {
        console.warn('Transactions API failed or returned invalid data:', transactionsRes);
      }

      if (marketplaceRes.status === 'fulfilled' && marketplaceRes.value?.data) {
        newData.allListings = Array.isArray(marketplaceRes.value.data) ? marketplaceRes.value.data : [];
      } else {
        console.warn('Marketplace API failed or returned invalid data:', marketplaceRes);
      }

      if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
        newData.stats = statsRes.value.data || {};
      } else {
        console.warn('Stats API failed or returned invalid data:', statsRes);
      }

      // Generate fraud alerts based on data analysis
      newData.fraudAlerts = generateFraudAlerts(newData);

      // Calculate analytics data
      newData.analytics = calculateAnalytics(newData);

      setData(newData);
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // Generate fraud alerts based on data analysis
  const generateFraudAlerts = (rawData) => {
    const alerts = [];
    const { allCredits, allTransactions, allListings } = rawData;

    // Check for suspicious volume patterns
    const volumeAlerts = checkVolumePatterns(allCredits);
    alerts.push(...volumeAlerts);

    // Check for duplicate certificates
    const duplicateAlerts = checkDuplicateCertificates(allCredits);
    alerts.push(...duplicateAlerts);

    // Check for unusual transaction patterns
    const transactionAlerts = checkTransactionPatterns(allTransactions);
    alerts.push(...transactionAlerts);

    // Check for price manipulation
    const priceAlerts = checkPriceManipulation(allListings);
    alerts.push(...priceAlerts);

    return alerts;
  };

  // Check for suspicious volume patterns
  const checkVolumePatterns = (credits) => {
    const alerts = [];
    const producerVolumes = {};

    // Safety check: ensure credits is an array
    if (!Array.isArray(credits)) {
      console.warn('checkVolumePatterns: credits is not an array:', credits);
      return alerts;
    }

    credits.forEach(credit => {
      const producerId = credit.producerId;
      if (!producerVolumes[producerId]) {
        producerVolumes[producerId] = [];
      }
      producerVolumes[producerId].push({
        amount: credit.amount || 0,
        date: new Date(credit.createdAt),
        creditId: credit._id
      });
    });

    Object.entries(producerVolumes).forEach(([producerId, volumes]) => {
      if (volumes.length > 0) {
        const totalVolume = volumes.reduce((sum, v) => sum + v.amount, 0);
        const averageVolume = totalVolume / volumes.length;
        
        // Flag if any single credit is more than 5x the average
        volumes.forEach(volume => {
          if (volume.amount > averageVolume * 5) {
            alerts.push({
              id: `volume_${volume.creditId}`,
              type: 'suspicious_volume',
              severity: 'high',
              producerId,
              description: `Unusually high credit amount: ${volume.amount} kg (${(volume.amount / averageVolume).toFixed(1)}x average)`,
              timestamp: volume.date,
              status: 'pending',
              riskScore: 0.85,
              details: {
                normalVolume: averageVolume,
                detectedVolume: volume.amount,
                percentage: ((volume.amount / averageVolume) * 100).toFixed(1),
                creditId: volume.creditId
              }
            });
          }
        });
      }
    });

    return alerts;
  };

  // Check for duplicate certificates
  const checkDuplicateCertificates = (credits) => {
    const alerts = [];
    
    // Safety check: ensure credits is an array
    if (!Array.isArray(credits)) {
      console.warn('checkDuplicateCertificates: credits is not an array:', credits);
      return alerts;
    }
    
    const certificateGroups = {};

    credits.forEach(credit => {
      const key = `${credit.productionDetails?.facilityName}_${credit.productionDetails?.location}_${credit.amount}`;
      if (!certificateGroups[key]) {
        certificateGroups[key] = [];
      }
      certificateGroups[key].push(credit);
    });

    Object.entries(certificateGroups).forEach(([key, group]) => {
      if (group.length > 1) {
        const similarity = calculateSimilarity(group);
        if (similarity > 0.8) {
          alerts.push({
            id: `duplicate_${key}`,
            type: 'duplicate_certificates',
            severity: 'medium',
            producerId: group[0].producerId,
            description: `Potential duplicate certificates detected (${group.length} similar)`,
            timestamp: new Date(),
            status: 'pending',
            riskScore: 0.65,
            details: {
              certificateNumbers: group.map(c => c._id),
              similarity: similarity,
              count: group.length
            }
          });
        }
      }
    });

    return alerts;
  };

  // Check for unusual transaction patterns
  const checkTransactionPatterns = (transactions) => {
    const alerts = [];
    
    // Safety check: ensure transactions is an array
    if (!Array.isArray(transactions)) {
      console.warn('checkTransactionPatterns: transactions is not an array:', transactions);
      return alerts;
    }
    
    const userTransactions = {};

    transactions.forEach(transaction => {
      const userId = transaction.fromUserId || transaction.toUserId;
      if (!userTransactions[userId]) {
        userTransactions[userId] = [];
      }
      userTransactions[userId].push(transaction);
    });

    Object.entries(userTransactions).forEach(([userId, userTrans]) => {
      if (userTrans.length > 10) {
        const timeSpan = Math.max(...userTrans.map(t => new Date(t.createdAt))) - 
                        Math.min(...userTrans.map(t => new Date(t.createdAt)));
        const hours = timeSpan / (1000 * 60 * 60);
        
        if (hours < 24) {
          alerts.push({
            id: `pattern_${userId}`,
            type: 'unusual_pattern',
            severity: 'low',
            userId,
            description: `Unusual transaction pattern: ${userTrans.length} transactions in ${hours.toFixed(1)} hours`,
            timestamp: new Date(),
            status: 'pending',
            riskScore: 0.35,
            details: {
              pattern: 'Multiple transactions in short time',
              frequency: `${userTrans.length} transactions in ${hours.toFixed(1)} hours`,
              totalAmount: userTrans.reduce((sum, t) => sum + (t.amount || 0), 0)
            }
          });
        }
      }
    });

    return alerts;
  };

  // Check for price manipulation
  const checkPriceManipulation = (listings) => {
    const alerts = [];
    
    // Safety check: ensure listings is an array
    if (!Array.isArray(listings)) {
      console.warn('checkPriceManipulation: listings is not an array:', listings);
      return alerts;
    }
    
    const priceStats = {};

    listings.forEach(listing => {
      const creditType = listing.creditType || 'unknown';
      if (!priceStats[creditType]) {
        priceStats[creditType] = [];
      }
      priceStats[creditType].push(listing.pricePerCredit);
    });

    Object.entries(priceStats).forEach(([creditType, prices]) => {
      if (prices.length > 5) {
        const avgPrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
        const stdDev = Math.sqrt(prices.reduce((sum, p) => sum + Math.pow(p - avgPrice, 2), 0) / prices.length);
        
        prices.forEach((price, index) => {
          if (Math.abs(price - avgPrice) > stdDev * 3) {
            alerts.push({
              id: `price_${creditType}_${index}`,
              type: 'price_manipulation',
              severity: 'medium',
              description: `Suspicious pricing for ${creditType}: $${price} (${((price - avgPrice) / avgPrice * 100).toFixed(1)}% from average)`,
              timestamp: new Date(),
              status: 'pending',
              riskScore: 0.55,
              details: {
                creditType,
                price,
                averagePrice: avgPrice.toFixed(2),
                deviation: ((price - avgPrice) / avgPrice * 100).toFixed(1)
              }
            });
          }
        });
      }
    });

    return alerts;
  };

  // Calculate similarity between credit groups
  const calculateSimilarity = (credits) => {
    if (credits.length < 2) return 0;
    
    let totalSimilarity = 0;
    let comparisons = 0;
    
    for (let i = 0; i < credits.length; i++) {
      for (let j = i + 1; j < credits.length; j++) {
        const credit1 = credits[i];
        const credit2 = credits[j];
        
        let similarity = 0;
        let fields = 0;
        
        // Compare facility name
        if (credit1.productionDetails?.facilityName && credit2.productionDetails?.facilityName) {
          similarity += credit1.productionDetails.facilityName === credit2.productionDetails.facilityName ? 1 : 0;
          fields++;
        }
        
        // Compare location
        if (credit1.productionDetails?.location && credit2.productionDetails?.location) {
          similarity += credit1.productionDetails.location === credit2.productionDetails.location ? 1 : 0;
          fields++;
        }
        
        // Compare amount (with tolerance)
        if (credit1.amount && credit2.amount) {
          const amountDiff = Math.abs(credit1.amount - credit2.amount) / Math.max(credit1.amount, credit2.amount);
          similarity += amountDiff < 0.1 ? 1 : 0;
          fields++;
        }
        
        if (fields > 0) {
          totalSimilarity += similarity / fields;
          comparisons++;
        }
      }
    }
    
    return comparisons > 0 ? totalSimilarity / comparisons : 0;
  };

  // Calculate analytics from raw data
  const calculateAnalytics = (rawData) => {
    const { allCredits, allTransactions, allListings, fraudAlerts } = rawData;

    // System overview
    const systemOverview = {
      totalUsers: new Set([...allCredits.map(c => c.producerId), ...allTransactions.map(t => t.fromUserId || t.toUserId)]).size,
      totalCredits: allCredits.length,
      totalTransactions: allTransactions.length,
      totalListings: allListings.length,
      fraudAlerts: fraudAlerts.length
    };

    // Credit analytics
    const creditAnalytics = {
      totalCredits: allCredits.length,
      pendingCredits: allCredits.filter(c => c.status === 'pending').length,
      approvedCredits: allCredits.filter(c => c.status === 'approved').length,
      rejectedCredits: allCredits.filter(c => c.status === 'rejected').length,
      totalVolume: allCredits.reduce((sum, c) => sum + (c.amount || 0), 0),
      monthlyCredits: getMonthlyData(allCredits, 'createdAt'),
      statusDistribution: getStatusDistribution(allCredits)
    };

    // Transaction analytics
    const transactionAnalytics = {
      totalTransactions: allTransactions.length,
      completedTransactions: allTransactions.filter(t => t.status === 'completed').length,
      pendingTransactions: allTransactions.filter(t => t.status === 'pending').length,
      totalVolume: allTransactions.reduce((sum, t) => sum + (t.amount || 0), 0),
      monthlyTransactions: getMonthlyData(allTransactions, 'createdAt')
    };

    // Fraud analytics
    const fraudAnalytics = {
      totalAlerts: fraudAlerts.length,
      highRiskAlerts: fraudAlerts.filter(a => a.severity === 'high').length,
      mediumRiskAlerts: fraudAlerts.filter(a => a.severity === 'medium').length,
      lowRiskAlerts: fraudAlerts.filter(a => a.severity === 'low').length,
      resolvedAlerts: fraudAlerts.filter(a => a.status === 'resolved').length,
      pendingAlerts: fraudAlerts.filter(a => a.status === 'pending').length
    };

    return {
      system: systemOverview,
      credits: creditAnalytics,
      transactions: transactionAnalytics,
      fraud: fraudAnalytics,
      overview: {
        systemHealth: calculateSystemHealth(creditAnalytics, transactionAnalytics, fraudAnalytics),
        riskScore: calculateRiskScore(fraudAnalytics),
        complianceRate: calculateComplianceRate(creditAnalytics, transactionAnalytics)
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

  // Calculate system health score
  const calculateSystemHealth = (credits, transactions, fraud) => {
    let score = 100;
    
    // Deduct points for high fraud alerts
    score -= fraud.highRiskAlerts * 10;
    score -= fraud.mediumRiskAlerts * 5;
    
    // Deduct points for low approval rates
    const approvalRate = credits.totalCredits > 0 ? (credits.approvedCredits / credits.totalCredits) * 100 : 0;
    if (approvalRate < 80) score -= (80 - approvalRate) * 0.5;
    
    // Deduct points for low transaction completion rates
    const completionRate = transactions.totalTransactions > 0 ? (transactions.completedTransactions / transactions.totalTransactions) * 100 : 0;
    if (completionRate < 90) score -= (90 - completionRate) * 0.5;
    
    return Math.max(0, Math.round(score));
  };

  // Calculate risk score
  const calculateRiskScore = (fraud) => {
    let score = 0;
    
    score += fraud.highRiskAlerts * 30;
    score += fraud.mediumRiskAlerts * 15;
    score += fraud.lowRiskAlerts * 5;
    
    return Math.min(100, score);
  };

  // Calculate compliance rate
  const calculateComplianceRate = (credits, transactions) => {
    const creditCompliance = credits.totalCredits > 0 ? 
      ((credits.approvedCredits + credits.rejectedCredits) / credits.totalCredits) * 100 : 0;
    
    const transactionCompliance = transactions.totalTransactions > 0 ? 
      (transactions.completedTransactions / transactions.totalTransactions) * 100 : 0;
    
    return Math.round((creditCompliance + transactionCompliance) / 2);
  };

  // Refresh specific data
  const refreshCredits = async () => {
    try {
      const response = await creditService.getCredits();
      setData(prev => ({
        ...prev,
        allCredits: response.data || [],
        fraudAlerts: generateFraudAlerts({ ...prev, allCredits: response.data || [] }),
        analytics: calculateAnalytics({ ...prev, allCredits: response.data || [] })
      }));
    } catch (err) {
      setError(err.message || 'Failed to refresh credits');
    }
  };

  const refreshTransactions = async () => {
    try {
      const response = await transactionService.getAllTransactions();
      setData(prev => ({
        ...prev,
        allTransactions: response.data || [],
        fraudAlerts: generateFraudAlerts({ ...prev, allTransactions: response.data || [] }),
        analytics: calculateAnalytics({ ...prev, allTransactions: response.data || [] })
      }));
    } catch (err) {
      setError(err.message || 'Failed to refresh transactions');
    }
  };

  // Resolve fraud alert
  const resolveAlert = async (alertId, resolutionData) => {
    try {
      setData(prev => ({
        ...prev,
        fraudAlerts: prev.fraudAlerts.map(alert => 
          alert.id === alertId ? { ...alert, status: 'resolved', resolution: resolutionData } : alert
        )
      }));
      return { success: true };
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
    resolveAlert
  };
}; 