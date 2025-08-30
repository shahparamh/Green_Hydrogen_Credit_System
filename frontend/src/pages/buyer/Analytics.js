import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { TrendingUp, ShoppingCart, CheckCircle, Calendar, MapPin, BarChart3, DollarSign } from 'lucide-react';
import BarChart from '../../components/Charts/BarChart';
import LineChart from '../../components/Charts/LineChart';
import PieChart from '../../components/Charts/PieChart';

const Analytics = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockData = {
      overview: {
        totalPurchases: 12,
        totalCredits: 2500.75,
        totalSpent: 67500.50,
        averagePrice: 27.00,
        activeCredits: 1800.25,
        retiredCredits: 700.50
      },
      monthlyData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        purchases: [2, 3, 4, 2, 5, 6],
        amounts: [400, 600, 800, 300, 1200, 1500],
        spending: [10800, 16200, 21600, 8100, 32400, 40500]
      },
      productionMethods: [
        { name: 'Electrolysis', value: 70, color: '#3B82F6' },
        { name: 'Steam Methane Reforming', value: 20, color: '#10B981' },
        { name: 'Biomass Gasification', value: 10, color: '#F59E0B' }
      ],
      topProducers: [
        { name: 'Green Hydrogen Solutions', credits: 800.25, value: 21600.75 },
        { name: 'Wind Energy Corp', credits: 600.50, value: 17250.00 },
        { name: 'Biomass Innovations Ltd', credits: 400.00, value: 8800.00 },
        { name: 'Solar H2 Technologies', credits: 350.00, value: 8575.00 },
        { name: 'Ocean Energy Systems', credits: 350.00, value: 8750.00 }
      ],
      regionalDistribution: [
        { region: 'North America', credits: 1200.25, value: 32400.75 },
        { region: 'Europe', credits: 800.50, value: 21600.00 },
        { region: 'Asia Pacific', credits: 300.00, value: 8100.00 },
        { region: 'Rest of World', credits: 200.00, value: 5400.00 }
      ],
      priceTrends: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        averagePrice: [25.50, 26.00, 27.50, 28.00, 27.00, 27.50]
      }
    };

    setTimeout(() => {
      setAnalyticsData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Portfolio Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive insights into your hydrogen credit portfolio</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <TrendingUp className="w-4 h-4" />
          <span>Buyer Portal</span>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Purchases</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.overview.totalPurchases}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Credits</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.overview.totalCredits} kg</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${analyticsData.overview.totalSpent.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Price</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${analyticsData.overview.averagePrice}/kg</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Purchases */}
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Purchases</h3>
          <LineChart
            data={{
              labels: analyticsData.monthlyData.labels,
              datasets: [
                {
                  label: 'Credits Purchased (kg)',
                  data: analyticsData.monthlyData.amounts,
                  borderColor: '#3B82F6',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  tension: 0.4
                },
                {
                  label: 'Number of Purchases',
                  data: analyticsData.monthlyData.purchases,
                  borderColor: '#10B981',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  tension: 0.4,
                  yAxisID: 'y1'
                }
              ]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                }
              },
              scales: {
                y: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  beginAtZero: true,
                  ticks: {
                    callback: function(value) {
                      return value + ' kg';
                    }
                  }
                },
                y1: {
                  type: 'linear',
                  display: true,
                  position: 'right',
                  beginAtZero: true,
                  grid: {
                    drawOnChartArea: false,
                  },
                }
              }
            }}
          />
        </div>

        {/* Production Methods Distribution */}
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Production Methods</h3>
          <PieChart
            data={{
              labels: analyticsData.productionMethods.map(item => item.name),
              datasets: [{
                data: analyticsData.productionMethods.map(item => item.value),
                backgroundColor: analyticsData.productionMethods.map(item => item.color),
                borderWidth: 2,
                borderColor: '#ffffff'
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'bottom',
                }
              }
            }}
          />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Trends */}
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Spending</h3>
          <BarChart
            data={{
              labels: analyticsData.monthlyData.labels,
              datasets: [{
                label: 'Total Spent ($)',
                data: analyticsData.monthlyData.spending,
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                borderColor: '#10B981',
                borderWidth: 1
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value) {
                      return '$' + value.toLocaleString();
                    }
                  }
                }
              }
            }}
          />
        </div>

        {/* Price Trends */}
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Price Trends</h3>
          <LineChart
            data={{
              labels: analyticsData.priceTrends.labels,
              datasets: [{
                label: 'Average Price per kg ($)',
                data: analyticsData.priceTrends.averagePrice,
                borderColor: '#F59E0B',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                tension: 0.4
              }]
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: false,
                  ticks: {
                    callback: function(value) {
                      return '$' + value;
                    }
                  }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Top Producers */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700">
        <div className="p-6 border-b border-gray-200 dark:border-dark-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Top Producers</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {analyticsData.topProducers.map((producer, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{producer.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{producer.credits} kg purchased</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">${producer.value.toLocaleString()}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Value</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Portfolio Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Portfolio Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Active Credits</span>
              <span className="font-semibold text-gray-900 dark:text-white">{analyticsData.overview.activeCredits} kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Retired Credits</span>
              <span className="font-semibold text-gray-900 dark:text-white">{analyticsData.overview.retiredCredits} kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Portfolio Value</span>
              <span className="font-semibold text-gray-900 dark:text-white">${analyticsData.overview.totalSpent.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Average Purchase Size</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {(analyticsData.overview.totalCredits / analyticsData.overview.totalPurchases).toFixed(2)} kg
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Regional Distribution</h3>
          <div className="space-y-3">
            {analyticsData.regionalDistribution.map((region, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][index] }}></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{region.region}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{region.credits} kg</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">${region.value.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Purchased 500 kg from Green Hydrogen Solutions</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">2 days ago</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Retired 200 kg of credits for carbon offset</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">1 week ago</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Purchased 300 kg from Wind Energy Corp</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">2 weeks ago</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">Received notification about expiring credits</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">3 weeks ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 