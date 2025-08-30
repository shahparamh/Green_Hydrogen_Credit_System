import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart as PieChartIcon,
  Download,
  Calendar,
  Filter,
  Leaf,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import AnalyticsDashboard from '../../components/Dashboard/AnalyticsDashboard';
import LineChart from '../../components/Charts/LineChart';
import BarChart from '../../components/Charts/BarChart';
import PieChart from '../../components/Charts/PieChart';
import StatsCard from '../../components/Dashboard/StatsCard';

const ProducerAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [analyticsData, setAnalyticsData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch analytics data
    const fetchAnalyticsData = async () => {
      setLoading(true);
      
      // Mock data - replace with actual API calls
      const mockData = {
        trendData: [
          { date: 'Jan', credits: 200, requests: 3, approved: 180, rejected: 20 },
          { date: 'Feb', credits: 250, requests: 4, approved: 240, rejected: 10 },
          { date: 'Mar', credits: 300, requests: 5, approved: 280, rejected: 20 },
          { date: 'Apr', credits: 280, requests: 4, approved: 260, rejected: 20 },
          { date: 'May', credits: 320, requests: 6, approved: 300, rejected: 20 },
          { date: 'Jun', credits: 350, requests: 7, approved: 330, rejected: 20 },
        ],
        performanceData: [
          { metric: 'Production', current: 350, previous: 320 },
          { metric: 'Efficiency', current: 94, previous: 91 },
          { metric: 'Quality', current: 98, previous: 96 },
          { metric: 'Compliance', current: 100, previous: 98 },
        ],
        distributionData: [
          { category: 'Approved', value: 1810, total: 2000 },
          { category: 'Pending', value: 120, total: 2000 },
          { category: 'Rejected', value: 70, total: 2000 },
        ],
        summaryStats: {
          totalCredits: 2000,
          approvalRate: 90.5,
          avgProcessingTime: 2.3,
          totalRequests: 29,
        }
      };

      // Simulate loading delay
      setTimeout(() => {
        setAnalyticsData(mockData);
        setLoading(false);
      }, 1000);
    };

    fetchAnalyticsData();
  }, [timeRange]);

  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
    // In real app, refetch data based on new time range
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Analytics & Insights
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive analysis of your green hydrogen credit production
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="btn-outline flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>
          <button className="btn-outline flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Credits"
          value={analyticsData.summaryStats?.totalCredits?.toLocaleString() || '0'}
          change="+12.5%"
          changeType="positive"
          icon={Leaf}
          trend={12.5}
        />
        <StatsCard
          title="Approval Rate"
          value={`${analyticsData.summaryStats?.approvalRate || 0}%`}
          change="+2.1%"
          changeType="positive"
          icon={CheckCircle}
          trend={2.1}
        />
        <StatsCard
          title="Avg Processing"
          value={`${analyticsData.summaryStats?.avgProcessingTime || 0} days`}
          change="-0.5 days"
          changeType="positive"
          icon={Clock}
          trend={-0.5}
        />
        <StatsCard
          title="Total Requests"
          value={analyticsData.summaryStats?.totalRequests || 0}
          change="+3 new"
          changeType="neutral"
          icon={AlertTriangle}
        />
      </div>

      {/* Main Analytics Dashboard */}
      <AnalyticsDashboard
        title="Production Analytics"
        data={analyticsData}
        timeRange={timeRange}
        onTimeRangeChange={handleTimeRangeChange}
      />

      {/* Detailed Charts Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Detailed Analysis
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Credit Production Trend */}
          <LineChart
            title="Credit Production Trend"
            data={analyticsData.trendData || []}
            dataKeys={['credits', 'approved', 'rejected']}
            xAxisKey="date"
            height={300}
            colors={['#22c55e', '#0ea5e9', '#ef4444']}
          />
          
          {/* Request Status Distribution */}
          <PieChart
            title="Request Status Distribution"
            data={analyticsData.distributionData || []}
            dataKey="value"
            nameKey="category"
            height={300}
            innerRadius="40%"
            colors={['#22c55e', '#f59e0b', '#ef4444']}
          />
        </div>

        {/* Performance Metrics */}
        <div className="card">
          <div className="p-6 border-b border-gray-200 dark:border-dark-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Performance Metrics
            </h3>
          </div>
          <div className="p-6">
            <BarChart
              title="Performance Comparison (Current vs Previous Period)"
              data={analyticsData.performanceData || []}
              dataKeys={['current', 'previous']}
              xAxisKey="metric"
              height={250}
              colors={['#22c55e', '#0ea5e9']}
            />
          </div>
        </div>
      </div>

      {/* Insights & Recommendations */}
      <div className="card">
        <div className="p-6 border-b border-gray-200 dark:border-dark-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Insights & Recommendations
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Positive Trends</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Credit production increased by 12.5% this month</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Approval rate improved to 90.5%</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Processing time reduced by 0.5 days</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-white">Areas for Improvement</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Consider reducing rejection rate further</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span>Optimize production efficiency</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Maintain high compliance standards</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProducerAnalytics;
