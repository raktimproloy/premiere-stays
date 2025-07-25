// components/HeroSection.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaArrowRight, FaMapMarkerAlt, FaUserFriends } from 'react-icons/fa';
import { CalendarIcon, LocationIcon, ProfileIcon } from '../../../public/images/svg';

const HeroSection = () => {

  const HeroImage = "/images/hero_section.png"
  // State for form fields
  const [location, setLocation] = useState('');
  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
  
  // State for UI interactions
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  
  // State for which dropdown is open
  const [activeDropdown, setActiveDropdown] = useState<null | 'location' | 'guests' | 'checkin' | 'checkout'>(null);
  // Suppress onClickOutside for a short time after programmatic open
  const [suppressClose, setSuppressClose] = useState(false);
  
  // Refs for focusing next inputs
  const checkInRef = useRef<any>(null);
  const checkOutRef = useRef<any>(null);
  const guestsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Dummy location data
  const locations: Location[] = [
    { id: 1, name: 'Miami Beach', properties: 124 },
    { id: 2, name: 'South Beach', properties: 98 },
    { id: 3, name: 'Key Biscayne', properties: 45 },
    { id: 4, name: 'Downtown Miami', properties: 87 },
    { id: 5, name: 'Coconut Grove', properties: 56 },
    { id: 6, name: 'Coral Gables', properties: 72 },
    { id: 7, name: 'Brickell', properties: 103 },
    { id: 8, name: 'Bal Harbour', properties: 38 },
    { id: 9, name: 'Sunny Isles', properties: 65 },
  ];

  // Filter locations based on search input
  useEffect(() => {
    if (location.trim() === '') {
      setFilteredLocations(locations);
    } else {
      setFilteredLocations(
        locations.filter(loc => 
          loc.name.toLowerCase().includes(location.toLowerCase())
        )
      );
    }
  }, [location]);

  // Update dropdown open/close logic
  const handleDropdown = (dropdown: typeof activeDropdown) => {
    setActiveDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  // Update location select to close other dropdowns
  const handleLocationSelect = (loc: string) => {
    setLocation(loc);
    setSuppressClose(true);
    setActiveDropdown('checkin');
  };

  // Update check-in select to close other dropdowns
  const handleCheckInSelect = (date: Date | null) => {
    setCheckInDate(date);
    setSuppressClose(true);
    setActiveDropdown('checkout');
  };

  // Update check-out select to close other dropdowns
  const handleCheckOutSelect = (date: Date | null) => {
    setCheckOutDate(date);
    setSuppressClose(true);
    setActiveDropdown('guests');
  };

  // Handle form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search Parameters:', {
      location,
      checkInDate,
      checkOutDate,
      guests
    });
    alert(`Searching for ${guests} guests in ${location || 'Miami'} from ${checkInDate?.toLocaleDateString()} to ${checkOutDate?.toLocaleDateString()}`);
  };

  // Close dropdowns when clicking outside
  // useEffect(() => {
  //   const handleClickOutside = (e: MouseEvent) => {
  //     if (formRef.current && !formRef.current.contains(e.target as Node)) {
  //       if (!suppressClose) setActiveDropdown(null);
  //     }
  //   };
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => document.removeEventListener('mousedown', handleClickOutside);
  // }, [suppressClose]);

  return (
    <div className="relative h-[90vh] w-full">
      {/* Background image with overlay */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: `url(${HeroImage})` }}
      ></div>
      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="hidden md:block text-2xl md:text-5xl lg:text-6xl font-bold text-white mb-6 animate-fade-in">
            Experience 5-Star Vacation Living
          </h1>
          <p className="hidden md:block text-white text-lg mb-8 max-w-2xl mx-auto animate-fade-in delay-200">
            Unlock the full potential of your property with our expert management services. 
            We prioritize your success and satisfaction, ensuring a seamless experience every step of the way.
          </p>
          {/* Search Form */}
          <form 
            ref={formRef}
            onSubmit={handleSearch}
            className="bg-white rounded-xl shadow-2xl p-4 md:p-6 max-w-full mx-auto animate-fade-in delay-300"
          >
            <div className="flex flex-col md:flex-row gap-2 md:gap-2 items-stretch rounded-xl">
              {/* Location Search */}
              <div className="relative w-62 min-w-[120px]">
                <div className="flex px-4 items-center border rounded-lg border-gray-300 bg-white h-full">
                  <LocationIcon  />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onFocus={() => handleDropdown('location')}
                    placeholder="Search by location"
                    className="w-full px-2 py-3 bg-transparent focus:outline-none"
                  />
                </div>
                {activeDropdown === 'location' && (
                  <div className="absolute z-20 mt-1 w-[140%] bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto">
                    {filteredLocations.map((loc) => (
                      <div
                        key={loc.id}
                        onClick={() => handleLocationSelect(loc.name)}
                        className="px-4 py-3 hover:bg-gray-100 cursor-pointer flex justify-between"
                      >
                        <span>{loc.name}</span>
                        <span className="text-gray-500 text-sm">{loc.properties} properties</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Date Range Picker */}
              <div className="flex flex-row flex-[2] min-w-[320px] border rounded-lg border-gray-300">
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
              {/* Guests */}
              <div className="relative w-64 min-w-[90px]">
                <div
                  className="flex px-4 items-center border-1 border-gray-300 rounded-lg bg-white h-full cursor-pointer"
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
              {/* Search Button */}
              <div className="flex items-stretch">
                <button
                  type="submit"
                  className="h-full w-full bg-gradient-to-r from-[#F7B730] to-[#F7B730] hover:from-[#F7B730] hover:to-[#F7B730] text-black font-semibold py-3 px-4 rounded-full transition-all duration-300 transform hover:scale-[1.02] shadow-lg flex items-center justify-center cursor-pointer"
                >
                  <span className="hidden md:inline">Search Properties</span>
                  <FaArrowRight className='ml-2' />
                  {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg> */}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Type definition for location data
interface Location {
  id: number;
  name: string;
  properties: number;
}

export default HeroSection;