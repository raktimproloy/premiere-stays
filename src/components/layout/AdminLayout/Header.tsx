import { useAuth } from '@/components/common/AuthContext';
import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import { FiMenu, FiX, FiSearch, FiMessageCircle, FiBell, FiChevronDown, FiLogOut, FiUser, FiSettings } from 'react-icons/fi';

const profileImage = "/images/profile.jpg"; // Replace with actual profile image path
const searchIcon = "/images/icons/search.svg"
const notificationIcon = "/images/icons/notification.svg"
const chatIcon = "/images/icons/chat.svg"


export default function Header({ sidebarOpen, setSidebarOpen }: { sidebarOpen: boolean; setSidebarOpen: Function }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, logout } = useAuth();

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between p-4">
        {/* Sidebar toggle button */}
        <button
          className="md:hidden text-gray-500 hover:text-gray-700"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Left: Search input */}
        <div className="flex-1 max-w-md relative">
          {/* <FiSearch className="" size={20} /> */}
          <Image src={searchIcon} alt='search' width={20} height={20} className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'/>
          <input
            type="text"
            placeholder="Search here..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#F7B730] focus:border-transparent"
          />
        </div>

        {/* Right: Icons and profile */}
        <div className="flex items-center gap-6">
          {/* Message icon */}
          <button className="text-gray-600 hover:text-gray-900" aria-label="Messages">
            <Image src={chatIcon} alt='chat' width={24} height={24}/>
          </button>

          {/* Notification icon */}
          <button className="text-gray-600 hover:text-gray-900" aria-label="Notifications">
            <Image src={notificationIcon} alt='notification' width={24} height={24}/>
          </button>

          {/* Profile section */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center cursor-pointer gap-3 focus:outline-none"
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <Image
                src={profileImage}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover"
                width={500}
                height={500}
              />
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-gray-900 font-semibold">Zahidul Islam</span>
                <span className="text-gray-500 text-sm">@username</span>
              </div>
              <FiChevronDown className={`text-gray-600 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                <nav className="flex flex-col py-2">
                  <a href="#" className="px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                    <FiUser /> Profile
                  </a>
                  <a href="#" className="px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                    <FiSettings /> Settings
                  </a>
                  <button
                    onClick={() => logout()}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100 flex items-center gap-2"
                  >
                    <FiLogOut /> Logout
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
