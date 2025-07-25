// components/Navbar.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FaArrowRight } from "react-icons/fa";
import { useAuth } from '@/components/common/AuthContext';
import { FiChevronDown, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import { useRef, useEffect } from 'react';

const profileImage = "/images/profile.jpg";

const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const Logo = '/images/logo.png';
  const { isAuthenticated, logout } = useAuth();

  // Dummy user info (replace with real user data if available)
  const user = {
    first_name: 'Zahidul',
    last_name: 'Islam',
    email_address: 'zahidulislam@gmail.com',
  };
  const formatFullName = () => `${user.first_name} ${user.last_name}`;
  const formatEmail = () => user.email_address;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Book Now', path: '/book-now' },
    { name: 'FAQS', path: '/faqs' },
    { name: 'ContactUs', path: '/contact' },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-22">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Image src={Logo} alt='logo' width={157} height={70} />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center px-1 py-2 text-sm font-medium transition-colors duration-200 ${
                  pathname === item.path
                    ? 'text-[#586DF7]'
                    : 'text-gray-700 hover:text-[#586DF7]'
                }`}
              >
                {pathname === item.path && (
                  <span className="mr-2 h-2 w-2 bg-[#586DF7] rounded-full inline-block"></span>
                )}
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth/Profile Dropdown */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
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
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                    width={40}
                    height={40}
                  />
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-gray-900 font-semibold truncate max-w-[160px]">
                      {formatFullName()}
                    </span>
                    <span className="text-gray-500 text-sm truncate max-w-[160px]">
                      {formatEmail()}
                    </span>
                  </div>
                  <FiChevronDown 
                    className={`text-gray-600 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`} 
                  />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {formatFullName()}
                      </p>
                      <p className="text-sm text-gray-500 truncate">
                        {formatEmail()}
                      </p>
                    </div>
                    <nav className="flex flex-col py-1">
                      <Link
                        href="/admin/profile"
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <FiUser className="text-gray-500" />
                        Profile
                      </Link>
                      <Link
                        href="/admin/settings"
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <FiSettings className="text-gray-500" />
                        Settings
                      </Link>
                      <Link
                        href="/admin/help"
                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      >
                        <FiSettings className="text-gray-500" />
                        Help
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <FiLogOut className="text-red-500" />
                        Logout
                      </button>
                    </nav>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-700 hover:text-orange-500"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex items-center text-sm font-medium text-[#586DF7] border border-[#586DF7] px-4 py-2 rounded-full transition-colors duration-200"
                >
                  Register <span className="ml-1"><FaArrowRight /></span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`flex items-center block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === item.path
                    ? 'text-[#586DF7]'
                    : 'text-gray-700 hover:text-[#586DF7]'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {pathname === item.path && (
                  <span className="mr-2 h-2 w-2 bg-[#586DF7] rounded-full inline-block"></span>
                )}
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-gray-200">
              <Link
                href="/login"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-orange-500 hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="mt-2 block flex items-center w-full text-center px-3 py-2 rounded-full border border-[#586DF7] text-base font-medium text-[#586DF7] "
                onClick={() => setIsMenuOpen(false)}
              >
                Register <span className="ml-1"><FaArrowRight /></span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;