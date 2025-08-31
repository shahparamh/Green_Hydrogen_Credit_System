import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  TrendingUp, 
  FileText, 
  BarChart3,
  Search,
  Filter,
  Eye,
  Download,
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Globe
} from 'lucide-react';
import StatsCard from '../../components/Dashboard/StatsCard';
import LineChart from '../../components/Charts/LineChart';
import BarChart from '../../components/Charts/BarChart';
import PieChart from '../../components/Charts/PieChart';
import { useAuditorData } from '../../hooks/useAuditorData';
import { auditService } from '../../services';

const AuditorDashboard = () => {
  const { data, loading, error, refreshAll, resolveAlert } = useAuditorData();
  const [filters, setFilters] = useState({
    severity: 'all',
    dateRange: '30',
    category: 'all',
    search: ''
  });

  // Filter data based on current filters
  const filteredFraudAlerts = data.fraudAlerts?.filter(alert => {
    if (filters.severity !== 'all' && alert.severity !== filters.severity) return false;
    if (filters.category !== 'all' && alert.type !== filters.category) return false;
    if (filters.search && !alert.description?.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  }) || [];

  const filteredCredits = data.allCredits?.filter(credit => {
    if (filters.search && !credit.productionDetails?.facilityName?.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  }) || [];

  const filteredTransactions = data.allTransactions?.filter(transaction => {
    if (filters.search && !transaction.type?.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  }) || [];

  // Generate compliance report
  const generateComplianceReport = async (filters) => {
    try {
      const response = await auditService.generateComplianceReport(filters);
      if (response.success) {
        return { success: true, data: response.data };
      }
      return { success: false, error: response.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Investigate fraud alert
  const investigateFraud = async (alertId, investigationData) => {
    try {
      const response = await auditService.investigateFraud(alertId, investigationData);
      if (response.success) {
        await refreshAll();
        return { success: true, data: response.data };
      }
      return { success: false, error: response.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Export audit data
  const exportAuditData = async (format, filters) => {
    try {
      const response = await auditService.exportAuditData(format, filters);
      if (response.success) {
        return { success: true, data: response.data };
      }
      return { success: false, error: response.message };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // Filter audit logs
  const getFilteredLogs = () => {
    let filtered = [...data.auditLogs];

    if (filters.severity !== 'all') {
      filtered = filtered.filter(log => log.severity === filters.severity);
    }

    if (filters.category !== 'all') {
      filtered = filtered.filter(log => log.category === filters.category);
    }

    if (filters.search) {
      filtered = filtered.filter(log => 
        log.action?.toLowerCase().includes(filters.search.toLowerCase()) ||
        log.userId?.toLowerCase().includes(filters.search.toLowerCase()) ||
        log.description?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    return filtered;
  };

  // Calculate analytics
  const getAnalyticsData = () => {
    const totalLogs = data.auditLogs.length;
    const highSeverityAlerts = data.auditLogs.filter(log => log.severity === 'high').length;
    const complianceScore = calculateComplianceScore();
    const fraudRate = calculateFraudRate();
    const monthlyMetrics = getMonthlyMetrics();
    const categoryDistribution = getCategoryDistribution();
    const riskAssessment = calculateRiskAssessment();

    return {
      totalLogs,
      highSeverityAlerts,
      complianceScore,
      fraudRate,
      monthlyMetrics,
      categoryDistribution,
      riskAssessment
    };
  };

  const calculateComplianceScore = () => {
    if (data.complianceReports.length === 0) return 85;
    const scores = data.complianceReports.map(report => report.complianceScore || 0);
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  };

  const calculateFraudRate = () => {
    if (data.fraudAlerts.length === 0) return 0;
    const totalTransactions = data.auditLogs.filter(log => log.category === 'transaction').length;
    return totalTransactions > 0 ? ((data.fraudAlerts.length / totalTransactions) * 100).toFixed(2) : 0;
  };

  const getMonthlyMetrics = () => {
    const months = {};
    const currentDate = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthKey = date.toISOString().slice(0, 7);
      months[monthKey] = { logs: 0, alerts: 0, compliance: 0 };
    }

    data.auditLogs.forEach(log => {
      const date = new Date(log.createdAt);
      const monthKey = date.toISOString().slice(0, 7);
      if (months[monthKey]) {
        months[monthKey].logs++;
        if (log.severity === 'high') months[monthKey].alerts++;
      }
    });

    data.complianceReports.forEach(report => {
      const date = new Date(report.createdAt);
      const monthKey = date.toISOString().slice(0, 7);
      if (months[monthKey]) {
        months[monthKey].compliance = report.complianceScore || 0;
      }
    });

    return Object.entries(months).map(([month, data]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short' }),
      ...data
    }));
  };

  const getCategoryDistribution = () => {
    const distribution = {};
    data.auditLogs.forEach(log => {
      const category = log.category || 'Unknown';
      distribution[category] = (distribution[category] || 0) + 1;
    });

    return Object.entries(distribution).map(([category, count]) => ({
      name: category,
      value: count
    }));
  };

  const calculateRiskAssessment = () => {
    const highRiskFactors = data.auditLogs.filter(log => log.severity === 'high').length;
    const fraudAlerts = data.fraudAlerts.length;
    const complianceScore = calculateComplianceScore();
    
    let riskScore = 0;
    if (highRiskFactors > 10) riskScore += 30;
    if (fraudAlerts > 5) riskScore += 25;
    if (complianceScore < 80) riskScore += 25;
    if (data.auditLogs.length > 1000) riskScore += 20;
    
    return Math.min(riskScore, 100);
  };

  useEffect(() => {
    refreshAll();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></Loader2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading auditor data...</p>
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
  const filteredLogs = getFilteredLogs();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Auditor Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor ecosystem compliance, enforce regulations, and ensure transparency
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={refreshAll} className="btn-secondary flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          <button onClick={() => generateComplianceReport(filters)} className="btn-primary flex items-center space-x-2">
            <FileText className="w-5 h-5" />
            <span>Generate Report</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Audit Logs"
          value={analytics.totalLogs.toLocaleString()}
          change="System activity"
          changeType="neutral"
          icon={FileText}
        />
        <StatsCard
          title="High Severity Alerts"
          value={analytics.highSeverityAlerts}
          change="Requires attention"
          changeType="negative"
          icon={AlertTriangle}
        />
        <StatsCard
          title="Compliance Score"
          value={`${analytics.complianceScore}%`}
          change="System health"
          changeType="positive"
          icon={CheckCircle}
        />
        <StatsCard
          title="Risk Assessment"
          value={`${analytics.riskAssessment}%`}
          change="Risk level"
          changeType={analytics.riskAssessment > 70 ? "negative" : "positive"}
          icon={Shield}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <LineChart
          title="Monthly Activity Metrics"
          data={analytics.monthlyMetrics}
          dataKeys={['logs', 'alerts']}
          xAxisKey="month"
          height={300}
          colors={['#3b82f6', '#ef4444']}
        />
        <BarChart
          title="Compliance Trends"
          data={analytics.monthlyMetrics}
          dataKeys={['compliance']}
          xAxisKey="month"
          height={300}
          colors={['#10b981']}
        />
        <PieChart
          title="Audit Categories"
          data={analytics.categoryDistribution}
          dataKey="value"
          nameKey="name"
          height={300}
        />
      </div>

      {/* Risk Assessment */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Risk Assessment Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-dark-800 rounded-lg">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {analytics.highSeverityAlerts}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">High Risk Events</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-dark-800 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {analytics.fraudRate}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Fraud Rate</div>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-dark-800 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {analytics.complianceScore}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Compliance Score</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search audit logs..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
              />
            </div>
            
            <select
              value={filters.severity}
              onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            >
              <option value="all">All Severities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            >
              <option value="all">All Categories</option>
              <option value="authentication">Authentication</option>
              <option value="transaction">Transaction</option>
              <option value="credit">Credit</option>
              <option value="user">User</option>
              <option value="system">System</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {filteredLogs.length} logs found
            </span>
          </div>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="card">
        <div className="p-6 border-b border-gray-200 dark:border-dark-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Audit Logs
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-700 divide-y divide-gray-200 dark:divide-dark-600">
              {filteredLogs.slice(0, 20).map((log) => (
                <tr key={log._id} className="hover:bg-gray-50 dark:hover:bg-dark-800">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {new Date(log.createdAt).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(log.createdAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {log.userId || 'System'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {log.userRole || 'Unknown'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {log.action || 'Unknown Action'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {log.description || 'No description'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200">
                      {log.category || 'Unknown'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      log.severity === 'high' ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200' :
                      log.severity === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200' :
                      'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200'
                    }`}>
                      {log.severity || 'low'}
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
                        onClick={() => exportAuditData('json', { logId: log._id })}
                        className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredLogs.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No audit logs found</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
          <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Fraud Investigation
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Investigate suspicious activities
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
            Risk Assessment
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Evaluate system risk levels
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuditorDashboard;
