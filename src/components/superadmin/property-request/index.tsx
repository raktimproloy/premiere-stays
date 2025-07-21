'use client'
import React, { useEffect, useState } from 'react';
import { FiEye } from 'react-icons/fi';
import PropertyDetailModal from '@/components/common/PropertyDetailModal';

// Rename local interface to avoid type conflict
interface LocalProperty {
  id: string;
  name?: string;
  type?: string;
  bathrooms?: number;
  bedrooms?: number;
  capacity?: string;
  price?: string;
  status?: string;
  listingDate?: string;
}

const PropertyRequestTable = () => {
  const [properties, setProperties] = useState<LocalProperty[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<LocalProperty[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  useEffect(() => {
    fetch('/data/propertyRequests.json')
      .then((res) => res.json())
      .then((data) => {
        setProperties(data);
        setFilteredProperties(data);
      });
  }, []);

  useEffect(() => {
    let result = [...properties];
    if (statusFilter !== 'All') {
      result = result.filter((property) => property.status === statusFilter);
    }
    setFilteredProperties(result);
  }, [statusFilter, properties]);

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-[#F7B730] text-white';
      case 'Approved':
        return 'bg-[#40C557] text-white';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleOpenModal = (property: LocalProperty) => {
    setSelectedProperty({
      id: property.id,
      name: property.name || '',
      type: property.type || '',
      bathrooms: property.bathrooms ?? 0,
      bedrooms: property.bedrooms ?? 0,
      capacity: property.capacity || '',
      price: property.price || '',
      status: (property.status as 'Pending' | 'Occupied' | 'Active') || 'Pending',
      listingDate: property.listingDate || '',
    });
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProperty(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Property List</h1>
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
              <span className={`px-5 py-2 rounded-full text-sm font-medium ${statusFilter === 'All' ? 'bg-[#40C557] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>All Property List</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="statusFilter"
                checked={statusFilter === 'Pending'}
                onChange={() => setStatusFilter('Pending')}
                className="sr-only"
              />
              <span className={`px-5 py-2 rounded-full text-sm font-medium ${statusFilter === 'Pending' ? 'bg-[#F7B730] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>Pending Property Request</span>
            </label>
          </div>
        </div>
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-5 text-left text-xs font-semibold text-black uppercase tracking-wider">Property Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">Bathroom</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">Bed Room</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">Capacity</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-black uppercase tracking-wider">Listing Date</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-black uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProperties.length > 0 ? (
                  filteredProperties.map((property) => (
                    <tr key={property.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">{property.name || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{property.type || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{property.bathrooms ?? '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{property.bedrooms ?? '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{property.capacity || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{property.price || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-5 py-2 inline-flex text-md leading-5 font-semibold rounded-full ${getStatusBadge(property.status)}`}>{property.status || '-'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{property.listingDate || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleOpenModal(property)}
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
                    <td colSpan={9} className="px-6 py-8 text-center text-gray-500">No property requests found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Property Detail Modal */}
      <PropertyDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        property={selectedProperty}
      />
    </div>
  );
};

export default PropertyRequestTable;
