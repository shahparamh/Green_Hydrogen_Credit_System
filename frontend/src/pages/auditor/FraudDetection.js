import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Shield, AlertTriangle, CheckCircle, Clock, Eye, TrendingUp, Users, Activity } from 'lucide-react';

const FraudDetection = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [fraudData, setFraudData] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockFraudData = {
      overview: {
        totalAlerts: 15,
        highRiskAlerts: 3,
        mediumRiskAlerts: 8,
        lowRiskAlerts: 4,
        resolvedAlerts: 12,
        pendingAlerts: 3,
        totalTransactions: 1250,
        suspiciousTransactions: 25
      },
      riskMetrics: {
        anomalyScore: 0.15,
        fraudRate: 0.02,
        detectionAccuracy: 0.95,
        falsePositiveRate: 0.03
      },
      recentAlerts: [
        {
          id: 1,
          type: 'suspicious_volume',
          severity: 'high',
          producerName: 'Unknown Producer',
          description: 'Unusually high credit minting volume detected',
          timestamp: '2024-03-15T14:30:00Z',
          status: 'pending',
          riskScore: 0.85,
          details: {
            normalVolume: 500,
            detectedVolume: 2500,
            percentage: 400,
            location: 'Unknown Location',
            transactionHash: '0x1234567890abcdef...'
          }
        },
        {
          id: 2,
          type: 'duplicate_certificates',
          severity: 'medium',
          producerName: 'Green Hydrogen Solutions',
          description: 'Potential duplicate certificate submission',
          timestamp: '2024-03-14T11:20:00Z',
          status: 'investigating',
          riskScore: 0.65,
          details: {
            certificateNumbers: ['H2-CRED-2024-001', 'H2-CRED-2024-001-A'],
            similarity: 0.95,
            submissionTime: '2 hours apart',
            transactionHash: '0xabcdef1234567890...'
          }
        },
        {
          id: 3,
          type: 'unusual_pattern',
          severity: 'low',
          producerName: 'Wind Energy Corp',
          description: 'Unusual transaction pattern detected',
          timestamp: '2024-03-13T16:45:00Z',
          status: 'resolved',
          riskScore: 0.35,
          details: {
            pattern: 'Multiple small transactions',
            frequency: '10 transactions in 1 hour',
            totalAmount: 1000,
            averageAmount: 100,
            transactionHashes: ['0x7890abcdef123456...', '0x4567890abcdef123...']
          }
        }
      ]
    };

    setTimeout(() => {
      setFraudData(mockFraudData);
      setAlerts(mockFraudData.recentAlerts);
      setLoading(false);
    }, 1000);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20';
      case 'investigating':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20';
      case 'resolved':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="w-4 h-4" />;
      case 'medium':
        return <Clock className="w-4 h-4" />;
      case 'low':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleResolveAlert = (alertId) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, status: 'resolved' } : alert
    ));
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading fraud detection data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fraud Detection</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor and detect fraudulent activities in the hydrogen credit system</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Shield className="w-4 h-4" />
          <span>Auditor Portal</span>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Alerts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{fraudData.overview.totalAlerts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Alerts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{fraudData.overview.pendingAlerts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolved Alerts</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{fraudData.overview.resolvedAlerts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Activity className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Fraud Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{(fraudData.riskMetrics.fraudRate * 100).toFixed(2)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Risk Metrics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Anomaly Score</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{(fraudData.riskMetrics.anomalyScore * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full" 
                  style={{ width: `${fraudData.riskMetrics.anomalyScore * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Detection Accuracy</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{(fraudData.riskMetrics.detectionAccuracy * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full" 
                  style={{ width: `${fraudData.riskMetrics.detectionAccuracy * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">False Positive Rate</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{(fraudData.riskMetrics.falsePositiveRate * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full" 
                  style={{ width: `${fraudData.riskMetrics.falsePositiveRate * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Alert Distribution</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">High Risk</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{fraudData.overview.highRiskAlerts}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Medium Risk</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{fraudData.overview.mediumRiskAlerts}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Low Risk</span>
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">{fraudData.overview.lowRiskAlerts}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Alerts */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700">
        <div className="p-6 border-b border-gray-200 dark:border-dark-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Fraud Alerts</h2>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-dark-700">
          {alerts.length === 0 ? (
            <div className="p-6 text-center">
              <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No fraud alerts detected.</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {alert.description}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(alert.severity)}`}>
                        {getSeverityIcon(alert.severity)}
                        <span className="ml-1 capitalize">{alert.severity} Risk</span>
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                        <span className="capitalize">{alert.status}</span>
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Producer</p>
                        <p className="font-medium text-gray-900 dark:text-white">{alert.producerName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Alert Type</p>
                        <p className="font-medium text-gray-900 dark:text-white">{alert.type.replace('_', ' ').toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Risk Score</p>
                        <p className="font-medium text-gray-900 dark:text-white">{(alert.riskScore * 100).toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Timestamp</p>
                        <p className="font-medium text-gray-900 dark:text-white">{formatTimestamp(alert.timestamp)}</p>
                      </div>
                    </div>
                    
                    {alert.details && (
                      <div className="mt-4 p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Alert Details</h4>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {alert.type === 'suspicious_volume' && (
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p>Normal Volume: {alert.details.normalVolume} kg</p>
                                <p>Detected Volume: {alert.details.detectedVolume} kg</p>
                                <p>Percentage Increase: {alert.details.percentage}%</p>
                              </div>
                              <div>
                                <p>Location: {alert.details.location}</p>
                                <p>Transaction: {alert.details.transactionHash.substring(0, 20)}...</p>
                              </div>
                            </div>
                          )}
                          {alert.type === 'duplicate_certificates' && (
                            <div>
                              <p>Certificate Numbers: {alert.details.certificateNumbers.join(', ')}</p>
                              <p>Similarity: {(alert.details.similarity * 100).toFixed(1)}%</p>
                              <p>Submission Time: {alert.details.submissionTime}</p>
                            </div>
                          )}
                          {alert.type === 'unusual_pattern' && (
                            <div>
                              <p>Pattern: {alert.details.pattern}</p>
                              <p>Frequency: {alert.details.frequency}</p>
                              <p>Total Amount: {alert.details.totalAmount} kg</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-6 flex flex-col space-y-2">
                    <button
                      onClick={() => {
                        setSelectedAlert(alert);
                        setShowModal(true);
                      }}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Investigate
                    </button>
                    {alert.status !== 'resolved' && (
                      <button
                        onClick={() => handleResolveAlert(alert.id)}
                        className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Alert Details Modal */}
      {showModal && selectedAlert && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <div className="inline-block align-bottom bg-white dark:bg-dark-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Fraud Alert Investigation: {selectedAlert.description}
                </h3>
              </div>
              
              <div className="px-6 py-4 max-h-96 overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Alert Information</h4>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Type</p>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedAlert.type.replace('_', ' ').toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Severity</p>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedAlert.severity}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</p>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedAlert.status}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Risk Score</p>
                        <p className="text-sm text-gray-900 dark:text-white">{(selectedAlert.riskScore * 100).toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Entity Information</h4>
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Producer</p>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedAlert.producerName}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Detailed Analysis</h4>
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {selectedAlert.details && (
                        <div className="space-y-2">
                          {Object.entries(selectedAlert.details).map(([key, value]) => (
                            <div key={key}>
                              <span className="font-medium text-gray-700 dark:text-gray-300">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}: </span>
                              <span>{value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Recommended Actions</h4>
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <ul className="list-disc list-inside space-y-1">
                        <li>Review transaction history for the affected producer</li>
                        <li>Verify certificate authenticity and documentation</li>
                        <li>Check for similar patterns across the system</li>
                        <li>Contact the producer for clarification if needed</li>
                        <li>Update fraud detection rules if necessary</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 border-t border-gray-200 dark:border-dark-700 flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700"
                >
                  Close
                </button>
                {selectedAlert.status !== 'resolved' && (
                  <button
                    onClick={() => {
                      handleResolveAlert(selectedAlert.id);
                      setShowModal(false);
                    }}
                    className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    Resolve Alert
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FraudDetection; 