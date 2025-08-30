import React, { useState, useEffect } from 'react';
import { ShoppingCart, TrendingUp, Search, Eye, Plus, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { marketplaceService } from '../services';
import { useAuth } from '../contexts/AuthContext';

const Marketplace = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await marketplaceService.getAvailableCredits();
      if (response.success) {
        setListings(response.data || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></Loader2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading marketplace...</p>
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
          <button onClick={fetchListings} className="btn-primary flex items-center mx-auto">
            <RefreshCw className="h-4 h-4 mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const filteredListings = listings.filter(listing => 
    listing.projectName?.toLowerCase().includes(search.toLowerCase()) ||
    listing.technology?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Marketplace</h1>
          <p className="text-gray-600 dark:text-gray-400">Buy and sell green hydrogen credits</p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={fetchListings} className="btn-secondary flex items-center space-x-2">
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
          {user?.role === 'producer' && (
            <button className="btn-primary flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Sell Credits</span>
            </button>
          )}
        </div>
      </div>

      <div className="card p-6">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search credits..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="p-6 border-b border-gray-200 dark:border-dark-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Available Credits ({filteredListings.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-dark-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Project</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Credits</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Technology</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-dark-700 divide-y divide-gray-200 dark:divide-dark-600">
              {filteredListings.map((listing) => (
                <tr key={listing._id} className="hover:bg-gray-50 dark:hover:bg-dark-800">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{listing.projectName}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{listing.location}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{listing.amount} credits</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">${listing.pricePerCredit}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200">
                      {listing.technology}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300">
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                      <button className="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredListings.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No credits found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
