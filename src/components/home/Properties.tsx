// components/FeaturedPropertiesSection.tsx
import Image from 'next/image';
import React from 'react';
import { BathroomIcon, BedIcon, GuestIcon, LocationFillIcon, LocationIcon } from '../../../public/images/svg';
import PropertyCard from '../common/card/PropertyCard';

const FeaturedPropertiesSection = () => {
    const propertyImage1 = '/images/property.png';
  const properties = [
    {
      id: 1,
      title: "Design District Guesthouse - 2Bdrms",
      location: "Miami, Miami-Dade County, Florida, United States",
      image: propertyImage1,
      beds: 2,
      bathrooms: 1,
      guests: 4,
      price: 50.00,
      discountPrice: 49.00,
      badge: "FOR RENT",
      rating: 4.8,
      reviews: 28
    },
    {
      id: 2,
      title: "Design District Guesthouse - 2Bdrms",
      location: "Miami, Miami-Dade County, Florida, United States",
      image: propertyImage1,
      beds: 2,
      bathrooms: 1,
      guests: 4,
      price: 50.00,
      discountPrice: 49.00,
      badge: "FOR RENT",
      rating: 4.9,
      reviews: 12
    },
    {
      id: 3,
      title: "Design District Guesthouse - 2Bdrms",
      location: "Miami, Miami-Dade County, Florida, United States",
      image: propertyImage1,
      beds: 2,
      bathrooms: 1,
      guests: 4,
      price: 50.00,
      discountPrice: 49.00,
      badge: "FOR RENT",
      rating: 4.7,
      reviews: 35
    }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with button on right */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 sm:mb-10 md:mb-12">
          <div className="mb-6 lg:mb-0 w-full lg:w-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
              Explore Our Featured Properties
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-xl">
              Properties that combine exceptional style, prime locations & outstanding value.
            </p>
          </div>
          <button className="w-full sm:w-auto flex items-center justify-center bg-[#F7B730] text-black font-bold py-3 px-4 sm:px-6 rounded-full shadow-lg transition-all duration-300 hover:bg-[#e6a825] hover:shadow-xl active:scale-95 text-sm sm:text-base">
            <span>Discover More</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Property Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedPropertiesSection;