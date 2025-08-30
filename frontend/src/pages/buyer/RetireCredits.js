import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { CheckCircle, ShoppingCart, AlertTriangle, Leaf, Calendar, MapPin, TrendingUp } from 'lucide-react';

const RetireCredits = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [availableCredits, setAvailableCredits] = useState([]);
  const [selectedCredits, setSelectedCredits] = useState([]);
  const [retirementReason, setRetirementReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockCredits = [
      {
        id: 1,
        producerName: 'Green Hydrogen Solutions',
        projectName: 'Solar-Powered H2 Production Facility',
        amount: 500.25,
        availableAmount: 500.25,
        purchaseDate: '2024-03-15',
        expiryDate: '2025-03-15',
        price: 25.50,
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
        availableAmount: 150.50,
        purchaseDate: '2024-03-10',
        expiryDate: '2025-03-10',
        price: 28.75,
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
        availableAmount: 200.00,
        purchaseDate: '2024-02-28',
        expiryDate: '2024-06-28',
        price: 22.00,
        location: 'Rural Denmark',
        productionMethod: 'Biomass Gasification',
        certificateNumber: 'H2-CRED-2024-003',
        carbonOffset: 1000.00
      }
    ];

    setTimeout(() => {
      setAvailableCredits(mockCredits);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreditSelection = (creditId, amount) => {
    setSelectedCredits(prev => {
      const existing = prev.find(item => item.creditId === creditId);
      if (existing) {
        return prev.map(item => 
          item.creditId === creditId 
            ? { ...item, amount: Math.min(amount, availableCredits.find(c => c.id === creditId).availableAmount) }
            : item
        );
      } else {
        return [...prev, { creditId, amount: Math.min(amount, availableCredits.find(c => c.id === creditId).availableAmount) }];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedCredits.length === 0 || !retirementReason) {
      setSubmitStatus('error');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setSelectedCredits([]);
      setRetirementReason('');
      
      // Update available amounts
      setAvailableCredits(prev => prev.map(credit => {
        const selected = selectedCredits.find(s => s.creditId === credit.id);
        if (selected) {
          return { ...credit, availableAmount: credit.availableAmount - selected.amount };
        }
        return credit;
      }));
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalSelectedAmount = selectedCredits.reduce((sum, item) => sum + item.amount, 0);
  const totalSelectedValue = selectedCredits.reduce((sum, item) => {
    const credit = availableCredits.find(c => c.id === item.creditId);
    return sum + (item.amount * credit.price);
  }, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading available credits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Retire Credits</h1>
          <p className="text-gray-600 dark:text-gray-400">Permanently retire hydrogen credits to offset your carbon footprint</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <CheckCircle className="w-4 h-4" />
          <span>Buyer Portal</span>
        </div>
      </div>

      {/* Status Messages */}
      {submitStatus === 'success' && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            <div>
              <h3 className="text-sm font-medium text-green-800 dark:text-green-200">Credits Retired Successfully</h3>
              <p className="text-sm text-green-700 dark:text-green-300">Your credits have been permanently retired and cannot be used again.</p>
            </div>
          </div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <div>
              <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Retirement Failed</h3>
              <p className="text-sm text-red-700 dark:text-red-300">Please select credits and provide a retirement reason.</p>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Leaf className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available Credits</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {availableCredits.reduce((sum, credit) => sum + credit.availableAmount, 0).toFixed(2)} kg
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Selected for Retirement</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalSelectedAmount.toFixed(2)} kg</p>
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
              <p className="text-2xl font-bold text-gray-900 dark:text-white">${totalSelectedValue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Available Credits */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700">
        <div className="p-6 border-b border-gray-200 dark:border-dark-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Available Credits for Retirement</h2>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-dark-700">
          {availableCredits.filter(credit => credit.availableAmount > 0).length === 0 ? (
            <div className="p-6 text-center">
              <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No credits available for retirement.</p>
            </div>
          ) : (
            availableCredits
              .filter(credit => credit.availableAmount > 0)
              .map((credit) => {
                const selected = selectedCredits.find(s => s.creditId === credit.id);
                const selectedAmount = selected ? selected.amount : 0;
                
                return (
                  <div key={credit.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {credit.projectName}
                          </h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Available
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Producer</p>
                            <p className="font-medium text-gray-900 dark:text-white">{credit.producerName}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Available Amount</p>
                            <p className="font-medium text-gray-900 dark:text-white">{credit.availableAmount} kg</p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Price per kg</p>
                            <p className="font-medium text-gray-900 dark:text-white">${credit.price}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Carbon Offset</p>
                            <p className="font-medium text-gray-900 dark:text-white">{credit.carbonOffset} kg CO2</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Production Method</p>
                            <p className="font-medium text-gray-900 dark:text-white">{credit.productionMethod}</p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-400">Location</p>
                            <p className="font-medium text-gray-900 dark:text-white">{credit.location}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="ml-6 flex flex-col space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Amount to Retire (kg)
                          </label>
                          <input
                            type="number"
                            min="0"
                            max={credit.availableAmount}
                            step="0.01"
                            value={selectedAmount}
                            onChange={(e) => handleCreditSelection(credit.id, parseFloat(e.target.value) || 0)}
                            className="w-24 px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Value: ${(selectedAmount * credit.price).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      </div>

      {/* Retirement Form */}
      {selectedCredits.length > 0 && (
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700">
          <div className="p-6 border-b border-gray-200 dark:border-dark-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Retirement Details</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Reason for Retirement *
              </label>
              <textarea
                value={retirementReason}
                onChange={(e) => setRetirementReason(e.target.value)}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-700 text-gray-900 dark:text-white"
                placeholder="Please describe why you are retiring these credits..."
              />
            </div>
            
            <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Retirement Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Credits to Retire:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{totalSelectedAmount.toFixed(2)} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Total Value:</span>
                  <span className="font-medium text-gray-900 dark:text-white">${totalSelectedValue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Carbon Offset:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {selectedCredits.reduce((sum, item) => {
                      const credit = availableCredits.find(c => c.id === item.creditId);
                      return sum + (item.amount * credit.carbonOffset / credit.amount);
                    }, 0).toFixed(2)} kg CO2
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Important Notice</h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    Retiring credits is a permanent action. Once retired, these credits cannot be used for trading or other purposes. 
                    This action will permanently remove the credits from circulation and they cannot be recovered.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Retiring Credits...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Retire Credits
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default RetireCredits; 