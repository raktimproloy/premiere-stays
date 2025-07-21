'use client';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { FiX, FiEdit, FiUser, FiHome, FiCalendar, FiCreditCard } from 'react-icons/fi';

interface Property {
  id: string;
  name: string;
  type: string;
  bathrooms: number;
  bedrooms: number;
  capacity: string;
  price: string;
  status: 'Pending' | 'Occupied' | 'Active';
  listingDate: string;
}

interface PropertyDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
}

const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  isOpen,
  onClose,
  property
}) => {
  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Mock booking data for demonstration
  const mockBooking = {
    person: {
      name: "Rafhim Rafat",
      email: "rafhim.rafat@gmail.com",
      phone: "880 1012754876"
    },
    property: {
      name: property?.name || "Wynwood Townhomes w/Heated Pools",
      location: "Miami, Miami-Dade County, Florida, United States",
      bathrooms: `${property?.bathrooms || 6} Bathroom`,
      bedrooms: `${property?.bedrooms || 6} Bedroom`,
      type: property?.type || "Villa",
      capacity: property?.capacity || "6 Guest",
      extraServices: "Breakfast, Lunch",
      price: property?.price || "$340 (Two Night)"
    },
    paymentMethod: "Paypal",
    applyDate: "10-08-2025"
  };

  if (!isOpen || !property) return null;

  return (
    <>
      {/* Backdrop with fade effect */}
      <div 
        className={`fixed inset-0 z-40 transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            {/* Modal Panel */}
            <div className={`pointer-events-auto w-screen max-w-3xl transform transition ease-in-out duration-300 ${
              isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}>
              <div className="flex h-full flex-col bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={onClose}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      {/* <FiX className="h-5 w-5 text-gray-500" /> */}
                      <img src="/images/icons/back.svg" alt="close" className="h-5 w-5" />
                    </button>
                    <h2 className="text-xl font-semibold text-gray-900">Booking Details</h2>
                  </div>
                  <Link href={`/admin/properties/edit/${property?.id}`} className="flex items-center space-x-2 text-sm px-4 cursor-pointer py-2 rounded-full bg-[#4581FF] text-white">
                    <span>You can edit property</span>
                    <FiEdit className="h-4 w-4" />
                  </Link>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                  <div className="px-6 py-6">
                    {/* Property Images */}
                    <div className="grid grid-cols-4 gap-2 mb-8">
                      {[1, 2, 3, 4].map((index) => (
                        <div key={index} className="aspect-square rounded-2xl overflow-hidden">
                          <img src={`/images/hotel.png`} alt="property" className="h-full w-full object-cover" />
                        </div>
                      ))}
                    </div>

                    {/* Person Details Section */}
                    <div className="mb-6">
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>
                            <td className="text-md font-medium text-gray-700 py-1 pr-4">Person Name:</td>
                            <td className="text-md text-gray-500 py-1">{mockBooking.person.name}</td>
                          </tr>
                          <tr>
                            <td className="text-md font-medium text-gray-700 py-1 pr-4">Person Email ID:</td>
                            <td className="text-md text-gray-500 py-1">{mockBooking.person.email}</td>
                          </tr>
                          <tr>
                            <td className="text-md font-medium text-gray-700 py-1 pr-4">Person Phone:</td>
                            <td className="text-md text-gray-500 py-1">{mockBooking.person.phone}</td>
                          </tr>
                          <tr>
                            <td className="text-md font-medium text-gray-700 py-1 pr-4">Person Name:</td>
                            <td className="text-md text-gray-500 py-1">{mockBooking.person.name}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-dashed border-gray-300 my-6"></div>

                    {/* Property Details Section */}
                    <div>
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr>
                            <td className="text-md font-medium text-gray-700 py-1 pr-4">Property Name:</td>
                            <td className="text-md text-gray-500 py-1">{mockBooking.property.name}</td>
                          </tr>
                          <tr>
                            <td className="text-md font-medium text-gray-700 py-1 pr-4">Property Location:</td>
                            <td className="text-md text-gray-500 py-1">{mockBooking.property.location}</td>
                          </tr>
                          <tr>
                            <td className="text-md font-medium text-gray-700 py-1 pr-4">Bathroom:</td>
                            <td className="text-md text-gray-500 py-1">{mockBooking.property.bathrooms}</td>
                          </tr>
                          <tr>
                            <td className="text-md font-medium text-gray-700 py-1 pr-4">Bedroom:</td>
                            <td className="text-md text-gray-500 py-1">{mockBooking.property.bedrooms}</td>
                          </tr>
                          <tr>
                            <td className="text-md font-medium text-gray-700 py-1 pr-4">Type:</td>
                            <td className="text-md text-gray-500 py-1">{mockBooking.property.type}</td>
                          </tr>
                          <tr>
                            <td className="text-md font-medium text-gray-700 py-1 pr-4">Capacity:</td>
                            <td className="text-md text-gray-500 py-1">{mockBooking.property.capacity}</td>
                          </tr>
                          <tr>
                            <td className="text-md font-medium text-gray-700 py-1 pr-4">Extra Services:</td>
                            <td className="text-md text-gray-500 py-1">{mockBooking.property.extraServices}</td>
                          </tr>
                          <tr>
                            <td className="text-md font-medium text-gray-700 py-1 pr-4">Price:</td>
                            <td className="text-md text-gray-500 py-1">{mockBooking.property.price}</td>
                          </tr>
                          <tr>
                            <td className="text-md font-medium text-gray-700 py-1 pr-4">Payment Method:</td>
                            <td className="text-md text-gray-500 py-1">{mockBooking.paymentMethod}</td>
                          </tr>
                          <tr>
                            <td className="text-md font-medium text-gray-700 py-1 pr-4">Apply Date:</td>
                            <td className="text-md text-gray-500 py-1">{mockBooking.applyDate}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Footer with Action Buttons */}
                <div className="border-t border-gray-200 px-6 py-4">
                  <div className="flex justify-between space-x-3">
                    <button
                      type="button"
                      className="flex-1 px-4 py-2 rounded-full text-sm font-medium text-white bg-[#FF4545] hover:bg-[#FF4545]/80 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors cursor-pointer"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      className="flex-1 px-4 py-2 rounded-full text-sm font-medium text-white bg-[#40C557] hover:bg-[#40C557]/80 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors cursor-pointer"
                    >
                      Approved
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyDetailModal; 