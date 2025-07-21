'use client';
import React, { useState, useEffect } from 'react';
import { FiEye } from 'react-icons/fi';
import BusinessRequestDetailModal, { BusinessRequestDetail } from './BusinessRequestDetailModal';

interface BusinessRequest {
  id: string;
  personName: string;
  email: string;
  phone: string;
  document: string;
  requestStatus: 'Pending' | 'Approved';
  applyDate: string;
}

const BusinessRequestList = () => {
  const [requests, setRequests] = useState<BusinessRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<BusinessRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedRequest, setSelectedRequest] = useState<BusinessRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Mock data from image
  useEffect(() => {
    const mockData: BusinessRequest[] = [
      { id: '1', personName: 'MD Siam', email: 'mdsiam@gmail.com', phone: '880 1877787843', document: 'Submitted', requestStatus: 'Pending', applyDate: '2025-06-30' },
      { id: '2', personName: 'MD Rahat', email: 'mdsiam@gmail.com', phone: '880 1877787843', document: '2025-06-30', requestStatus: 'Approved', applyDate: '2025-06-30' },
      { id: '3', personName: 'Rifat Hassan', email: 'mdsiam@gmail.com', phone: '880 1877787843', document: '2025-07-10', requestStatus: 'Pending', applyDate: '2025-07-10' },
      { id: '4', personName: 'Hasib ali', email: 'mdsiam@gmail.com', phone: '880 1877787843', document: '2025-07-05', requestStatus: 'Pending', applyDate: '2025-07-05' },
      { id: '5', personName: 'Sbbir Rahman', email: 'mdsiam@gmail.com', phone: '880 1877787843', document: '2025-06-30', requestStatus: 'Pending', applyDate: '2025-06-30' },
    ];
    setRequests(mockData);
    setFilteredRequests(mockData);
  }, []);

  useEffect(() => {
    let result = [...requests];
    if (statusFilter !== 'All') {
      result = result.filter(request => request.requestStatus === statusFilter);
    }
    setFilteredRequests(result);
  }, [statusFilter, requests]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-[#F7B730] text-white';
      case 'Approved':
        return 'bg-[#2ECC71] text-white';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handler for opening modal with details
  const handleOpenModal = (request: BusinessRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  // Map BusinessRequest to BusinessRequestDetail for modal
  const mapToDetail = (request: BusinessRequest | null): BusinessRequestDetail | null => {
    if (!request) return null;
    return {
      id: request.id,
      personName: request.personName,
      email: request.email,
      phone: request.phone,
      requestDate: request.applyDate,
      totalPropertyListing: '112 List', // mock value
      revenueGenerated: '$456663', // mock value
      documentation: [
        { label: 'NID Card' },
        { label: 'Driving License' },
        { label: 'Income Proof' }
      ]
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Business Request List</h1>
          </div>
          <div className="mt-4 flex gap-3 md:mt-0">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="statusFilter"
                checked={statusFilter === 'All'}
                onChange={() => setStatusFilter('All')}
                className="sr-only"
              />
              <span className={`px-5 py-2 rounded-full text-sm font-medium ${statusFilter === 'All' ? 'bg-[#2ECC71] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>All Business User</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="statusFilter"
                checked={statusFilter === 'Pending'}
                onChange={() => setStatusFilter('Pending')}
                className="sr-only"
              />
              <span className={`px-5 py-2 rounded-full text-sm font-medium ${statusFilter === 'Pending' ? 'bg-[#F7B730] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Pending Request</span>
            </label>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-5 text-left text-xs font-semibold text-black uppercase tracking-wider">Business User Na...</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">Email address</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">Phone No</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">Document...</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">Request St...</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">Apply Date</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-black uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.length > 0 ? (
                  filteredRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{request.personName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{request.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{request.phone}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{request.document === 'Submitted' ? <span className="inline-flex items-center">Submitted <span className="ml-1 text-green-500">&#10003;</span></span> : request.document}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-5 py-2 inline-flex text-md leading-5 font-semibold rounded-full ${getStatusBadge(request.requestStatus)}`}>{request.requestStatus}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{request.applyDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleOpenModal(request)}
                          className="text-gray-600 hover:text-[#EBA83A] transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <FiEye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">No requests found matching your filters</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Business Request Detail Modal */}
      <BusinessRequestDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        request={mapToDetail(selectedRequest)}
      />
    </div>
  );
};

export default BusinessRequestList;
