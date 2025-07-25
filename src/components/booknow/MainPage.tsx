'use client'
import Breadcrumb from '@/components/common/Breadcrumb'
import PropertyCard from '@/components/common/card/PropertyCard';
import DefaultLayout from '@/components/layout/DefaultLayout'
import React, { useState } from 'react'

const propertyImage1 = '/images/property.png';
const properties = [
  {
    id: 1,
    title: "Design District Guesthouse - 2Bdrms1",
    location: "Miami, Miami-Dade County, Florida, United States",
    image: propertyImage1,
    beds: 1,
    bathrooms: 1,
    guestType: 'Adult',
    persons: 2,
    roomType: 'Private Room',
    facilities: ['Wi-Fi', 'Parking', 'Laundry'],
    price: 120,
    discountPrice: 110,
    badge: "FOR RENT",
    rating: 4.8,
    reviews: 28
  },
  {
    id: 2,
    title: "Design District Guesthouse - 2Bdrms2",
    location: "Miami, Miami-Dade County, Florida, United States",
    image: propertyImage1,
    beds: 2,
    bathrooms: 2,
    guestType: 'Youth',
    persons: 4,
    roomType: 'Entire Unit',
    facilities: ['Wi-Fi', 'AC', 'Kitchen Access', 'Private Bathroom'],
    price: 300,
    discountPrice: 290,
    badge: "FOR RENT",
    rating: 4.9,
    reviews: 12
  },
  {
    id: 3,
    title: "Design District Guesthouse - 2Bdrms3",
    location: "Miami, Miami-Dade County, Florida, United States",
    image: propertyImage1,
    beds: 1,
    bathrooms: 1,
    guestType: 'Children',
    persons: 1,
    roomType: 'Shared Room',
    facilities: ['Wi-Fi', 'Pet-Friendly', 'Parking'],
    price: 80,
    discountPrice: 75,
    badge: "FOR RENT",
    rating: 4.7,
    reviews: 35
  },
  {
    id: 4,
    title: "Design District Guesthouse - 2Bdrms4",
    location: "Miami, Miami-Dade County, Florida, United States",
    image: propertyImage1,
    beds: 2,
    bathrooms: 2,
    guestType: 'Adult',
    persons: 2,
    roomType: 'Entire Unit',
    facilities: ['Wi-Fi', 'Parking', 'Furnished', 'Laundry'],
    price: 350,
    discountPrice: 340,
    badge: "FOR RENT",
    rating: 4.8,
    reviews: 28
  },
  {
    id: 5,
    title: "Design District Guesthouse - 2Bdrms5",
    location: "Miami, Miami-Dade County, Florida, United States",
    image: propertyImage1,
    beds: 1,
    bathrooms: 2,
    guestType: 'Youth',
    persons: 1,
    roomType: 'Private Room',
    facilities: ['Wi-Fi', 'AC', 'Parking', 'Private Bathroom'],
    price: 200,
    discountPrice: 180,
    badge: "FOR RENT",
    rating: 4.9,
    reviews: 12
  },
  {
    id: 6,
    title: "Design District Guesthouse - 2Bdrms6",
    location: "Miami, Miami-Dade County, Florida, United States",
    image: propertyImage1,
    beds: 2,
    bathrooms: 1,
    guestType: 'Children',
    persons: 4,
    roomType: 'Shared Room',
    facilities: ['Wi-Fi', 'Pet-Friendly', 'Parking', 'Furnished'],
    price: 150,
    discountPrice: 140,
    badge: "FOR RENT",
    rating: 4.7,
    reviews: 35
  }
];

const ROOM_TYPES = ['Private Room', 'Shared Room', 'Entire Unit'];
const BED_TYPES = ['Single Bed', 'Double Bed'];
const BATHROOMS = ['Single Bathroom', 'Double Bathroom'];
const GUESTS = ['Adult', 'Youth', 'Children'];
const PERSONS = ['One Person', 'Two Person', 'Four Person'];
const FACILITIES = ['Wi-Fi', 'Pet-Friendly', 'AC', 'Laundry', 'Kitchen Access', 'Private Bathroom', 'Parking', 'Furnished'];

