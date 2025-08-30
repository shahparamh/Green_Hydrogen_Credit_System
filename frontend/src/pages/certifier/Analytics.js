import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { BarChart3, TrendingUp, CheckCircle, Clock, AlertTriangle, Users, MapPin } from 'lucide-react';
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
        totalRequests: 45,
        approvedRequests: 32,
        pendingRequests: 8,
        rejectedRequests: 5,
        totalHydrogenCredits: 12500.75,
        averageProcessingTime: 3.2
      },
      monthlyData: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        requests: [8, 12, 15, 10, 18, 22],
        approvals: [6, 10, 12, 8, 15, 18],
        hydrogenAmount: [1200, 1800, 2200, 1500, 2800, 3200]
      },
      productionMethods: [
        { name: 'Electrolysis', value: 65, color: '#3B82F6' },
        { name: 'Steam Methane Reforming', value: 20, color: '#10B981' },
        { name: 'Biomass Gasification', value: 10, color: '#F59E0B' },
        { name: 'Other', value: 5, color: '#EF4444' }
      ],
      topProducers: [
        { name: 'Green Hydrogen Solutions', credits: 2500.75, projects: 3 },
        { name: 'Wind Energy Corp', credits: 1800.50, projects: 2 },
        { name: 'Biomass Innovations Ltd', credits: 950.25, projects: 1 },
        { name: 'Solar H2 Technologies', credits: 800.00, projects: 1 },
        { name: 'Ocean Energy Systems', credits: 650.50, projects: 1 }
      ],
      regionalDistribution: [
        { region: 'North America', credits: 4500.25, projects: 12 },
        { region: 'Europe', credits: 3800.50, projects: 15 },
        { region: 'Asia Pacific', credits: 2800.00, projects: 8 },
        { region: 'Rest of World', credits: 1400.00, projects: 5 }
      ]
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Certification Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400">Comprehensive insights into hydrogen credit certification</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <BarChart3 className="w-4 h-4" />
          <span>Certifier Portal</span>
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.overview.totalRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approved</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.overview.approvedRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.overview.pendingRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Rejected</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{analyticsData.overview.rejectedRequests}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Monthly Trends</h3>
          <LineChart
            data={{
              labels: analyticsData.monthlyData.labels,
              datasets: [
                {
                  label: 'Requests',
                  data: analyticsData.monthlyData.requests,
                  borderColor: '#3B82F6',
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  tension: 0.4
                },
                {
                  label: 'Approvals',
                  data: analyticsData.monthlyData.approvals,
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
        {/* Hydrogen Production Volume */}
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hydrogen Production Volume</h3>
          <BarChart
            data={{
              labels: analyticsData.monthlyData.labels,
              datasets: [{
                label: 'Hydrogen Amount (kg)',
                data: analyticsData.monthlyData.hydrogenAmount,
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: '#3B82F6',
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
                      return value + ' kg';
                    }
                  }
                }
              }
            }}
          />
        </div>

        {/* Regional Distribution */}
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Regional Distribution</h3>
          <BarChart
            data={{
              labels: analyticsData.regionalDistribution.map(item => item.region),
              datasets: [{
                label: 'Credits (kg)',
                data: analyticsData.regionalDistribution.map(item => item.credits),
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
                      return value + ' kg';
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
                    <p className="text-sm text-gray-600 dark:text-gray-400">{producer.projects} projects</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">{producer.credits} kg</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Credits</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Key Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total Hydrogen Credits</span>
              <span className="font-semibold text-gray-900 dark:text-white">{analyticsData.overview.totalHydrogenCredits} kg</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Approval Rate</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {((analyticsData.overview.approvedRequests / analyticsData.overview.totalRequests) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Average Processing Time</span>
              <span className="font-semibold text-gray-900 dark:text-white">{analyticsData.overview.averageProcessingTime} days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Active Projects</span>
              <span className="font-semibold text-gray-900 dark:text-white">{analyticsData.overview.approvedRequests}</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Approved Solar Hydrogen Farm project</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">New request from Wind Energy Corp</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Completed Biomass project review</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Updated certification standards</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 