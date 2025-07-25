import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { FaStar, FaTimes } from 'react-icons/fa';

interface BookingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  property?: any;
}

const dummyProperty = {
  name: 'Wynwood Townhomes w/Heated Pools',
  location: 'Miami, Miami-Dade County, Florida, United States',
  bedrooms: 4,
  bathrooms: 6,
  type: 'Cabin',
  capacity: '4 Guests',
  payment: 'Credit Card',
  services: ['Breakfast', 'Lunch', 'Dinner'],
  price: 175,
  rating: 4.9,
  reviews: 28,
  applyDate: '10-10-2025',
  images: [
    '/images/property.png',
    '/images/property.png',
    '/images/property.png',
    '/images/property.png',
  ],
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem in velit sed enim pharetra aliquet. Etiam euismod, urna eu tincidunt consectetur, nisi nisl aliquam enim, nec dictum ex enim euismod enim. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Integer euismod, urna eu tincidunt consectetur, nisi nisl aliquam enim, nec dictum ex enim euismod enim.',
};

const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({ isOpen, onClose, property }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const data = property || dummyProperty;

  // Close on Esc
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/30 backdrop-blur-sm">
      {/* Modal Panel */}
      <div
        ref={modalRef}
        className="relative bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col animate-fadeIn"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <FaTimes className="h-5 w-5" />
            </button>
            <span className="text-lg font-semibold text-gray-900">Booking Details</span>
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {/* Images Carousel */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
            {data.images.map((img: string, idx: number) => (
              <div key={idx} className="aspect-square rounded-2xl overflow-hidden">
                <Image src={img} alt="property" width={200} height={200} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
          {/* Property Details Table */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mb-6 text-sm">
            <div className="flex flex-col gap-1">
              <span className="font-medium text-gray-700">Property Name:</span>
              <span className="text-gray-500">{data.name}</span>
              <span className="font-medium text-gray-700 mt-2">Property Location:</span>
              <span className="text-gray-500">{data.location}</span>
              <span className="font-medium text-gray-700 mt-2">Bedroom:</span>
              <span className="text-gray-500">{data.bedrooms}</span>
              <span className="font-medium text-gray-700 mt-2">Bathroom:</span>
              <span className="text-gray-500">{data.bathrooms}</span>
              <span className="font-medium text-gray-700 mt-2">Type:</span>
              <span className="text-gray-500">{data.type}</span>
              <span className="font-medium text-gray-700 mt-2">Capacity:</span>
              <span className="text-gray-500">{data.capacity}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-medium text-gray-700">Payment Method:</span>
              <span className="text-gray-500">{data.payment}</span>
              <span className="font-medium text-gray-700 mt-2">Extra Services:</span>
              <span className="text-gray-500">{data.services.join(', ')}</span>
              <span className="font-medium text-gray-700 mt-2">Price:</span>
              <span className="text-gray-500">${data.price.toFixed(2)} /Night</span>
              <span className="font-medium text-gray-700 mt-2">Rating:</span>
              <span className="flex items-center gap-1 text-gray-500">
                <FaStar className="text-yellow-400" />
                {data.rating} <span className="ml-1 text-xs text-gray-400">({data.reviews} Reviews)</span>
              </span>
              <span className="font-medium text-gray-700 mt-2">Apply Date:</span>
              <span className="text-gray-500">{data.applyDate}</span>
            </div>
          </div>
          {/* Description */}
          <div className="mt-6">
            <span className="font-medium text-gray-700 block mb-2">Description</span>
            <div className="bg-gray-50 border rounded-lg p-4 max-h-40 overflow-y-auto text-gray-600 text-sm">
              {data.description}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsModal; 