import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Leaf, TrendingUp, Calendar, MapPin, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const MyCredits = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // Mock data for demonstration
  useEffect(() => {
    const mockCredits = [
      {
        id: 1,
        projectName: 'Solar Hydrogen Farm',
        amount: 1500.50,
        status: 'active',
        issueDate: '2024-01-15',
        expiryDate: '2025-01-15',
        location: 'California, USA',
        productionMethod: 'Electrolysis',
        certificateNumber: 'H2-CRED-2024-001',
        verifiedBy: 'Green Certifiers Inc.'
      },
      {
        id: 2,
        projectName: 'Wind-Powered H2 Production',
        amount: 2300.75,
        status: 'pending',
        issueDate: '2024-02-20',
        expiryDate: '2025-02-20',
        location: 'Texas, USA',
        productionMethod: 'Electrolysis',
        certificateNumber: 'H2-CRED-2024-002',
        verifiedBy: 'EcoVerification Ltd.'
      },
      {
        id: 3,
        projectName: 'Biomass Hydrogen Plant',
        amount: 800.25,
        status: 'expired',
        issueDate: '2023-06-10',
        expiryDate: '2024-06-10',
        location: 'Oregon, USA',
        productionMethod: 'Biomass Gasification',
        certificateNumber: 'H2-CRED-2023-015',
        verifiedBy: 'Sustainable Certifiers'
      }
    ];

    setTimeout(() => {
      setCredits(mockCredits);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCredits = credits.filter(credit => {
    if (filter === 'all') return true;
    return credit.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20';
      case 'expired':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'expired':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const totalCredits = credits.reduce((sum, credit) => sum + credit.amount, 0);
  const activeCredits = credits.filter(credit => credit.status === 'active').reduce((sum, credit) => sum + credit.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your credits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Credits</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and track your hydrogen production credits</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Leaf className="w-4 h-4" />
          <span>Producer Portal</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Credits</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCredits.toFixed(2)} kg</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Credits</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeCredits.toFixed(2)} kg</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Leaf className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{credits.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by status:</span>
          <div className="flex space-x-2">
            {['all', 'active', 'pending', 'expired'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1 text-sm font-medium rounded-md capitalize ${
                  filter === status
                    ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Credits List */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700">
        <div className="p-6 border-b border-gray-200 dark:border-dark-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Credit Certificates</h2>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-dark-700">
          {filteredCredits.length === 0 ? (
            <div className="p-6 text-center">
              <Leaf className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No credits found with the selected filter.</p>
            </div>
          ) : (
            filteredCredits.map((credit) => (
              <div key={credit.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {credit.projectName}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(credit.status)}`}>
                        {getStatusIcon(credit.status)}
                        <span className="ml-1 capitalize">{credit.status}</span>
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Amount</p>
                        <p className="font-medium text-gray-900 dark:text-white">{credit.amount} kg</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Production Method</p>
                        <p className="font-medium text-gray-900 dark:text-white">{credit.productionMethod}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Location</p>
                        <p className="font-medium text-gray-900 dark:text-white">{credit.location}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Certificate Number</p>
                        <p className="font-medium text-gray-900 dark:text-white">{credit.certificateNumber}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Issue Date</p>
                        <p className="font-medium text-gray-900 dark:text-white">{credit.issueDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Expiry Date</p>
                        <p className="font-medium text-gray-900 dark:text-white">{credit.expiryDate}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-gray-600 dark:text-gray-400">Verified By</p>
                      <p className="font-medium text-gray-900 dark:text-white">{credit.verifiedBy}</p>
                    </div>
                  </div>
                  
                  <div className="ml-6 flex flex-col space-y-2">
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700">
                      View Details
                    </button>
                    <button className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
                      Download Certificate
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MyCredits; 