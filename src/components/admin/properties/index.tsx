'use client';
import React, { useState, useEffect } from 'react';
import { FiEye, FiPlus, FiChevronLeft, FiChevronRight, FiSearch } from 'react-icons/fi';
import PropertyDetailModal from '@/components/common/PropertyDetailModal';
import Link from 'next/link';

interface Property {
  id: string;
  name: string;
  type?: string;
  property_type?: string;
  bathrooms: number;
  bedrooms: number;
  capacity?: string;
  max_guests?: number;
  price?: string;
  status?: 'Pending' | 'Occupied' | 'Active';
  listingDate?: string;
  active?: boolean;
}

const PropertyRequestList = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  
  const itemsPerPage = 8;
  const totalPages = Math.ceil(total / itemsPerPage);
  
  const openModal = (property: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleReject = () => {
    console.log('Reject clicked');
  };

  const handleApprove = () => {
    console.log('Approve clicked');
  };

  // Utility function to format date as YYYY-MM-DD
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };

  // Fetch properties from API
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/properties?page=${currentPage}&pageSize=${itemsPerPage}`)
      .then(async (res) => {
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to fetch properties');
        }
        return res.json();
      })
      .then((data) => {
        setProperties(data.properties || []);
        setTotal(data.total || 0);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [currentPage]);

  // Filter properties based on status and search term (client-side)
  useEffect(() => {
    let result = [...properties];
    
    // Apply status filter
    if (statusFilter !== 'All') {
      result = result.filter(property => property.status === statusFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(property => 
        property.name.toLowerCase().includes(term) || 
        property.type?.toLowerCase().includes(term) ||
        property.price?.toLowerCase().includes(term)
      );
    }
    
    setFilteredProperties(result);
  }, [statusFilter, searchTerm, properties]);
  
  // Pagination controls
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  // Render pagination buttons
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-1 rounded-md ${
            currentPage === i
              ? 'bg-[#EBA83A] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {i}
        </button>
      );
    }
    
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-1 rounded-md ${
            currentPage === 1
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <FiChevronLeft size={20} />
        </button>
        
        {pages}
        
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-1 rounded-md ${
            currentPage === totalPages
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <FiChevronRight size={20} />
        </button>
        
        <span className="text-sm text-gray-600 ml-2">
          Showing {properties.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} - {Math.min(currentPage * itemsPerPage, total)} of {total} properties
        </span>
      </div>
    );
  };
  
  // Status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-[#F7B730] text-white';
      case 'Occupied':
        return 'bg-[#586DF7] text-white';
      case 'Active':
        return 'bg-[#40C557] text-white';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Property Requests</h1>
          </div>
          
          {/* Search Bar */}
          <div className="mt-4 md:mt-0 md:ml-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-[#EBA83A] focus:border-[#EBA83A] sm:text-sm"
              />
            </div>
          </div>
          
          <div className="mt-4 flex flex-col gap-3 md:flex-row md:gap-3 md:mt-0 w-full md:w-auto">
            <div className="flex gap-3 w-full md:w-auto">
            <label className="flex items-center cursor-pointer w-full md:w-auto">
                <input
                type="radio"
                name="statusFilter"
                checked={statusFilter === 'All'}
                onChange={() => setStatusFilter('All')}
                className="sr-only"
                />
                <span className={`px-5 py-2 rounded-full text-sm font-medium ${
                statusFilter === 'All' 
                    ? 'bg-[#40C557] text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                All Properties
                </span>
            </label>
            
            <label className="flex items-center cursor-pointer w-full md:w-auto">
                <input
                type="radio"
                name="statusFilter"
                checked={statusFilter === 'Pending'}
                onChange={() => setStatusFilter('Pending')}
                className="sr-only"
                />
                <span className={`px-5 py-2 rounded-full text-sm font-medium ${
                statusFilter === 'Pending' 
                    ? 'bg-[#F7B730] text-white ' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}>
                Pending Request
                </span>
            </label>
            </div>
            <Link href="/admin/properties/create"
              className="flex items-center justify-center px-6 py-3 bg-[#586DF7] text-white rounded-full hover:bg-[#d99a34] transition-colors shadow-sm w-full md:w-auto mt-3 md:mt-0"
            >
              <FiPlus className="mr-2 border rounded-full font-bol" />
              Create Property
            </Link>
          </div>
        </div>

        {/* Property Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading properties...</div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">{error}</div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-white">
                  <tr className=''>
                    <th scope="col" className="px-6 py-5 text-left text-xs font-semibold text-black uppercase tracking-wider">
                      Property Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                      Bathroom
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                      Bed room
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                      Capacity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">
                      Listing Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-black uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProperties.length > 0 ? (
                    filteredProperties.map((property) => (
                      <tr key={property.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-700">{property.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-700">{property.type || property.property_type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {property.bathrooms}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {property.bedrooms}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {property.capacity || property.max_guests}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {property.price || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-5 py-2 inline-flex text-md leading-5 font-semibold rounded-full  ${getStatusBadge(property.status || (property.active ? 'Active' : 'Pending'))}`}>
                            {property.status || (property.active ? 'Active' : 'Pending')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {property.listingDate ? formatDate(property.listingDate) : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => openModal(property)}
                            className="text-gray-600 hover:text-[#EBA83A] transition-colors"
                            title="View Details"
                          >
                            <FiEye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                        No properties found matching your filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
          
          {/* Pagination */}
          {!loading && !error && total > itemsPerPage && (
            <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
              {renderPagination()}
            </div>
          )}
        </div>
      </div>

      {/* Property Detail Modal */}
      <PropertyDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        property={selectedProperty as Property | any}
        editUrl={`/admin/properties/edit/${selectedProperty?.id}`}
        editLabel="Edit Property"
        editActive={selectedProperty?.status !== 'Pending'}
        onEditClick={() => { /* custom logic */ }}
        footerActions={[
          { label: 'Reject', active: true, color: '#FF4545', onClick: handleReject },
          { label: 'Approve', active: selectedProperty?.status === 'Pending', color: '#40C557', onClick: handleApprove }
        ]}
      />
    </div>
  );
};

export default PropertyRequestList;