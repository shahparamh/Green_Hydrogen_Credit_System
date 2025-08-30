import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  FileText, 
  Shield, 
  TrendingUp,
  BarChart3,
  Filter,
  Search,
  Eye,
  Check,
  X,
  Download,
  RefreshCw,
  Loader2,
  AlertCircle
} from 'lucide-react';
import StatsCard from '../../components/Dashboard/StatsCard';
import LineChart from '../../components/Charts/LineChart';
import BarChart from '../../components/Charts/BarChart';
import { useCertifierData } from '../../hooks/useCertifierData';

const CertifierDashboard = () => {
  const { data, loading, error, refreshAll, approveCredit, rejectCredit } = useCertifierData();
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: '30',
    search: ''
  });

  // Filter data based on current filters
  const filteredPendingRequests = data.pendingRequests?.filter(request => {
    if (filters.status !== 'all' && request.status !== filters.status) return false;
    if (filters.search && !request.productionDetails?.facilityName?.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  }) || [];

  const filteredApprovedCredits = data.approvedCredits?.filter(credit => {
    if (filters.status !== 'all' && credit.status !== filters.status) return false;
    if (filters.search && !credit.productionDetails?.facilityName?.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  }) || [];

  // Calculate analytics data
  const getAnalyticsData = () => {
    const totalPending = data.pendingRequests?.length || 0;
    const totalApproved = data.approvedCredits?.length || 0;
    const totalRejected = data.rejectedCredits?.length || 0;
    const approvalRate = totalPending + totalApproved + totalRejected > 0 
      ? ((totalApproved / (totalPending + totalApproved + totalRejected)) * 100).toFixed(1)
      : 0;

    return {
      totalPending,
      totalApproved,
      totalRejected,
      approvalRate,
      monthlyData: getMonthlyCertificationData(),
      complianceScore: calculateComplianceScore()
    };
  };

  // Get monthly certification data for charts
  const getMonthlyCertificationData = () => {
    const months = {};
    const currentDate = new Date();
    
    // Initialize last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = date.toISOString().slice(0, 7);
      months[monthKey] = { approved: 0, rejected: 0, pending: 0 };
    }

    // Count by month and status
    [...data.approvedCredits, ...data.rejectedCredits, ...data.pendingRequests].forEach(item => {
      const date = new Date(item.createdAt || item.updatedAt);
      const monthKey = date.toISOString().slice(0, 7);
      if (months[monthKey]) {
        if (item.status === 'approved') months[monthKey].approved++;
        else if (item.status === 'rejected') months[monthKey].rejected++;
        else months[monthKey].pending++;
      }
    });

    return Object.entries(months).map(([month, counts]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short' }),
      ...counts
    }));
  };

  // Calculate compliance score
  const calculateComplianceScore = () => {
    if (data.complianceReports.length === 0) return 85; // Default score
    
    const scores = data.complianceReports.map(report => report.complianceScore || 0);
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></Loader2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading certifier data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4"></AlertCircle>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Error Loading Data</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={refreshAll}
            className="btn-primary flex items-center mx-auto"
          >
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Certifier Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review production data, issue certifications, and maintain compliance standards
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
            <FileText className="w-5 h-5" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Pending Requests"
          value={analytics.totalPending}
          change={`${analytics.totalPending} new`}
          changeType="neutral"
          icon={Clock}
        />
        <StatsCard
          title="Approved Credits"
          value={analytics.totalApproved}
          change={`${analytics.approvalRate}% rate`}
          changeType="positive"
          icon={CheckCircle}
          trend={parseFloat(analytics.approvalRate)}
        />
        <StatsCard
          title="Rejected Credits"
          value={analytics.totalRejected}
          change="Review required"
          changeType="negative"
          icon={AlertTriangle}
        />
        <StatsCard
          title="Compliance Score"
          value={`${analytics.complianceScore}%`}
          change="Above threshold"
          changeType="positive"
          icon={Shield}
          trend={analytics.complianceScore}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart
          title="Certification Trends"
          data={analytics.monthlyData}
          dataKeys={['approved', 'rejected', 'pending']}
          xAxisKey="month"
          height={300}
          colors={['#22c55e', '#ef4444', '#f59e0b']}
        />
        
        <BarChart
          title="Monthly Certifications"
          data={analytics.monthlyData}
          dataKeys={['approved', 'rejected']}
          xAxisKey="month"
          height={300}
          colors={['#22c55e', '#ef4444']}
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
                placeholder="Search requests..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
              />
            </div>
            
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {filteredPendingRequests.length} requests found
            </span>
          </div>
        </div>
      </div>

      {/* Pending Requests Table */}
      <div className="card">
        <div className="p-6 border-b border-gray-200 dark:border-dark-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Pending Certification Requests
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
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-700 divide-y divide-gray-200 dark:divide-dark-600">
              {filteredPendingRequests.map((request) => (
                <tr key={request._id} className="hover:bg-gray-50 dark:hover:bg-dark-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          {request.producerName?.charAt(0) || 'P'}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {request.producerName || 'Unknown Producer'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {request.producerEmail || 'No email'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {request.projectName || 'Unnamed Project'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {request.technology || 'Unknown Technology'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {request.amount || 0} credits
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      ${request.value || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {request.location || 'Unknown Location'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(request.createdAt).toLocaleTimeString()}
                    </div>
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
                        onClick={() => approveCredit(request._id, {})}
                        className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => rejectCredit(request._id, '')}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredPendingRequests.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No pending requests found</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Batch Approve
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Approve multiple requests at once
          </p>
        </div>

        <div className="card p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Compliance Report
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Generate detailed compliance analysis
          </p>
        </div>

        <div className="card p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Standards Update
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Review and update certification standards
          </p>
        </div>
      </div>
    </div>
  );
};

export default CertifierDashboard;




