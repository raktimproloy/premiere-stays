// components/Navbar.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FaArrowRight } from "react-icons/fa";

const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const Logo = '/images/logo.png';

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

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="text-sm font-medium text-gray-700 hover:text-orange-500"
            >
              Login
            </Link>
            {/* <span className="h-5 w-px bg-gray-300"></span> */}
            <Link
              href="/register"
              className="flex items-center text-sm font-medium text-[#586DF7] border border-[#586DF7] px-4 py-2 rounded-full transition-colors duration-200"
            >
              Register <span className="ml-1"><FaArrowRight /></span>
            </Link>
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