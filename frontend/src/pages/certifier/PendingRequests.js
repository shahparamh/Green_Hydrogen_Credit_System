import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { AlertTriangle, CheckCircle, XCircle, Clock, Eye, Download, MapPin, Calendar } from 'lucide-react';

const PendingRequests = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockRequests = [
      {
        id: 1,
        producerName: 'Green Hydrogen Solutions',
        projectName: 'Solar-Powered H2 Production Facility',
        hydrogenAmount: 2500.75,
        productionMethod: 'Electrolysis',
        location: 'California, USA',
        submissionDate: '2024-03-15',
        status: 'pending',
        documents: ['Project Plan.pdf', 'Environmental Assessment.pdf', 'Technical Specifications.pdf'],
        description: 'Large-scale hydrogen production facility powered by solar energy with advanced electrolysis technology.',
        estimatedCompletion: '2024-12-31',
        contactEmail: 'contact@greenh2solutions.com',
        contactPhone: '+1-555-0123'
      },
      {
        id: 2,
        producerName: 'Wind Energy Corp',
        projectName: 'Offshore Wind Hydrogen Project',
        hydrogenAmount: 1800.50,
        productionMethod: 'Electrolysis',
        location: 'North Sea, Netherlands',
        submissionDate: '2024-03-12',
        status: 'under_review',
        documents: ['Wind Farm Design.pdf', 'Hydrogen Production Plan.pdf', 'Safety Protocols.pdf'],
        description: 'Innovative offshore wind farm with integrated hydrogen production capabilities.',
        estimatedCompletion: '2025-06-30',
        contactEmail: 'info@windenergycorp.com',
        contactPhone: '+31-20-1234567'
      },
      {
        id: 3,
        producerName: 'Biomass Innovations Ltd',
        projectName: 'Agricultural Waste to Hydrogen',
        hydrogenAmount: 950.25,
        productionMethod: 'Biomass Gasification',
        location: 'Rural Denmark',
        submissionDate: '2024-03-10',
        status: 'pending',
        documents: ['Biomass Supply Chain.pdf', 'Gasification Technology.pdf', 'Carbon Footprint Analysis.pdf'],
        description: 'Sustainable hydrogen production from agricultural waste using advanced gasification technology.',
        estimatedCompletion: '2024-10-15',
        contactEmail: 'hello@biomassinnovations.dk',
        contactPhone: '+45-33-123456'
      }
    ];

    setTimeout(() => {
      setRequests(mockRequests);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20';
      case 'under_review':
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20';
      case 'approved':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
      case 'rejected':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'under_review':
        return <Eye className="w-4 h-4" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleApprove = async (requestId) => {
    // Simulate API call
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'approved' } : req
    ));
  };

  const handleReject = async (requestId) => {
    // Simulate API call
    setRequests(prev => prev.map(req => 
      req.id === requestId ? { ...req, status: 'rejected' } : req
    ));
  };

  const pendingRequests = requests.filter(req => req.status === 'pending' || req.status === 'under_review');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading pending requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pending Requests</h1>
          <p className="text-gray-600 dark:text-gray-400">Review and approve hydrogen production credit requests</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <AlertTriangle className="w-4 h-4" />
          <span>Certifier Portal</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {requests.filter(r => r.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Under Review</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {requests.filter(r => r.status === 'under_review').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Hydrogen</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {pendingRequests.reduce((sum, req) => sum + req.hydrogenAmount, 0).toFixed(2)} kg
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700">
        <div className="p-6 border-b border-gray-200 dark:border-dark-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Credit Requests</h2>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-dark-700">
          {pendingRequests.length === 0 ? (
            <div className="p-6 text-center">
              <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No pending requests to review.</p>
            </div>
          ) : (
            pendingRequests.map((request) => (
              <div key={request.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {request.projectName}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        <span className="ml-1 capitalize">{request.status.replace('_', ' ')}</span>
                      </span>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{request.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Producer</p>
                        <p className="font-medium text-gray-900 dark:text-white">{request.producerName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Hydrogen Amount</p>
                        <p className="font-medium text-gray-900 dark:text-white">{request.hydrogenAmount} kg</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Production Method</p>
                        <p className="font-medium text-gray-900 dark:text-white">{request.productionMethod}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Location</p>
                        <p className="font-medium text-gray-900 dark:text-white">{request.location}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Submission Date</p>
                        <p className="font-medium text-gray-900 dark:text-white">{request.submissionDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Estimated Completion</p>
                        <p className="font-medium text-gray-900 dark:text-white">{request.estimatedCompletion}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-gray-600 dark:text-gray-400 mb-2">Supporting Documents</p>
                      <div className="flex flex-wrap gap-2">
                        {request.documents.map((doc, index) => (
                          <button
                            key={index}
                            className="inline-flex items-center px-3 py-1 text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/20 rounded-md hover:bg-primary-200 dark:hover:bg-primary-900/40"
                          >
                            <Download className="w-3 h-3 mr-1" />
                            {doc}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-6 flex flex-col space-y-2">
                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowModal(true);
                      }}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Review Details
                    </button>
                    {request.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(request.id)}
                          className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Review Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <div className="inline-block align-bottom bg-white dark:bg-dark-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Review Request: {selectedRequest.projectName}
                </h3>
              </div>
              
              <div className="px-6 py-4 max-h-96 overflow-y-auto">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Project Details</h4>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{selectedRequest.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Producer</p>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedRequest.producerName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact Email</p>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedRequest.contactEmail}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Contact Phone</p>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedRequest.contactPhone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</p>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedRequest.location}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Technical Specifications</h4>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Hydrogen Amount</p>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedRequest.hydrogenAmount} kg</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Production Method</p>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedRequest.productionMethod}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Timeline</h4>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Submission Date</p>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedRequest.submissionDate}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Estimated Completion</p>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedRequest.estimatedCompletion}</p>
                      </div>
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
                {selectedRequest.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleApprove(selectedRequest.id);
                        setShowModal(false);
                      }}
                      className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                    >
                      Approve Request
                    </button>
                    <button
                      onClick={() => {
                        handleReject(selectedRequest.id);
                        setShowModal(false);
                      }}
                      className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                    >
                      Reject Request
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingRequests; 