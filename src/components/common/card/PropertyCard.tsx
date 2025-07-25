'use client'
import Image from 'next/image'
import React from 'react'
import { BathroomIcon, GuestIcon, LocationFillIcon } from '../../../../public/images/svg'
import { BedIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PropertyCard({property}: {property: any}) {
  const router = useRouter();
  return (
    <div 
      onClick={() => router.push(`/book-now/${property.id}`)}
      key={property.id}
      className="bg-white rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
      {/* Property Image with Badge */}
      <div className="relative h-64">
        <div className="absolute inset-0">
            <Image src={property.image} alt={property.title} width={1000} height={1000} />
        </div>
        
        {/* Badge */}
        <div className="absolute top-4 left-0 flex items-center z-20">
          <div className="relative flex items-center h-8">
            <div className="absolute -left-2 bg-[#586DF7] text-white font-bold px-6 py-2 text-xs rounded-r-md flex items-center h-8 z-10">
              {property.badge}
            </div>
            <span className="absolute -left-2 top-6 block w-0 h-0 border-t-8 border-b-8 border-r-10 border-t-transparent border-b-transparent text-[#6C81FF] border-l-[#6C81FF] z-5"></span>
            
          </div>
        </div>
        
        {/* Glass Effect Features Panel */}
        <div className="absolute w-[90%] border-2 border-[#F2F2F23D] mx-auto bottom-3 left-0 right-0 bg-white/10 backdrop-blur-md py-3 px-4 rounded-full">
          <div className="flex justify-between text-white">
            <div className="flex items-center">
              <BedIcon />
              <span>{property.beds} Beds</span>
            </div>
            <div className="flex items-center">
              <BathroomIcon />
              <span>{property.bathrooms} Bath</span>
            </div>
            <div className="flex items-center">
              <GuestIcon />
              <span>{property.guests} Guests</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Property Details */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {property.title}
        </h3>
        <p className="text-gray-600 mb-4 flex items-start ">
          <span className='mr-2 bg-[#586DF71A] p-2 rounded-full'><LocationFillIcon /></span>{property.location}
        </p>
        
        {/* Pricing and Rating */}
        <div className="flex justify-between items-center">
          <div className='flex items-center'>
            <div className="text-xl font-bold text-gray-900">${property.price.toFixed(2)}</div>
            <div className="text-gray-400">/Last minute</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 flex items-center">
                <span>
                <svg  
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 text-yellow-400`} 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                </span>
                <span className='text-black font-bold mx-1'>
                    4.9
                </span>
                ({property.reviews} Reviews)
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}
