// components/FooterSection.tsx
import Image from 'next/image';
import React from 'react';

const FooterSection = () => {
    const CTAImage = "/images/cta_image.png"
    const Logo = "/images/logo.png"
  return (
    <div className="relative pt-20">
      {/* Footer */}
      <footer className="bg-[#100A55] text-white pt-64 pb-12 relative">
        <div className="absolute top-0 left-0 right-0 z-10 max-w-7xl mx-auto px-4 pt-4 sm:px-6 lg:px-8 -mt-32">
          <div className="bg-[#586DF7] rounded-3xl shadow-2xl overflow-hidden">
            <div className="">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
                <div className='col-span-3 pl-16 pt-4'>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Ready to Experience Comfort, Convenience, and Quality?
                  </h2>
                  <p className="text-lg text-blue-100 max-w-xl mb-6">
                    Browse our available rentals and secure your stay with just a few clicks. Whether you're planning a weekend getaway or a longer stay, we've got the perfect space waiting for you.
                  </p>
                  <button className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-4 px-8 rounded-full text-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center">
                    Book A Property
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="col-span-2 flex justify-end">
                  
                  <Image src={CTAImage} alt="Hero Section" width={500} height={500} className='w-full h-full object-cover relative -right-3' />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="lg:col-span-1 text-center">
              <Image src={Logo} alt="Logo" width={150} height={150} />
            </div>

            {/* Company Links */}
            <div>
              <h3 className="text-lg font-bold mb-4 uppercase tracking-wider">Company</h3>
              <ul className="space-y-2">
                {['Home', 'About Us', 'Services', 'FAQs', 'Book Now', 'Contact Us'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* For Sale and Rent */}
            <div>
              <h3 className="text-lg font-bold mb-4 uppercase tracking-wider">For Sale and Rent</h3>
              <ul className="space-y-2">
                {['Owner Services', 'Manage Your Rental', 'Grow Your Portfolio', 'Owner Login', 'Privacy Policy', 'Terms and Condition'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-bold mb-4 uppercase tracking-wider">Contact Information</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span className="text-gray-400">Phone: <span className="text-white">(123) 757-2069</span></span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="text-gray-400">Email: <span className="text-white">info@premierestayamiami.com</span></span>
                </li>
                <li className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-blue-500 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-400">#1 Dealing Street, St. Thomas Village,<br />Chagastons, Trinidad & Tobago</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-400 text-center">
              ©2025. Premierestayakiami. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FooterSection;