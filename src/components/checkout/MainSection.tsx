'use client'
import Image from 'next/image';
import React, { useState } from 'react';
import { LocationFillIcon } from '../../../public/images/svg';
import { CalendarIcon } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { ProfileIcon } from '../../../public/images/svg';
import { useRef } from 'react';
import { FaArrowRight } from 'react-icons/fa';
const propertyImage1 = '/images/property.png';
const MainSection = () => {
  const [selectedAddress, setSelectedAddress] = useState('zahidul');
  const [newAddress, setNewAddress] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [email, setEmail] = useState('');
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [suppressClose, setSuppressClose] = useState(false);
  const checkInRef = useRef<DatePicker>(null);
  const checkOutRef = useRef<DatePicker>(null);
  const guestsRef = useRef<HTMLDivElement>(null);

  

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAddress(e.target.value);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
    alert('Address saved successfully!');
    setNewAddress(false);
  };

  const handleCheckInSelect = (date: Date | null) => {
    setCheckInDate(date);
  };

  const handleCheckOutSelect = (date: Date | null) => {
    setCheckOutDate(date);
  };

  const handleDropdown = (dropdown: string) => {
    setActiveDropdown(dropdown);
  };

  type PaymentMethod = 'card' | 'paypal' | 'googlepay';
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const paymentMethods = [
    { id: 'card', label: 'Debit/Credit Card', image: '/images/mastercard.png' },
    { id: 'paypal', label: 'PayPal', image: '/images/paypal.png' },
    { id: 'googlepay', label: 'Google Pay', image: '/images/gpay.png' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <div className="flex items-center">
                  <a href="#" className="text-sm font-medium text-[#586DF7] hover:text-gray-700">Home</a>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <a href="#" className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700">Confirm and pay</a>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Guest Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Guest Information</h2>
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Attached address</h3>
                {/* Address Info - always visible */}
                <div className="space-y-1 mb-8 pl-1">
                  <p className="flex items-center font-medium text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Zahidul Islam
                  </p>
                  <p className="flex items-center text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    zahidulsiams66@gmail.com
                  </p>
                  <p className="flex items-center text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    1231 456-7890
                  </p>
                  <p className="flex items-center text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    2021 Royalty Boulevard Portland, OR 96199
                  </p>
                </div>
                {/* Add New Address Form - always visible */}
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Address</h3>
                <form onSubmit={handleSubmit} className="border-t border-gray-200 pt-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Enter your Name</label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your Name"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Enter your Email</label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your Email"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Enter your Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter your Phone"
                        required
                      />
                    </div>
                    <div className='flex justify-end'>
                      <button
                        type="submit"
                        className="bg-[#586DF7] text-white py-3 px-10 rounded-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-end gap-2"
                      >
                        Save
                        <FaArrowRight/>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          {/* Right Column - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              {/* Property Info */}
              <div className="flex items-center gap-4 mb-6  ">
                <Image src={propertyImage1} alt="property" width={200} height={200} className='w-24 h-24 rounded-lg object-cover' />
                <div>
                  <h3 className="font-bold text-gray-900">Design District Guesthouse – 2Bdrms</h3>
                  <p className="text-gray-600 text-sm flex items-start gap-1"><span className='bg-[#586DF71A] p-2 rounded-full'><LocationFillIcon /></span> Miami, Miami Dade County, Florida, United States</p>
                </div>
              </div>
              {/* Booking Details */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                <div className="grid grid-cols-1 gap-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <div className="flex flex-row flex-[2] min-w-[320px] border rounded-lg border-gray-300 mb-3">
                    <div className="flex-1 relative flex items-center px-4">
                      <CalendarIcon />
                      <DatePicker
                        ref={checkInRef}
                        selected={checkInDate}
                        onChange={handleCheckInSelect}
                        selectsStart
                        startDate={checkInDate}
                        endDate={checkOutDate}
                        minDate={new Date()}
                        placeholderText="Check-in"
                        className="w-full px-4 py-3 bg-transparent focus:outline-none"
                        onFocus={() => handleDropdown('checkin')}
                        popperPlacement="bottom"
                        popperClassName="z-30"
                        open={activeDropdown === 'checkin'}
                        onClickOutside={() => { if (!suppressClose) setActiveDropdown(null); }}
                      />
                    </div>
                    <div className="flex items-center px-2 text-gray-300 select-none">|</div>
                    <div className="flex-1 relative flex items-center px-4">
                      <CalendarIcon />
                      <DatePicker
                        ref={checkOutRef}
                        selected={checkOutDate}
                        onChange={handleCheckOutSelect}
                        selectsEnd
                        startDate={checkInDate}
                        endDate={checkOutDate}
                        minDate={checkInDate || new Date()}
                        placeholderText="Check-out"
                        className="w-full px-4 py-3 bg-transparent focus:outline-none"
                        onFocus={() => handleDropdown('checkout')}
                        popperPlacement="bottom"
                        popperClassName="z-30"
                        open={activeDropdown === 'checkout'}
                        onClickOutside={() => { if (!suppressClose) setActiveDropdown(null); }}
                      />
                    </div>
                  </div>
                  <div className="relative w-full">
                    <div
                      className="flex px-4 items-center border-1 border-gray-300 rounded-lg bg-white h-full cursor-pointer "
                      onClick={() => handleDropdown('guests')}
                      tabIndex={0}
                      ref={guestsRef}
                    >
                      <ProfileIcon />
                      <span className="w-full px-2 py-3 text-left select-none">
                        {guests} {guests === 1 ? 'Guest' : 'Guests'}
                      </span>
                    </div>
                    {activeDropdown === 'guests' && (
                      <div className="absolute z-20 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                          <div
                            key={num}
                            onClick={() => {
                              setGuests(num);
                              setActiveDropdown(null);
                            }}
                            className={`px-4 py-3 hover:bg-gray-100 cursor-pointer ${guests === num ? 'bg-blue-50' : ''}`}
                          >
                            {num} {num === 1 ? 'Guest' : 'Guests'}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Booking Summary */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">$175 × 33 nights</span>
                    <span className="font-medium">$6,775.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Breakfast</span>
                    <span className="font-medium">$63.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Taxes (4.5%)</span>
                    <span className="font-medium">$291.80</span>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>$6,129.90</span>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between">
                    <span className="font-medium text-blue-800">Payment due</span>
                    <span className="font-bold text-blue-800">$6,129.90</span>
                  </div>
                </div>
                <button className="w-full bg-[#F7B730] text-black py-3 px-4 rounded-full shadow-sm hover:bg-[#e4c278] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Continue →
                </button>
                <div className="mt-4 text-center">
                  <a href="#" className="text-sm font-medium text-black hover:text-blue-800">
                    Back to Listing Detail
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="max-w-md p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Payment Method</h2>
      
      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <button
            key={method.id}
            type="button"
            className={`w-full flex items-center p-4 rounded-lg border transition-all duration-200 ${
              selectedMethod === method.id
                ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setSelectedMethod(method.id as PaymentMethod)}
          >
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center mr-4 ${
              selectedMethod === method.id
                ? 'border-blue-500 bg-blue-500'
                : 'border-gray-400'
            }`}>
              {selectedMethod === method.id && (
                <div className="w-2 h-2 rounded-full bg-white"></div>
              )}
            </div>
            <Image src={method.image} alt={method.label} width={500} height={500} className='w-14 h-5  mr-2' />
            <span className="text-gray-700 font-medium">{method.label}</span>
          </button>
        ))}
      </div>
    </div>
      </div>
    </div>
  );
};

export default MainSection;