const PROPERTIES_PER_PAGE = 3;
export default function MainPage() {

    const [showFilters, setShowFilters] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedRoomTypes, setSelectedRoomTypes] = useState<string[]>([]);
    const [selectedBeds, setSelectedBeds] = useState<string[]>([]);
    const [selectedBathrooms, setSelectedBathrooms] = useState<string[]>([]);
    const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
    const [selectedPersons, setSelectedPersons] = useState<string[]>([]);
    const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 400]);
  
    // Filtering logic
    const filteredProperties = properties.filter((property) => {
      // Room Type
      if (selectedRoomTypes.length && !selectedRoomTypes.includes(property.roomType)) return false;
      // Beds (1 or 2)
      if (selectedBeds.length && !selectedBeds.includes(property.beds === 1 ? 'Single Bed' : 'Double Bed')) return false;
      // Bathrooms (1 or 2)
      if (selectedBathrooms.length && !selectedBathrooms.includes(property.bathrooms === 1 ? 'Single Bathroom' : 'Double Bathroom')) return false;
      // Guest
      if (selectedGuests.length && !selectedGuests.includes(property.guestType)) return false;
      // Persons
      if (selectedPersons.length && !selectedPersons.includes(property.persons === 1 ? 'One Person' : property.persons === 2 ? 'Two Person' : 'Four Person')) return false;
      // Facilities
      if (selectedFacilities.length && !selectedFacilities.every(fac => property.facilities.includes(fac))) return false;
      // Price
      if (property.price < priceRange[0] || property.price > priceRange[1]) return false;
      return true;
    });
  
    const totalPages = Math.ceil(filteredProperties.length / PROPERTIES_PER_PAGE);
    const paginatedProperties = filteredProperties.slice(
      (currentPage - 1) * PROPERTIES_PER_PAGE,
      currentPage * PROPERTIES_PER_PAGE
    );
  
    // Handlers for checkboxes
    const handleCheckbox = (setter: React.Dispatch<React.SetStateAction<string[]>>, value: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setter((prev) =>
        e.target.checked ? [...prev, value] : prev.filter((v) => v !== value)
      );
    };
    // Handler for price range
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
      const val = Number(e.target.value);
      setPriceRange((prev) => idx === 0 ? [val, prev[1]] : [prev[0], val]);
    };
    // Clear all filters
    const clearAll = () => {
      setSelectedRoomTypes([]);
      setSelectedBeds([]);
      setSelectedBathrooms([]);
      setSelectedGuests([]);
      setSelectedPersons([]);
      setSelectedFacilities([]);
      setPriceRange([0, 400]);
    };
  return (
    <>
    {/* Properties Header Section */}
    <div className="flex flex-col max-w-6xl mx-auto md:flex-row justify-between items-center mt-8 mb-6 gap-4">
        <div className="text-lg font-medium text-gray-800">
          <span className="font-semibold">{(currentPage - 1) * PROPERTIES_PER_PAGE + 1}</span> - <span className="font-semibold">{Math.min(currentPage * PROPERTIES_PER_PAGE, filteredProperties.length)}</span> of <span className="font-semibold">{filteredProperties.length}</span> Properties
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-sm">Sort By:</span>
          {/* <select className="border border-gray-300 rounded-full px-4 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200">
            <option>Newest</option>
            <option>Price (Low to High)</option>
            <option>Price (High to Low)</option>
          </select> */}
          <button
            className="ml-2 border border-gray-300 rounded-full px-6 py-2 text-sm text-gray-700 hover:bg-gray-100 transition flex items-center"
            onClick={() => setShowFilters(!showFilters)}
          >
            More Filters
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex">
        {/* Sidebar Filter Panel */}
        {showFilters && (
          <div className="w-full sm:w-80 bg-white border border-gray-200 rounded-xl shadow-lg p-6 mr-8 relative z-20">
            <div className="flex justify-between items-center mb-4">
              <div className="font-semibold text-lg">Filter by</div>
              <button className="text-blue-500 text-sm" onClick={clearAll}>Clear all</button>
            </div>
            {/* Room Type */}
            <div className="mb-4">
              <div className="font-semibold text-sm mb-2">Room Type</div>
              {ROOM_TYPES.map((type) => (
                <div key={type} className="flex items-center mb-1">
                  <input type="checkbox" checked={selectedRoomTypes.includes(type)} onChange={handleCheckbox(setSelectedRoomTypes, type)} className="mr-2" />
                  <span className="text-sm">{type}</span>
                </div>
              ))}
            </div>
            {/* Beds */}
            <div className="mb-4">
              <div className="font-semibold text-sm mb-2">Beds</div>
              {BED_TYPES.map((type) => (
                <div key={type} className="flex items-center mb-1">
                  <input type="checkbox" checked={selectedBeds.includes(type)} onChange={handleCheckbox(setSelectedBeds, type)} className="mr-2" />
                  <span className="text-sm">{type}</span>
                </div>
              ))}
            </div>
            {/* Bathrooms */}
            <div className="mb-4">
              <div className="font-semibold text-sm mb-2">Bathrooms</div>
              {BATHROOMS.map((type) => (
                <div key={type} className="flex items-center mb-1">
                  <input type="checkbox" checked={selectedBathrooms.includes(type)} onChange={handleCheckbox(setSelectedBathrooms, type)} className="mr-2" />
                  <span className="text-sm">{type}</span>
                </div>
              ))}
            </div>
            {/* Guest */}
            <div className="mb-4">
              <div className="font-semibold text-sm mb-2">Guest</div>
              {GUESTS.map((type) => (
                <div key={type} className="flex items-center mb-1">
                  <input type="checkbox" checked={selectedGuests.includes(type)} onChange={handleCheckbox(setSelectedGuests, type)} className="mr-2" />
                  <span className="text-sm">{type}</span>
                </div>
              ))}
            </div>
            {/* Persons */}
            <div className="mb-4">
              <div className="font-semibold text-sm mb-2">Persons</div>
              {PERSONS.map((type) => (
                <div key={type} className="flex items-center mb-1">
                  <input type="checkbox" checked={selectedPersons.includes(type)} onChange={handleCheckbox(setSelectedPersons, type)} className="mr-2" />
                  <span className="text-sm">{type}</span>
                </div>
              ))}
            </div>
            {/* Facilities */}
            <div className="mb-4">
              <div className="font-semibold text-sm mb-2">Facilities</div>
              {FACILITIES.map((type) => (
                <div key={type} className="flex items-center mb-1">
                  <input type="checkbox" checked={selectedFacilities.includes(type)} onChange={handleCheckbox(setSelectedFacilities, type)} className="mr-2" />
                  <span className="text-sm">{type}</span>
                </div>
              ))}
            </div>
            {/* Price Range */}
            <div className="mb-4">
              <div className="font-semibold text-sm mb-2">Price range</div>
              <div className="flex flex-col sm:flex-row items-center justify-between mb-2 gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Min</span>
                  <input
                    type="number"
                    min={0}
                    max={priceRange[1]}
                    value={priceRange[0]}
                    onChange={e => {
                      const val = Math.min(Number(e.target.value), priceRange[1]);
                      setPriceRange([val, priceRange[1]]);
                    }}
                    className="w-16 px-2 py-1 border border-gray-200 rounded text-xs text-center focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
                <span className="mx-2 text-gray-400 hidden sm:inline">—</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Max</span>
                  <input
                    type="number"
                    min={priceRange[0]}
                    max={400}
                    value={priceRange[1]}
                    onChange={e => {
                      const val = Math.max(Number(e.target.value), priceRange[0]);
                      setPriceRange([priceRange[0], val]);
                    }}
                    className="w-16 px-2 py-1 border border-gray-200 rounded text-xs text-center focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>
              <div className="relative flex items-center">
                {/* Min slider */}
                <input
                  type="range"
                  min={0}
                  max={priceRange[1]}
                  value={priceRange[0]}
                  onChange={e => {
                    const val = Math.min(Number(e.target.value), priceRange[1]);
                    setPriceRange([val, priceRange[1]]);
                  }}
                  className="w-full accent-yellow-400"
                  style={{ zIndex: priceRange[0] > 0 ? 2 : 1 }}
                />
                {/* Max slider */}
                <input
                  type="range"
                  min={priceRange[0]}
                  max={400}
                  value={priceRange[1]}
                  onChange={e => {
                    const val = Math.max(Number(e.target.value), priceRange[0]);
                    setPriceRange([priceRange[0], val]);
                  }}
                  className="w-full accent-yellow-400 absolute left-0 top-0"
                  style={{ zIndex: 1 }}
                  tabIndex={-1}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>$0</span>
                <span>$400</span>
              </div>
            </div>
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl" onClick={() => setShowFilters(false)}>&times;</button>
          </div>
        )}
        {/* Property Grid */}
        <div className={`flex-1 transition-all duration-300 ${showFilters ? 'md:w-2/3' : 'md:w-full'}`}>
          <div className={`grid grid-cols-1 ${showFilters ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6`}>
            {paginatedProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </div>
      {/* Pagination */}
      <div className="flex justify-center my-20">
        <nav className="flex items-center gap-4">
          {/* Left Arrow */}
          <button
            className={`w-10 h-10 rounded-full border ${currentPage === 1 ? 'border-blue-100 text-blue-200 cursor-not-allowed' : 'border-blue-100 text-blue-500 hover:bg-blue-50'}`}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            &larr;
          </button>
          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`w-10 h-10 rounded-full border border-blue-100 text-blue-500 font-semibold ${currentPage === page ? 'bg-yellow-400 text-white' : 'bg-white hover:bg-blue-50'}`}
              onClick={() => setCurrentPage(page)}
            >
              {page.toString().padStart(2, '0')}
            </button>
          ))}
          {/* Right Arrow */}
          <button
            className={`w-10 h-10 rounded-full border ${currentPage === totalPages ? 'border-blue-100 text-blue-200 cursor-not-allowed' : 'border-blue-100 text-blue-500 hover:bg-blue-50'}`}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            &rarr;
          </button>
        </nav>
      </div>
    </>
  )
}
