import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Leaf, ShoppingCart, TrendingUp, Calendar, MapPin, CheckCircle, Clock, AlertCircle } from 'lucide-react';

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
        producerName: 'Green Hydrogen Solutions',
        projectName: 'Solar-Powered H2 Production Facility',
        amount: 500.25,
        purchaseDate: '2024-03-15',
        expiryDate: '2025-03-15',
        price: 25.50,
        status: 'active',
        location: 'California, USA',
        productionMethod: 'Electrolysis',
        certificateNumber: 'H2-CRED-2024-001',
        carbonOffset: 2500.75
      },
      {
        id: 2,
        producerName: 'Wind Energy Corp',
        projectName: 'Offshore Wind Hydrogen Project',
        amount: 300.75,
        purchaseDate: '2024-03-10',
        expiryDate: '2025-03-10',
        price: 28.75,
        status: 'active',
        location: 'North Sea, Netherlands',
        productionMethod: 'Electrolysis',
        certificateNumber: 'H2-CRED-2024-002',
        carbonOffset: 1500.50
      },
      {
        id: 3,
        producerName: 'Biomass Innovations Ltd',
        projectName: 'Agricultural Waste to Hydrogen',
        amount: 200.00,
        purchaseDate: '2024-02-28',
        expiryDate: '2024-06-28',
        price: 22.00,
        status: 'expiring_soon',
        location: 'Rural Denmark',
        productionMethod: 'Biomass Gasification',
        certificateNumber: 'H2-CRED-2024-003',
        carbonOffset: 1000.00
      },
      {
        id: 4,
        producerName: 'Solar H2 Technologies',
        projectName: 'Desert Solar Hydrogen Farm',
        amount: 150.50,
        purchaseDate: '2024-01-15',
        expiryDate: '2024-01-15',
        price: 24.50,
        status: 'expired',
        location: 'Arizona, USA',
        productionMethod: 'Electrolysis',
        certificateNumber: 'H2-CRED-2024-004',
        carbonOffset: 750.25
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
      case 'expiring_soon':
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
      case 'expiring_soon':
        return <Clock className="w-4 h-4" />;
      case 'expired':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const totalCredits = credits.reduce((sum, credit) => sum + credit.amount, 0);
  const totalValue = credits.reduce((sum, credit) => sum + (credit.amount * credit.price), 0);
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
          <p className="text-gray-600 dark:text-gray-400">Manage and track your purchased hydrogen credits</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <ShoppingCart className="w-4 h-4" />
          <span>Buyer Portal</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Leaf className="w-6 h-6 text-blue-600 dark:text-blue-400" />
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
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalValue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by status:</span>
          <div className="flex space-x-2">
            {['all', 'active', 'expiring_soon', 'expired'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1 text-sm font-medium rounded-md capitalize ${
                  filter === status
                    ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Credits List */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700">
        <div className="p-6 border-b border-gray-200 dark:border-dark-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Purchased Credits</h2>
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
                        <span className="ml-1 capitalize">{credit.status.replace('_', ' ')}</span>
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Producer</p>
                        <p className="font-medium text-gray-900 dark:text-white">{credit.producerName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Amount</p>
                        <p className="font-medium text-gray-900 dark:text-white">{credit.amount} kg</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Price per kg</p>
                        <p className="font-medium text-gray-900 dark:text-white">${credit.price}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Total Value</p>
                        <p className="font-medium text-gray-900 dark:text-white">${(credit.amount * credit.price).toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Production Method</p>
                        <p className="font-medium text-gray-900 dark:text-white">{credit.productionMethod}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Location</p>
                        <p className="font-medium text-gray-900 dark:text-white">{credit.location}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Purchase Date</p>
                        <p className="font-medium text-gray-900 dark:text-white">{credit.purchaseDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Expiry Date</p>
                        <p className="font-medium text-gray-900 dark:text-white">{credit.expiryDate}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Certificate Number</p>
                        <p className="font-medium text-gray-900 dark:text-white">{credit.certificateNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Carbon Offset</p>
                        <p className="font-medium text-gray-900 dark:text-white">{credit.carbonOffset} kg CO2</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-6 flex flex-col space-y-2">
                    <button className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700">
                      View Details
                    </button>
                    <button className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
                      Download Certificate
                    </button>
                    {credit.status === 'active' && (
                      <button className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700">
                        Retire Credits
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Portfolio Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Purchases</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{credits.length}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Price</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              ${(totalValue / totalCredits).toFixed(2)}/kg
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Carbon Offset</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {credits.reduce((sum, credit) => sum + credit.carbonOffset, 0).toFixed(2)} kg CO2
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Expiring Soon</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {credits.filter(credit => credit.status === 'expiring_soon').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCredits; 