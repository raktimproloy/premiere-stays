'use client'
import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { FaEdit, FaCog, FaQuestionCircle, FaEye, FaUser, FaEnvelope, FaPhone, FaCalendar, FaTimes, FaLock } from 'react-icons/fa';
import { CameraIcon, EditIcon } from '../../../public/images/svg';
import BookingDetailsModal from './BookingDetailsModal';

const user = {
  name: 'Zahidul Islam',
  email: 'zahidulislam@gmail.com',
  phone: '880 ******76',
  dob: 'October 10, 2002',
  photo: '/images/profile.jpg',
};

const bookings = [
  {
    id: 1,
    image: '/images/property.png',
    title: 'Wynwood Townhomes w/Heated Pools',
    location: 'Miami, Miami-Dade County, Florida, United States',
    bedroom: '04',
    bathroom: '06',
    type: 'Cabin',
    capacity: '4 Guests',
    services: ['Breakfast', 'Lunch', 'Dinner'],
    status: 'Pending',
    price: 175,
    statusColor: 'bg-yellow-400 text-yellow-900',
    images: undefined, // allow images property for type compatibility
  },
  {
    id: 2,
    image: '/images/property.png',
    title: 'Wynwood Townhomes w/Heated Pools',
    location: 'Miami, Miami-Dade County, Florida, United States',
    bedroom: '04',
    bathroom: '06',
    type: 'Cabin',
    capacity: '4 Guests',
    services: ['Breakfast', 'Lunch', 'Dinner'],
    status: 'Approved',
    price: 175,
    statusColor: 'bg-green-500 text-white',
    images: undefined,
  },
  {
    id: 3,
    image: '/images/property.png',
    title: 'Wynwood Townhomes w/Heated Pools',
    location: 'Miami, Miami-Dade County, Florida, United States',
    bedroom: '04',
    bathroom: '06',
    type: 'Cabin',
    capacity: '4 Guests',
    services: ['Breakfast', 'Lunch', 'Dinner'],
    status: 'Cancel',
    price: 175,
    statusColor: 'bg-red-500 text-white',
    images: undefined,
  },
  {
    id: 4,
    image: '/images/property.png',
    title: 'Wynwood Townhomes w/Heated Pools',
    location: 'Miami, Miami-Dade County, Florida, United States',
    bedroom: '04',
    bathroom: '06',
    type: 'Cabin',
    capacity: '4 Guests',
    services: ['Breakfast', 'Lunch', 'Dinner'],
    status: 'Completed',
    price: 175,
    statusColor: 'bg-green-400 text-white',
    images: undefined,
  },
];

