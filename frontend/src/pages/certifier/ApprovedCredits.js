import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { CheckCircle, Download, Eye, Calendar, MapPin, TrendingUp } from 'lucide-react';

const ApprovedCredits = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [approvedCredits, setApprovedCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCredit, setSelectedCredit] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    const mockApprovedCredits = [
      {
        id: 1,
        producerName: 'Green Hydrogen Solutions',
        projectName: 'Solar-Powered H2 Production Facility',
        hydrogenAmount: 2500.75,
        productionMethod: 'Electrolysis',
        location: 'California, USA',
        approvalDate: '2024-03-10',
        certificateNumber: 'H2-CRED-2024-001',
        certifierName: 'Dr. Sarah Johnson',
        validityPeriod: '2 years',
        carbonOffset: 12500.50,
        documents: ['Approval Certificate.pdf', 'Technical Report.pdf', 'Environmental Assessment.pdf']
      },
      {
        id: 2,
        producerName: 'Wind Energy Corp',
        projectName: 'Offshore Wind Hydrogen Project',
        hydrogenAmount: 1800.50,
        productionMethod: 'Electrolysis',
        location: 'North Sea, Netherlands',
        approvalDate: '2024-03-05',
        certificateNumber: 'H2-CRED-2024-002',
        certifierName: 'Prof. Michael Chen',
        validityPeriod: '3 years',
        carbonOffset: 9000.25,
        documents: ['Approval Certificate.pdf', 'Wind Farm Analysis.pdf', 'Safety Assessment.pdf']
      },
      {
        id: 3,
        producerName: 'Biomass Innovations Ltd',
        projectName: 'Agricultural Waste to Hydrogen',
        hydrogenAmount: 950.25,
        productionMethod: 'Biomass Gasification',
        location: 'Rural Denmark',
        approvalDate: '2024-02-28',
        certificateNumber: 'H2-CRED-2024-003',
        certifierName: 'Dr. Emma Wilson',
        validityPeriod: '2 years',
        carbonOffset: 4750.75,
        documents: ['Approval Certificate.pdf', 'Biomass Analysis.pdf', 'Carbon Footprint Report.pdf']
      }
    ];

    setTimeout(() => {
      setApprovedCredits(mockApprovedCredits);
      setLoading(false);
    }, 1000);
  }, []);

  const totalApprovedCredits = approvedCredits.reduce((sum, credit) => sum + credit.hydrogenAmount, 0);
  const totalCarbonOffset = approvedCredits.reduce((sum, credit) => sum + credit.carbonOffset, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading approved credits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Approved Credits</h1>
          <p className="text-gray-600 dark:text-gray-400">View all approved hydrogen production credit certificates</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <CheckCircle className="w-4 h-4" />
          <span>Certifier Portal</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Approved</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{approvedCredits.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Hydrogen</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalApprovedCredits.toFixed(2)} kg</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Carbon Offset</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCarbonOffset.toFixed(2)} kg CO2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Approved Credits List */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700">
        <div className="p-6 border-b border-gray-200 dark:border-dark-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Approved Certificates</h2>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-dark-700">
          {approvedCredits.length === 0 ? (
            <div className="p-6 text-center">
              <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">No approved credits found.</p>
            </div>
          ) : (
            approvedCredits.map((credit) => (
              <div key={credit.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {credit.projectName}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approved
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Producer</p>
                        <p className="font-medium text-gray-900 dark:text-white">{credit.producerName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Hydrogen Amount</p>
                        <p className="font-medium text-gray-900 dark:text-white">{credit.hydrogenAmount} kg</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Production Method</p>
                        <p className="font-medium text-gray-900 dark:text-white">{credit.productionMethod}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Location</p>
                        <p className="font-medium text-gray-900 dark:text-white">{credit.location}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Certificate Number</p>
                        <p className="font-medium text-gray-900 dark:text-white">{credit.certificateNumber}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Approval Date</p>
                        <p className="font-medium text-gray-900 dark:text-white">{credit.approvalDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Certifier</p>
                        <p className="font-medium text-gray-900 dark:text-white">{credit.certifierName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Validity Period</p>
                        <p className="font-medium text-gray-900 dark:text-white">{credit.validityPeriod}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-gray-600 dark:text-gray-400">Carbon Offset</p>
                      <p className="font-medium text-gray-900 dark:text-white">{credit.carbonOffset} kg CO2</p>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-gray-600 dark:text-gray-400 mb-2">Documents</p>
                      <div className="flex flex-wrap gap-2">
                        {credit.documents.map((doc, index) => (
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
                        setSelectedCredit(credit);
                        setShowModal(true);
                      }}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </button>
                    <button className="inline-flex items-center px-3 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary-600 hover:bg-primary-700">
                      <Download className="w-4 h-4 mr-2" />
                      Download Certificate
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showModal && selectedCredit && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <div className="inline-block align-bottom bg-white dark:bg-dark-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Certificate Details: {selectedCredit.certificateNumber}
                </h3>
              </div>
              
              <div className="px-6 py-4 max-h-96 overflow-y-auto">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Project Information</h4>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Project Name</p>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedCredit.projectName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Producer</p>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedCredit.producerName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</p>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedCredit.location}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Production Method</p>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedCredit.productionMethod}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Credit Details</h4>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Hydrogen Amount</p>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedCredit.hydrogenAmount} kg</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Carbon Offset</p>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedCredit.carbonOffset} kg CO2</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Validity Period</p>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedCredit.validityPeriod}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Approval Date</p>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedCredit.approvalDate}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Certification Details</h4>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Certificate Number</p>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedCredit.certificateNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Certifier</p>
                        <p className="text-sm text-gray-900 dark:text-white">{selectedCredit.certifierName}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Available Documents</h4>
                    <div className="mt-2 space-y-2">
                      {selectedCredit.documents.map((doc, index) => (
                        <button
                          key={index}
                          className="flex items-center w-full px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 rounded-md"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          {doc}
                        </button>
                      ))}
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
                  Download Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovedCredits; 