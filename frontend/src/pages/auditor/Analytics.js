import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { BarChart3, Shield, TrendingUp, Users, Activity, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
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
        totalUsers: 1250,
        totalTransactions: 8500,
        totalCredits: 45000.75,
        totalValue: 1250000.50,
        fraudAlerts: 45,
        resolvedAlerts: 38,
        pendingAlerts: 7,
        systemUptime: 99.8
      },
      monthlyData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        transactions: [1200, 1400, 1600, 1800, 2000, 2200],
        credits: [8000, 9500, 11000, 12500, 14000, 15500],
        fraudAlerts: [8, 12, 15, 10, 18, 22],
        newUsers: [150, 180, 200, 220, 250, 280]
      },
      userDistribution: [
        { role: 'Producer', count: 450, percentage: 36 },
        { role: 'Buyer', count: 380, percentage: 30.4 },
        { role: 'Certifier', count: 120, percentage: 9.6 },
        { role: 'Auditor', count: 80, percentage: 6.4 },
        { role: 'Other', count: 220, percentage: 17.6 }
      ],
      fraudTypes: [
        { type: 'Suspicious Volume', count: 15, percentage: 33.3 },
        { type: 'Duplicate Certificates', count: 12, percentage: 26.7 },
        { type: 'Unusual Patterns', count: 10, percentage: 22.2 },
        { type: 'Identity Fraud', count: 5, percentage: 11.1 },
        { type: 'Other', count: 3, percentage: 6.7 }
      ],
      topProducers: [
        { name: 'Green Hydrogen Solutions', credits: 8500.25, transactions: 45 },
        { name: 'Wind Energy Corp', credits: 7200.50, transactions: 38 },
        { name: 'Biomass Innovations Ltd', credits: 5800.75, transactions: 32 },
        { name: 'Solar H2 Technologies', credits: 4200.00, transactions: 28 },
        { name: 'Ocean Energy Systems', credits: 3800.25, transactions: 25 }
      ],
      regionalActivity: [
        { region: 'North America', transactions: 3200, credits: 18000.25 },
        { region: 'Europe', transactions: 2800, credits: 16000.50 },
        { region: 'Asia Pacific', transactions: 1800, credits: 8000.75 },
        { region: 'Rest of World', transactions: 700, credits: 3000.25 }
      ],
      systemMetrics: {
        averageResponseTime: 0.8,
        errorRate: 0.02,
        securityScore: 95.5,
        complianceRate: 98.2
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
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading system analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive insights into the hydrogen credit system</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <BarChart3 className="w-4 h-4" />
          <span>Auditor Portal</span>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.overview.totalUsers.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Activity className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.overview.totalTransactions.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Credits</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.overview.totalCredits.toLocaleString()} kg</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Shield className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Fraud Alerts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.overview.fraudAlerts}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly System Activity</h3>
          <LineChart
            data={{
              labels: analyticsData.monthlyData.labels,
              datasets: [
                {
                  label: 'Transactions',
                  data: analyticsData.monthlyData.transactions,
                  borderColor: '#3B82F6',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  tension: 0.4
                },
                {
                  label: 'New Users',
                  data: analyticsData.monthlyData.newUsers,
                  borderColor: '#10B981',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  tension: 0.4
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
                  beginAtZero: true
                }
              }
            }}
          />
        </div>

        {/* User Distribution */}
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Distribution</h3>
          <PieChart
            data={{
              labels: analyticsData.userDistribution.map(item => item.role),
              datasets: [{
                data: analyticsData.userDistribution.map(item => item.count),
                backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
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
        {/* Credit Volume Trends */}
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Credit Volume Trends</h3>
          <BarChart
            data={{
              labels: analyticsData.monthlyData.labels,
              datasets: [{
                label: 'Credits (kg)',
                data: analyticsData.monthlyData.credits,
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
                      return value.toLocaleString() + ' kg';
                    }
                  }
                }
              }
            }}
          />
        </div>

        {/* Fraud Alert Trends */}
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Fraud Alert Trends</h3>
          <BarChart
            data={{
              labels: analyticsData.monthlyData.labels,
              datasets: [{
                label: 'Fraud Alerts',
                data: analyticsData.monthlyData.fraudAlerts,
                backgroundColor: 'rgba(239, 68, 68, 0.8)',
                borderColor: '#EF4444',
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
                  beginAtZero: true
                }
              }
            }}
          />
        </div>
      </div>

      {/* Fraud Types Distribution */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Fraud Types Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <PieChart
              data={{
                labels: analyticsData.fraudTypes.map(item => item.type),
                datasets: [{
                  data: analyticsData.fraudTypes.map(item => item.count),
                  backgroundColor: ['#EF4444', '#F59E0B', '#3B82F6', '#10B981', '#8B5CF6'],
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
          <div className="space-y-4">
            {analyticsData.fraudTypes.map((fraudType, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ['#EF4444', '#F59E0B', '#3B82F6', '#10B981', '#8B5CF6'][index] }}></div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{fraudType.type}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{fraudType.count}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{fraudType.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
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
                    <p className="text-sm text-gray-600 dark:text-gray-400">{producer.transactions} transactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">{producer.credits.toLocaleString()} kg</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Credits</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">System Performance</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">System Uptime</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{analyticsData.overview.systemUptime}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${analyticsData.overview.systemUptime}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Security Score</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{analyticsData.systemMetrics.securityScore}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full" 
                  style={{ width: `${analyticsData.systemMetrics.securityScore}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Compliance Rate</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{analyticsData.systemMetrics.complianceRate}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full" 
                  style={{ width: `${analyticsData.systemMetrics.complianceRate}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Error Rate</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{(analyticsData.systemMetrics.errorRate * 100).toFixed(2)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ width: `${analyticsData.systemMetrics.errorRate * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Regional Activity</h3>
          <div className="space-y-3">
            {analyticsData.regionalActivity.map((region, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][index] }}></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{region.region}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{region.transactions.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{region.credits.toLocaleString()} kg</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent System Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">System security scan completed - No threats detected</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">New fraud detection rule deployed</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">4 hours ago</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">High-volume transaction detected and flagged for review</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">6 hours ago</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">System backup completed successfully</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">1 day ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 