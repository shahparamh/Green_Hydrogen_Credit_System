import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { FileText, Search, Filter, Download, Eye, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const AllTransactions = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockTransactions = [
      {
        id: 1,
        type: 'credit_mint',
        producerName: 'Green Hydrogen Solutions',
        buyerName: 'Energy Corp',
        amount: 500.25,
        price: 25.50,
        timestamp: '2024-03-15T10:30:00Z',
        status: 'completed',
        transactionHash: '0x1234567890abcdef...',
        blockNumber: 12345678,
        gasUsed: 150000,
        carbonOffset: 2500.75,
        description: 'Credit minting for Solar Hydrogen Farm project'
      },
      {
        id: 2,
        type: 'credit_transfer',
        producerName: 'Wind Energy Corp',
        buyerName: 'Industrial Manufacturing Ltd',
        amount: 300.75,
        price: 28.75,
        timestamp: '2024-03-14T15:45:00Z',
        status: 'completed',
        transactionHash: '0xabcdef1234567890...',
        blockNumber: 12345677,
        gasUsed: 120000,
        carbonOffset: 1500.50,
        description: 'Credit transfer between verified parties'
      },
      {
        id: 3,
        type: 'credit_retirement',
        producerName: 'Biomass Innovations Ltd',
        buyerName: 'Carbon Offset Corp',
        amount: 200.00,
        price: 22.00,
        timestamp: '2024-03-13T09:15:00Z',
        status: 'completed',
        transactionHash: '0x7890abcdef123456...',
        blockNumber: 12345676,
        gasUsed: 100000,
        carbonOffset: 1000.00,
        description: 'Credit retirement for environmental offset'
      },
      {
        id: 4,
        type: 'credit_mint',
        producerName: 'Solar H2 Technologies',
        buyerName: 'Green Energy Fund',
        amount: 150.50,
        price: 24.50,
        timestamp: '2024-03-12T14:20:00Z',
        status: 'pending',
        transactionHash: '0x4567890abcdef123...',
        blockNumber: 12345675,
        gasUsed: 80000,
        carbonOffset: 750.25,
        description: 'Credit minting for Desert Solar project'
      },
      {
        id: 5,
        type: 'credit_transfer',
        producerName: 'Ocean Energy Systems',
        buyerName: 'Marine Transport Co',
        amount: 100.00,
        price: 26.00,
        timestamp: '2024-03-11T11:30:00Z',
        status: 'failed',
        transactionHash: '0xdef1234567890abc...',
        blockNumber: 12345674,
        gasUsed: 95000,
        carbonOffset: 500.00,
        description: 'Failed credit transfer due to insufficient balance'
      }
    ];

    setTimeout(() => {
      setTransactions(mockTransactions);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.producerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.transactionHash.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || transaction.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20';
      case 'failed':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'failed':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'credit_mint':
        return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20';
      case 'credit_transfer':
        return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20';
      case 'credit_retirement':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const totalTransactions = transactions.length;
  const completedTransactions = transactions.filter(t => t.status === 'completed').length;
  const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalValue = transactions.reduce((sum, t) => sum + (t.amount * t.price), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Transactions</h1>
          <p className="text-gray-600 dark:text-gray-400">Monitor and audit all hydrogen credit transactions</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <FileText className="w-4 h-4" />
          <span>Auditor Portal</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalTransactions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{completedTransactions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Volume</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalVolume.toFixed(2)} kg</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <FileText className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalValue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by status:</span>
            <div className="flex space-x-2">
              {['all', 'completed', 'pending', 'failed'].map((status) => (
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
      </div>

      {/* Transactions List */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700">
        <div className="p-6 border-b border-gray-200 dark:border-dark-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Transaction History</h2>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-dark-700">
          {filteredTransactions.length === 0 ? (
            <div className="p-6 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No transactions found.</p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {transaction.description}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(transaction.type)}`}>
                        {transaction.type.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {getStatusIcon(transaction.status)}
                        <span className="ml-1 capitalize">{transaction.status}</span>
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Producer</p>
                        <p className="font-medium text-gray-900 dark:text-white">{transaction.producerName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Buyer</p>
                        <p className="font-medium text-gray-900 dark:text-white">{transaction.buyerName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Amount</p>
                        <p className="font-medium text-gray-900 dark:text-white">{transaction.amount} kg</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Price</p>
                        <p className="font-medium text-gray-900 dark:text-white">${transaction.price}/kg</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Transaction Hash</p>
                        <p className="font-medium text-gray-900 dark:text-white font-mono text-xs">
                          {transaction.transactionHash.substring(0, 20)}...
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Block Number</p>
                        <p className="font-medium text-gray-900 dark:text-white">{transaction.blockNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Gas Used</p>
                        <p className="font-medium text-gray-900 dark:text-white">{transaction.gasUsed.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Timestamp</p>
                        <p className="font-medium text-gray-900 dark:text-white">{formatTimestamp(transaction.timestamp)}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-gray-600 dark:text-gray-400">Carbon Offset</p>
                      <p className="font-medium text-gray-900 dark:text-white">{transaction.carbonOffset} kg CO2</p>
                    </div>
                  </div>
                  
                  <div className="ml-6 flex flex-col space-y-2">
                    <button
                      onClick={() => {
                        setSelectedTransaction(transaction);
                        setShowModal(true);
                      }}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </button>
                    <button className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Transaction Details Modal */}
      {showModal && selectedTransaction && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <div className="inline-block align-bottom bg-white dark:bg-dark-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Transaction Details: {selectedTransaction.transactionHash.substring(0, 20)}...
                </h3>
              </div>
              
              <div className="px-6 py-4 max-h-96 overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Transaction Information</h4>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Type</p>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedTransaction.type.replace('_', ' ').toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</p>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedTransaction.status}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Amount</p>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedTransaction.amount} kg</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Price</p>
                        <p className="text-sm text-gray-900 dark:text-white">${selectedTransaction.price}/kg</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Parties Involved</h4>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Producer</p>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedTransaction.producerName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Buyer</p>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedTransaction.buyerName}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Blockchain Details</h4>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Transaction Hash</p>
                        <p className="text-sm text-gray-900 dark:text-white font-mono">{selectedTransaction.transactionHash}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Block Number</p>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedTransaction.blockNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Gas Used</p>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedTransaction.gasUsed.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Timestamp</p>
                        <p className="text-sm text-gray-900 dark:text-white">{formatTimestamp(selectedTransaction.timestamp)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Environmental Impact</h4>
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Carbon Offset</p>
                      <p className="text-sm text-gray-900 dark:text-white">{selectedTransaction.carbonOffset} kg CO2</p>
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
                <button className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
                  Export Transaction
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllTransactions; 