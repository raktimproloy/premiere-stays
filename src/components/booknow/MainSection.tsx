'use client'
import React, { useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { BathroomIcon, BedIcon, CalendarIcon, GuestIcon, HeartIcon, LocationFillIcon, ProfileIcon, PropertyIcon, PropertyIcon2, ShareIcon } from '../../../public/images/svg';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/navigation';
const images = [
  '/images/booknow/image1.png',
  '/images/booknow/image2.png',
  '/images/booknow/image3.png',
  '/images/booknow/image4.png',
  '/images/booknow/image5.png',
];

export default function MainSection({id}: {id: string}) {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [guests, setGuests] = useState(1);
    const [services, setServices] = useState({
      breakfast: false,
      lunch: false,
      driver: false
    });
    const [mainImage, setMainImage] = useState(images[0]);
    const [checkInDate, setCheckInDate] = useState<Date | null>(null);
    const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [suppressClose, setSuppressClose] = useState(false);
    const checkInRef = useRef<DatePicker>(null);
    const checkOutRef = useRef<DatePicker>(null);
    const guestsRef = useRef<HTMLDivElement>(null);
    const handleServiceChange = (service: keyof typeof services) => {
      setServices(prev => ({ ...prev, [service]: !prev[service] }));
    };
  
    const calculateTotal = () => {
      let total = 175.00;
      if (services.breakfast) total += 9.00;
      if (services.lunch) total += 12.00;
      if (services.driver) total += 12.00;
      return total.toFixed(2);
    };
    const handleCheckInSelect = (date: Date | null) => {
      setCheckInDate(date);
      setCheckIn(date?.toISOString().split('T')[0] || '');
    };
    const handleCheckOutSelect = (date: Date | null) => {
      setCheckOutDate(date);
      setCheckOut(date?.toISOString().split('T')[0] || '');
    };
    const handleDropdown = (dropdown: typeof activeDropdown) => {
      setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
      setSuppressClose(true);
    };
    return (
    <section className="max-w-7xl mx-auto p-2 md:p-6 lg:p-8">
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left: Images */}
      <div className="w-full lg:w-3/5 flex flex-col items-center">
        <div className="w-full aspect-video rounded-2xl overflow-hidden mb-4 bg-gray-100 flex items-center justify-center">
          <img src={mainImage} alt="Property" className="object-cover w-full h-full" />
        </div>
        <div className="w-full relative">
          {/* Custom navigation buttons */}
          <button
            className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 shadow hover:bg-yellow-400 transition hidden sm:flex"
            type="button"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-300 rounded-full p-2 shadow hover:bg-yellow-400 transition hidden sm:flex"
            type="button"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </button>
          <Swiper
            spaceBetween={12}
            slidesPerView={4}
            className="!px-2"
            loop={true}
            navigation={{
              nextEl: '.swiper-button-next-custom',
              prevEl: '.swiper-button-prev-custom',
            }}
            modules={[Navigation]}
            breakpoints={{
              320: { slidesPerView: 2 },
              640: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
          >
            {images.map((img, idx) => (
              <SwiperSlide key={img}>
                <button
                  className={`rounded-xl overflow-hidden border-2 transition-all duration-200 ${mainImage === img ? 'border-yellow-400' : 'border-transparent'}`}
                  onClick={() => setMainImage(img)}
                >
                  <img src={img} alt="Thumb" className="object-cover w-full h-full" />
                </button>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Right: Booking Card */}
      <div className="w-full lg:w-2/5 flex flex-col">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Wynwood Townhomes w/ Heated Pools</h1>
          <div className="flex items-center text-gray-500 text-sm mb-4">
          <span className='mr-2 bg-[#586DF71A] p-2 rounded-full'><LocationFillIcon /></span>
            Miami, Miami-Dade County, Florida, United States
          </div>
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
          <div className="border-t border-gray-200 pt-4 mt-4 mb-4 border-dashed">
            <div className="font-semibold mb-2">Extra Services</div>
            <div className="space-y-2">
              {[{ id: 'breakfast', label: 'Breakfast', price: 9.00 }, { id: 'lunch', label: 'Lunch', price: 12.00 }, { id: 'driver', label: 'Dinner', price: 12.00 }].map((service) => (
                <label key={service.id} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={services[service.id as keyof typeof services]}
                    onChange={() => handleServiceChange(service.id as keyof typeof services)}
                    className="form-checkbox h-4 w-4 text-yellow-400 border-gray-300 rounded mr-2"
                  />
                  <span className="flex-1 text-gray-700">{service.label}</span>
                  <span className="text-gray-500 text-sm">${service.price.toFixed(2)}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-blue-700">${calculateTotal()}</span>
            <span className="text-gray-400 text-xs">(You won't be charged yet!)</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <button className="w-3/5 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-3 px-6 rounded-full transition-colors duration-300 flex items-center justify-center mb-2" onClick={() => router.push(`/book-now/checkout/${id}`)}>
                Book Now
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
            <div className="flex items-center justify-center gap-4 mt-2">
                <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-100">
                <HeartIcon/>
                </button>
                <button className="p-2 rounded-full border border-gray-200 hover:bg-gray-100">
                <ShareIcon/>
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* Bottom: Property Details */}
    <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-4 mt-8">
      <div className="flex-1 flex items-center justify-start bg-white rounded-xl shadow p-4 gap-2">
        <div className="flex items-center">
            <span className='bg-[#586DF7] p-2 rounded-lg'><PropertyIcon2 /></span>
            <div className='flex flex-col ml-2'>
                <span className="text-xs text-gray-500 mb-1">Type</span>
                <span className="rounded-lg py-1 text-sm font-semibold">Private Room / Apartment</span>

            </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-start bg-white rounded-xl shadow p-4 gap-2">
        <div className="flex items-center">
        <span className='bg-[#F86E04] p-2 rounded-lg'><GuestIcon /></span>
        <div className='flex flex-col ml-2'>
          <span className="text-xs text-gray-500 mb-1">Accomodation</span>
          <span className=" text-orange-700 rounded-lg py-1 text-sm font-semibold">16+ Guests</span>

        </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-start bg-white rounded-xl shadow p-4 gap-2">
        <div className="flex items-center">
            <span className='bg-[#38C6F9] p-2 rounded-lg'><BedIcon /></span>
            <div className='flex flex-col ml-2'>

          <span className="text-xs text-gray-500 mb-1">Bedrooms</span>
          <span className=" text-blue-700 rounded-lg py-1 text-sm font-semibold">6 Bedrooms / 8 Beds</span>
            </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-start bg-white rounded-xl shadow p-4 gap-2">
        <div className="flex items-center">
            <span className='bg-[#A020F0] p-2 rounded-lg'><BathroomIcon /></span>
            <div className='flex flex-col ml-2'>
          <span className="text-xs text-gray-500 mb-1">Bathrooms</span>
          <span className=" text-purple-700 rounded-lg py-1 text-sm font-semibold">4 Full 1 Half Baths</span>

            </div>
        </div>
      </div>
    </div>
  </section>
  )
}