export default function Profile() {
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: '880 1098657432',
    dob: '10-10-2025',
  });
  const [passwordForm, setPasswordForm] = useState({
    old: '',
    new: '',
    confirm: '',
  });
  const modalRef = useRef<HTMLDivElement>(null);
  const passwordModalRef = useRef<HTMLDivElement>(null);

  // Close modal on Esc
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowModal(false);
        setShowPasswordModal(false);
        setShowBookingModal(false);
      }
    };
    if (showModal || showPasswordModal || showBookingModal) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [showModal, showPasswordModal, showBookingModal]);

  // Close modal on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (showModal && modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowModal(false);
      }
      if (showPasswordModal && passwordModalRef.current && !passwordModalRef.current.contains(event.target as Node)) {
        setShowPasswordModal(false);
      }
      if (showBookingModal && selectedBooking && !selectedBooking.contains(event.target as Node)) {
        setShowBookingModal(false);
      }
    }
    if (showModal || showPasswordModal || showBookingModal) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showModal, showPasswordModal, showBookingModal, selectedBooking]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save logic here
    setShowModal(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save password logic here
    setShowPasswordModal(false);
  };

  return (
    <div className="bg-[#F8F9FB] min-h-screen py-6 sm:py-8 px-2 sm:px-4 md:px-8 relative">
      {/* Booking Details Modal */}
      <BookingDetailsModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        property={selectedBooking}
      />
      {/* Edit Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div ref={modalRef} className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 w-full max-w-lg mx-auto relative animate-fadeIn">
            <button
              className="absolute top-2 sm:top-4 right-2 sm:right-4 text-gray-400 hover:text-gray-700 text-lg"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              <FaTimes />
            </button>
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="flex items-center border border-[#1C88FF1A] rounded-lg px-3 py-2 bg-gray-50">
                  <FaUser className="text-gray-400 mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Zahidul Islam"
                    className="bg-transparent outline-none w-full text-gray-700 text-sm sm:text-base"
                    required
                  />
                </div>
                <div className="flex items-center border border-[#1C88FF1A] rounded-lg px-3 py-2 bg-gray-50">
                  <FaEnvelope className="text-gray-400 mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="zahidulislam@gmail.com"
                    className="bg-transparent outline-none w-full text-gray-700 text-sm sm:text-base"
                    required
                  />
                </div>
                <div className="flex items-center border border-[#1C88FF1A] rounded-lg px-3 py-2 bg-gray-50">
                  <FaPhone className="text-gray-400 mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="880 1098657432"
                    className="bg-transparent outline-none w-full text-gray-700 text-sm sm:text-base"
                    required
                  />
                </div>
                <div className="flex items-center border border-[#1C88FF1A] rounded-lg px-3 py-2 bg-gray-50">
                  <FaCalendar className="text-gray-400 mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="text"
                    name="dob"
                    value={form.dob}
                    onChange={handleChange}
                    placeholder="10-10-2025"
                    className="bg-transparent outline-none w-full text-gray-700 text-sm sm:text-base"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-2 gap-3 sm:gap-0">
                <button
                  type="button"
                  className="text-[#586DF7] text-sm hover:underline"
                  onClick={() => { setShowModal(false); setShowPasswordModal(true); }}
                >
                  Change Password?
                </button>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 sm:px-8 py-2 rounded-full shadow transition-colors text-sm sm:text-base"
                >
                  Save Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Change Password Modal Overlay */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div ref={passwordModalRef} className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 w-full max-w-md mx-auto relative animate-fadeIn">
            <button
              className="absolute top-2 sm:top-4 right-2 sm:right-4 text-gray-400 hover:text-gray-700 text-lg"
              onClick={() => setShowPasswordModal(false)}
              aria-label="Close"
            >
              <FaTimes />
            </button>
            <form onSubmit={handlePasswordSubmit} className="space-y-3 sm:space-y-4">
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center border border-[#1C88FF1A] rounded-lg px-3 py-2 bg-gray-50">
                  <FaLock className="text-gray-400 mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="password"
                    name="old"
                    value={passwordForm.old}
                    onChange={handlePasswordChange}
                    placeholder="Old Password"
                    className="bg-transparent outline-none w-full text-gray-700 text-sm sm:text-base"
                    required
                  />
                </div>
                <div className="flex items-center border border-[#1C88FF1A] rounded-lg px-3 py-2 bg-gray-50">
                  <FaLock className="text-gray-400 mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="password"
                    name="new"
                    value={passwordForm.new}
                    onChange={handlePasswordChange}
                    placeholder="New Password"
                    className="bg-transparent outline-none w-full text-gray-700 text-sm sm:text-base"
                    required
                  />
                </div>
                <div className="flex items-center border border-[#1C88FF1A] rounded-lg px-3 py-2 bg-gray-50">
                  <FaLock className="text-gray-400 mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="password"
                    name="confirm"
                    value={passwordForm.confirm}
                    onChange={handlePasswordChange}
                    placeholder="Confirm Password"
                    className="bg-transparent outline-none w-full text-gray-700 text-sm sm:text-base"
                    required
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-2 gap-3 sm:gap-0">
                <button
                  type="button"
                  className="text-gray-500 text-sm hover:underline"
                  onClick={() => { setShowPasswordModal(false); setShowModal(true); }}
                >
                  Go Back
                </button>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 sm:px-8 py-2 rounded-full shadow transition-colors text-sm sm:text-base"
                >
                  Save Change
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Top Profile Section */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-10">
        {/* Photo and Upload */}
        <div className="md:col-span-3 flex flex-col items-center justify-center bg-white rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="flex lg:flex-row flex-col items-center gap-4">
            <Image src={user.photo} alt="Profile" width={100} height={100} className="rounded-full w-20 h-20 sm:w-24 sm:h-24 object-cover" />
            <button className="flex items-center gap-2 text-black rounded-full p-2 border-1 border-[#1C88FF1A] hover:bg-[#1C88FF1A] transition-colors text-xs px-4 py-2">
              Upload Photo
              <CameraIcon/>
            </button>
          </div>
        </div>
        {/* Info */}
        <div className="md:col-span-6 bg-white rounded-xl p-4 sm:p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full lg:w-auto">
              <div>
                <div className="flex items-center gap-2 text-gray-900 mb-1 font-semibold text-sm sm:text-base">Your Name </div>
                <div className=" text-gray-600 text-sm sm:text-base">{user.name}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-900 mb-1 font-semibold text-sm sm:text-base">Email Address </div>
                <div className="text-gray-600 text-sm sm:text-base">{user.email}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-900 mb-1 font-semibold text-sm sm:text-base">Phone Number </div>
                <div className="text-gray-600 text-sm sm:text-base">{user.phone}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-900 mb-1 font-semibold text-sm sm:text-base">Date of Birth </div>
                <div className="text-gray-600 text-sm sm:text-base">{user.dob}</div>
              </div>
            </div>
            <span onClick={() => setShowModal(true)} className='cursor-pointer self-center lg:self-start'>
              <EditIcon />
            </span>
          </div>
        </div>
        {/* Settings/Help */}
        <div className="md:col-span-3 flex flex-row sm:flex-col gap-3 sm:gap-4 justify-center bg-white rounded-xl p-4 sm:p-6 shadow-sm">
          <button className="flex items-center gap-2 text-gray-700 hover:text-blue-700 font-medium text-sm sm:text-base"><FaCog className="text-lg sm:text-xl" /> Settings</button>
          <button className="flex items-center gap-2 text-gray-700 hover:text-blue-700 font-medium text-sm sm:text-base"><FaQuestionCircle className="text-lg sm:text-xl" /> Help</button>
        </div>
      </div>
      {/* Booking List Section */}
      <div className="max-w-7xl mx-auto my-16 sm:my-8 md:my-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Your all Booking List</h2>
          <div className="relative">
            <button className="flex items-center gap-1 text-gray-600 border border-gray-200 rounded-lg px-3 sm:px-4 py-2 bg-white hover:bg-gray-50 text-sm sm:text-base">
              Sort By <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {bookings.map((b) => (
            <div key={b.id} className="bg-white rounded-xl shadow-sm p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start relative">
              <Image src={b.image} alt={b.title} width={200} height={200} className="rounded-lg w-full sm:w-40 h-48 sm:h-full object-cover" />
              <div className="flex-1 w-full">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-gray-900 text-base sm:text-lg line-clamp-1">{b.title}</h3>
                  <button className="text-gray-400 hover:text-blue-600" onClick={() => {
                    setSelectedBooking({
                      ...b,
                      images: b.images || [b.image], // Ensure images is always an array
                    });
                    setShowBookingModal(true);
                  }}><FaEye /></button>
                </div>
                <div className="text-xs text-gray-500 mb-1 line-clamp-1">Location <span className="ml-1 text-gray-700">{b.location}</span></div>
                <div className="flex flex-col gap-1 sm:gap-2 mb-1 text-xs">
                  <span>Bedroom <span className="font-semibold text-gray-700">{b.bedroom}</span></span>
                  <span>Bathroom <span className="font-semibold text-gray-700">{b.bathroom}</span></span>
                  <span>Type <span className="font-semibold text-gray-700">{b.type}</span></span>
                  <span>Capacity <span className="font-semibold text-gray-700">{b.capacity}</span></span>
                </div>
                <div className="flex flex-wrap gap-1 sm:gap-2 mb-1 text-xs">
                  <span className="text-gray-600">Extra Services</span>
                  {b.services.map((s, i) => (
                    <span key={i} className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-medium">{s}</span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-4 items-center mt-2">
                  <span className="text-gray-600 text-xs sm:text-sm">Booking Status:</span>
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${b.statusColor}`}>{b.status}</span>
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-4 items-center mt-2">
                  <span className="text-[#586DF7] font-bold text-base sm:text-lg">${b.price.toFixed(2)}<span className="text-xs font-normal text-gray-500 ml-1">/Night</span></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
