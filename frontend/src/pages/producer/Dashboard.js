import React, { useState, useEffect } from 'react';
import { 
  Leaf, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  BarChart3,
  DollarSign,
  Zap,
  Loader2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import StatsCard from '../../components/Dashboard/StatsCard';
import LineChart from '../../components/Charts/LineChart';
import { useProducerData } from '../../hooks/useProducerData';

const ProducerDashboard = () => {
  const { data, loading, error, refreshAll } = useProducerData();
  const [stats, setStats] = useState({
    totalCredits: 0,
    pendingRequests: 0,
    approvedCredits: 0,
    totalValue: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (data.analytics?.credits) {
      const { credits: creditAnalytics } = data.analytics;
      
      setStats({
        totalCredits: creditAnalytics.totalCredits || 0,
        pendingRequests: creditAnalytics.pendingCredits || 0,
        approvedCredits: creditAnalytics.approvedCredits || 0,
        totalValue: creditAnalytics.totalValue || 0
      });

      // Convert monthly data for charts
      if (creditAnalytics.monthlyCredits) {
        setChartData(creditAnalytics.monthlyCredits.map(item => ({
          month: new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short' }),
          credits: item.count,
          approved: Math.floor(item.count * 0.8), // Mock approved rate
          requests: Math.floor(item.count * 1.2) // Mock request rate
        })));
      }

      // Set recent activity from credits data
      if (data.credits && data.credits.length > 0) {
        const recent = data.credits
          .slice(0, 4)
          .map(credit => ({
            id: credit._id,
            type: 'request',
            amount: credit.amount || 0,
            status: credit.status,
            date: credit.createdAt
          }));
        setRecentActivity(recent);
      }
    }
  }, [data]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'rejected':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 dark:text-green-400';
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'rejected':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></Loader2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading producer data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 stext-red-500 mx-auto mb-4"></AlertCircle>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Data</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={refreshAll}
            className="btn-primary flex items-center mx-auto"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </button>
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
            Producer Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor your green hydrogen credit production and requests
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={refreshAll}
            className="btn-secondary flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button className="btn-primary flex items-center space-x-2">
            <Leaf className="w-5 h-5" />
            <span>Request New Credits</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Credits"
          value={stats.totalCredits.toLocaleString()}
          change="+12.5%"
          changeType="positive"
          icon={Leaf}
          trend={12.5}
        />
        <StatsCard
          title="Pending Requests"
          value={stats.pendingRequests}
          change="2 new"
          changeType="neutral"
          icon={Clock}
        />
        <StatsCard
          title="Approved Credits"
          value={stats.approvedCredits.toLocaleString()}
          change="+8.3%"
          changeType="positive"
          icon={CheckCircle}
          trend={8.3}
        />
        <StatsCard
          title="Total Value"
          value={`$${stats.totalValue.toLocaleString()}`}
          change="+15.2%"
          changeType="positive"
          icon={DollarSign}
          trend={15.2}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart
          title="Credit Production Trend"
          data={chartData}
          dataKeys={['credits', 'approved']}
          xAxisKey="month"
          height={300}
          colors={['#22c55e', '#0ea5e9']}
        />
        
        <LineChart
          title="Request Volume"
          data={chartData}
          dataKeys={['requests']}
          xAxisKey="month"
          height={300}
          colors={['#f59e0b']}
        />
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="p-6 border-b border-gray-200 dark:border-dark-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-800 rounded-lg">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(activity.status)}
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {activity.type === 'request' ? 'Credit Request' : 'Credits Approved'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.amount} credits • {new Date(activity.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)} bg-opacity-10 ${
                  activity.status === 'approved' ? 'bg-green-100 dark:bg-green-900/20' :
                  activity.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                  'bg-red-100 dark:bg-red-900/20'
                }`}>
                  {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Request Credits
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Submit a new credit request for your green hydrogen production
          </p>
        </div>

        <div className="card p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            View Analytics
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Detailed insights into your credit production and performance
          </p>
        </div>

        <div className="card p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Production Status
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Check the current status of your hydrogen production facilities
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProducerDashboard;
