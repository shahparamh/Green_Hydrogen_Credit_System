import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Wallet, 
  ShoppingCart, 
  FileText, 
  BarChart3,
  Search,
  Filter,
  Eye,
  Download,
  RefreshCw,
  Loader2,
  AlertCircle,
  DollarSign,
  CreditCard
} from 'lucide-react';
import StatsCard from '../../components/Dashboard/StatsCard';
import LineChart from '../../components/Charts/LineChart';
import BarChart from '../../components/Charts/BarChart';
import PieChart from '../../components/Charts/PieChart';
import { useBuyerData } from '../../hooks/useBuyerData';
import { transactionService } from '../../services';

const BuyerDashboard = () => {
  const { data, loading, error, refreshAll, purchaseCredits, retireCredits } = useBuyerData();
  const [filters, setFilters] = useState({
    priceRange: 'all',
    technology: 'all',
    location: 'all',
    search: ''
  });

  // Filter data based on current filters
  const filteredCredits = data.purchasedCredits?.filter(credit => {
    if (filters.priceRange !== 'all') {
      const price = credit.price || 0;
      if (filters.priceRange === 'low' && price > 25) return false;
      if (filters.priceRange === 'medium' && (price <= 25 || price > 50)) return false;
      if (filters.priceRange === 'high' && price <= 50) return false;
    }
    
    if (filters.technology !== 'all' && credit.productionMethod !== filters.technology) return false;
    if (filters.location !== 'all' && credit.location !== filters.location) return false;
    
    if (filters.search && !credit.projectName?.toLowerCase().includes(filters.search.toLowerCase())) return false;
    
    return true;
  }) || [];

  // Generate portfolio report
  const generateReport = async () => {
    try {
      const response = await transactionService.generatePortfolioReport();
      if (response.success) {
        return { success: true, data: response.data };
      }
      return { success: false, error: response.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Calculate analytics
  const getAnalyticsData = () => {
    const totalPortfolioValue = data.portfolio.reduce((sum, credit) => sum + (credit.value || 0), 0);
    const totalCredits = data.portfolio.reduce((sum, credit) => sum + (credit.amount || 0), 0);
    const monthlySpending = getMonthlySpendingData();
    const portfolioDistribution = getPortfolioDistribution();

    return {
      totalPortfolioValue,
      totalCredits,
      availableBalance: data.balance,
      monthlySpending,
      portfolioDistribution
    };
  };

  const getMonthlySpendingData = () => {
    const months = {};
    const currentDate = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = date.toISOString().slice(0, 7);
      months[monthKey] = { spending: 0, credits: 0 };
    }

    data.transactions.forEach(transaction => {
      if (transaction.type === 'purchase') {
        const date = new Date(transaction.createdAt);
        const monthKey = date.toISOString().slice(0, 7);
        if (months[monthKey]) {
          months[monthKey].spending += transaction.amount || 0;
          months[monthKey].credits += transaction.creditAmount || 0;
        }
      }
    });

    return Object.entries(months).map(([month, data]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short' }),
      ...data
    }));
  };

  const getPortfolioDistribution = () => {
    const distribution = {};
    data.portfolio.forEach(credit => {
      const tech = credit.technology || 'Unknown';
      distribution[tech] = (distribution[tech] || 0) + (credit.amount || 0);
    });

    return Object.entries(distribution).map(([tech, amount]) => ({
      name: tech,
      value: amount
    }));
  };

  useEffect(() => {
    refreshAll();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></Loader2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading buyer data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4"></AlertCircle>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Data</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button onClick={refreshAll} className="btn-primary flex items-center mx-auto">
            <RefreshCw className="h-4 h-4 mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const analytics = getAnalyticsData();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Buyer Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Browse available credits, manage your portfolio, and track your investments
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={refreshAll} className="btn-secondary flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button onClick={generateReport} className="btn-primary flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Portfolio Value"
          value={`$${analytics.totalPortfolioValue.toLocaleString()}`}
          change="Total investment"
          changeType="positive"
          icon={TrendingUp}
        />
        <StatsCard
          title="Total Credits"
          value={analytics.totalCredits.toLocaleString()}
          change="Portfolio size"
          changeType="neutral"
          icon={CreditCard}
        />
        <StatsCard
          title="Available Balance"
          value={`$${analytics.availableBalance.toLocaleString()}`}
          change="Ready to invest"
          changeType="positive"
          icon={Wallet}
        />
        <StatsCard
          title="Available Credits"
          value={filteredCredits.length.toLocaleString()}
          change="Market listings"
          changeType="neutral"
          icon={ShoppingCart}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <LineChart
          title="Monthly Spending"
          data={analytics.monthlySpending}
          dataKeys={['spending']}
          xAxisKey="month"
          height={300}
          colors={['#8b5cf6']}
        />
        <BarChart
          title="Credits Purchased"
          data={analytics.monthlySpending}
          dataKeys={['credits']}
          xAxisKey="month"
          height={300}
          colors={['#10b981']}
        />
        <PieChart
          title="Portfolio Distribution"
          data={analytics.portfolioDistribution}
          dataKey="value"
          nameKey="name"
          height={300}
        />
      </div>

      {/* Filters and Search */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search credits..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
              />
            </div>
            
            <select
              value={filters.technology}
              onChange={(e) => setFilters(prev => ({ ...prev, technology: e.target.value }))}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            >
              <option value="all">All Technologies</option>
              <option value="solar">Solar</option>
              <option value="wind">Wind</option>
              <option value="hydro">Hydro</option>
              <option value="biomass">Biomass</option>
            </select>
            
            <select
              value={filters.location}
              onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            >
              <option value="all">All Locations</option>
              <option value="north">North</option>
              <option value="south">South</option>
              <option value="east">East</option>
              <option value="west">West</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {filteredCredits.length} credits available
            </span>
          </div>
        </div>
      </div>

      {/* Available Credits Table */}
      <div className="card">
        <div className="p-6 border-b border-gray-200 dark:border-dark-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Available Credits for Purchase
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Producer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Credits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Technology
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-700 divide-y divide-gray-200 dark:divide-dark-600">
              {filteredCredits.map((credit) => (
                <tr key={credit._id} className="hover:bg-gray-50 dark:hover:bg-dark-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          {credit.producerName?.charAt(0) || 'P'}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {credit.producerName || 'Unknown Producer'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {credit.location || 'Unknown Location'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {credit.projectName || 'Unnamed Project'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {credit.technology || 'Unknown Technology'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {credit.amount || 0} credits
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      ${credit.pricePerCredit || 0}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      per credit
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200">
                      {credit.technology || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {/* View details modal */}}
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => purchaseCredits(credit._id, 1)}
                        className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredCredits.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No available credits found</p>
            </div>
          )}
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Portfolio Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-dark-800 rounded-lg">
            <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {analytics.totalCredits.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Credits</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-dark-800 rounded-lg">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              ${analytics.totalPortfolioValue.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Portfolio Value</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-dark-800 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ${analytics.availableBalance.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Available Balance</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
